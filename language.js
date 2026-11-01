// language.js
// ============================================
// نظام إدارة اللغة في جميع صفحات الموقع
// ============================================

const SUPPORTED_LANGUAGES = ['ar', 'fr', 'en'];
const DEFAULT_LANGUAGE = 'ar';

const translations = {
    ar: {
        // القائمة الجانبية
        settings: 'الإعدادات',
        language: 'اللغة',
        appearance: 'المظهر',
        account: 'الحساب',
        changeTheme: 'تغيير المظهر',
        profile: 'ملفي الشخصي',
        view: 'عرض',
        arabic: 'العربية',
        french: 'Français',
        english: 'English',

        // الصفحة الرئيسية
        schoolName: 'ثانوية الخوارزمي',
        schoolBadge: 'مؤسسة تعليمية رائدة',
        students: 'تلميذ',
        teachers: 'أستاذ',
        classes: 'قسم',
        suggestions: 'اقتراحاتي',
        start: 'ابدأ الآن',
        resources: 'الموارد التعليمية',
        features: 'ماذا نقدم لكم؟',
        featuresSubtitle: 'خدمات متكاملة لتسهيل التواصل والتعلم',
        direct: 'تواصل مباشر',
        directDesc: 'تواصل فوري مع الأساتذة والإدارة عبر رسائل ذكية',
        achievement: 'متابعة التحصيل',
        achievementDesc: 'نظام متطور لمتابعة النقاط والتقييمات الشهرية',
        schedule: 'جدول ذكي',
        scheduleDesc: 'جدول حصص تفاعلي مع إشعارات تذكيرية',
        library: 'المكتبة الرقمية',
        libraryDesc: 'اكتشف الكتب والروايات التعليمية وشاركها مع زملائك بسهولة',
        community: 'مجتمع التلاميذ',
        communityDesc: 'تبادل الموارد والمعرفة مع زملائك في مختلف المستويات والشعب',
        developer: 'المبرمج والمطور',
        developerLabel: 'المبرمج والمطور',
        developerName: 'آدم حليم',
        rights: 'جميع الحقوق محفوظة',
        allRightsReserved: 'جميع الحقوق محفوظة',
        footerTagline: 'منصة تعليمية لتلاميذ ثانوية الخوارزمي',
        platform: 'منصة ذكية لتواصل التلاميذ مع الإدارة',

        // الملف الشخصي
        profileTitle: 'ملفي الشخصي',
        name: 'الاسم:',
        email: 'البريد:',
        class: 'القسم:',
        rank: 'الرتبة:',
        newPassword: 'كلمة المرور الجديدة',
        changePassword: 'تغيير كلمة المرور',
        logout: 'تسجيل الخروج',

        // المظهر
        light: 'نهاري',
        dark: 'ليلي',
        show: 'عرض',

        // لوحة التحكم
        welcome: 'أهلاً بك',
        remainingHomeworks: 'الواجبات المتبقية',
        messages: 'الرسائل الواردة',
        completionRate: 'نسبة الإنجاز',
        points: 'نقاط التميز',
        scheduleTitle: 'جدول الحصص الأسبوعي',
        edit: 'تعديل',
        save: 'حفظ',
        homeworks: 'الواجبات المنزلية',
        contactAdmin: 'التواصل مع الإدارة',
        quickActions: 'إجراءات سريعة',
        resourcesLabel: 'الموارد التعليمية',
        libraryLabel: 'المكتبة الرقمية',
        ideasLabel: 'الاقتراحات',
        announcementsLabel: 'الإعلانات',
        adminPanel: 'لوحة المشرف',
        nightMode: 'الوضع الليلي',
        home: 'الرئيسية',
        myProfile: 'ملفي الشخصي',
        noHomeworks: 'لا توجد واجبات حالياً',
        addHomework: 'إضافة واجب جديد',
        noMessages: 'لا توجد رسائل بعد',
        sendFirstMessage: 'أرسل رسالتك الأولى للإدارة',
        writeMessage: 'اكتب رسالتك هنا...',
        send: 'إرسال',
        morning: 'الفترة الصباحية',
        evening: 'الفترة المسائية',
        note: 'الفترة الصباحية: 8:00 - 12:00 | الفترة المسائية: 14:00 - 18:00',
        holiday: 'يوم عطلة رسمي',
        noEvening: 'لا توجد حصص مسائية',
        emptyMorning: 'صباح فارغ',
        replyFromAdmin: 'رد من الإدارة:',
        waiting: 'قيد الانتظار',
        replied: 'تم الرد',
        pending: 'في انتظار الرد',

        // الخدمات
        servicesTitle: 'خدماتنا المتكاملة',
        servicesSubtitle: 'كل ما تحتاجه في مكان واحد - اضغط على أي خدمة للبدء',
        messagesLabel: 'مركز التواصل',
        englishLabel: 'تعلم اللغات الأجنبية', // ✅ تم التعديل هنا
        newBadge: 'جديد',
        serviceMessagesDesc: 'تواصل مع الإدارة، المبرمج، وزملائك',
        serviceEnglishDesc: 'الإنجليزية، الفرنسية، الإسبانية - دروس وموارد شاملة', // ✅ تم التعديل هنا
        serviceResourcesDesc: 'دروس، ملخصات، امتحانات وتمارين',
        serviceLibraryDesc: 'كتب وروايات بصيغة PDF للقراءة والتحميل',
        serviceIdeasDesc: 'شارك أفكارك وصوّت على اقتراحات زملائك',
        serviceAnnouncementsDesc: 'آخر الأخبار والإعلانات المدرسية',
        serviceAdminDesc: 'إدارة التلاميذ، الموارد، والإعلانات',
        serviceThemeDesc: 'تبديل بين الوضع النهاري والليلي',
        serviceHomeDesc: 'العودة للصفحة الرئيسية للموقع',
        serviceProfileDesc: 'عرض وتعديل معلوماتك الشخصية',

        // الموارد
        resourcesHeader: 'الموارد التعليمية',
        shareResources: 'شارك مع زملائك الدروس، الملخصات، والامتحانات',
        totalResources: 'إجمالي الموارد',
        myContributions: 'مساهماتي',
        pendingReview: 'قيد المراجعة',
        level: 'المستوى:',
        branch: 'الشعبة:',
        type: 'النوع:',
        all: 'الكل',
        allBranches: 'جميع',
        scientific: 'علمية',
        literary: 'أدبية',
        lessons: 'دروس',
        summaries: 'ملخصات',
        exams: 'امتحانات',
        exercises: 'تمارين',
        myResources: 'مساهماتي',
        showAll: 'عرض الكل',
        addResource: 'رفع مورد',
        upload: 'رفع',
        cancel: 'إلغاء',
        resourceTitle: 'عنوان المورد',
        resourceDesc: 'الوصف',
        resourceType: 'النوع',
        resourceLevel: 'المستوى',
        resourceBranch: 'الشعبة',
        pdfFile: 'ملف PDF',
        maxSize: 'الحد الأقصى للحجم: 10MB',
        noResources: 'لا توجد موارد في هذا التصنيف',
        uploadSuccess: 'تم رفع المورد بنجاح! في انتظار موافقة المشرف',
        download: 'تحميل',
        noFile: 'لا يوجد ملف للتحميل',
        viewCount: 'مشاهدة',
        pendingBadge: 'قيد المراجعة',
        approveResource: 'الموافقة على المورد',

        // المكتبة
        libraryHeader: 'المكتبة الرقمية',
        totalBooks: 'إجمالي الكتب',
        pdfBooks: 'كتب PDF',
        booksCount: 'كتب',
        novelsCount: 'روايات',
        addBook: 'إضافة كتاب',
        bookTitle: 'عنوان الكتاب',
        author: 'المؤلف',
        bookType: 'النوع',
        bookDesc: 'الوصف',
        pdfLink: 'رابط PDF',
        pdfLinkHint: 'أو اتركه فارغاً ليرفعه التلاميذ لاحقاً',
        noBooks: 'لا توجد كتب',
        read: 'قراءة',
        noPdf: 'لا يوجد PDF',
        deleteBook: 'حذف الكتاب',
        bookAdded: 'تم نشر الكتاب بنجاح!',

        // الاقتراحات
        ideasHeader: 'اقتراحات التلاميذ',
        ideasDesc: 'شاركنا أفكارك لتطوير المدرسة | صوت على اقتراحات زملائك',
        ideaTitle: 'عنوان الاقتراح',
        ideaCategory: 'التصنيف',
        ideaContent: 'محتوى الاقتراح',
        educational: 'تعليمي',
        sports: 'رياضي',
        cultural: 'ثقافي',
        infrastructure: 'بنية تحتية',
        other: 'أخرى',
        sendIdea: 'إرسال الاقتراح',
        noIdeas: 'لا توجد اقتراحات في هذا التصنيف',
        addComment: 'أضف رداً...',
        commentAdded: 'تم إضافة التعليق بنجاح!',
        vote: 'صوت',
        voteSuccess: 'تم التصويت بنجاح!',
        approved: 'مقبول',
        pendingIdea: 'قيد المراجعة',

        // الإعلانات
        announcementsHeader: 'الإعلانات',
        announcementsDesc: 'آخر الأخبار والإعلانات المدرسية',
        announcementsManagement: 'إدارة الإعلانات',
        addAnnouncement: 'إضافة إعلان',
        announcementTitle: 'عنوان الإعلان',
        announcementContent: 'محتوى الإعلان',
        publish: 'نشر',
        noAnnouncements: 'لا توجد إعلانات حالياً',
        deleteAnnouncement: 'حذف الإعلان',
        totalAnnouncements: 'الإعلانات',

        // لوحة المشرف
        adminTitle: 'لوحة تحكم المشرف',
        adminIdeas: 'الاقتراحات',
        adminStudents: 'التلاميذ',
        adminMessages: 'الرسائل',
        adminPending: 'قيد المراجعة',
        adminAdmins: 'المشرفون',
        pointsManagement: 'إدارة نقاط التميز',
        selectStudent: 'اختر التلميذ',
        pointsAmount: 'عدد النقاط',
        addPoints: 'إضافة نقاط',
        subtractPoints: 'خصم نقاط',
        execute: 'تنفيذ',
        ranking: 'ترتيب التلاميذ حسب النقاط',
        messagesManagement: 'إدارة الرسائل والردود',
        student: 'التلميذ',
        message: 'الرسالة',
        date: 'التاريخ',
        status: 'الحالة',
        reply: 'الرد',
        actions: 'إجراءات',
        writeReply: 'اكتب الرد...',
        deleteMessage: 'حذف الرسالة',
        replySent: 'تم إرسال الرد!',
        ideasManagement: 'إدارة الاقتراحات',
        resourcesManagement: 'إدارة الموارد التعليمية',
        studentsManagement: 'قائمة التلاميذ وإدارة الصلاحيات',
        promote: 'جعل مشرفاً',
        demote: 'إزالة الصلاحية',
        promoteSuccess: 'تمت الترقية بنجاح!',
        demoteSuccess: 'تمت إزالة الصلاحية',
        backToDashboard: 'العودة للوحة التحكم',

        // تسجيل الدخول
        loginTitle: 'تسجيل الدخول',
        registerTitle: 'تسجيل جديد',
        email: 'البريد الإلكتروني',
        password: 'كلمة المرور',
        fullName: 'الاسم الكامل',
        selectClass: 'اختر القسم',
        login: 'دخول',
        register: 'تسجيل حساب',
        backToHome: 'العودة للصفحة الرئيسية',
        loginSuccess: 'مرحباً',
        registerSuccess: 'تم التسجيل بنجاح!',
        emailRequired: 'الرجاء إدخال البريد الإلكتروني وكلمة المرور',
        passwordMin: 'كلمة المرور يجب أن تكون 4 أحرف على الأقل',
        fillAll: 'الرجاء ملء جميع الحقول',
        emailExists: 'البريد الإلكتروني مسجل مسبقاً',
        invalidCredentials: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',

        // إضافات
        loading: 'جارٍ التحميل...',
        calculator: 'آلة حاسبة علمية',
        memory: 'الذاكرة',
        store: 'حفظ',
        recall: 'استرجاع',
        clear: 'مسح',
        messagesTitle: 'مركز التواصل'
    },
    fr: {
        settings: 'Paramètres',
        language: 'Langue',
        appearance: 'Apparence',
        account: 'Compte',
        changeTheme: 'Changer le thème',
        profile: 'Mon profil',
        view: 'Voir',
        arabic: 'العربية',
        french: 'Français',
        english: 'English',
        schoolName: 'Lycée Al-Khwarizmi',
        schoolBadge: 'Un établissement éducatif de premier plan',
        students: 'Élèves',
        teachers: 'Enseignants',
        classes: 'Classes',
        suggestions: 'Mes suggestions',
        start: 'Commencer',
        resources: 'Ressources pédagogiques',
        features: 'Que vous proposons-nous ?',
        featuresSubtitle: 'Des services complets pour faciliter la communication et l\'apprentissage',
        direct: 'Communication directe',
        directDesc: 'Échange instantané avec les enseignants et l\'administration via une messagerie intelligente',
        achievement: 'Suivi des résultats',
        achievementDesc: 'Système avancé de suivi des notes et des évaluations mensuelles',
        schedule: 'Emploi du temps intelligent',
        scheduleDesc: 'Emploi du temps interactif avec notifications de rappel',
        library: 'Bibliothèque numérique',
        libraryDesc: 'Découvrez les livres et romans éducatifs et partagez-les avec vos camarades',
        community: 'Communauté des élèves',
        communityDesc: 'Échangez des ressources et des connaissances avec vos camarades',
        developer: 'Développeur',
        developerLabel: 'Développeur',
        developerName: 'Adam Halym',
        rights: 'Tous droits réservés',
        allRightsReserved: 'Tous droits réservés',
        footerTagline: 'Plateforme éducative pour les élèves du Lycée Al-Khwarizmi',
        platform: 'Une plateforme intelligente pour communiquer avec l\'administration',
        profileTitle: 'Mon profil',
        name: 'Nom :',
        email: 'E-mail :',
        class: 'Classe :',
        rank: 'Rang :',
        newPassword: 'Nouveau mot de passe',
        changePassword: 'Changer le mot de passe',
        logout: 'Se déconnecter',
        light: 'Clair',
        dark: 'Sombre',
        show: 'Voir',
        welcome: 'Bienvenue',
        remainingHomeworks: 'Devoirs restants',
        messages: 'Messages reçus',
        completionRate: 'Taux d\'achèvement',
        points: 'Points d\'excellence',
        scheduleTitle: 'Emploi du temps hebdomadaire',
        edit: 'Modifier',
        save: 'Enregistrer',
        homeworks: 'Devoirs à la maison',
        contactAdmin: 'Contacter l\'administration',
        quickActions: 'Actions rapides',
        resourcesLabel: 'Ressources',
        libraryLabel: 'Bibliothèque',
        ideasLabel: 'Idées',
        announcementsLabel: 'Annonces',
        adminPanel: 'Panneau d\'administration',
        nightMode: 'Mode nuit',
        home: 'Accueil',
        myProfile: 'Mon profil',
        noHomeworks: 'Aucun devoir pour le moment',
        addHomework: 'Ajouter un nouveau devoir',
        noMessages: 'Aucun message pour le moment',
        sendFirstMessage: 'Envoyez votre premier message à l\'administration',
        writeMessage: 'Écrivez votre message ici...',
        send: 'Envoyer',
        morning: 'Matin',
        evening: 'Après-midi',
        note: 'Matin: 8:00 - 12:00 | Après-midi: 14:00 - 18:00',
        holiday: 'Jour férié',
        noEvening: 'Pas de cours après-midi',
        emptyMorning: 'Matin libre',
        replyFromAdmin: 'Réponse de l\'administration:',
        waiting: 'En attente',
        replied: 'Répondu',
        pending: 'En attente de réponse',
        servicesTitle: 'Nos services intégrés',
        servicesSubtitle: 'Tout ce dont vous avez besoin en un seul endroit',
        messagesLabel: 'Centre de communication',
        englishLabel: 'Apprendre les langues étrangères', // ✅ تم التعديل هنا
        newBadge: 'Nouveau',
        serviceMessagesDesc: 'Communiquez avec l\'administration, le développeur et vos camarades',
        serviceEnglishDesc: 'Anglais, français et espagnol - cours et ressources complètes', // ✅ تم التعديل هنا
        serviceResourcesDesc: 'Cours, résumés, examens et exercices',
        serviceLibraryDesc: 'Livres et romans PDF à lire et télécharger',
        serviceIdeasDesc: 'Partagez vos idées et votez pour celles de vos camarades',
        serviceAnnouncementsDesc: 'Dernières nouvelles et annonces scolaires',
        serviceAdminDesc: 'Gérer les élèves, les ressources et les annonces',
        serviceThemeDesc: 'Basculer entre le mode jour et nuit',
        serviceHomeDesc: 'Retour à la page d\'accueil',
        serviceProfileDesc: 'Voir et modifier vos informations personnelles',
        resourcesHeader: 'Ressources pédagogiques',
        shareResources: 'Partagez avec vos camarades les cours, résumés et examens',
        totalResources: 'Total des ressources',
        myContributions: 'Mes contributions',
        pendingReview: 'En attente de révision',
        level: 'Niveau:',
        branch: 'Filière:',
        type: 'Type:',
        all: 'Tous',
        allBranches: 'Toutes',
        scientific: 'Scientifique',
        literary: 'Littéraire',
        lessons: 'Cours',
        summaries: 'Résumés',
        exams: 'Examens',
        exercises: 'Exercices',
        myResources: 'Mes contributions',
        showAll: 'Voir tout',
        addResource: 'Ajouter une ressource',
        upload: 'Télécharger',
        cancel: 'Annuler',
        resourceTitle: 'Titre de la ressource',
        resourceDesc: 'Description',
        resourceType: 'Type',
        resourceLevel: 'Niveau',
        resourceBranch: 'Filière',
        pdfFile: 'Fichier PDF',
        maxSize: 'Taille maximale: 10MB',
        noResources: 'Aucune ressource dans cette catégorie',
        uploadSuccess: 'Ressource ajoutée avec succès! En attente d\'approbation',
        download: 'Télécharger',
        noFile: 'Aucun fichier à télécharger',
        viewCount: 'Vues',
        pendingBadge: 'En attente de révision',
        approveResource: 'Approuver la ressource',
        libraryHeader: 'Bibliothèque numérique',
        totalBooks: 'Total des livres',
        pdfBooks: 'Livres PDF',
        booksCount: 'Livres',
        novelsCount: 'Romans',
        addBook: 'Ajouter un livre',
        bookTitle: 'Titre du livre',
        author: 'Auteur',
        bookType: 'Type',
        bookDesc: 'Description',
        pdfLink: 'Lien PDF',
        pdfLinkHint: 'Ou laissez vide pour que les élèves le téléchargent plus tard',
        noBooks: 'Aucun livre',
        read: 'Lire',
        noPdf: 'Pas de PDF',
        deleteBook: 'Supprimer le livre',
        bookAdded: 'Livre publié avec succès!',
        ideasHeader: 'Idées des élèves',
        ideasDesc: 'Partagez vos idées pour améliorer l\'école | Votez pour les idées de vos camarades',
        ideaTitle: 'Titre de l\'idée',
        ideaCategory: 'Catégorie',
        ideaContent: 'Contenu de l\'idée',
        educational: 'Éducatif',
        sports: 'Sport',
        cultural: 'Culturel',
        infrastructure: 'Infrastructure',
        other: 'Autre',
        sendIdea: 'Envoyer l\'idée',
        noIdeas: 'Aucune idée dans cette catégorie',
        addComment: 'Ajouter un commentaire...',
        commentAdded: 'Commentaire ajouté avec succès!',
        vote: 'Vote',
        voteSuccess: 'Vote enregistré avec succès!',
        approved: 'Approuvé',
        pendingIdea: 'En attente de révision',
        announcementsHeader: 'Annonces',
        announcementsDesc: 'Dernières nouvelles et annonces scolaires',
        announcementsManagement: 'Gestion des annonces',
        addAnnouncement: 'Ajouter une annonce',
        announcementTitle: 'Titre de l\'annonce',
        announcementContent: 'Contenu de l\'annonce',
        publish: 'Publier',
        noAnnouncements: 'Aucune annonce pour le moment',
        deleteAnnouncement: 'Supprimer l\'annonce',
        totalAnnouncements: 'Annonces',
        adminTitle: 'Panneau d\'administration',
        adminIdeas: 'Idées',
        adminStudents: 'Élèves',
        adminMessages: 'Messages',
        adminPending: 'En attente',
        adminAdmins: 'Administrateurs',
        pointsManagement: 'Gestion des points d\'excellence',
        selectStudent: 'Choisir l\'élève',
        pointsAmount: 'Nombre de points',
        addPoints: 'Ajouter des points',
        subtractPoints: 'Retirer des points',
        execute: 'Exécuter',
        ranking: 'Classement des élèves par points',
        messagesManagement: 'Gestion des messages et réponses',
        student: 'Élève',
        message: 'Message',
        date: 'Date',
        status: 'Statut',
        reply: 'Réponse',
        actions: 'Actions',
        writeReply: 'Écrire la réponse...',
        deleteMessage: 'Supprimer le message',
        replySent: 'Réponse envoyée!',
        ideasManagement: 'Gestion des idées',
        resourcesManagement: 'Gestion des ressources pédagogiques',
        studentsManagement: 'Liste des élèves et gestion des permissions',
        promote: 'Promouvoir administrateur',
        demote: 'Révoquer les permissions',
        promoteSuccess: 'Promotion réussie!',
        demoteSuccess: 'Permissions révoquées',
        backToDashboard: 'Retour au tableau de bord',
        loginTitle: 'Connexion',
        registerTitle: 'Inscription',
        email: 'E-mail',
        password: 'Mot de passe',
        fullName: 'Nom complet',
        selectClass: 'Choisir la classe',
        login: 'Se connecter',
        register: 'S\'inscrire',
        backToHome: 'Retour à l\'accueil',
        loginSuccess: 'Bienvenue',
        registerSuccess: 'Inscription réussie!',
        emailRequired: 'Veuillez entrer l\'e-mail et le mot de passe',
        passwordMin: 'Le mot de passe doit contenir au moins 4 caractères',
        fillAll: 'Veuillez remplir tous les champs',
        emailExists: 'Cet e-mail est déjà enregistré',
        invalidCredentials: 'E-mail ou mot de passe incorrect',
        loading: 'Chargement...',
        calculator: 'Calculatrice scientifique',
        memory: 'Mémoire',
        store: 'Enregistrer',
        recall: 'Rappeler',
        clear: 'Effacer',
        messagesTitle: 'Centre de communication'
    },
    en: {
        settings: 'Settings',
        language: 'Language',
        appearance: 'Appearance',
        account: 'Account',
        changeTheme: 'Change theme',
        profile: 'My profile',
        view: 'View',
        arabic: 'العربية',
        french: 'Français',
        english: 'English',
        schoolName: 'Al-Khwarizmi High School',
        schoolBadge: 'Leading educational institution',
        students: 'Students',
        teachers: 'Teachers',
        classes: 'Classes',
        suggestions: 'My suggestions',
        start: 'Get started',
        resources: 'Educational resources',
        features: 'What do we offer?',
        featuresSubtitle: 'Comprehensive services to facilitate communication and learning',
        direct: 'Direct communication',
        directDesc: 'Instant communication with teachers and administration through smart messaging',
        achievement: 'Academic progress',
        achievementDesc: 'An advanced system for tracking grades and monthly assessments',
        schedule: 'Smart schedule',
        scheduleDesc: 'Interactive class schedule with reminder notifications',
        library: 'Digital library',
        libraryDesc: 'Discover educational books and novels and share them with your classmates',
        community: 'Student community',
        communityDesc: 'Exchange resources and knowledge with your classmates',
        developer: 'Developer',
        developerLabel: 'Developer',
        developerName: 'Adam Halym',
        rights: 'All rights reserved',
        allRightsReserved: 'All rights reserved',
        footerTagline: 'Educational platform for Al-Khwarizmi High School students',
        platform: 'A smart platform for students to communicate with the administration',
        profileTitle: 'My profile',
        name: 'Name:',
        email: 'Email:',
        class: 'Class:',
        rank: 'Rank:',
        newPassword: 'New password',
        changePassword: 'Change password',
        logout: 'Log out',
        light: 'Light',
        dark: 'Dark',
        show: 'View',
        welcome: 'Welcome',
        remainingHomeworks: 'Remaining homeworks',
        messages: 'Incoming messages',
        completionRate: 'Completion rate',
        points: 'Points of excellence',
        scheduleTitle: 'Weekly schedule',
        edit: 'Edit',
        save: 'Save',
        homeworks: 'Homework',
        contactAdmin: 'Contact administration',
        quickActions: 'Quick actions',
        resourcesLabel: 'Resources',
        libraryLabel: 'Library',
        ideasLabel: 'Ideas',
        announcementsLabel: 'Announcements',
        adminPanel: 'Admin panel',
        nightMode: 'Night mode',
        home: 'Home',
        myProfile: 'My profile',
        noHomeworks: 'No homework at the moment',
        addHomework: 'Add new homework',
        noMessages: 'No messages yet',
        sendFirstMessage: 'Send your first message to the administration',
        writeMessage: 'Write your message here...',
        send: 'Send',
        morning: 'Morning',
        evening: 'Afternoon',
        note: 'Morning: 8:00 - 12:00 | Afternoon: 14:00 - 18:00',
        holiday: 'Official holiday',
        noEvening: 'No afternoon classes',
        emptyMorning: 'Free morning',
        replyFromAdmin: 'Reply from administration:',
        waiting: 'Waiting',
        replied: 'Replied',
        pending: 'Pending reply',
        servicesTitle: 'Our Integrated Services',
        servicesSubtitle: 'Everything you need in one place - click any service to start',
        messagesLabel: 'Communication Center',
        englishLabel: 'Learn Foreign Languages', // ✅ تم التعديل هنا
        newBadge: 'New',
        serviceMessagesDesc: 'Communicate with administration, developer, and classmates',
        serviceEnglishDesc: 'English, French, Spanish - comprehensive lessons and resources', // ✅ تم التعديل هنا
        serviceResourcesDesc: 'Lessons, summaries, exams, and exercises',
        serviceLibraryDesc: 'PDF books and novels to read and download',
        serviceIdeasDesc: 'Share your ideas and vote on your classmates\' suggestions',
        serviceAnnouncementsDesc: 'Latest news and school announcements',
        serviceAdminDesc: 'Manage students, resources, and announcements',
        serviceThemeDesc: 'Toggle between day and night mode',
        serviceHomeDesc: 'Return to the main page',
        serviceProfileDesc: 'View and edit your personal information',
        resourcesHeader: 'Educational Resources',
        shareResources: 'Share with your classmates lessons, summaries, and exams',
        totalResources: 'Total resources',
        myContributions: 'My contributions',
        pendingReview: 'Pending review',
        level: 'Level:',
        branch: 'Branch:',
        type: 'Type:',
        all: 'All',
        allBranches: 'All',
        scientific: 'Scientific',
        literary: 'Literary',
        lessons: 'Lessons',
        summaries: 'Summaries',
        exams: 'Exams',
        exercises: 'Exercises',
        myResources: 'My contributions',
        showAll: 'Show all',
        addResource: 'Upload resource',
        upload: 'Upload',
        cancel: 'Cancel',
        resourceTitle: 'Resource title',
        resourceDesc: 'Description',
        resourceType: 'Type',
        resourceLevel: 'Level',
        resourceBranch: 'Branch',
        pdfFile: 'PDF file',
        maxSize: 'Maximum size: 10MB',
        noResources: 'No resources in this category',
        uploadSuccess: 'Resource uploaded successfully! Waiting for admin approval',
        download: 'Download',
        noFile: 'No file to download',
        viewCount: 'Views',
        pendingBadge: 'Pending review',
        approveResource: 'Approve resource',
        libraryHeader: 'Digital Library',
        totalBooks: 'Total books',
        pdfBooks: 'PDF books',
        booksCount: 'Books',
        novelsCount: 'Novels',
        addBook: 'Add book',
        bookTitle: 'Book title',
        author: 'Author',
        bookType: 'Type',
        bookDesc: 'Description',
        pdfLink: 'PDF link',
        pdfLinkHint: 'Or leave empty for students to upload later',
        noBooks: 'No books',
        read: 'Read',
        noPdf: 'No PDF',
        deleteBook: 'Delete book',
        bookAdded: 'Book published successfully!',
        ideasHeader: 'Student Ideas',
        ideasDesc: 'Share your ideas to improve the school | Vote on your classmates\' ideas',
        ideaTitle: 'Idea title',
        ideaCategory: 'Category',
        ideaContent: 'Idea content',
        educational: 'Educational',
        sports: 'Sports',
        cultural: 'Cultural',
        infrastructure: 'Infrastructure',
        other: 'Other',
        sendIdea: 'Send idea',
        noIdeas: 'No ideas in this category',
        addComment: 'Add a comment...',
        commentAdded: 'Comment added successfully!',
        vote: 'Vote',
        voteSuccess: 'Vote recorded successfully!',
        approved: 'Approved',
        pendingIdea: 'Pending review',
        announcementsHeader: 'Announcements',
        announcementsDesc: 'Latest news and school announcements',
        announcementsManagement: 'Announcements Management',
        addAnnouncement: 'Add announcement',
        announcementTitle: 'Announcement title',
        announcementContent: 'Announcement content',
        publish: 'Publish',
        noAnnouncements: 'No announcements at the moment',
        deleteAnnouncement: 'Delete announcement',
        totalAnnouncements: 'Announcements',
        adminTitle: 'Admin Dashboard',
        adminIdeas: 'Ideas',
        adminStudents: 'Students',
        adminMessages: 'Messages',
        adminPending: 'Pending',
        adminAdmins: 'Admins',
        pointsManagement: 'Points Management',
        selectStudent: 'Select student',
        pointsAmount: 'Points amount',
        addPoints: 'Add points',
        subtractPoints: 'Subtract points',
        execute: 'Execute',
        ranking: 'Student ranking by points',
        messagesManagement: 'Messages & Replies',
        student: 'Student',
        message: 'Message',
        date: 'Date',
        status: 'Status',
        reply: 'Reply',
        actions: 'Actions',
        writeReply: 'Write reply...',
        deleteMessage: 'Delete message',
        replySent: 'Reply sent!',
        ideasManagement: 'Ideas Management',
        resourcesManagement: 'Resources Management',
        studentsManagement: 'Students & Permissions',
        promote: 'Promote to admin',
        demote: 'Revoke permissions',
        promoteSuccess: 'Promotion successful!',
        demoteSuccess: 'Permissions revoked',
        backToDashboard: 'Back to dashboard',
        loginTitle: 'Login',
        registerTitle: 'Register',
        email: 'Email',
        password: 'Password',
        fullName: 'Full name',
        selectClass: 'Select class',
        login: 'Login',
        register: 'Register',
        backToHome: 'Back to home',
        loginSuccess: 'Welcome',
        registerSuccess: 'Registration successful!',
        emailRequired: 'Please enter email and password',
        passwordMin: 'Password must be at least 4 characters',
        fillAll: 'Please fill all fields',
        emailExists: 'Email already registered',
        invalidCredentials: 'Invalid email or password',
        loading: 'Loading...',
        calculator: 'Scientific Calculator',
        memory: 'Memory',
        store: 'Store',
        recall: 'Recall',
        clear: 'Clear',
        messagesTitle: 'Communication Center'
    }
};

