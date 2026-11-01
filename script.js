// script.js
// ============================================
// نظام الملف الشخصي والرتب والنقاط
// ============================================

// ============================================
// الحصول على رتبة المستخدم حسب بريده
// ============================================
function getUserRole(email) {
    const admins = ["adamhalym2017@gmail.com", "admin@alkhwarizmi.com"];
    if (admins.includes(email)) {
        return { ar: "مشرف 👑", fr: "Superviseur 👑", en: "Admin 👑", code: "admin" };
    } else {
        return { ar: "تلميذ 📚", fr: "Élève 📚", en: "Student 📚", code: "student" };
    }
}

// ============================================
// إضافة الرتبة إلى الملف الشخصي
// ============================================
function addRankToProfile() {
    let currentUser = null;
    try {
        const saved = localStorage.getItem('currentUser');
        if (saved && saved !== 'null') currentUser = JSON.parse(saved);
    } catch (e) {
        currentUser = null;
    }
    if (!currentUser) return;

    const profileInfo = document.getElementById('profileInfo') || document.querySelector('.profile-info');
    if (!profileInfo) return;
    if (document.querySelector('.rank-display')) return;

    const currentLang = localStorage.getItem('language') || 'ar';
    const role = getUserRole(currentUser.email);
    const rankHTML = `
        <p class="rank-display">
            <strong><i class="fas fa-medal"></i> ${getTranslation('rank', currentLang)}:</strong>
            <span id="profileRank">${role[currentLang] || role.ar}</span>
        </p>
    `;
    profileInfo.insertAdjacentHTML('beforeend', rankHTML);
}

// ============================================
// تحديث صورة الملف الشخصي
// ============================================
async function updateProfileImage(file, currentUser) {
    if (!file || !currentUser) return false;

    if (typeof supabase === 'undefined' || !supabase) {
        return updateProfileImageLocal(file, currentUser);
    }

    const fileExt = (file.name.split('.').pop() || 'jpg').toLowerCase();
    const fileName = `${currentUser.id}_${Date.now()}.${fileExt}`;

    try {
        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(fileName, file, { upsert: true, contentType: file.type });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(fileName);

        await supabase
            .from('students')
            .update({ avatar_url: urlData.publicUrl })
            .eq('id', currentUser.id);

        await refreshUserAvatar(currentUser.id);
        return true;
    } catch (error) {
        console.error('خطأ في رفع الصورة:', error);
        // fallback: حفظ محلي
        return updateProfileImageLocal(file, currentUser);
    }
}

function updateProfileImageLocal(file, currentUser) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = function(event) {
            const imageUrl = event.target.result;
            try {
                localStorage.setItem(`avatar_${currentUser.id}`, imageUrl);
            } catch (e) {
                console.warn('⚠️ فشل حفظ الصورة محلياً:', e);
            }
            refreshUserAvatarLocal(currentUser.id);
            resolve(true);
        };
        reader.onerror = function() { resolve(false); };
        reader.readAsDataURL(file);
    });
}

async function refreshUserAvatar(userId) {
    if (typeof supabase === 'undefined' || !supabase) {
        refreshUserAvatarLocal(userId);
        return;
    }

    try {
        const { data } = await supabase
            .from('students')
            .select('avatar_url')
            .eq('id', userId)
            .single();

        const avatarCircle = document.getElementById('avatarCircle');
        const profileAvatarImg = document.getElementById('profileAvatarImg');

        if (data && data.avatar_url) {
            if (avatarCircle) {
                avatarCircle.innerHTML = `<img src="${data.avatar_url}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;" alt="الصورة الشخصية">`;
            }
            if (profileAvatarImg) profileAvatarImg.src = data.avatar_url;

            let currentUser = null;
            try {
                currentUser = JSON.parse(localStorage.getItem('currentUser'));
            } catch (e) {}
            if (currentUser) {
                currentUser.avatar_url = data.avatar_url;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
            }
        } else {
            refreshUserAvatarLocal(userId);
        }
    } catch (error) {
        console.error('خطأ في تحميل الصورة:', error);
        refreshUserAvatarLocal(userId);
    }
}

function refreshUserAvatarLocal(userId) {
    const savedAvatar = localStorage.getItem(`avatar_${userId}`);
    const avatarCircle = document.getElementById('avatarCircle');
    const profileAvatarImg = document.getElementById('profileAvatarImg');

    if (savedAvatar) {
        if (avatarCircle) {
            avatarCircle.innerHTML = `<img src="${savedAvatar}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;" alt="الصورة الشخصية">`;
        }
        if (profileAvatarImg) profileAvatarImg.src = savedAvatar;
    } else {
        if (avatarCircle && !avatarCircle.querySelector('img')) {
            avatarCircle.innerHTML = '<i class="fas fa-user-graduate"></i>';
        }
        if (profileAvatarImg) profileAvatarImg.src = '';
    }
}

