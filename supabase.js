// supabase.js
// ============================================
// إعدادات Supabase + دوال مساعدة
// النسخة الموحدة: تعمل مع جدول `students` فقط
// ============================================

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import { hashPassword, verifyPassword, checkLoginLockout, recordLoginAttempt } from './security.js';

// ============================================
// إعدادات الاتصال
// ============================================
const supabaseUrl = 'https://pkwwxbjksgvpasszozzs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrd3d4Ymprc2d2cGFzc3pvenpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3NTIwODUsImV4cCI6MjA5MzMyODA4NX0.fPvPaPMGRTcKAhcmgTe7tzxWzqYsvot-e_kRVW_CUWY';

export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
    }
});

window.supabase = supabase;

console.log('✅ Supabase client initialized (students table only)');

// ============================================
// 🔐 جلب المستخدم الحالي (Async)
// ============================================
export async function getCurrentUser() {
    try {
        const cached = localStorage.getItem('currentUser');
        if (!cached || cached === 'null') return null;

        const parsed = JSON.parse(cached);
        if (!parsed || !parsed.id) return null;

        const { data, error } = await supabase
            .from('students')
            .select('id, name, email, class, role, points, avatar_url, gender, created_at')
            .eq('id', parsed.id)
            .single();

        if (error || !data) {
            localStorage.removeItem('currentUser');
            return null;
        }

        localStorage.setItem('currentUser', JSON.stringify(data));
        return data;
    } catch (e) {
        console.error('❌ getCurrentUser error:', e.message);
        return null;
    }
}

// ============================================
// 🔐 جلب المستخدم (Sync - من الـ cache فقط)
// ============================================
export function getCurrentUserSync() {
    try {
        const cached = localStorage.getItem('currentUser');
        if (!cached || cached === 'null') return null;
        const user = JSON.parse(cached);
        if (!user || !user.id) return null;
        return user;
    } catch (e) {
        return null;
    }
}

