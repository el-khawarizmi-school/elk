// darkmode.js
// ============================================
// نظام الوضع الليلي الاحترافي - نسخة محسّنة
// ============================================

// ============================================
// إزالة أي زر قديم موجود في الصفحة
// ============================================
function removeExistingToggle() {
    const existingToggle = document.querySelector('.theme-switch-wrapper');
    if (existingToggle) existingToggle.remove();
    const oldToggle = document.querySelector('.dark-mode-toggle');
    if (oldToggle) oldToggle.remove();
}

// ============================================
// تطبيق الوضع المحفوظ
// ============================================
function applyStoredTheme() {
    try {
        if (localStorage.getItem('darkMode') === 'true') {
            document.documentElement.classList.add('dark-mode');
            if (document.body) {
                document.body.classList.add('dark-mode');
            }
        }
    } catch (e) {
        console.warn('⚠️ فشل تطبيق الوضع الليلي:', e);
    }
}

// ============================================
// تبديل الوضع الليلي (يُستدعى من القائمة الجانبية)
// ============================================
function toggleThemeFromMenu() {
    const body = document.body;
    if (!body) return;

    body.classList.toggle('dark-mode');
    document.documentElement.classList.toggle('dark-mode');

    const isDark = body.classList.contains('dark-mode');
    try {
        localStorage.setItem('darkMode', isDark ? 'true' : 'false');
    } catch (e) {}

    updateSideMenuThemeState();
    updateDashboardThemeIcon();
}

// ============================================
// تحديث حالة الثيم في القائمة الجانبية
// ============================================
function updateSideMenuThemeState() {
    const dark = document.body && document.body.classList.contains('dark-mode');
    const icon = document.getElementById('themeIcon');
    const value = document.getElementById('themeValue');
    const lang = localStorage.getItem('language') || 'ar';

    if (icon) {
        icon.className = dark ? 'fas fa-sun' : 'fas fa-moon';
    }

    const values = {
        ar: dark ? 'نهاري' : 'ليلي',
        fr: dark ? 'Clair' : 'Sombre',
        en: dark ? 'Light' : 'Dark'
    };
    if (value) value.textContent = values[lang] || values.ar;
}

// ============================================
// تحديث أيقونة الثيم في لوحة التحكم (Service Card)
// ============================================
function updateDashboardThemeIcon() {
    const icon = document.getElementById('themeServiceIcon');
    if (!icon) return;
    const dark = document.body && document.body.classList.contains('dark-mode');
    icon.className = dark ? 'fas fa-sun' : 'fas fa-moon';
}

