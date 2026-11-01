// notifications.js
// ============================================
// نظام الإشعارات الفورية - نسخة محسّنة 2.0
// ============================================

import { supabase } from './supabase.js';

// ============================================
// المتغيرات العامة
// ============================================
let notificationsChannel = null;
let currentUserId = null;
let currentNotifications = [];
let unreadCount = 0;
let browserPermission = 'default';

// متغيرات تجميع الإشعارات
let notificationQueue = [];
let batchTimer = null;
const BATCH_DELAY = 3000; // 3 ثوانٍ

// ============================================
// الأصوات
// ============================================
function playNotificationSound(type = 'info') {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;

        const audioContext = new AudioCtx();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        let freq1 = 800;
        let freq2 = 1200;

        if (type === 'success') {
            freq1 = 523.25;
            freq2 = 659.25;
        } else if (type === 'warning') {
            freq1 = 440;
            freq2 = 554.37;
        }

        oscillator.frequency.setValueAtTime(freq1, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(freq2, audioContext.currentTime + 0.1);
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);

        setTimeout(() => {
            try { audioContext.close(); } catch (e) {}
        }, 500);
    } catch (e) {
        console.warn('⚠️ فشل تشغيل الصوت');
    }
}

// ============================================
// الاهتزاز
// ============================================
function vibrateDevice() {
    if (navigator.vibrate) {
        navigator.vibrate(200);
    }
}

// ============================================
// إذن الإشعارات
// ============================================
async function requestNotificationPermission() {
    if (!('Notification' in window)) return false;

    if (Notification.permission === 'granted') {
        browserPermission = 'granted';
        return true;
    }

    if (Notification.permission !== 'denied') {
        try {
            const permission = await Notification.requestPermission();
            browserPermission = permission;
            return permission === 'granted';
        } catch (e) {
            return false;
        }
    }

    return false;
}

// ============================================
// إشعار نظام المتصفح (محسن)
// ============================================
function showBrowserNotification(title, content, link = null, icon = null) {
    if (browserPermission !== 'granted') return;
    if (!('Notification' in window)) return;
    
    // عدم إظهار الإشعار إذا كان المستخدم في الصفحة نفسها
    if (document.visibilityState === 'visible' && document.hasFocus()) return;

    try {
        const notification = new Notification(title, {
            body: content,
            icon: icon || '/favicon.ico',
            badge: '/favicon.ico',
            dir: 'rtl',
            lang: 'ar',
            tag: 'alkhwarizmi-notification',
            requireInteraction: false
        });

        // إغلاق تلقائي بعد 6 ثوانٍ
        setTimeout(() => {
            try { notification.close(); } catch (e) {}
        }, 6000);

        // عند النقر
        notification.onclick = () => {
            try {
                window.focus();
                notification.close();
                // التوجيه للرابط إذا وجد
                if (link && link !== 'null' && link !== 'undefined') {
                    window.location.href = link;
                }
            } catch (e) {}
        };
    } catch (e) {
        console.warn('⚠️ فشل إظهار إشعار المتصفح:', e);
    }
}

