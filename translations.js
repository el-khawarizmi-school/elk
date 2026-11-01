// ========== ملف الترجمة ==========

const translations = {
    main_title: { ar: "ثانوية الخوارزمي", fr: "Lycée Al-Khwarizmi", en: "Al-Khwarizmi High School" },
    badge_text: { ar: "مؤسسة تعليمية رائدة", fr: "Établissement d'enseignement leader", en: "Leading Educational Institution" },
    tagline_text: { ar: "منصة ذكية لتواصل التلاميذ مع الإدارة", fr: "Plateforme intelligente pour la communication des élèves avec l'administration", en: "Smart platform for student-administration communication" },
    students: { ar: "تلميذ", fr: "Élèves", en: "Students" },
    teachers: { ar: "أستاذ", fr: "Professeurs", en: "Teachers" },
    classes: { ar: "قسم", fr: "Classes", en: "Classes" },
    start_now: { ar: "ابدأ الآن", fr: "Commencez maintenant", en: "Start Now" },
    my_ideas: { ar: "اقتراحاتي", fr: "Mes idées", en: "My Ideas" },
    what_we_offer: { ar: "ماذا نقدم لك؟", fr: "Que vous offrons-nous ?", en: "What do we offer you?" },
    direct_contact: { ar: "تواصل مباشر", fr: "Contact direct", en: "Direct Contact" },
    direct_contact_desc: { ar: "تواصل فوري مع الأساتذة والإدارة عبر رسائل ذكية", fr: "Communication instantanée avec les professeurs et l'administration via des messages intelligents", en: "Instant communication with teachers and administration via smart messages" },
    grade_tracking: { ar: "متابعة التحصيل", fr: "Suivi des résultats", en: "Grade Tracking" },
    grade_tracking_desc: { ar: "نظام متطور لمتابعة النقاط والتقييمات الشهرية", fr: "Système avancé de suivi des notes et évaluations mensuelles", en: "Advanced system for tracking grades and monthly assessments" },
    smart_schedule: { ar: "جدول ذكي", fr: "Emploi du temps intelligent", en: "Smart Schedule" },
    smart_schedule_desc: { ar: "جدول حصص تفاعلي مع إشعارات تذكيرية", fr: "Emploi du temps interactif avec notifications de rappel", en: "Interactive timetable with reminder notifications" },
    developer: { ar: "المبرمج والمطور", fr: "Programmeur et développeur", en: "Programmer and developer" },
    copyright: { ar: "جميع الحقوق محفوظة", fr: "Tous droits réservés", en: "All rights reserved" }
};

let currentLang = localStorage.getItem('language') || 'ar';

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[key] && translations[key][lang]) {
            el.textContent = translations[key][lang];
        }
    });
    
    const langSpan = document.getElementById('currentLangText');
    if (langSpan) {
        if (lang === 'ar') langSpan.textContent = 'العربية';
        else if (lang === 'fr') langSpan.textContent = 'Français';
        else langSpan.textContent = 'English';
    }
    
    closeLanguageMenu();
}

function toggleLanguageMenu() {
    const menu = document.getElementById('languageMenu');
    if (menu) menu.classList.toggle('show');
}

function closeLanguageMenu() {
    const menu = document.getElementById('languageMenu');
    if (menu) menu.classList.remove('show');
}

// إغلاق القائمة عند النقر خارجها
document.addEventListener('click', function(e) {
    const wrapper = document.querySelector('.language-wrapper');
    if (wrapper && !wrapper.contains(e.target)) {
        closeLanguageMenu();
    }
});

// تشغيل الترجمة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    const langSpan = document.getElementById('currentLangText');
    if (langSpan) {
        if (currentLang === 'ar') langSpan.textContent = 'العربية';
        else if (currentLang === 'fr') langSpan.textContent = 'Français';
        else langSpan.textContent = 'English';
    }
    
    document.querySelectorAll('.lang-option').forEach(btn => {
        btn.addEventListener('click', () => {
            setLanguage(btn.dataset.lang);
        });
    });
    
    const toggleBtn = document.getElementById('languageToggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleLanguageMenu();
        });
    }
    
    setLanguage(currentLang);
});