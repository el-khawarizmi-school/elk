// داخل ملف supabase.js
import { saveToCache, getFromCache, clearCache } from './cache.js';

// دالة تسجيل الدخول
export async function secureLogin(email, password) {
    // ... الكود السابق ...

    if (success) {
        // حفظ بيانات المستخدم في المتصفح
        saveToCache('current_user', user);
        // ...
    }
}

// دالة تسجيل الخروج
export async function logout() {
    // مسح البيانات عند الخروج لأسباب أمنية
    clearCache(); 
    // ...
}