// ============================================
// 🚪 تسجيل الدخول
// ============================================
export async function secureLogin(email, password) {
    try {
        if (!email || !password) {
            return { success: false, error: 'البريد وكلمة المرور مطلوبان' };
        }

        const lockStatus = checkLoginLockout(email);
        if (lockStatus.locked) {
            return {
                success: false,
                error: `⛔ الحساب مقفل مؤقتاً. حاول بعد ${lockStatus.remainingMinutes} دقيقة`
            };
        }

        const normalizedEmail = email.trim().toLowerCase();

        const { data: user, error } = await supabase
            .from('students')
            .select('*')
            .eq('email', normalizedEmail)
            .maybeSingle();

        if (error || !user) {
            recordLoginAttempt(email, false);
            return { success: false, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
        }

        // ✅ الإصلاح: دعم كلمات المرور المشفرة والنصية معاً
        let isValid = false;
        
        // 1. إذا كانت مشفرة (الطريقة الجديدة)
        if (user.password && user.password.startsWith('pbkdf2$')) {
            isValid = await verifyPassword(password, user.password);
        } 
        // 2. إذا كانت نصية (الطريقة القديمة أو حساب تم إنشاؤه يدوياً)
        else if (user.password) {
            isValid = (password === user.password);
        }
        // 3. إذا لم تكن هناك كلمة مرور أصلاً (حساب قديم جداً)
        else {
            isValid = false;
        }

        if (!isValid) {
            recordLoginAttempt(email, false);
            return { success: false, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
        }

        recordLoginAttempt(email, true);

        const safeUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            class: user.class,
            role: user.role || 'student',
            points: user.points || 0,
            avatar_url: user.avatar_url || null,
            gender: user.gender || 'male',
            created_at: user.created_at
        };

        localStorage.setItem('currentUser', JSON.stringify(safeUser));
        return { success: true, user: safeUser };

    } catch (error) {
        console.error('❌ login error:', error.message);
        return { success: false, error: 'حدث خطأ في تسجيل الدخول' };
    }
}

// ============================================
// 📝 تسجيل جديد
// ============================================
export async function secureRegister(name, className, email, password, gender = 'male') {
    try {
        if (!name || !className || !email || !password) {
            return { success: false, error: 'جميع الحقول مطلوبة' };
        }

        if (password.length < 8) {
            return { success: false, error: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' };
        }

        const normalizedEmail = email.trim().toLowerCase();

        const { data: existing } = await supabase
            .from('students')
            .select('id')
            .eq('email', normalizedEmail)
            .maybeSingle();

        if (existing) {
            return { success: false, error: 'البريد الإلكتروني مسجل مسبقاً' };
        }

        const hashResult = await hashPassword(password);
        const finalPassword = hashResult.success ? hashResult.hash : password;

        const { data, error } = await supabase
            .from('students')
            .insert({
                name: name.trim(),
                email: normalizedEmail,
                class: className,
                role: 'student',
                points: 0,
                password: finalPassword,
                gender: gender,
                created_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) {
            return { success: false, error: error.message };
        }

        return {
            success: true,
            user: {
                id: data.id,
                name: data.name,
                email: data.email,
                class: data.class,
                role: 'student',
                points: 0,
                gender: data.gender
            }
        };

    } catch (error) {
        console.error('❌ register error:', error.message);
        return { success: false, error: 'حدث خطأ في التسجيل' };
    }
}

// ============================================
// 🚪 تسجيل الخروج
// ============================================
export async function logout() {
    try {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('session_token');
        localStorage.removeItem('session_start');
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ============================================
// 🔑 تغيير كلمة المرور
// ============================================
export async function changePassword(newPassword) {
    try {
        if (!newPassword || newPassword.length < 8) {
            return { success: false, error: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' };
        }

        const user = getCurrentUserSync();
        if (!user) {
            return { success: false, error: 'يجب تسجيل الدخول أولاً' };
        }

        const hashResult = await hashPassword(newPassword);
        if (!hashResult.success) {
            return { success: false, error: 'فشل تشفير كلمة المرور' };
        }

        const { error } = await supabase
            .from('students')
            .update({ password: hashResult.hash })
            .eq('id', user.id);

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ============================================
// 🛡️ التحقق من الجلسة
// ============================================
export async function requireAuth() {
    const user = await getCurrentUser();
    if (!user) {
        window.location.href = 'login.html';
        return null;
    }
    return user;
}

export async function requireRole(requiredRole) {
    const user = await getCurrentUser();
    if (!user) {
        window.location.href = 'login.html';
        return null;
    }

    const hierarchy = { student: 1, admin: 2, developer: 3 };
    if ((hierarchy[user.role] || 0) < (hierarchy[requiredRole] || 0)) {
        showToast('⛔ ليس لديك صلاحية الوصول', 'error');
        setTimeout(() => window.location.href = 'dashboard.html', 1500);
        return null;
    }
    return user;
}

// ============================================
// 🗑️ حذف ملف من Storage
// ============================================
export async function deleteFileFromStorage(bucket, fileUrl) {
    try {
        if (!bucket || !fileUrl) return { success: false, error: 'بيانات ناقصة' };
        const fileName = fileUrl.split('/').pop();
        if (!fileName) return { success: false, error: 'اسم الملف غير صالح' };
        const { error } = await supabase.storage.from(bucket).remove([fileName]);
        if (error) return { success: false, error: error.message };
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ============================================
// 🎨 Toast
// ============================================
export function showToast(message, type = 'info') {
    const existing = document.querySelector('.toast-message');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast-message ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// ============================================
// 🔒 Escape HTML
// ============================================
export function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str).replace(/[&<>"']/g, function(m) {
        const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
        return map[m];
    });
}

// ============================================
// 🛡️ جلب التلاميذ (آمن)
// ============================================
export async function getStudentsSafe() {
    try {
        const { data, error } = await supabase
            .from('students')
            .select('id, name, email, class, role, points, avatar_url, gender, created_at');
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('❌ getStudentsSafe:', error.message);
        return [];
    }
}

export async function getStudentSafe(userId) {
    try {
        const { data, error } = await supabase
            .from('students')
            .select('id, name, email, class, role, points, avatar_url, gender')
            .eq('id', userId)
            .single();
        if (error) throw error;
        return data;
    } catch (error) {
        return null;
    }
}

export default supabase;