// ============================================
// الهروب من HTML
// ============================================
function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str).replace(/[&<>"']/g, m => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[m]);
}

// ============================================
// تحديد نمط الإشعار
// ============================================
function getNotificationStyle(notification) {
    const type = notification.type || '';
    const title = (notification.title || '').toLowerCase();

    if (
        title.includes('المطور') ||
        title.includes('developer') ||
        title.includes('🛠️') ||
        type === 'message_reply_developer' ||
        (type === 'message_reply' && (title.includes('مطور') || title.includes('developer')))
    ) {
        return { icon: 'fa-code', color: '#9d7cf5', bgColor: 'rgba(157, 124, 245, 0.12)', borderColor: 'rgba(157, 124, 245, 0.3)', dotColor: '#9d7cf5', label: 'المطور' };
    }

    if (
        title.includes('الإدارة') ||
        title.includes('admin') ||
        title.includes('📬') ||
        type === 'message_reply_admin' ||
        type === 'message_reply'
    ) {
        return { icon: 'fa-user-tie', color: '#f5c842', bgColor: 'rgba(245, 200, 66, 0.12)', borderColor: 'rgba(245, 200, 66, 0.3)', dotColor: '#f5c842', label: 'الإدارة' };
    }

    if (type === 'points_added') {
        return { icon: 'fa-star', color: '#4ade80', bgColor: 'rgba(74, 222, 128, 0.12)', borderColor: 'rgba(74, 222, 128, 0.3)', dotColor: '#4ade80', label: 'نقاط' };
    }

    if (type === 'points_removed') {
        return { icon: 'fa-star-half-alt', color: '#fb923c', bgColor: 'rgba(251, 146, 60, 0.12)', borderColor: 'rgba(251, 146, 60, 0.3)', dotColor: '#fb923c', label: 'خصم' };
    }

    if (type === 'announcement') {
        return { icon: 'fa-bullhorn', color: '#fb923c', bgColor: 'rgba(251, 146, 60, 0.12)', borderColor: 'rgba(251, 146, 60, 0.3)', dotColor: '#fb923c', label: 'إعلان' };
    }

    if (type === 'resource_approved') {
        return { icon: 'fa-check-circle', color: '#4ade80', bgColor: 'rgba(74, 222, 128, 0.12)', borderColor: 'rgba(74, 222, 128, 0.3)', dotColor: '#4ade80', label: 'موارد' };
    }

    if (type === 'idea_approved') {
        return { icon: 'fa-lightbulb', color: '#f5c842', bgColor: 'rgba(245, 200, 66, 0.12)', borderColor: 'rgba(245, 200, 66, 0.3)', dotColor: '#f5c842', label: 'اقتراح' };
    }

    return { icon: 'fa-bell', color: '#a18cd1', bgColor: 'rgba(161, 140, 209, 0.12)', borderColor: 'rgba(161, 140, 209, 0.3)', dotColor: '#a18cd1', label: 'إشعار' };
}

// ============================================
// تحميل الإشعارات
// ============================================
export async function loadNotifications(userId) {
    if (!userId) return [];

    currentUserId = userId;

    try {
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(50);

        if (error) throw error;

        currentNotifications = data || [];
        updateUnreadCount();

        return currentNotifications;
    } catch (error) {
        console.error('❌ خطأ في تحميل الإشعارات:', error);
        return [];
    }
}

// ============================================
// تحديث العداد
// ============================================
function updateUnreadCount() {
    unreadCount = currentNotifications.filter(n => !n.is_read).length;

    const badge = document.getElementById('notificationsBadge');
    const trigger = document.getElementById('notificationsTrigger');

    if (badge) {
        if (unreadCount > 0) {
            badge.textContent = unreadCount > 99 ? '99+' : unreadCount;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }

    if (trigger) {
        if (unreadCount > 0) {
            trigger.classList.add('has-new');
        } else {
            trigger.classList.remove('has-new');
        }
    }

    updatePageTitle();
}

function updatePageTitle() {
    const baseTitle = document.title.replace(/^\(\d+\+?\)\s*/, '');
    if (unreadCount > 0) {
        document.title = `(${unreadCount}) ${baseTitle}`;
    } else {
        document.title = baseTitle;
    }
}

// ============================================
// عرض قائمة الإشعارات
// ============================================
export function renderNotifications() {
    const list = document.getElementById('notificationsList');
    if (!list) return;

    if (currentNotifications.length === 0) {
        list.innerHTML = `
            <div class="notifications-empty">
                <i class="fas fa-bell-slash"></i>
                <p>لا توجد إشعارات</p>
            </div>
        `;
        return;
    }

    list.innerHTML = currentNotifications.map(n => {
        const style = getNotificationStyle(n);
        const timeAgo = getTimeAgo(n.created_at);
        const safeId = escapeHtml(n.id);
        const safeLink = escapeHtml(n.link || '');

        return `
            <div class="notification-item ${n.is_read ? 'read' : 'unread'}"
                 onclick="window.handleNotificationClick('${safeId}', '${safeLink}')"
                 style="border-right: 3px solid ${style.color};
                        background: ${n.is_read ? 'transparent' : style.bgColor};">
                <div class="notification-icon"
                     style="background: ${style.bgColor};
                            color: ${style.color};
                            border: 1px solid ${style.borderColor};">
                    <i class="fas ${style.icon}"></i>
                </div>
                <div class="notification-content">
                    <div class="notification-title" style="color: ${n.is_read ? 'var(--text-primary, #ffffff)' : style.color};">
                        ${escapeHtml(n.title)}
                    </div>
                    ${n.content ? `<div class="notification-text">${escapeHtml(n.content)}</div>` : ''}
                    <div class="notification-time">
                        <i class="fas fa-clock"></i> ${timeAgo}
                    </div>
                </div>
                ${!n.is_read ? `<div class="notification-dot" style="background: ${style.dotColor}; box-shadow: 0 0 8px ${style.dotColor};"></div>` : ''}
            </div>
        `;
    }).join('');
}

// ============================================
// حساب الوقت المنقضي
// ============================================
function getTimeAgo(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return 'الآن';
    if (diff < 3600) return `منذ ${Math.floor(diff / 60)} دقيقة`;
    if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} ساعة`;
    if (diff < 604800) return `منذ ${Math.floor(diff / 86400)} يوم`;

    return date.toLocaleDateString('ar-EG');
}

// ============================================
// عند النقر على إشعار
// ============================================
window.handleNotificationClick = async function(notificationId, link) {
    if (!notificationId) return;

    try {
        await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', notificationId);

        await loadNotifications(currentUserId);
        renderNotifications();
        updateUnreadCount();

        if (link && link !== '' && link !== 'null' && link !== 'undefined') {
            window.location.href = link;
        }
    } catch (error) {
        console.error('خطأ:', error);
    }
};

// ============================================
// تعليم الكل كمقروء
// ============================================
export async function markAllAsRead() {
    if (!currentUserId) return;

    try {
        const unreadIds = currentNotifications.filter(n => !n.is_read).map(n => n.id);
        if (unreadIds.length === 0) return;

        await supabase
            .from('notifications')
            .update({ is_read: true })
            .in('id', unreadIds);

        await loadNotifications(currentUserId);
        renderNotifications();
        updateUnreadCount();
    } catch (error) {
        console.error('خطأ:', error);
    }
}

// ============================================
// حذف جميع الإشعارات
// ============================================
export async function clearAllNotifications() {
    if (!currentUserId) return;
    if (!confirm('⚠️ حذف جميع الإشعارات؟')) return;

    try {
        await supabase
            .from('notifications')
            .delete()
            .eq('user_id', currentUserId);

        currentNotifications = [];
        renderNotifications();
        updateUnreadCount();
    } catch (error) {
        console.error('خطأ:', error);
    }
}

// ============================================
// إعداد Realtime (مع تجميع)
// ============================================
export function setupRealtime(userId) {
    if (!userId || !supabase) return;

    currentUserId = userId;

    try {
        if (notificationsChannel) {
            supabase.removeChannel(notificationsChannel);
        }

        notificationsChannel = supabase
            .channel(`notifications_${userId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'notifications',
                filter: `user_id=eq.${userId}`
            }, async (payload) => {
                console.log('🔔 إشعار جديد:', payload);

                const newNotif = payload.new;
                currentNotifications.unshift(newNotif);
                renderNotifications();
                updateUnreadCount();

                // إضافة للطابور
                notificationQueue.push(newNotif);

                // إذا لم يكن هناك مؤقت، ابدأ المؤقت
                if (!batchTimer) {
                    batchTimer = setTimeout(() => {
                        processQueue();
                    }, BATCH_DELAY);
                }
            })
            .subscribe();

        console.log('✅ Realtime notifications setup');
    } catch (e) {
        console.warn('⚠️ Realtime غير متاح:', e);
    }
}