// ============================================
// دوال إدارة اللغة
// ============================================

export function getCurrentLanguage() {
    const saved = localStorage.getItem('language');
    if (saved && SUPPORTED_LANGUAGES.includes(saved)) {
        return saved;
    }
    return DEFAULT_LANGUAGE;
}

export function setLanguage(lang) {
    if (!SUPPORTED_LANGUAGES.includes(lang)) {
        lang = DEFAULT_LANGUAGE;
    }
    localStorage.setItem('language', lang);
    applyLanguage(lang);
    return lang;
}

export function applyLanguage(lang) {
    const t = translations[lang] || translations[DEFAULT_LANGUAGE];
    const dir = lang === 'ar' ? 'rtl' : 'ltr';

    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
    if (document.body) document.body.dir = dir;

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key] !== undefined) {
            el.textContent = t[key];
        }
    });

    document.querySelectorAll('[data-i18n-html]').forEach(el => {
        const key = el.getAttribute('data-i18n-html');
        if (t[key] !== undefined) {
            el.innerHTML = t[key];
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (t[key] !== undefined) {
            el.placeholder = t[key];
        }
    });

    const schoolNameElements = document.querySelectorAll('.school-name, .main-title');
    schoolNameElements.forEach(el => {
        if (t.schoolName !== undefined) {
            el.textContent = t.schoolName;
        }
    });

    const developerNameElements = document.querySelectorAll('.developer-name');
    developerNameElements.forEach(el => {
        if (t.developerName !== undefined) {
            el.textContent = t.developerName;
        }
    });

    const langBtns = document.querySelectorAll('.language-btn');
    langBtns.forEach(btn => {
        if (btn.dataset.lang === lang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
        const textSpan = btn.querySelector('span:last-child');
        if (textSpan) {
            const key = btn.dataset.lang === 'ar' ? 'arabic' : btn.dataset.lang === 'fr' ? 'french' : 'english';
            if (t[key] !== undefined) {
                textSpan.textContent = t[key];
            }
        }
    });

    updateThemeState(lang);

    document.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang, translations: t } }));
}