// ============================================
// إضافة الأنماط الديناميكية (3D buttons)
// ============================================
function injectDynamicStyles() {
    // تجنب التكرار
    if (document.getElementById('dynamic-3d-styles')) return;

    const style = document.createElement('style');
    style.id = 'dynamic-3d-styles';
    style.textContent = `
        /* ===== زر الثيم في القائمة الجانبية ===== */
        #themeMenuItem .menu-item-icon {
            transition: all 0.3s ease;
        }
        #themeMenuItem:hover .menu-item-icon {
            transform: rotate(20deg) scale(1.1);
        }

        /* ===== أيقونات 3D على الأزرار ===== */
        .btn-3d {
            position: relative;
            transform-style: preserve-3d;
            perspective: 800px;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .btn-3d:hover {
            transform: translateY(-4px) scale(1.03);
        }
        .btn-3d:active {
            transform: translateY(2px) scale(0.97);
        }
        .btn-3d .icon-3d {
            display: inline-block;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            transform-style: preserve-3d;
        }
        .btn-3d:hover .icon-3d {
            transform: rotateY(15deg) rotateX(5deg) scale(1.15);
            text-shadow: 0 8px 25px rgba(255,215,0,0.3);
        }

        /* ===== أزرار 3D ملونة ===== */
        .btn-3d-primary {
            background: linear-gradient(145deg, #ff6b6b, #e55a5a);
            box-shadow:
                0 4px 15px rgba(255,107,107,0.3),
                inset 0 2px 0 rgba(255,255,255,0.2),
                inset 0 -3px 0 rgba(0,0,0,0.15);
            transform-style: preserve-3d;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .btn-3d-primary:hover {
            transform: translateY(-4px) scale(1.03);
            box-shadow:
                0 8px 30px rgba(255,107,107,0.4),
                inset 0 2px 0 rgba(255,255,255,0.2),
                inset 0 -3px 0 rgba(0,0,0,0.15);
        }

        .btn-3d-secondary {
            background: rgba(255,255,255,0.12);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
            box-shadow:
                0 4px 15px rgba(0,0,0,0.08),
                inset 0 1px 0 rgba(255,255,255,0.2);
            transform-style: preserve-3d;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .btn-3d-secondary:hover {
            transform: translateY(-4px) scale(1.03);
            background: rgba(255,255,255,0.2);
            box-shadow:
                0 8px 30px rgba(0,0,0,0.12),
                inset 0 1px 0 rgba(255,255,255,0.3);
        }

        .btn-3d-gold {
            background: linear-gradient(145deg, #ffd700, #f0c000);
            box-shadow:
                0 4px 15px rgba(255,215,0,0.3),
                inset 0 2px 0 rgba(255,255,255,0.3),
                inset 0 -3px 0 rgba(0,0,0,0.15);
            transform-style: preserve-3d;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            color: #1a1a2e;
        }
        .btn-3d-gold:hover {
            transform: translateY(-4px) scale(1.03);
            box-shadow:
                0 8px 30px rgba(255,215,0,0.4),
                inset 0 2px 0 rgba(255,255,255,0.3),
                inset 0 -3px 0 rgba(0,0,0,0.15);
        }
        .btn-3d-gold .icon-3d {
            color: #1a1a2e;
        }

        /* ===== بطاقات الإجراءات السريعة 3D ===== */
        .action-btn-3d {
            position: relative;
            transform-style: preserve-3d;
            perspective: 600px;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            background: rgba(255,255,255,0.06);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 16px;
            padding: 0.7rem 0.2rem;
            color: white;
            text-align: center;
            text-decoration: none;
            cursor: pointer;
            font-family: 'Cairo', sans-serif;
            font-size: 0.6rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.2rem;
            backdrop-filter: blur(10px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.05);
            min-height: 70px;
            justify-content: center;
        }
        .action-btn-3d:hover {
            transform: translateY(-4px) scale(1.02) rotateX(3deg);
            background: rgba(255,255,255,0.12);
            border-color: rgba(255,215,0,0.25);
            box-shadow: 0 12px 35px rgba(0,0,0,0.12);
        }
        .action-btn-3d:active {
            transform: translateY(0px) scale(0.97);
        }
        .action-btn-3d .icon-3d {
            font-size: 1.3rem;
            color: #ffd700;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 2rem;
            height: 2rem;
            border-radius: 50%;
            background: rgba(255,215,0,0.06);
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .action-btn-3d:hover .icon-3d {
            transform: rotateY(15deg) rotateX(5deg) scale(1.15);
            background: rgba(255,215,0,0.12);
        }
        .action-btn-3d span {
            font-size: 0.55rem;
            line-height: 1.2;
            opacity: 0.8;
            font-weight: 500;
        }

        body.dark-mode .action-btn-3d {
            background: rgba(0,0,0,0.2);
        }
        body.dark-mode .action-btn-3d:hover {
            background: rgba(255,255,255,0.08);
        }

        /* ===== أزرار الصفحة الرئيسية ===== */
        .hero .btn {
            transform-style: preserve-3d;
            perspective: 800px;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .hero .btn:hover {
            transform: translateY(-4px) scale(1.03) rotateX(2deg);
        }
        .hero .btn i {
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            transform-style: preserve-3d;
        }
        .hero .btn:hover i {
            transform: rotateY(15deg) scale(1.15);
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// التهيئة
// ============================================
function initDarkMode() {
    removeExistingToggle();
    applyStoredTheme();
    injectDynamicStyles();
    updateSideMenuThemeState();
    updateDashboardThemeIcon();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDarkMode);
} else {
    initDarkMode();
}

// ============================================
// جعل الدوال عامة
// ============================================
window.toggleThemeFromMenu = toggleThemeFromMenu;
window.updateSideMenuThemeState = updateSideMenuThemeState;
window.applyStoredTheme = applyStoredTheme;
window.updateDashboardThemeIcon = updateDashboardThemeIcon;

console.log('✅ Dark mode module loaded');