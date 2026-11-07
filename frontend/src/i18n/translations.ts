export type Language = 'ru' | 'uz' | 'en';

export const translations = {
  ru: {
    // Header & Navigation
    navCatalog: 'Каталог',
    navMyInvitations: 'Мои приглашения',
    navAdmin: 'Админка',
    navLogin: 'Войти',
    navLogout: 'Выйти',
    navLightMode: 'Дневной режим',
    navDarkMode: 'Ночной режим',
    navLanguage: 'Язык',
    
    // Hero Section
    heroBadge: 'Электронная Таклифнома #1 в Узбекистане',
    heroTitlePart1: "Приглашение, которое ",
    heroTitleHighlight: "хочется открыть",
    heroSubtitle: "Выберите дизайн, впишите имена, дату и ресторан — через пять минут у вас свой сайт-приглашение с картой, таймером до тоя, музыкой и списком гостей, которые ответили «приду».",
    heroChooseDesign: 'Выбрать дизайн',
    heroHowItWorks: 'Как это работает',
    
    // Hero Features
    heroFeatureEditor: 'Мгновенный редактор',
    heroFeatureMap: 'Навигатор для гостей',
    heroFeatureMusic: 'Фоновая музыка',
    
    // Hero Stats
    heroStat1Value: '5 мин',
    heroStat1Label: "до готового сайта",
    heroStat2Value: '100%',
    heroStat2Label: "на любом телефоне",
    heroStat3Value: '4.9',
    heroStat3Label: "средняя оценка пар",
    
    // Catalog Filters
    catalogTitle: "Дизайны приглашений",
    catalogSubtitle: "Каждый — живой сайт. Наведите, чтобы пролистать.",
    filterTypePhoto: 'Электронные фото',
    filterTypeWebsite: 'Сайты-приглашения',
    filterTypePhysical: 'Макеты для печати',
    badgeSoon: 'Скоро',
    disabledNotice: 'Раздел временно недоступен',
    
    // Categories
    catAll: 'Все категории',
    catWedding: 'Свадьба',
    catBirthday: 'День рождения',
    catSunnat: 'Суннат той',
    catJubiley: 'Юбилей',
    
    // Template Cards
    cardPreview: 'Просмотр',
    cardCreate: 'Создать сайт',
    cardFree: 'Бесплатно',
    cardPriceCurrency: 'сум',
    noTemplatesFound: 'Шаблоны не найдены',
    tryChangingFilter: 'Попробуйте изменить выбранные фильтры',

    // Advantages
    whyTitlePart1: 'Почему выбирают ',
    whyTitleHighlight: 'Web-Taklifnoma',
    whySubtitle: 'Самый удобный способ пригласить родных и близких на главное событие вашей жизни',
    adv1Title: "Гости отвечают сами",
    adv1Desc: "Кто придёт и сколько человек — ответы сразу в вашем кабинете. Больше не нужно обзванивать всю родню.",
    adv2Title: "Никто не заблудится",
    adv2Desc: "Точка ресторана в Яндекс и Google Картах. Таксист найдёт вход с первого раза.",
    adv3Title: "До тоя — 41 день",
    adv3Desc: "Обратный отсчёт на первом экране, чтобы дату запомнили даже самые занятые.",
    adv4Title: "Ваша песня встречает гостей",
    adv4Desc: "Выберите «Ёр-ёр» или загрузите свою — она заиграет, как только откроют приглашение.",

    // Steps
    stepsTitlePart1: "Три шага — ",
    stepsTitleHighlight: "и можно рассылать",
    step1Title: "Выберите дизайн",
    step1Desc: "Листайте каталог и открывайте шаблоны на телефоне — у каждого свой характер: Hilal, Anor, Marmar, Olive.",
    step2Title: "Впишите своё",
    step2Desc: "Имена, дата, время, ресторан, пара фотографий и песня. Вы сразу видите всё так, как увидит гость.",
    step3Title: "Отправьте ссылку",
    step3Desc: "Одна ссылка — в семейный чат, в Telegram, в WhatsApp. Ответы гостей соберутся в кабинете.",
    
    // FAQ Section
    faqTitle: "Что обычно спрашивают",
    faqSubtitle: 'Всё, что вам нужно знать об онлайн-пригласительных Web-Taklifnoma',
    faqQ1: 'Как гости открывают онлайн таклифному?',
    faqA1: 'Вы отправляете гостям персональную веб-ссылку через Telegram, WhatsApp или SMS. Гости открывают её на смартфоне или компьютере без установки любых приложений.',
    faqQ2: 'Как работает сбор ответов (RSVP)?',
    faqA2: 'Гости выбирают, придут ли они на мероприятие, и указывают количество человек. Все ответы мгновенно сохраняются и отображаются в вашем личном кабинете.',
    faqQ3: 'Можно ли добавить свою музыку и фото?',
    faqA3: 'Да! В редакторе сайтов-пригласительных вы можете загрузить собственные фотографии, выбрать фоновую песню и изменить текст приглашения.',
    faqQ4: 'Сколько времени доступен готовый сайт?',
    faqA4: 'Ваше веб-приглашение будет активно до и после проведения вашего торжества.',

    // Footer
    footerDesc: 'Персональные интерактивные сайты-приглашения и карточки на свадьбу и мероприятия в Узбекистане',
    footerRights: '© 2026 web-taklifnoma.uz. Все права защищены.',
    footerTag: 'Электронные сайты-приглашения №1 в Узбекистане',
    
    // Auth & Misc
    loginAccount: 'Войти в аккаунт',

    // Landing 3D
    openTitle: "Печать ломается — письмо у гостя в руках",
    openDesc: "Ссылку присылают в Telegram или WhatsApp. Ни приложений, ни регистрации: одно касание — и бабушка уже читает ваши имена.",
    liveTitle: "Внутри — живой сайт, а не картинка",
    liveDesc: "Листайте дальше: это настоящий шаблон из каталога.",
    demoGuest: "Дильноза-опа",
    demoRsvp: "Приду · 2 гостя",
    demoReplies: "Ответили 86 из 120",
    demoVenue: "Ресторан «Navruz», Юнусабад",
    timerDays: "дней",
    timerHours: "часов",
    timerMinutes: "минут",
    musicNow: "Сейчас играет",
    cardFormatWebsite: "Адаптивный сайт",
    cardSizeLabel: "Размер",
    badgeWebsite: "Сайт",
    badgePrint: "Печать A5",
    badgePhoto: "Фото-карточка",
    finalTitle: "Осталось запечатать конверт",
    finalDesc: "Начните с дизайна — имена и дату впишете за пять минут.",
    finalCta: "Создать приглашение",
    finalAsk: "Есть вопрос? Напишите нам",
    sceneAlt: "Конверт с золотым тиснением и сургучной печатью",
  },
  uz: {
    // Header & Navigation
    navCatalog: 'Katalog',
    navMyInvitations: 'Mening taklifnomalarim',
    navAdmin: 'Admin panel',
    navLogin: 'Kirish',
    navLogout: 'Chiqish',
    navLightMode: 'Kungi rejim',
    navDarkMode: 'Tungi rejim',
    navLanguage: 'Til',
    
    // Hero Section
    heroBadge: "O'zbekistonda #1 Elektron Taklifnoma",
    heroTitlePart1: "Ochib koʻrgingiz keladigan ",
    heroTitleHighlight: "taklifnoma",
    heroSubtitle: "Dizaynni tanlang, ismlar, sana va restoranni yozing — besh daqiqada oʻz taklifnoma saytingiz tayyor: xarita, toʻygacha qolgan vaqt, musiqa va «boraman» degan mehmonlar roʻyxati bilan.",
    heroChooseDesign: 'Dizayn tanlash',
    heroHowItWorks: 'Bu qanday ishlaydi',
    
    // Hero Features
    heroFeatureEditor: 'Zudlik bilan tahrirlash',
    heroFeatureMap: 'Mehmonlar uchun xarita',
    heroFeatureMusic: 'Fon musiqasi',
    
    // Hero Stats
    heroStat1Value: '5 min',
    heroStat1Label: "tayyor saytgacha",
    heroStat2Value: '100%',
    heroStat2Label: "har qanday telefonda",
    heroStat3Value: '4.9',
    heroStat3Label: "juftliklar bahosi",
    
    // Catalog Filters
    catalogTitle: "Taklifnoma dizaynlari",
    catalogSubtitle: "Har biri — jonli sayt. Varaqlash uchun ustiga olib boring.",
    filterTypePhoto: 'Elektron rasmlar',
    filterTypeWebsite: 'Taklifnoma saytlari',
    filterTypePhysical: 'Chop etish maketlari',
    badgeSoon: 'Tez kunda',
    disabledNotice: "Bo'lim vaqtincha mavjud emas",
    
    // Categories
    catAll: 'Barcha kategoriyalar',
    catWedding: "Nikoh to'yi",
    catBirthday: "Tug'ilgan kun",
    catSunnat: "Sunnat to'yi",
    catJubiley: 'Yubiley',
    
    // Template Cards
    cardPreview: "Ko'rish",
    cardCreate: 'Sayt yaratish',
    cardFree: 'Bepul',
    cardPriceCurrency: "so'm",
    noTemplatesFound: 'Shablonlar topilmadi',
    tryChangingFilter: "Tanlangan filtrlarni o'zgartirib ko'ring",

    // Advantages
    whyTitlePart1: 'Nima uchun ',
    whyTitleHighlight: 'Web-Taklifnoma',
    whySubtitle: "Hayotingizning bosh voqeasiga yaqinlaringizni taklif qilishning eng qulay usuli",
    adv1Title: "Mehmonlar oʻzlari javob beradi",
    adv1Desc: "Kim keladi va necha kishi — javoblar darhol kabinetingizda. Endi butun qarindoshlarga qoʻngʻiroq qilish shart emas.",
    adv2Title: "Hech kim adashmaydi",
    adv2Desc: "Restoran manzili Yandex va Google xaritalarida. Taksichi kirishni birinchi urinishdayoq topadi.",
    adv3Title: "Toʻygacha — 41 kun",
    adv3Desc: "Birinchi ekrandagi teskari sanoq — sanani eng band mehmonlar ham eslab qoladi.",
    adv4Title: "Qoʻshigʻingiz mehmonlarni kutib oladi",
    adv4Desc: "«Yor-yor»ni tanlang yoki oʻzingiznikini yuklang — taklifnoma ochilishi bilan yangraydi.",

    // Steps
    stepsTitlePart1: "Uch qadam — ",
    stepsTitleHighlight: "va yuborsangiz boʻladi",
    step1Title: "Dizaynni tanlang",
    step1Desc: "Katalogni varaqlang, shablonlarni telefonda oching — har biri oʻziga xos: Hilal, Anor, Marmar, Olive.",
    step2Title: "Oʻzingiznikini yozing",
    step2Desc: "Ismlar, sana, vaqt, restoran, bir-ikki surat va qoʻshiq. Hammasini mehmon qanday koʻrsa, shunday koʻrasiz.",
    step3Title: "Havolani yuboring",
    step3Desc: "Bitta havola — oilaviy chatga, Telegramga, WhatsAppga. Mehmonlar javoblari kabinetda yigʻiladi.",
    
    // FAQ Section
    faqTitle: "Odatda nima soʻrashadi",
    faqSubtitle: 'Veb-taklifnomalar haqida bilishingiz kerak bo\'lgan barcha narsalar',
    faqQ1: 'Mehmonlar onlayn taklifnomani qanday ochishadi?',
    faqA1: "Siz mehmonlarga Telegram, WhatsApp yoki SMS orqali shaxsiy havolani yuborasiz. Mehmonlar uni hech qanday ilova o'rnatmasdan smartfon yoki kompyuterda ochishadi.",
    faqQ2: "Javoblarni yig'ish (RSVP) qanday ishlaydi?",
    faqA2: "Mehmonlar tadbirga kelish-kelmasligini tanlaydilar va odamlar sonini ko'rsatadilar. Barcha javoblar zudlik bilan shaxsiy kabinetingizda saqlanadi va ko'rsatiladi.",
    faqQ3: "O'z musiqangiz va rasmlaringizni qo'shish mumkinmi?",
    faqA3: "Ha! Taklifnoma saytlari tahrirlovchisida siz o'z rasmlaringizni yuklashingiz, fon qo'shig'ini tanlashingiz va taklifnoma matnini o'zgartirishingiz mumkin.",
    faqQ4: 'Tayyor sayt qancha vaqt davomida ishlaydi?',
    faqA4: "Sizning veb-taklifnomangiz tantanangiz o'tgunga qadar va undan keyin ham faol bo'ladi.",

    // Footer
    footerDesc: "O'zbekistonda nikoh to'yi va tadbirlar uchun shaxsiy interaktiv taklifnoma saytlari va kartichkalari",
    footerRights: '© 2026 web-taklifnoma.uz. Barcha huquqlar himoyalangan.',
    footerTag: "O'zbekistonda #1 elektron taklifnoma saytlari",
    
    // Auth & Misc
    loginAccount: 'Hisobga kirish',

    // Landing 3D
    openTitle: "Muhr ochiladi — maktub mehmon qoʻlida",
    openDesc: "Havola Telegram yoki WhatsApp orqali keladi. Ilova ham, roʻyxatdan oʻtish ham kerak emas: bir bosish — buvijon ismlaringizni oʻqiyapti.",
    liveTitle: "Ichida — rasm emas, jonli sayt",
    liveDesc: "Varaqlashda davom eting: bu katalogdagi haqiqiy shablon.",
    demoGuest: "Dilnoza opa",
    demoRsvp: "Boraman · 2 kishi",
    demoReplies: "120 tadan 86 tasi javob berdi",
    demoVenue: "«Navruz» restorani, Yunusobod",
    timerDays: "kun",
    timerHours: "soat",
    timerMinutes: "daqiqa",
    musicNow: "Hozir yangrayapti",
    cardFormatWebsite: "Moslashuvchan sayt",
    cardSizeLabel: "Oʻlcham",
    badgeWebsite: "Sayt",
    badgePrint: "Chop etish A5",
    badgePhoto: "Foto-karta",
    finalTitle: "Konvertni muhrlash qoldi",
    finalDesc: "Dizayndan boshlang — ismlar va sanani besh daqiqada yozasiz.",
    finalCta: "Taklifnoma yaratish",
    finalAsk: "Savolingiz bormi? Bizga yozing",
    sceneAlt: "Oltin naqshli va surgʻuch muhrli konvert",
  },
  en: {
    // Header & Navigation
    navCatalog: 'Catalog',
    navMyInvitations: 'My Invitations',
    navAdmin: 'Admin Panel',
    navLogin: 'Login',
    navLogout: 'Logout',
    navLightMode: 'Light Mode',
    navDarkMode: 'Dark Mode',
    navLanguage: 'Language',
    
    // Hero Section
    heroBadge: '#1 Electronic Invitation in Uzbekistan',
    heroTitlePart1: "An invitation they’ll ",
    heroTitleHighlight: "want to open",
    heroSubtitle: "Choose a design, type in your names, the date and the venue — five minutes later you have your own invitation site, with a map, a countdown to the toi, music and a list of guests who replied “we’ll be there”.",
    heroChooseDesign: 'Choose Design',
    heroHowItWorks: 'How It Works',
    
    // Hero Features
    heroFeatureEditor: 'Instant Editor',
    heroFeatureMap: 'Guest Navigator',
    heroFeatureMusic: 'Background Music',
    
    // Hero Stats
    heroStat1Value: '5 min',
    heroStat1Label: "to a finished site",
    heroStat2Value: '100%',
    heroStat2Label: "on any phone",
    heroStat3Value: '4.9',
    heroStat3Label: "average rating from couples",
    
    // Catalog Filters
    catalogTitle: "Invitation designs",
    catalogSubtitle: "Each one is a living site. Hover to scroll through it.",
    filterTypePhoto: 'Digital Cards',
    filterTypeWebsite: 'Invitation Websites',
    filterTypePhysical: 'Print Templates',
    badgeSoon: 'Soon',
    disabledNotice: 'Section temporarily unavailable',
    
    // Categories
    catAll: 'All Categories',
    catWedding: 'Wedding',
    catBirthday: 'Birthday',
    catSunnat: 'Sunnat Toy',
    catJubiley: 'Jubilee',
    
    // Template Cards
    cardPreview: 'Preview',
    cardCreate: 'Create Site',
    cardFree: 'Free',
    cardPriceCurrency: 'UZS',
    noTemplatesFound: 'No templates found',
    tryChangingFilter: 'Try changing your search or category filter',

    // Advantages
    whyTitlePart1: 'Why Choose ',
    whyTitleHighlight: 'Web-Taklifnoma',
    whySubtitle: 'The easiest way to invite friends and family to your special event',
    adv1Title: "Guests reply on their own",
    adv1Desc: "Who’s coming and with how many — answers land in your dashboard. No more phoning every relative.",
    adv2Title: "Nobody gets lost",
    adv2Desc: "The venue pinned in Yandex and Google Maps. The taxi finds the entrance first time.",
    adv3Title: "41 days to the toi",
    adv3Desc: "A countdown on the first screen, so even the busiest guests remember the date.",
    adv4Title: "Your song greets the guests",
    adv4Desc: "Pick “Yor-yor” or upload your own — it starts as soon as the invitation opens.",

    // Steps
    stepsTitlePart1: "Three steps, ",
    stepsTitleHighlight: "then hit send",
    step1Title: "Choose a design",
    step1Desc: "Browse the catalog and open templates on your phone — each has its own character: Hilal, Anor, Marmar, Olive.",
    step2Title: "Fill in your story",
    step2Desc: "Names, date, time, venue, a couple of photos and a song. You see it exactly as a guest will.",
    step3Title: "Send the link",
    step3Desc: "One link — to the family chat, Telegram, WhatsApp. Guest replies gather in your dashboard.",
    
    // FAQ Section
    faqTitle: "What people usually ask",
    faqSubtitle: 'Everything you need to know about online invitations',
    faqQ1: 'How do guests open an online invitation?',
    faqA1: 'You send guests a personal web link via Telegram, WhatsApp, or SMS. Guests open it on a smartphone or computer without installing any applications.',
    faqQ2: 'How does guest response collection (RSVP) work?',
    faqA2: 'Guests confirm whether they are attending and indicate the number of guests. All responses are instantly stored and visible in your personal account.',
    faqQ3: 'Can I add my own music and photos?',
    faqA3: 'Yes! In the website invitation editor, you can upload your own photos, choose a background song, and customize invitation details.',
    faqQ4: 'How long will the completed website stay active?',
    faqA4: 'Your web invitation will remain active before, during, and after your event.',

    // Footer
    footerDesc: 'Personal interactive invitation websites and cards for weddings and events in Uzbekistan',
    footerRights: '© 2026 web-taklifnoma.uz. All rights reserved.',
    footerTag: '#1 Electronic Invitation Websites in Uzbekistan',
    
    // Auth & Misc
    loginAccount: 'Log In to Account',

    // Landing 3D
    openTitle: "The seal breaks — the letter is in their hands",
    openDesc: "The link arrives in Telegram or WhatsApp. No apps, no sign-up: one tap and grandma is already reading your names.",
    liveTitle: "Inside is a living site, not a picture",
    liveDesc: "Keep scrolling: this is a real template from the catalog.",
    demoGuest: "Dilnoza opa",
    demoRsvp: "Coming · 2 guests",
    demoReplies: "86 of 120 replied",
    demoVenue: "Navruz restaurant, Yunusabad",
    timerDays: "days",
    timerHours: "hours",
    timerMinutes: "min",
    musicNow: "Now playing",
    cardFormatWebsite: "Responsive website",
    cardSizeLabel: "Size",
    badgeWebsite: "Website",
    badgePrint: "Print A5",
    badgePhoto: "Photo card",
    finalTitle: "All that’s left is to seal it",
    finalDesc: "Start with a design — names and date take five minutes.",
    finalCta: "Create an invitation",
    finalAsk: "Questions? Write to us",
    sceneAlt: "Envelope with gold foil and a wax seal",
  }
} as const;

export type TranslationKey = keyof typeof translations['ru'];