// ============================================
// تغيير كلمة المرور (محسّنة مع PBKDF2)
// ============================================
async function changeUserPassword(userId, newPassword) {
    if (!newPassword || newPassword.length < 4) {
        showNotificationMessage('كلمة المرور يجب أن تكون 4 أحرف على الأقل', 'error');
        return false;
    }

    try {
        // محاولة التحديث في Supabase مع التشفير
        if (typeof supabase !== 'undefined' && supabase) {
            console.log('🔄 تحديث كلمة المرور في قاعدة البيانات...');

            let hash = newPassword;

            // محاولة استخدام hashPassword من security.js
            try {
                const securityModule = await import('./security.js');
                const result = await securityModule.hashPassword(newPassword);
                if (result && result.success && result.hash) {
                    hash = result.hash;
                }
            } catch (e) {
                console.warn('⚠️ فشل استيراد security.js، سيتم الحفظ كـ plain (غير مستحسن):', e);
            }

            const { error } = await supabase
                .from('students')
                .update({ password: hash })
                .eq('id', userId);

            if (error) {
                console.warn('⚠️ فشل تحديث كلمة المرور في قاعدة البيانات:', error);
                localStorage.setItem(`password_${userId}`, newPassword);
            } else {
                console.log('✅ تم تحديث كلمة المرور في قاعدة البيانات');
            }
        } else {
            console.log('💾 حفظ كلمة المرور محلياً');
            localStorage.setItem(`password_${userId}`, newPassword);
        }

        // تحديث كلمة المرور في localStorage للمستخدم الحالي
        try {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (currentUser && currentUser.id === userId) {
                currentUser.password = '[SECURED]';
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
            }
        } catch (e) {}

        showNotificationMessage('✅ تم تغيير كلمة المرور بنجاح!', 'success');
        return true;

    } catch (error) {
        console.error('❌ خطأ في تغيير كلمة المرور:', error);
        showNotificationMessage('❌ حدث خطأ في تغيير كلمة المرور', 'error');
        return false;
    }
}

// ============================================
// تسجيل الخروج
// ============================================
function logoutUser() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('session_token');
    localStorage.removeItem('session_start');
    showNotificationMessage('تم تسجيل الخروج بنجاح', 'success');
    setTimeout(() => { window.location.href = 'index.html'; }, 500);
}

// ============================================
// الترجمة المبسطة
// ============================================
function getTranslation(key, lang) {
    const translations = {
        rank: { ar: 'الرتبة', fr: 'Rang', en: 'Rank' }
    };
    if (!translations[key]) return key;
    return translations[key][lang] || translations[key].ar;
}