// ============================================
// معالجة الطابور
// ============================================
function processQueue() {
    if (notificationQueue.length === 0) {
        batchTimer = null;
        return;
    }

    // تشغيل الصوت مرة واحدة
    const hasWarning = notificationQueue.some(n => n.type === 'points_removed');
    playNotificationSound(hasWarning ? 'warning' : 'info');
    
    // اهتزاز الجهاز
    vibrateDevice();

    // إشعار المتصفح
    if (notificationQueue.length === 1) {
        const n = notificationQueue[0];
        showBrowserNotification(n.title, n.content || '', n.link);
    } else {
        showBrowserNotification(
            'إشعارات جديدة',
            `لديك ${notificationQueue.length} إشعارات جديدة`,
            null
        );
    }

    // إعادة تعيين الطابور والمؤقت
    notificationQueue = [];
    batchTimer = null;
}

// ============================================
// إيقاف Realtime
// ============================================
export function stopRealtime() {
    if (notificationsChannel) {
        try {
            supabase.removeChannel(notificationsChannel);
        } catch (e) {}
        notificationsChannel = null;
    }
    if (batchTimer) {
        clearTimeout(batchTimer);
        batchTimer = null;
    }
}

// ============================================
// إنشاء إشعار
// ============================================
export async function createNotification(userId, type, title, content = null, link = null) {
    if (!userId || !type || !title) {
        return { success: false, error: 'بيانات ناقصة' };
    }

    try {
        const { error } = await supabase
            .from('notifications')
            .insert({
                user_id: userId,
                type: type,
                title: title,
                content: content,
                link: link
            });

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('❌ خطأ في إنشاء إشعار:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// تهيئة النظام
// ============================================
export async function initNotifications(userId) {
    if (!userId) {
        console.warn('⚠️ لا يوجد userId');
        return;
    }

    currentUserId = userId;

    await requestNotificationPermission();
    await loadNotifications(userId);
    renderNotifications();
    setupRealtime(userId);

    console.log('✅ Notifications initialized for:', userId);
}

// ============================================
// تنظيف
// ============================================
window.addEventListener('beforeunload', () => {
    stopRealtime();
});

// ============================================
// تصدير
// ============================================
export default {
    initNotifications,
    loadNotifications,
    renderNotifications,
    markAllAsRead,
    clearAllNotifications,
    createNotification,
    playNotificationSound,
    showBrowserNotification
};

console.log('✅ Notifications module 2.0 loaded');