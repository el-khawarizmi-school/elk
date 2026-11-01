// security.js
// ============================================
// نظام الأمان - تشفير كلمات المرور والتحقق
// يعتمد على Web Crypto API المدمج في المتصفح
// لا يحتاج أي مكتبة خارجية
// ============================================

// ============================================
// تحويل ArrayBuffer إلى نص Hex
// ============================================
function bufferToHex(buffer) {
    return Array.from(new Uint8Array(buffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

// ============================================
// توليد Salt عشوائي
// ============================================
function generateSalt(length = 16) {
    const salt = new Uint8Array(length);
    crypto.getRandomValues(salt);
    return bufferToHex(salt);
}

// ============================================
// تشفير كلمة المرور باستخدام PBKDF2 (آمن جداً)
// ============================================
export async function hashPassword(password) {
    try {
        if (!password || typeof password !== 'string') {
            return { success: false, error: 'كلمة المرور غير صالحة' };
        }

        const salt = generateSalt(16);
        const encoder = new TextEncoder();
        const passwordBuffer = encoder.encode(password);

        // استيراد كلمة المرور كمفتاح
        const keyMaterial = await crypto.subtle.importKey(
            'raw',
            passwordBuffer,
            { name: 'PBKDF2' },
            false,
            ['deriveBits']
        );

        // اشتقاق المفتاح باستخدام PBKDF2 (100,000 دورة)
        const derivedBits = await crypto.subtle.deriveBits(
            {
                name: 'PBKDF2',
                salt: encoder.encode(salt),
                iterations: 100000,
                hash: 'SHA-256'
            },
            keyMaterial,
            256
        );

        const hash = bufferToHex(derivedBits);
        // تنسيق: pbkdf2$salt$hash
        const combined = `pbkdf2$${salt}$${hash}`;

        return { success: true, hash: combined };
    } catch (error) {
        console.error('❌ خطأ في تشفير كلمة المرور:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// التحقق من كلمة المرور
// ============================================
export async function verifyPassword(password, storedHash) {
    try {
        if (!password || !storedHash) return false;

        // دعم كلمات المرور القديمة (غير مشفرة)
        if (typeof storedHash !== 'string') return false;

        // كلمة مرور قديمة (non-hashed) - مقارنة مباشرة للترحيل
        if (!storedHash.startsWith('pbkdf2$')) {
            if (storedHash.length < 20) {
                console.warn('⚠️ كلمة مرور غير مشفرة - يجب ترحيلها');
                return password === storedHash;
            }
            // SHA-256 قديم (64 حرف hex)
            if (/^[a-f0-9]{64}$/i.test(storedHash)) {
                const encoder = new TextEncoder();
                const data = encoder.encode(password);
                const hashBuffer = await crypto.subtle.digest('SHA-256', data);
                const hashHex = bufferToHex(hashBuffer);
                return hashHex === storedHash;
            }
            return false;
        }

        // تنسيق جديد: pbkdf2$salt$hash
        const parts = storedHash.split('$');
        if (parts.length !== 3) return false;

        const salt = parts[1];
        const expectedHash = parts[2];

        const encoder = new TextEncoder();
        const passwordBuffer = encoder.encode(password);

        const keyMaterial = await crypto.subtle.importKey(
            'raw',
            passwordBuffer,
            { name: 'PBKDF2' },
            false,
            ['deriveBits']
        );

        const derivedBits = await crypto.subtle.deriveBits(
            {
                name: 'PBKDF2',
                salt: encoder.encode(salt),
                iterations: 100000,
                hash: 'SHA-256'
            },
            keyMaterial,
            256
        );

        const computedHash = bufferToHex(derivedBits);
        return computedHash === expectedHash;
    } catch (error) {
        console.error('❌ خطأ في التحقق من كلمة المرور:', error);
        return false;
    }
}

// ============================================
// التحقق من قوة كلمة المرور
// ============================================
export function checkPasswordStrength(password) {
    const checks = {
        length: password.length >= 8,
        hasUpper: /[A-Z]/.test(password),
        hasLower: /[a-z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    const score = Object.values(checks).filter(Boolean).length;

    let strength = 'weak';
    let color = '#ff6b6b';
    let text = 'ضعيفة';

    if (score >= 5) {
        strength = 'very-strong';
        color = '#4ade80';
        text = 'قوية جداً';
    } else if (score >= 4) {
        strength = 'strong';
        color = '#51cf66';
        text = 'قوية';
    } else if (score >= 3) {
        strength = 'medium';
        color = '#ffc107';
        text = 'متوسطة';
    }

    return { score, strength, color, text, checks };
}

// ============================================
// حماية من هجمات Brute Force
// ============================================
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 دقيقة

export function checkLoginLockout(email) {
    if (!email) return { locked: false, attempts: 0 };
    const lockKey = `lockout_${email}`;
    const lockData = localStorage.getItem(lockKey);

    if (!lockData) return { locked: false, attempts: 0 };

    try {
        const { attempts, lockUntil } = JSON.parse(lockData);

        if (lockUntil && Date.now() < lockUntil) {
            const remaining = Math.ceil((lockUntil - Date.now()) / 60000);
            return {
                locked: true,
                attempts,
                remainingMinutes: remaining
            };
        }

        if (lockUntil && Date.now() >= lockUntil) {
            localStorage.removeItem(lockKey);
            return { locked: false, attempts: 0 };
        }

        return { locked: false, attempts: attempts || 0 };
    } catch (e) {
        return { locked: false, attempts: 0 };
    }
}

export function recordLoginAttempt(email, success) {
    if (!email) return { locked: false, attempts: 0 };
    const lockKey = `lockout_${email}`;

    if (success) {
        localStorage.removeItem(lockKey);
        return { locked: false, attempts: 0 };
    }

    let attempts = 0;
    try {
        const existing = localStorage.getItem(lockKey);
        if (existing) {
            attempts = JSON.parse(existing).attempts || 0;
        }
    } catch (e) {}

    attempts++;

    if (attempts >= MAX_LOGIN_ATTEMPTS) {
        const lockUntil = Date.now() + LOCKOUT_DURATION;
        localStorage.setItem(lockKey, JSON.stringify({ attempts, lockUntil }));
        return {
            locked: true,
            attempts,
            remainingMinutes: 15
        };
    }

    localStorage.setItem(lockKey, JSON.stringify({ attempts }));
    return {
        locked: false,
        attempts,
        remainingAttempts: MAX_LOGIN_ATTEMPTS - attempts
    };
}

// ============================================
// Rate Limiting للرسائل والاقتراحات
// ============================================
const RATE_LIMITS = {
    message: { max: 5, window: 60 * 1000 },       // 5 رسائل / دقيقة
    idea: { max: 3, window: 5 * 60 * 1000 },      // 3 اقتراحات / 5 دقائق
    comment: { max: 10, window: 60 * 1000 },      // 10 تعليقات / دقيقة
    resource: { max: 3, window: 10 * 60 * 1000 }  // 3 موارد / 10 دقائق
};

export function checkRateLimit(action, userId) {
    const limit = RATE_LIMITS[action];
    if (!limit) return { allowed: true };
    if (!userId) return { allowed: true };

    const key = `ratelimit_${action}_${userId}`;
    const now = Date.now();

    let history = [];
    try {
        const stored = localStorage.getItem(key);
        if (stored) {
            history = JSON.parse(stored).filter(t => now - t < limit.window);
        }
    } catch (e) {
        history = [];
    }

    if (history.length >= limit.max) {
        const oldestInWindow = Math.min(...history);
        const waitTime = Math.ceil((limit.window - (now - oldestInWindow)) / 1000);
        return {
            allowed: false,
            waitSeconds: waitTime,
            message: `⏳ انتظر ${waitTime} ثانية قبل المحاولة مرة أخرى`
        };
    }

    history.push(now);
    localStorage.setItem(key, JSON.stringify(history));
    return { allowed: true, remaining: limit.max - history.length };
}

// ============================================
// تنظيف بيانات Rate Limit القديمة
// ============================================
export function cleanupOldRateLimits() {
    const keysToCheck = Object.keys(RATE_LIMITS);
    const now = Date.now();

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key || !key.startsWith('ratelimit_')) continue;

        const action = keysToCheck.find(a => key.includes(`ratelimit_${a}_`));
        if (!action) {
            localStorage.removeItem(key);
            continue;
        }

        try {
            const history = JSON.parse(localStorage.getItem(key) || '[]');
            const window = RATE_LIMITS[action].window;
            const filtered = history.filter(t => now - t < window);

            if (filtered.length === 0) {
                localStorage.removeItem(key);
            } else {
                localStorage.setItem(key, JSON.stringify(filtered));
            }
        } catch (e) {
            localStorage.removeItem(key);
        }
    }
}

// تشغيل التنظيف مرة واحدة عند تحميل الملف
try {
    cleanupOldRateLimits();
} catch (e) {}

console.log('✅ Security module loaded (Web Crypto API)');