// ============================================
// إشعار رسالة (Toast)
// ============================================
function showNotificationMessage(message, type = 'info') {
    const old = document.querySelector('.notification-toast');
    if (old) old.remove();

    const notif = document.createElement('div');
    notif.className = 'notification-toast';

    const icon = type === 'success' ? 'fa-check-circle'
               : type === 'error' ? 'fa-exclamation-circle'
               : 'fa-info-circle';

    notif.innerHTML = `<i class="fas ${icon}"></i><span>${message}</span>`;

    let bgColor;
    if (type === 'success') bgColor = 'rgba(81,207,102,0.95)';
    else if (type === 'error') bgColor = 'rgba(255,107,107,0.95)';
    else bgColor = 'linear-gradient(45deg, #667eea, #764ba2)';

    notif.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 12px 20px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 9999;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        font-family: 'Cairo', sans-serif;
        direction: rtl;
        max-width: 90%;
        font-size: 0.9rem;
    `;

    document.body.appendChild(notif);

    setTimeout(() => {
        notif.style.opacity = '0';
        notif.style.transition = 'opacity 0.3s';
        setTimeout(() => notif.remove(), 300);
    }, 4000);
}

window.showNotification = showNotificationMessage;

// ============================================
// تهيئة نظام الملف الشخصي
// ============================================
function initProfileSystem() {
    let currentUser = null;
    try {
        const saved = localStorage.getItem('currentUser');
        if (saved && saved !== 'null') currentUser = JSON.parse(saved);
    } catch (e) {
        currentUser = null;
    }
    if (!currentUser) return;

    console.log('👤 تهيئة الملف الشخصي للمستخدم:', currentUser.name);

    addRankToProfile();

    // ===== رفع الصورة =====
    const avatarUpload = document.getElementById('avatarUpload');
    if (avatarUpload) {
        const newAvatarUpload = avatarUpload.cloneNode(true);
        avatarUpload.parentNode.replaceChild(newAvatarUpload, avatarUpload);

        newAvatarUpload.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            if (file.size > 2 * 1024 * 1024) {
                showNotificationMessage('⚠️ حجم الصورة كبير جداً (الحد 2MB)', 'error');
                e.target.value = '';
                return;
            }

            const success = await updateProfileImage(file, currentUser);
            if (success) {
                showNotificationMessage('تم تحديث الصورة الشخصية!', 'success');
                const modal = document.getElementById('profileModal');
                if (modal) modal.style.display = 'none';
            } else {
                showNotificationMessage('حدث خطأ في رفع الصورة', 'error');
            }
        });
    }

    // ===== تغيير كلمة المرور =====
    const updatePasswordBtn = document.getElementById('updatePasswordBtn');
    if (updatePasswordBtn) {
        const newUpdatePasswordBtn = updatePasswordBtn.cloneNode(true);
        updatePasswordBtn.parentNode.replaceChild(newUpdatePasswordBtn, updatePasswordBtn);

        newUpdatePasswordBtn.addEventListener('click', async () => {
            const newPasswordInput = document.getElementById('newPassword');
            const newPassword = newPasswordInput ? newPasswordInput.value : '';

            if (!newPassword) {
                showNotificationMessage('⚠️ الرجاء إدخال كلمة المرور الجديدة', 'error');
                return;
            }

            if (newPassword.length < 4) {
                showNotificationMessage('⚠️ كلمة المرور يجب أن تكون 4 أحرف على الأقل', 'error');
                return;
            }

            newUpdatePasswordBtn.disabled = true;
            newUpdatePasswordBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التحديث...';

            const success = await changeUserPassword(currentUser.id, newPassword);

            newUpdatePasswordBtn.disabled = false;
            newUpdatePasswordBtn.innerHTML = '<i class="fas fa-key"></i> تغيير كلمة المرور';

            if (success) {
                if (newPasswordInput) newPasswordInput.value = '';
                const modal = document.getElementById('profileModal');
                if (modal) modal.style.display = 'none';
            }
        });
    }

    // ===== تسجيل الخروج =====
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        const newLogoutBtn = logoutBtn.cloneNode(true);
        logoutBtn.parentNode.replaceChild(newLogoutBtn, logoutBtn);

        newLogoutBtn.addEventListener('click', () => {
            if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
                logoutUser();
            }
        });
    }

    // ===== إغلاق المودال =====
    const closeModalBtn = document.getElementById('closeModalBtn');
    if (closeModalBtn) {
        const newCloseModalBtn = closeModalBtn.cloneNode(true);
        closeModalBtn.parentNode.replaceChild(newCloseModalBtn, closeModalBtn);

        newCloseModalBtn.addEventListener('click', () => {
            const modal = document.getElementById('profileModal');
            if (modal) modal.style.display = 'none';
        });
    }

    refreshUserAvatar(currentUser.id);
}

// ============================================
// بدء التهيئة
// ============================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(initProfileSystem, 100);
    });
} else {
    setTimeout(initProfileSystem, 100);
}

// ============================================
// أنماط الإشعارات
// ============================================
(function addNotificationStyles() {
    if (document.getElementById('notification-styles')) return;

    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100px); opacity: 0; }
        }
        .notification-toast {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            animation: slideIn 0.3s ease;
            font-family: 'Cairo', sans-serif;
            direction: rtl;
        }
        .notification-toast.fade-out {
            animation: slideOut 0.3s ease;
        }
    `;
    document.head.appendChild(style);
})();

// ============================================
// تحميل نقاط المستخدم
// ============================================
async function loadUserPoints() {
    let currentUser = null;
    try {
        const saved = localStorage.getItem('currentUser');
        if (saved && saved !== 'null') currentUser   = JSON.parse(saved);
    } catch (e) {
        currentUser = null;
    }
    if (!currentUser) return;

    if (typeof supabase === 'undefined' || !supabase) {
        const points = localStorage.getItem(`points_${currentUser.id}`) || 0;
        const pointsEl = document.getElementById('userPoints');
        if (pointsEl) pointsEl.textContent = points;
        return;
    }

    try {
        const { data, error } = await supabase
            .from('students')
            .select('points')
            .eq('id', currentUser.id)
            .single();

        if (!error && data) {
            const pointsEl = document.getElementById('userPoints');
            if (pointsEl) pointsEl.textContent = data.points || 0;
            currentUser.points = data.points || 0;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        }
    } catch (error) {
        console.error('خطأ في تحميل النقاط:', error);
    }
}

// ============================================
// تصدير الدوال العامة
// ============================================
window.showNotificationMessage = showNotificationMessage;
window.logoutUser = logoutUser;
window.loadUserPoints = loadUserPoints;
window.refreshUserAvatar = refreshUserAvatar;
window.updateProfileImage = updateProfileImage;
window.changeUserPassword = changeUserPassword;
window.getUserRole = getUserRole;

console.log('✅ نظام الملف الشخصي والرتب والنقاط تم تحميله بنجاح!');  