function updateThemeState(lang) {
    const dark = document.body && document.body.classList.contains('dark-mode');
    const value = document.getElementById('themeValue');
    if (value) {
        const names = {
            ar: dark ? 'نهاري' : 'ليلي',
            fr: dark ? 'Clair' : 'Sombre',
            en: dark ? 'Light' : 'Dark'
        };
        value.textContent = names[lang] || names.ar;
    }
}

export function translate(key, lang = null) {
    if (!lang) lang = getCurrentLanguage();
    const t = translations[lang] || translations[DEFAULT_LANGUAGE];
    return t[key] || key;
}

// ============================================
// ✅ ملاحظة مهمة:
// getCurrentUser() تم حذفها من هذا الملف لتفادي التعارض
// استخدم بدلاً منها:
//   import { getCurrentUser } from './supabase.js';
// ============================================

export function initLanguage() {
    const lang = getCurrentLanguage();
    applyLanguage(lang);

    document.querySelectorAll('.language-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const lang = this.dataset.lang;
            if (lang) {
                setLanguage(lang);
                const menu = document.getElementById('languageMenu');
                if (menu) menu.classList.remove('show');
            }
        });
    });

    console.log('✅ Language system initialized! Current language:', getCurrentLanguage());
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLanguage);
} else {
    initLanguage();
}

export default {
    getCurrentLanguage,
    setLanguage,
    applyLanguage,
    translate,
    initLanguage,
    translations
};