// ============================================================================
// TIMERHUB - Time Tracking Application
// Vanilla JavaScript - No frameworks, no external dependencies
// ============================================================================

// ============================================================================
// TRANSLATIONS
// ============================================================================

const translations = {
    en: {
        appName: 'TimerHub',
        createActivity: 'Create Activity',
        editActivity: 'Edit Activity',
        name: 'Name',
        color: 'Color',
        customColor: 'Custom color',
        shape: 'Shape',
        size: 'Size',
        save: 'Save',
        cancel: 'Cancel',
        edit: 'Edit',
        archive: 'Archive',
        delete: 'Delete',
        deleteConfirm: 'Are you sure?',
        timeLog: 'Time Log',
        today: 'Today',
        yesterday: 'Yesterday',
        dateRange: 'Date Range',
        allTime: 'All Time',
        allActivities: 'All Activities',
        copied: 'Copied to clipboard',
        total: 'Total',
        settings: 'Settings',
        theme: 'Theme',
        language: 'Language',
        timeFormat: 'Time Format',
        firstDayOfWeek: 'First Day of Week',
        confirmDelete: 'Confirm before delete',
        backupData: 'Backup Data',
        restoreData: 'Restore Data',
        noEntries: 'No entries found',
        since: 'since',
        deleteEntry: 'Delete Entry',
        editEntry: 'Edit Entry',
        startTime: 'Start Time',
        endTime: 'End Time',
        date: 'Date',
        activity: 'Activity',
        duration: 'Duration',
        overlappingEntry: 'This time overlaps with another entry',
        undo: 'Undo',
        deleted: 'Deleted',
        restoreSuccess: 'Data restored successfully',
        backupSuccess: 'Backup created',
        small: 'Small',
        medium: 'Medium',
        large: 'Large',
    },
    de: {
        appName: 'TimerHub',
        createActivity: 'Aktivität erstellen',
        editActivity: 'Aktivität bearbeiten',
        name: 'Name',
        color: 'Farbe',
        customColor: 'Eigene Farbe',
        shape: 'Form',
        size: 'Größe',
        save: 'Speichern',
        cancel: 'Abbrechen',
        edit: 'Bearbeiten',
        archive: 'Archivieren',
        delete: 'Löschen',
        deleteConfirm: 'Bist du sicher?',
        timeLog: 'Zeitprotokoll',
        today: 'Heute',
        yesterday: 'Gestern',
        dateRange: 'Zeitraum',
        allTime: 'Gesamter Zeitraum',
        allActivities: 'Alle Aktivitäten',
        copied: 'In Zwischenablage kopiert',
        total: 'Gesamt',
        settings: 'Einstellungen',
        theme: 'Design',
        language: 'Sprache',
        timeFormat: 'Zeitformat',
        firstDayOfWeek: 'Erster Wochentag',
        confirmDelete: 'Vor dem Löschen bestätigen',
        backupData: 'Daten sichern',
        restoreData: 'Daten wiederherstellen',
        noEntries: 'Keine Einträge gefunden',
        since: 'seit',
        deleteEntry: 'Eintrag löschen',
        editEntry: 'Eintrag bearbeiten',
        startTime: 'Startzeit',
        endTime: 'Endzeit',
        date: 'Datum',
        activity: 'Aktivität',
        duration: 'Dauer',
        overlappingEntry: 'Diese Zeit überlappt mit einem anderen Eintrag',
        undo: 'Rückgängig',
        deleted: 'Gelöscht',
        restoreSuccess: 'Daten erfolgreich wiederhergestellt',
        backupSuccess: 'Sicherung erstellt',
        small: 'Klein',
        medium: 'Mittel',
        large: 'Groß',
    },
    ru: {
        appName: 'TimerHub',
        createActivity: 'Создать занятие',
        editActivity: 'Изменить занятие',
        name: 'Название',
        color: 'Цвет',
        customColor: 'Свой цвет',
        shape: 'Форма',
        size: 'Размер',
        save: 'Сохранить',
        cancel: 'Отменить',
        edit: 'Редактировать',
        archive: 'Архивировать',
        delete: 'Удалить',
        deleteConfirm: 'Вы уверены?',
        timeLog: 'Журнал времени',
        today: 'Сегодня',
        yesterday: 'Вчера',
        dateRange: 'Диапазон дат',
        allTime: 'За всё время',
        allActivities: 'Все занятия',
        copied: 'Скопировано в буфер обмена',
        total: 'Всего',
        settings: 'Настройки',
        theme: 'Тема',
        language: 'Язык',
        timeFormat: 'Формат времени',
        firstDayOfWeek: 'Первый день недели',
        confirmDelete: 'Подтверждать удаление',
        backupData: 'Резервная копия',
        restoreData: 'Восстановить данные',
        noEntries: 'Записи не найдены',
        since: 'с',
        deleteEntry: 'Удалить запись',
        editEntry: 'Изменить запись',
        startTime: 'Время начала',
        endTime: 'Время окончания',
        date: 'Дата',
        activity: 'Занятие',
        duration: 'Длительность',
        overlappingEntry: 'Это время пересекается с другой записью',
        undo: 'Отменить',
        deleted: 'Удалено',
        restoreSuccess: 'Данные успешно восстановлены',
        backupSuccess: 'Резервная копия создана',
        small: 'Маленький',
        medium: 'Средний',
        large: 'Большой',
    }
};

// Strings used by static HTML, validation, exports, and notification flows.
// Keep this extension aligned across every supported locale.
const extendedTranslations = {
    en: {
        activityFilter: 'Activity filter',
        documentTitle: 'TimerHub - Time Tracker', homeScreen: 'Go to home screen',
        viewLog: 'View log', addActivity: 'Add new activity', copy: 'Copy', share: 'Share',
        exportTxt: 'Export TXT', exportCsv: 'Export CSV', exportJson: 'Export JSON',
        themeSystem: 'System', themeLight: 'Light', themeDark: 'Dark',
        languageEnglish: 'English', languageGerman: 'German', languageRussian: 'Russian',
        timeFormat12h: '12 Hour', timeFormat24h: '24 Hour', timerNotifications: 'Timer Notifications',
        notificationsOff: 'Off', every5Minutes: 'Every 5 minutes', every10Minutes: 'Every 10 minutes',
        every20Minutes: 'Every 20 minutes', every30Minutes: 'Every 30 minutes', every60Minutes: 'Every 60 minutes',
        custom: 'Custom', minutes: 'Minutes', enableNotifications: 'Enable notifications',
        sendPushTest: 'Send background push test', firstDaySunday: 'Sunday', firstDayMonday: 'Monday',
        loadDemoData: 'Load Demo Data', appVersionInfo: 'Version 1.0 | Data stored locally',
        close: 'Close', activityNamePlaceholder: 'e.g., Painting',
        shapeCircle: 'Circle', shapeSquare: 'Square', shapeRounded: 'Rounded', shapeDiamond: 'Diamond',
        shapeTriangle: 'Triangle', shapeHexagon: 'Hexagon', shapeOctagon: 'Octagon', shapeStar: 'Star',
        shapeHeart: 'Heart', shapeOval: 'Oval', colorSample: 'Color {color}',
        pleaseEnterName: 'Please enter a name', pleaseFillAllFields: 'Please fill all fields',
        startBeforeEnd: 'Start time must be before end time', failedToCopy: 'Failed to copy',
        exportedAs: 'Exported as {format}', backupFailed: 'Backup failed', restoreFailed: 'Restore failed',
        mergeExistingData: 'Merge with existing data? (Cancel to replace)', demoDataLoaded: 'Demo data loaded',
        initFailed: 'TimerHub could not start. Reload the page or restore a backup.',
        notificationOffStatus: 'Notifications are off.', notificationUnsupported: 'Notifications are not supported by this browser.',
        notificationsEnabled: 'Notifications enabled', notificationsBlocked: 'Notifications blocked',
        serviceWorkerUnsupported: 'Service Worker is not supported by this browser.',
        notificationPermissionGranted: 'Permission granted. Interval: {minutes} min.',
        notificationPermissionBlocked: 'Notifications are blocked in browser settings.',
        notificationIntervalStatus: 'Interval: {minutes} min.', notificationEnabledBody: 'Notifications are enabled.',
        notificationTestTitle: 'TimerHub notification test', notificationTestBody: 'This is a background push test.',
        notificationTimerBody: 'Timer is still running: {activity}',
        notificationNeedEnable: 'Enable notifications to restore background reminders.',
        notificationNeedEnableClosed: 'Enable notifications to receive reminders while TimerHub is closed.',
        notificationNoSubscription: 'No push subscription found. Tap Enable notifications to restore reminders.',
        notificationBackgroundActive: 'Background reminders active every {minutes} minutes.',
        notificationPreviousDeliveryFailed: 'Previous delivery failed: {status}',
        notificationPushRegisteredStart: 'Push is registered. Start a timer to schedule reminders.',
        notificationTestAccepted: 'Test push accepted. It should appear even with TimerHub closed.',
        notificationTestFailed: 'Test push failed{status}. Check notification permission and try again.',
        notificationSetupFailed: 'Notifications are enabled, but background push setup failed{status}.',
        notificationNeedsAttention: 'Background reminders need attention{status}.',
        notificationUpdateFailed: 'Could not update background reminders{status}.',
        notificationScheduleFailed: 'The timer is running, but its background reminder was not scheduled{status}.',
        notificationCancelFailed: 'The timer stopped, but its server reminder could not be cancelled{status}.',
        notificationPreviousCancelFailed: 'The previous server reminder could not be cancelled{status}.',
        notificationHttpStatus: ' (HTTP {status})',
        notificationBackgroundFallbackTitle: 'TimerHub', notificationBackgroundFallbackBody: 'Timer reminder',
        textLogTotal: 'Total', colorPickerLabel: 'Choose a color', shapePickerLabel: 'Choose a shape',
        sizePickerLabel: 'Choose a size',
        demoMasking: 'Masking', demoPainting: 'Painting', demoWallpapering: 'Wallpapering',
        demoUnloading: 'Unloading', demoTravel: 'Travel', demoBreak: 'Break',
        logFilename: 'timelog', backupFilename: 'timerhub_backup',
    },
    de: {
        activityFilter: 'Aktivitätsfilter',
        documentTitle: 'TimerHub - Zeiterfassung', homeScreen: 'Zum Startbildschirm',
        viewLog: 'Zeitprotokoll anzeigen', addActivity: 'Aktivität hinzufügen', copy: 'Kopieren', share: 'Teilen',
        exportTxt: 'TXT exportieren', exportCsv: 'CSV exportieren', exportJson: 'JSON exportieren',
        themeSystem: 'System', themeLight: 'Hell', themeDark: 'Dunkel',
        languageEnglish: 'Englisch', languageGerman: 'Deutsch', languageRussian: 'Russisch',
        timeFormat12h: '12-Stunden-Format', timeFormat24h: '24-Stunden-Format', timerNotifications: 'Timer-Benachrichtigungen',
        notificationsOff: 'Aus', every5Minutes: 'Alle 5 Minuten', every10Minutes: 'Alle 10 Minuten',
        every20Minutes: 'Alle 20 Minuten', every30Minutes: 'Alle 30 Minuten', every60Minutes: 'Alle 60 Minuten',
        custom: 'Benutzerdefiniert', minutes: 'Minuten', enableNotifications: 'Benachrichtigungen aktivieren',
        sendPushTest: 'Push-Test im Hintergrund senden', firstDaySunday: 'Sonntag', firstDayMonday: 'Montag',
        loadDemoData: 'Demodaten laden', appVersionInfo: 'Version 1.0 | Daten lokal gespeichert',
        close: 'Schließen', activityNamePlaceholder: 'z. B. Streichen',
        shapeCircle: 'Kreis', shapeSquare: 'Quadrat', shapeRounded: 'Abgerundet', shapeDiamond: 'Raute',
        shapeTriangle: 'Dreieck', shapeHexagon: 'Sechseck', shapeOctagon: 'Achteck', shapeStar: 'Stern',
        shapeHeart: 'Herz', shapeOval: 'Oval', colorSample: 'Farbe {color}',
        pleaseEnterName: 'Bitte einen Namen eingeben', pleaseFillAllFields: 'Bitte alle Felder ausfüllen',
        startBeforeEnd: 'Die Startzeit muss vor der Endzeit liegen', failedToCopy: 'Kopieren fehlgeschlagen',
        exportedAs: 'Als {format} exportiert', backupFailed: 'Sicherung fehlgeschlagen', restoreFailed: 'Wiederherstellung fehlgeschlagen',
        mergeExistingData: 'Mit vorhandenen Daten zusammenführen? (Abbrechen, um sie zu ersetzen)', demoDataLoaded: 'Demodaten geladen',
        initFailed: 'TimerHub konnte nicht gestartet werden. Lade die Seite neu oder stelle eine Sicherung wieder her.',
        notificationOffStatus: 'Benachrichtigungen sind ausgeschaltet.', notificationUnsupported: 'Dieser Browser unterstützt keine Benachrichtigungen.',
        notificationsEnabled: 'Benachrichtigungen aktiviert', notificationsBlocked: 'Benachrichtigungen blockiert',
        serviceWorkerUnsupported: 'Dieser Browser unterstützt keine Service Worker.',
        notificationPermissionGranted: 'Berechtigung erteilt. Intervall: {minutes} Min.',
        notificationPermissionBlocked: 'Benachrichtigungen sind in den Browsereinstellungen blockiert.',
        notificationIntervalStatus: 'Intervall: {minutes} Min.', notificationEnabledBody: 'Benachrichtigungen sind aktiviert.',
        notificationTestTitle: 'TimerHub-Benachrichtigungstest', notificationTestBody: 'Dies ist ein Push-Test im Hintergrund.',
        notificationTimerBody: 'Der Timer läuft noch: {activity}',
        notificationNeedEnable: 'Aktiviere Benachrichtigungen, um Erinnerungen im Hintergrund wiederherzustellen.',
        notificationNeedEnableClosed: 'Aktiviere Benachrichtigungen für Erinnerungen, wenn TimerHub geschlossen ist.',
        notificationNoSubscription: 'Kein Push-Abonnement gefunden. Tippe auf „Benachrichtigungen aktivieren“, um Erinnerungen wiederherzustellen.',
        notificationBackgroundActive: 'Hintergrunderinnerungen alle {minutes} Minuten aktiv.',
        notificationPreviousDeliveryFailed: 'Vorherige Zustellung fehlgeschlagen: {status}',
        notificationPushRegisteredStart: 'Push ist eingerichtet. Starte einen Timer, um Erinnerungen zu planen.',
        notificationTestAccepted: 'Push-Test angenommen. Er sollte auch bei geschlossenem TimerHub erscheinen.',
        notificationTestFailed: 'Push-Test fehlgeschlagen{status}. Prüfe die Benachrichtigungsberechtigung und versuche es erneut.',
        notificationSetupFailed: 'Benachrichtigungen sind aktiviert, aber Push im Hintergrund konnte nicht eingerichtet werden{status}.',
        notificationNeedsAttention: 'Bei den Hintergrunderinnerungen ist ein Problem aufgetreten{status}.',
        notificationUpdateFailed: 'Hintergrunderinnerungen konnten nicht aktualisiert werden{status}.',
        notificationScheduleFailed: 'Der Timer läuft, aber die Hintergrunderinnerung wurde nicht geplant{status}.',
        notificationCancelFailed: 'Der Timer wurde gestoppt, aber die Servererinnerung konnte nicht abgebrochen werden{status}.',
        notificationPreviousCancelFailed: 'Die vorherige Servererinnerung konnte nicht abgebrochen werden{status}.',
        notificationHttpStatus: ' (HTTP {status})',
        notificationBackgroundFallbackTitle: 'TimerHub', notificationBackgroundFallbackBody: 'Timer-Erinnerung',
        textLogTotal: 'Gesamt', colorPickerLabel: 'Farbe auswählen', shapePickerLabel: 'Form auswählen',
        sizePickerLabel: 'Größe auswählen',
        demoMasking: 'Abkleben', demoPainting: 'Streichen', demoWallpapering: 'Tapezieren',
        demoUnloading: 'Entladen', demoTravel: 'Anfahrt', demoBreak: 'Pause',
        logFilename: 'zeitprotokoll', backupFilename: 'timerhub_sicherung',
    },
    ru: {
        activityFilter: 'Фильтр занятий',
        documentTitle: 'TimerHub — учёт времени', homeScreen: 'На главный экран',
        viewLog: 'Открыть журнал времени', addActivity: 'Добавить занятие', copy: 'Копировать', share: 'Поделиться',
        exportTxt: 'Экспорт TXT', exportCsv: 'Экспорт CSV', exportJson: 'Экспорт JSON',
        themeSystem: 'Системная', themeLight: 'Светлая', themeDark: 'Тёмная',
        languageEnglish: 'Английский', languageGerman: 'Немецкий', languageRussian: 'Русский',
        timeFormat12h: '12-часовой формат', timeFormat24h: '24-часовой формат', timerNotifications: 'Напоминания таймера',
        notificationsOff: 'Выключены', every5Minutes: 'Каждые 5 минут', every10Minutes: 'Каждые 10 минут',
        every20Minutes: 'Каждые 20 минут', every30Minutes: 'Каждые 30 минут', every60Minutes: 'Каждые 60 минут',
        custom: 'Свой интервал', minutes: 'Минуты', enableNotifications: 'Включить уведомления',
        sendPushTest: 'Отправить тестовое Push-уведомление', firstDaySunday: 'Воскресенье', firstDayMonday: 'Понедельник',
        loadDemoData: 'Загрузить демонстрационные данные', appVersionInfo: 'Версия 1.0 | Данные хранятся локально',
        close: 'Закрыть', activityNamePlaceholder: 'Например, покраска',
        shapeCircle: 'Круг', shapeSquare: 'Квадрат', shapeRounded: 'Скруглённая', shapeDiamond: 'Ромб',
        shapeTriangle: 'Треугольник', shapeHexagon: 'Шестиугольник', shapeOctagon: 'Восьмиугольник', shapeStar: 'Звезда',
        shapeHeart: 'Сердце', shapeOval: 'Овал', colorSample: 'Цвет {color}',
        pleaseEnterName: 'Введите название', pleaseFillAllFields: 'Заполните все поля',
        startBeforeEnd: 'Время начала должно быть раньше времени окончания', failedToCopy: 'Не удалось скопировать',
        exportedAs: 'Экспортировано в формате {format}', backupFailed: 'Не удалось создать резервную копию', restoreFailed: 'Не удалось восстановить данные',
        mergeExistingData: 'Объединить с существующими данными? (Отмена — заменить данные)', demoDataLoaded: 'Демонстрационные данные загружены',
        initFailed: 'Не удалось запустить TimerHub. Перезагрузите страницу или восстановите резервную копию.',
        notificationOffStatus: 'Уведомления выключены.', notificationUnsupported: 'Этот браузер не поддерживает уведомления.',
        notificationsEnabled: 'Уведомления включены', notificationsBlocked: 'Уведомления заблокированы',
        serviceWorkerUnsupported: 'Этот браузер не поддерживает Service Worker.',
        notificationPermissionGranted: 'Разрешение получено. Интервал: {minutes} мин.',
        notificationPermissionBlocked: 'Уведомления заблокированы в настройках браузера.',
        notificationIntervalStatus: 'Интервал: {minutes} мин.', notificationEnabledBody: 'Уведомления включены.',
        notificationTestTitle: 'Проверка уведомлений TimerHub', notificationTestBody: 'Это тестовое Push-уведомление.',
        notificationTimerBody: 'Таймер всё ещё работает: {activity}',
        notificationNeedEnable: 'Включите уведомления, чтобы восстановить фоновые напоминания.',
        notificationNeedEnableClosed: 'Включите уведомления, чтобы получать напоминания при закрытом TimerHub.',
        notificationNoSubscription: 'Подписка Push не найдена. Нажмите «Включить уведомления», чтобы восстановить напоминания.',
        notificationBackgroundActive: 'Фоновые напоминания включены: каждые {minutes} мин.',
        notificationPreviousDeliveryFailed: 'Предыдущее уведомление не доставлено: {status}',
        notificationPushRegisteredStart: 'Push настроен. Запустите таймер, чтобы включить напоминания.',
        notificationTestAccepted: 'Тестовое Push-уведомление отправлено. Оно должно прийти и при закрытом TimerHub.',
        notificationTestFailed: 'Не удалось отправить тестовое Push-уведомление{status}. Проверьте разрешение и попробуйте снова.',
        notificationSetupFailed: 'Уведомления включены, но Push в фоне настроить не удалось{status}.',
        notificationNeedsAttention: 'Проверьте настройки фоновых напоминаний{status}.',
        notificationUpdateFailed: 'Не удалось обновить фоновые напоминания{status}.',
        notificationScheduleFailed: 'Таймер запущен, но фоновое напоминание не создано{status}.',
        notificationCancelFailed: 'Таймер остановлен, но серверное напоминание не удалось отменить{status}.',
        notificationPreviousCancelFailed: 'Не удалось отменить предыдущее серверное напоминание{status}.',
        notificationHttpStatus: ' (HTTP {status})',
        notificationBackgroundFallbackTitle: 'TimerHub', notificationBackgroundFallbackBody: 'Напоминание таймера',
        textLogTotal: 'Всего', colorPickerLabel: 'Выбрать цвет', shapePickerLabel: 'Выбрать форму',
        sizePickerLabel: 'Выбрать размер',
        demoMasking: 'Заклеивание', demoPainting: 'Покраска', demoWallpapering: 'Поклейка обоев',
        demoUnloading: 'Разгрузка', demoTravel: 'Дорога', demoBreak: 'Перерыв',
        logFilename: 'журнал-времени', backupFilename: 'timerhub-копия',
    }
};
for (const language of Object.keys(translations)) {
    Object.assign(translations[language], extendedTranslations[language]);
}

// ============================================================================
// STORAGE REPOSITORY
// ============================================================================

class StorageRepository {
    constructor() {
        this.dbName = 'TimerHubDB';
        this.version = 1;
        this.db = null;
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Activities store
                if (!db.objectStoreNames.contains('activities')) {
                    const actStore = db.createObjectStore('activities', { keyPath: 'id' });
                    actStore.createIndex('createdAt', 'createdAt', { unique: false });
                }

                // TimeEntries store
                if (!db.objectStoreNames.contains('timeEntries')) {
                    const entryStore = db.createObjectStore('timeEntries', { keyPath: 'id' });
                    entryStore.createIndex('activityId', 'activityId', { unique: false });
                    entryStore.createIndex('startTimestamp', 'startTimestamp', { unique: false });
                }

                // Settings store
                if (!db.objectStoreNames.contains('settings')) {
                    db.createObjectStore('settings', { keyPath: 'key' });
                }

                // Layout store (button positions)
                if (!db.objectStoreNames.contains('layout')) {
                    db.createObjectStore('layout', { keyPath: 'activityId' });
                }
            };
        });
    }

    // Activities
    async getActivities() {
        const tx = this.db.transaction(['activities'], 'readonly');
        const store = tx.objectStore('activities');
        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getActivity(id) {
        const tx = this.db.transaction(['activities'], 'readonly');
        const store = tx.objectStore('activities');
        return new Promise((resolve, reject) => {
            const request = store.get(id);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async saveActivity(activity) {
        const tx = this.db.transaction(['activities'], 'readwrite');
        const store = tx.objectStore('activities');
        return new Promise((resolve, reject) => {
            const request = store.put(activity);
            request.onsuccess = () => resolve(activity);
            request.onerror = () => reject(request.error);
        });
    }

    async deleteActivity(id) {
        const tx = this.db.transaction(['activities'], 'readwrite');
        const store = tx.objectStore('activities');
        return new Promise((resolve, reject) => {
            const request = store.delete(id);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    // TimeEntries
    async getTimeEntries() {
        const tx = this.db.transaction(['timeEntries'], 'readonly');
        const store = tx.objectStore('timeEntries');
        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getTimeEntry(id) {
        const tx = this.db.transaction(['timeEntries'], 'readonly');
        const store = tx.objectStore('timeEntries');
        return new Promise((resolve, reject) => {
            const request = store.get(id);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async saveTimeEntry(entry) {
        const tx = this.db.transaction(['timeEntries'], 'readwrite');
        const store = tx.objectStore('timeEntries');
        return new Promise((resolve, reject) => {
            const request = store.put(entry);
            request.onsuccess = () => resolve(entry);
            request.onerror = () => reject(request.error);
        });
    }

    async deleteTimeEntry(id) {
        const tx = this.db.transaction(['timeEntries'], 'readwrite');
        const store = tx.objectStore('timeEntries');
        return new Promise((resolve, reject) => {
            const request = store.delete(id);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    // Settings
    async getSetting(key, defaultValue) {
        const tx = this.db.transaction(['settings'], 'readonly');
        const store = tx.objectStore('settings');
        return new Promise((resolve, reject) => {
            const request = store.get(key);
            request.onsuccess = () => {
                const result = request.result;
                resolve(result ? result.value : defaultValue);
            };
            request.onerror = () => reject(request.error);
        });
    }

    async setSetting(key, value) {
        const tx = this.db.transaction(['settings'], 'readwrite');
        const store = tx.objectStore('settings');
        return new Promise((resolve, reject) => {
            const request = store.put({ key, value });
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    // Layout
    async getLayout() {
        const tx = this.db.transaction(['layout'], 'readonly');
        const store = tx.objectStore('layout');
        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async saveLayout(layout) {
        const tx = this.db.transaction(['layout'], 'readwrite');
        const store = tx.objectStore('layout');
        return new Promise((resolve, reject) => {
            const request = store.put(layout);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    // Bulk export/import
    async exportAll() {
        const [activities, timeEntries, settings] = await Promise.all([
            this.getActivities(),
            this.getTimeEntries(),
            this.db.transaction(['settings'], 'readonly').objectStore('settings').getAll()
        ]);

        return {
            activities,
            timeEntries,
            settings: Object.fromEntries(settings.map(s => [s.key, s.value])),
            exportedAt: Date.now()
        };
    }

    async importAll(data, merge = false) {
        // Activities
        const txAct = this.db.transaction(['activities'], 'readwrite');
        const storeAct = txAct.objectStore('activities');
        
        if (!merge) {
            await new Promise((resolve, reject) => {
                const request = storeAct.clear();
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
        }

        for (const act of data.activities) {
            await new Promise((resolve, reject) => {
                const request = storeAct.put(act);
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
        }

        // TimeEntries
        const txEntry = this.db.transaction(['timeEntries'], 'readwrite');
        const storeEntry = txEntry.objectStore('timeEntries');
        
        if (!merge) {
            await new Promise((resolve, reject) => {
                const request = storeEntry.clear();
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
        }

        for (const entry of data.timeEntries) {
            await new Promise((resolve, reject) => {
                const request = storeEntry.put(entry);
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
        }

        // Settings
        const txSettings = this.db.transaction(['settings'], 'readwrite');
        const storeSettings = txSettings.objectStore('settings');
        
        for (const [key, value] of Object.entries(data.settings)) {
            await new Promise((resolve, reject) => {
                const request = storeSettings.put({ key, value });
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
        }
    }
}

// ============================================================================
// MAIN APPLICATION
// ============================================================================

class TimerHubApp {
    constructor() {
        this.storage = new StorageRepository();
        this.activities = [];
        this.timeEntries = [];
        this.activeActivityId = null;
        this.currentLanguage = 'en';
        this.currentTheme = 'system';
        this.timeFormat = '24h';
        this.firstDayOfWeek = 1; // Monday
        this.confirmDelete = true;
        this.currentScreen = 'main';
        this.draggedActivityId = null;
        this.editingActivityId = null;
        this.editingEntryId = null;
        this.deletedEntry = null;
        this.uiUpdateInterval = null;
        this.notificationTimeout = null;
        this.toastTimeout = null;
        this.notificationTestMode = false;
        this.isDemoMode = this.isDevMode();

        this.COLORS = [
            '#E74C3C', '#C0392B', '#E67E22', '#D35400', '#F39C12',
            '#F1C40F', '#27AE60', '#2ECC71', '#16A085', '#1ABC9C',
            '#3498DB', '#2980B9', '#4A5F9F', '#34495E', '#9B59B6',
            '#8E44AD', '#E91E63', '#FF6FA3', '#795548', '#7CB342',
            '#95A5A6', '#2C3E50', '#000000', '#FFFFFF'
        ];

        this.SHAPES = [
            { id: 'circle', key: 'shapeCircle', label: '●', svg: 'M 50 50 C 50 77.6 27.6 100 0 100 C -27.6 100 -50 77.6 -50 50 C -50 22.4 -27.6 0 0 0 C 27.6 0 50 22.4 50 50' },
            { id: 'square', key: 'shapeSquare', label: '■', svg: 'M -50 -50 L 50 -50 L 50 50 L -50 50 Z' },
            { id: 'rounded', key: 'shapeRounded', label: '▬', svg: 'M -50 -30 L 50 -30 Q 50 -50 30 -50 L -30 -50 Q -50 -50 -50 -30 L -50 30 Q -50 50 -30 50 L 30 50 Q 50 50 50 30 L 50 -30 Z' },
            { id: 'diamond', key: 'shapeDiamond', label: '◆', svg: 'M 0 -50 L 50 0 L 0 50 L -50 0 Z' },
            { id: 'triangle', key: 'shapeTriangle', label: '▲', svg: 'M 0 -50 L 50 50 L -50 50 Z' },
            { id: 'hexagon', key: 'shapeHexagon', label: '⬡', svg: 'M 0 -50 L 43.3 -25 L 43.3 25 L 0 50 L -43.3 25 L -43.3 -25 Z' },
            { id: 'octagon', key: 'shapeOctagon', label: '⬢', svg: 'M -29.29 -50 L 29.29 -50 L 50 -29.29 L 50 29.29 L 29.29 50 L -29.29 50 L -50 29.29 L -50 -29.29 Z' },
            { id: 'star', key: 'shapeStar', label: '★', svg: 'M 0 -50 L 15 -20 L 50 -20 L 25 5 L 40 40 L 0 15 L -40 40 L -25 5 L -50 -20 L -15 -20 Z' },
            { id: 'heart', key: 'shapeHeart', label: '♥', svg: 'M 0 10 C -30 -20 -50 -10 -50 -20 C -50 -40 -30 -50 -15 -50 C 0 -60 15 -50 15 -50 C 30 -50 50 -40 50 -20 C 50 -10 30 -20 0 10' },
            { id: 'oval', key: 'shapeOval', label: '⬭', svg: 'M -50 0 A 50 30 0 0 1 50 0 A 50 30 0 0 1 -50 0' }
        ];
    }

    isDevMode() {
        return window.location.hostname === 'localhost' || 
               window.location.hostname === '127.0.0.1' ||
               window.location.hostname === '';
    }

    t(key, params = {}) {
        const template = translations[this.currentLanguage]?.[key] || translations.en[key] || key;
        return String(template).replace(/\{([\w]+)\}/g, (match, name) =>
            Object.prototype.hasOwnProperty.call(params, name)
                ? String(params[name])
                : match
        );
    }

    applyTranslations(root = document) {
        const language = Object.prototype.hasOwnProperty.call(translations, this.currentLanguage)
            ? this.currentLanguage
            : 'en';
        this.currentLanguage = language;
        if (document.documentElement) document.documentElement.lang = language;
        if (typeof document.title === 'string') document.title = this.t('documentTitle');

        root.querySelectorAll?.('[data-i18n]').forEach(element => {
            element.textContent = this.t(element.dataset.i18n);
        });
        root.querySelectorAll?.('[data-i18n-placeholder]').forEach(element => {
            element.placeholder = this.t(element.dataset.i18nPlaceholder);
        });
        root.querySelectorAll?.('[data-i18n-title]').forEach(element => {
            element.title = this.t(element.dataset.i18nTitle);
        });
        root.querySelectorAll?.('[data-i18n-aria-label]').forEach(element => {
            element.setAttribute('aria-label', this.t(element.dataset.i18nAriaLabel));
        });

        document.querySelectorAll('.color-option[data-color]').forEach(element => {
            element.setAttribute('aria-label', this.t('colorSample', { color: element.dataset.color }));
        });
    }

    notificationError(key, error) {
        const status = error?.status
            ? this.t('notificationHttpStatus', { status: error.status })
            : '';
        return this.t(key, { status });
    }

    syncServiceWorkerLocale() {
        if (!('serviceWorker' in navigator)) return;
        return navigator.serviceWorker.ready
            .then(registration => {
                const worker = registration.active || navigator.serviceWorker.controller;
                worker?.postMessage({ type: 'SET_LOCALE', locale: this.currentLanguage });
            })
            .catch(error => console.warn('TimerHub could not sync Service Worker locale:', error));
    }

    async init() {
        try {
            await this.storage.init();
            await this.loadSettings();
            await this.loadActivities();
            await this.loadTimeEntries();
            this.applyTranslations();
            this.setupUI();
            this.applyTheme();
            this.syncServiceWorkerLocale();
            this.startUIUpdateLoop();
            this.renderMain();

            // Reconcile a timer restored from IndexedDB with its persisted
            // server alarm so browser restarts do not silently lose reminders.
            if (this.activeActivityId) {
                this.reconcileBackgroundAlarm().catch(error => {
                    console.error('TimerHub background alarm restore failed:', error);
                    this.showPushStatus(this.notificationError('notificationNeedsAttention', error));
                });
            }

            // Show initial onboarding if no activities
            if (this.activities.length === 0) {
                this.showOnboarding();
            }
        } catch (error) {
            console.error('Init error:', error);
            alert(this.t('initFailed'));
        }
    }

    async loadSettings() {
        const language = await this.storage.getSetting('language', 'en');
        this.currentLanguage = Object.prototype.hasOwnProperty.call(translations, language) ? language : 'en';
        const theme = await this.storage.getSetting('theme', 'system');
        this.currentTheme = ['system', 'light', 'dark'].includes(theme) ? theme : 'system';
        const timeFormat = await this.storage.getSetting('timeFormat', '24h');
        this.timeFormat = ['12h', '24h'].includes(timeFormat) ? timeFormat : '24h';
        const firstDay = Number(await this.storage.getSetting('firstDayOfWeek', 1));
        this.firstDayOfWeek = [0, 1].includes(firstDay) ? firstDay : 1;
        this.confirmDelete = await this.storage.getSetting('confirmDelete', true);
        this.notificationInterval =
            await this.storage.getSetting('notificationInterval', 20);
        this.notificationCustomMinutes =
            await this.storage.getSetting('notificationCustomMinutes', 20);
    }

    async loadActivities() {
        this.activities = (await this.storage.getActivities())
            .filter(a => !a.archived)
            .sort((a, b) => (a.position || 0) - (b.position || 0));
    }

    async loadTimeEntries() {
        this.timeEntries = await this.storage.getTimeEntries();
        // Find active entry
        const activeEntry = this.timeEntries.find(e => e.endTimestamp === null);
        if (activeEntry) {
            this.activeActivityId = activeEntry.activityId;
        }
    }

    setupUI() {
        // Safe element selector
        const sel = (id) => {
            const el = document.getElementById(id);
            if (!el) console.warn(`Element not found: ${id}`);
            return el;
        };

        // Navigation
        sel('navLog')?.addEventListener('click', () => this.switchScreen('log'));
        sel('navSettings')?.addEventListener('click', () => this.switchScreen('settings'));
        sel('navHome')?.addEventListener('click', () => this.switchScreen('main'));
        sel('navHome')?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.switchScreen('main');
            }
        });

        // Add activity button
        sel('addActivityBtn')?.addEventListener('click', () => this.showActivityModal());

        // Activity modal
        sel('modalCloseBtn')?.addEventListener('click', () => this.closeActivityModal());
        sel('modalCancelBtn')?.addEventListener('click', () => this.closeActivityModal());
        sel('modalSaveBtn')?.addEventListener('click', () => this.saveActivity());

        // Activity menu modal
        sel('menuCloseBtn')?.addEventListener('click', () => this.closeActivityMenu());
        sel('menuEditBtn')?.addEventListener('click', () => this.editActivity());
        sel('menuArchiveBtn')?.addEventListener('click', () => this.archiveActivity());
        sel('menuDeleteBtn')?.addEventListener('click', () => this.deleteActivity());

        // Entry edit modal
        sel('entryEditCloseBtn')?.addEventListener('click', () => this.closeEntryEditModal());
        sel('entryEditCancelBtn')?.addEventListener('click', () => this.closeEntryEditModal());
        sel('entryEditSaveBtn')?.addEventListener('click', () => this.saveTimeEntry());
        sel('entryEditDeleteBtn')?.addEventListener('click', () => this.deleteTimeEntry());

        // Log screen
        sel('logDateFilter')?.addEventListener('change', () => this.updateLogView());
        sel('logActivityFilter')?.addEventListener('change', () => this.updateLogView());
        sel('dateFrom')?.addEventListener('change', () => this.updateLogView());
        sel('dateTo')?.addEventListener('change', () => this.updateLogView());

        sel('copyLogBtn')?.addEventListener('click', () => this.copyLog());
        sel('shareLogBtn')?.addEventListener('click', () => this.shareLog());
        sel('exportTxtBtn')?.addEventListener('click', () => this.exportLog('txt'));
        sel('exportCsvBtn')?.addEventListener('click', () => this.exportLog('csv'));
        sel('exportJsonBtn')?.addEventListener('click', () => this.exportLog('json'));

        // Settings screen
        sel('themeSelect')?.addEventListener('change', (e) => {
            this.currentTheme = e.target.value;
            this.storage.setSetting('theme', this.currentTheme);
            this.applyTheme();
        });
        if (window.matchMedia) {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
            systemTheme.addEventListener?.('change', () => {
                if (this.currentTheme === 'system') this.applyTheme();
            });
            systemTheme.addListener?.(() => {
                if (this.currentTheme === 'system') this.applyTheme();
            });
        }

        sel('languageSelect')?.addEventListener('change', (e) => {
            this.currentLanguage = Object.prototype.hasOwnProperty.call(translations, e.target.value) ? e.target.value : 'en';
            e.target.value = this.currentLanguage;
            this.storage.setSetting('language', this.currentLanguage);
            this.applyTranslations();
            this.renderAll();
            this.clearToast();
            this.syncServiceWorkerLocale();
            if (this.activeTimerEntry()) {
                this.reconcileBackgroundAlarm().catch(error => {
                    console.error('TimerHub alarm language update failed:', error);
                    this.showPushStatus(this.notificationError('notificationUpdateFailed', error));
                });
            }
        });

        sel('timeFormatSelect')?.addEventListener('change', (e) => {
            this.timeFormat = e.target.value;
            this.storage.setSetting('timeFormat', this.timeFormat);
            this.renderAll();
        });

        sel('firstDaySelect')?.addEventListener('change', (e) => {
            this.firstDayOfWeek = parseInt(e.target.value);
            this.storage.setSetting('firstDayOfWeek', this.firstDayOfWeek);
            this.renderAll();
        });

        sel('confirmDeleteCheckbox')?.addEventListener('change', (e) => {
            this.confirmDelete = e.target.checked;
            this.storage.setSetting('confirmDelete', this.confirmDelete);
        });

        sel('notificationIntervalSelect')?.addEventListener('change', async (e) => {
            const value = e.target.value;
            const input = document.getElementById('notificationCustomMinutes');

            if (value === 'custom') {
                const minutes = Math.max(
                    1,
                    Math.min(1440, parseInt(input?.value || '20', 10))
                );

                this.notificationCustomMinutes = minutes;
                this.notificationInterval = minutes;

                if (input) {
                    input.value = minutes;
                    input.style.display = 'block';
                }

                await this.storage.setSetting(
                    'notificationCustomMinutes',
                    minutes
                );
            } else {
                this.notificationInterval = parseInt(value, 10);

                if (input) {
                    input.style.display = 'none';
                }
            }

            await this.storage.setSetting(
                'notificationInterval',
                this.notificationInterval
            );

            this.updateNotificationStatus();
            this.reconcileBackgroundAlarm().catch(error => {
                console.error('TimerHub alarm update failed:', error);
                this.showPushStatus(this.notificationError('notificationUpdateFailed', error));
            });
        });

        sel('notificationCustomMinutes')?.addEventListener('change', async (e) => {
            const minutes = Math.max(
                1,
                Math.min(1440, parseInt(e.target.value || '20', 10))
            );

            this.notificationCustomMinutes = minutes;
            this.notificationInterval = minutes;
            e.target.value = minutes;

            await this.storage.setSetting(
                'notificationCustomMinutes',
                minutes
            );

            await this.storage.setSetting(
                'notificationInterval',
                minutes
            );

            this.updateNotificationStatus();
            this.reconcileBackgroundAlarm().catch(error => {
                console.error('TimerHub alarm update failed:', error);
                this.showPushStatus(this.notificationError('notificationUpdateFailed', error));
            });
        });

        sel('notificationEnableBtn')?.addEventListener('click', async () => {
            const status = document.getElementById('notificationStatus');
            console.log('TimerHub: notification button clicked');

            try {
                await this.requestNotificationPermission();
            } catch (error) {
                console.error('TimerHub notification error:', error);
                if (status) {
                    status.textContent = this.notificationError('notificationSetupFailed', error);
                }
            }
        });

        sel('notificationTestBtn')?.addEventListener('click', async () => {
            try {
                await this.sendBackgroundPushTest();
                this.showPushStatus(this.t('notificationTestAccepted'));
            } catch (error) {
                console.error('TimerHub test push failed:', error);
                this.showPushStatus(this.notificationError('notificationTestFailed', error));
            }
        });

        sel('backupBtn')?.addEventListener('click', () => this.backupData());
        sel('restoreBtn')?.addEventListener('click', () => this.restoreData());

        if (this.isDemoMode) {
            const demoBtn = sel('demoDataBtn');
            if (demoBtn) {
                demoBtn.style.display = 'block';
                demoBtn.addEventListener('click', () => this.loadDemoData());
            }
        }

        // Color picker
        this.populateColorPicker();

        // Shape picker
        this.populateShapePicker();

        // Size buttons
        document.querySelectorAll('.size-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
                e.target.classList.add('selected');
            });
        });

        // Activity name input
        sel('activityName')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.saveActivity();
            }
        });
    }

    populateColorPicker() {
        const picker = document.getElementById('colorPicker');
        picker.innerHTML = '';

        this.COLORS.forEach(color => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'color-option';
            btn.style.backgroundColor = color;
            btn.dataset.color = color;
            btn.setAttribute('aria-label', this.t('colorSample', { color }));
            btn.addEventListener('click', () => {
                document.querySelectorAll('.color-option').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
            });
            picker.appendChild(btn);
        });

        // Custom color swatch — opens the system color picker for any color
        const customBtn = document.createElement('button');
        customBtn.type = 'button';
        customBtn.id = 'customColorSwatch';
        customBtn.className = 'color-option color-option-custom';
        customBtn.textContent = '+';
        customBtn.title = this.t('customColor');
        customBtn.dataset.i18nTitle = 'customColor';
        customBtn.dataset.i18nAriaLabel = 'customColor';
        customBtn.setAttribute('aria-label', customBtn.title);

        const customInput = document.createElement('input');
        customInput.type = 'color';
        customInput.id = 'customColorInput';
        customInput.className = 'custom-color-input';
        customInput.value = '#4A90E2';
        customBtn.dataset.color = customInput.value;

        customBtn.addEventListener('click', () => customInput.click());
        customInput.addEventListener('input', () => {
            customBtn.style.backgroundColor = customInput.value;
            customBtn.style.backgroundImage = 'none';
            customBtn.dataset.color = customInput.value;
            customBtn.setAttribute('aria-label', this.t('colorSample', { color: customInput.value }));
            customBtn.textContent = '';
            document.querySelectorAll('.color-option').forEach(b => b.classList.remove('selected'));
            customBtn.classList.add('selected');
        });

        picker.appendChild(customBtn);
        picker.appendChild(customInput);
    }

    // Converts an "rgb(r, g, b)" string (as read back from style.backgroundColor)
    // into a "#rrggbb" hex string for use with <input type="color">
    rgbStringToHex(rgb) {
        if (!rgb) return '#000000';
        if (typeof rgb !== 'string') return '#000000';
        const hex = rgb.trim();
        if (/^#[0-9a-f]{6}$/i.test(hex)) return hex;
        const shortHex = hex.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/i);
        if (shortHex) return `#${shortHex[1]}${shortHex[1]}${shortHex[2]}${shortHex[2]}${shortHex[3]}${shortHex[3]}`;
        const rgbMatch = hex.match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*(?:0|1|0?\.\d+))?\s*\)$/i);
        if (!rgbMatch || rgbMatch.slice(1, 4).some(channel => Number(channel) > 255)) return '#000000';
        return '#' + rgbMatch.slice(1, 4).map(channel => Number(channel).toString(16).padStart(2, '0')).join('');
    }

    contrastingTextColor(color) {
        const hex = this.rgbStringToHex(color).replace('#', '');
        if (!/^[0-9a-f]{6}$/i.test(hex)) return '#000000';
        const channels = [0, 2, 4].map(index => parseInt(hex.slice(index, index + 2), 16) / 255);
        const linear = channels.map(value => value <= 0.04045
            ? value / 12.92
            : ((value + 0.055) / 1.055) ** 2.4);
        const luminance = 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
        const contrastWithBlack = (luminance + 0.05) / 0.05;
        const contrastWithWhite = 1.05 / (luminance + 0.05);
        return contrastWithBlack >= contrastWithWhite ? '#000000' : '#ffffff';
    }

    populateShapePicker() {
        const picker = document.getElementById('shapePicker');
        this.SHAPES.forEach(shape => {
            const btn = document.createElement('button');
            btn.className = 'shape-option';
            btn.textContent = shape.label;
            btn.dataset.shape = shape.id;
            btn.dataset.i18nTitle = shape.key;
            btn.dataset.i18nAriaLabel = shape.key;
            btn.setAttribute('aria-label', this.t(shape.key));
            btn.title = this.t(shape.key);
            btn.addEventListener('click', () => {
                document.querySelectorAll('.shape-option').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
            });
            picker.appendChild(btn);
        });
    }

    applyTheme() {
        const html = document.documentElement;
        if (this.currentTheme === 'system') {
            html.removeAttribute('data-theme');
        } else {
            html.setAttribute('data-theme', this.currentTheme);
        }
        const themeColor = document.querySelector('meta[name="theme-color"]');
        if (themeColor) {
            const background = getComputedStyle(html).getPropertyValue('--bg-primary').trim();
            if (background) themeColor.setAttribute('content', background);
        }
    }

    startUIUpdateLoop() {
        if (this.uiUpdateInterval) clearInterval(this.uiUpdateInterval);
        
        this.uiUpdateInterval = setInterval(() => {
            // Update active button duration every second
            if (this.activeActivityId) {
                const btn = document.querySelector(`[data-activity-id="${this.activeActivityId}"]`);
                if (btn) {
                    const duration = this.getActiveDuration();
                    const durationElement = btn.querySelector('.btn-duration');
                    if (durationElement) {
                        durationElement.textContent = this.formatDuration(duration);
                    }
                }
            }
        }, 1000);
    }

    switchScreen(screen) {
        this.currentScreen = screen;
        
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        
        switch (screen) {
            case 'log':
                document.getElementById('logScreen').classList.add('active');
                this.renderLog();
                break;
            case 'settings':
                document.getElementById('settingsScreen').classList.add('active');
                this.renderSettings();
                break;
            default:
                document.getElementById('mainScreen').classList.add('active');
                this.renderMain();
        }
    }

    renderAll() {
        this.applyTranslations();
        this.renderMain();
        this.renderLog();
        this.renderSettings();
        this.refreshTranslatedDynamicText();
    }

    refreshTranslatedDynamicText() {
        const activityModal = document.getElementById('activityModal');
        if (activityModal?.classList.contains('active')) {
            const title = document.getElementById('modalTitle');
            if (title) title.textContent = this.t(this.editingActivityId ? 'editActivity' : 'createActivity');
        }

        const activityMenu = document.getElementById('activityMenuModal');
        if (activityMenu?.classList.contains('active')) {
            const activity = this.activities.find(item => item.id === this.editingActivityId);
            const title = document.getElementById('activityMenuTitle');
            if (title) title.textContent = activity?.name || this.t('activity');
        }
    }

    renderMain() {
        const grid = document.getElementById('activitiesGrid');
        grid.innerHTML = '';

        this.activities.forEach((activity, index) => {
            const btn = document.createElement('button');
            btn.className = `activity-btn ${activity.size}`;
            if (this.activeActivityId === activity.id) {
                btn.classList.add('active');
            }
            btn.dataset.activityId = activity.id;
            btn.setAttribute('aria-label', activity.name);
            btn.style.backgroundColor = activity.color;
            btn.style.setProperty('--activity-text-color', this.contrastingTextColor(activity.color));

            // Apply shape if needed (for now using border-radius)
            if (activity.shape === 'circle') {
                btn.style.borderRadius = '50%';
            } else if (activity.shape === 'diamond') {
                btn.style.borderRadius = '0';
            }

            const name = document.createElement('div');
            name.className = 'btn-name';
            name.textContent = activity.name;

            if (this.activeActivityId === activity.id) {
                const entry = this.timeEntries.find(e => e.activityId === activity.id && e.endTimestamp === null);
                if (entry) {
                    const timeEl = document.createElement('div');
                    timeEl.className = 'btn-time';
                    timeEl.textContent = `${this.t('since')} ${this.formatTime(entry.startTimestamp)}`;
                    
                    const durationEl = document.createElement('div');
                    durationEl.className = 'btn-duration';
                    durationEl.textContent = this.formatDuration(this.getActiveDuration());
                    
                    btn.appendChild(name);
                    btn.appendChild(timeEl);
                    btn.appendChild(durationEl);
                }
            } else {
                btn.appendChild(name);
            }

            // Click events
            btn.addEventListener('click', (e) => {
                if (!this.draggedActivityId) {
                    this.toggleActivity(activity.id);
                }
            });

            // Long press for menu
            let longPressTimer;
            btn.addEventListener('touchstart', () => {
                longPressTimer = setTimeout(() => {
                    this.showActivityMenu(activity.id);
                }, 500);
            });
            btn.addEventListener('touchend', () => clearTimeout(longPressTimer));

            // Drag
            btn.addEventListener('touchstart', (e) => {
                if (e.touches.length === 1) {
                    this.startDrag(activity.id, e.touches[0]);
                }
            });

            grid.appendChild(btn);
        });

        this.populateActivityFilter();
    }

    startDrag(activityId, touch) {
        this.draggedActivityId = activityId;
        const btn = document.querySelector(`[data-activity-id="${activityId}"]`);
        if (btn) {
            btn.classList.add('dragging');
            btn.style.position = 'fixed';
            btn.style.zIndex = '1000';
            
            const moveHandler = (e) => {
                const t = e.touches[0];
                btn.style.left = (t.clientX - btn.offsetWidth / 2) + 'px';
                btn.style.top = (t.clientY - btn.offsetHeight / 2) + 'px';
            };

            const endHandler = () => {
                btn.classList.remove('dragging');
                btn.style.position = '';
                btn.style.zIndex = '';
                btn.style.left = '';
                btn.style.top = '';
                this.draggedActivityId = null;
                
                document.removeEventListener('touchmove', moveHandler);
                document.removeEventListener('touchend', endHandler);
                
                this.renderMain();
            };

            document.addEventListener('touchmove', moveHandler, { passive: true });
            document.addEventListener('touchend', endHandler);
        }
    }

    getPushClientId() {
        let clientId = localStorage.getItem('timerhubPushClientId');

        if (!clientId) {
            clientId = crypto.randomUUID
                ? crypto.randomUUID().replace(/-/g, '')
                : Date.now().toString(36) +
                  Math.random().toString(36).slice(2) +
                  Math.random().toString(36).slice(2);

            localStorage.setItem(
                'timerhubPushClientId',
                clientId
            );
        }

        return clientId;
    }

    urlBase64ToUint8Array(base64String) {
        if (typeof base64String !== 'string' || !base64String.trim()) {
            throw new Error('Push public key is invalid.');
        }
        base64String = base64String.trim();
        const padding = "=".repeat(
            (4 - (base64String.length % 4)) % 4
        );

        const base64 = (
            base64String + padding
        )
            .replace(/-/g, "+")
            .replace(/_/g, "/");

        const rawData = atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }

        // A VAPID P-256 public key is an uncompressed point: 0x04 + 32 + 32 bytes.
        if (outputArray.length !== 65 || outputArray[0] !== 4) {
            throw new Error('Push public key must be a valid VAPID public key.');
        }

        return outputArray;
    }

    showPushStatus(message) {
        const status = document.getElementById('notificationStatus');
        if (status) status.textContent = message;
    }

    async pushRequest(path, options = {}) {
        const response = await fetch(path, options);
        if (!response.ok) {
            const detail = await response.text().catch(() => '');
            const error = new Error(
                `HTTP ${response.status}` + (detail ? `: ${detail}` : '')
            );
            error.status = response.status;
            error.responseText = detail;
            throw error;
        }
        return response;
    }

    async registerBackgroundPush({ createIfMissing = true } = {}) {
        if (
            !("serviceWorker" in navigator) ||
            !("PushManager" in window)
        ) {
            throw new Error(
                "Background Push is not supported by this browser."
            );
        }

        const configResponse = await this.pushRequest("/api/push/config");
        const config = await configResponse.json();

        if (!config.publicKey) {
            throw new Error(
                "Push public key is missing."
            );
        }

        const registration =
            await navigator.serviceWorker.ready;

        const clientId = this.getPushClientId();
        const serverStatusResponse = await this.pushRequest(
            `/api/push/status?clientId=${encodeURIComponent(clientId)}`
        );
        const serverStatus = await serverStatusResponse.json();

        let subscription =
            await registration.pushManager.getSubscription();

        const staleServerSubscription =
            [404, 410].includes(serverStatus.lastDelivery?.statusCode);
        if (serverStatus.lastDelivery && !serverStatus.lastDelivery.ok && !staleServerSubscription) {
            const statusCode = serverStatus.lastDelivery.statusCode;
            this.lastPushDeliveryError =
                (statusCode ? `HTTP ${statusCode}: ` : '') +
                (serverStatus.lastDelivery.error || 'Push service delivery failed');
        } else if (staleServerSubscription) {
            this.lastPushDeliveryError = null;
        }
        if (staleServerSubscription && subscription) {
            await subscription.unsubscribe();
            subscription = null;
        }

        const applicationServerKey =
            this.urlBase64ToUint8Array(config.publicKey);

        // A subscription is bound to the VAPID public key used to create it.
        // Replace it when a deployment rotates keys instead of repeatedly
        // sending requests that the push service will reject.
        if (subscription) {
            const existingKey = subscription.options?.applicationServerKey ||
                subscription.getKey?.('applicationServerKey');
            if (existingKey) {
                const existingBytes = new Uint8Array(existingKey);
                const keysMatch = existingBytes.length === applicationServerKey.length &&
                    existingBytes.every((byte, index) => byte === applicationServerKey[index]);
                if (!keysMatch) {
                    await subscription.unsubscribe();
                    subscription = null;
                }
            }
        }

        if (!subscription) {
            if (!createIfMissing) return null;
            subscription =
                await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey
                });
        }

        await this.pushRequest(
            "/api/push/subscribe?clientId=" +
            encodeURIComponent(clientId) +
            "&locale=" + encodeURIComponent(this.currentLanguage),
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(subscription)
            }
        );

        return subscription;
    }

    activeTimerEntry() {
        return this.timeEntries.find(entry =>
            entry.activityId === this.activeActivityId &&
            entry.endTimestamp === null
        );
    }

    async cancelBackgroundAlarm() {
        await this.pushRequest(
            `/api/push/cancel?clientId=${encodeURIComponent(this.getPushClientId())}`,
            { method: 'POST' }
        );
    }

    async scheduleBackgroundAlarm(entry, {
        createIfMissing = true,
        subscriptionRegistered = false
    } = {}) {
        const intervalMinutes = Number(this.notificationInterval);
        if (!entry || !Number.isFinite(intervalMinutes) || intervalMinutes <= 0) {
            await this.cancelBackgroundAlarm();
            return false;
        }
        if (!('Notification' in window) || Notification.permission !== 'granted') {
            await this.cancelBackgroundAlarm();
            return false;
        }

        const subscription = subscriptionRegistered
            ? true
            : await this.registerBackgroundPush({ createIfMissing });
        if (!subscription) {
            this.showPushStatus(this.t('notificationNeedEnable'));
            return false;
        }

        const activity = this.activities.find(item => item.id === entry.activityId);
        const intervalMs = intervalMinutes * 60 * 1000;
        const timestamp = Date.now() + intervalMs;
        await this.pushRequest(
            `/api/push/schedule?clientId=${encodeURIComponent(this.getPushClientId())}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    alarmId: entry.id,
                    timestamp,
                    intervalMs,
                    title: this.t('notificationBackgroundFallbackTitle'),
                    body: this.t('notificationTimerBody', {
                        activity: activity?.name || entry.activityNameSnapshot || this.t('activity')
                    }),
                    locale: this.currentLanguage,
                    tag: 'timerhub-timer'
                })
            }
        );
        const deliveryError = this.lastPushDeliveryError;
        this.lastPushDeliveryError = null;
        this.showPushStatus(this.t('notificationBackgroundActive', { minutes: intervalMinutes }) +
            (deliveryError ? ` ${this.t('notificationPreviousDeliveryFailed', { status: deliveryError })}` : ''));
        return true;
    }

    async reconcileBackgroundAlarm() {
        const entry = this.activeTimerEntry();
        if (!entry || Number(this.notificationInterval) <= 0) {
            await this.cancelBackgroundAlarm();
            return false;
        }
        if (!('Notification' in window) || Notification.permission !== 'granted') {
            await this.cancelBackgroundAlarm();
            this.showPushStatus(this.t('notificationNeedEnableClosed'));
            return false;
        }

        const subscription = await this.registerBackgroundPush({ createIfMissing: true });
        if (!subscription) {
            this.showPushStatus(this.t('notificationNoSubscription'));
            return false;
        }
        return this.scheduleBackgroundAlarm(entry, {
            createIfMissing: true,
            subscriptionRegistered: true
        });
    }

    async sendBackgroundPushTest() {
        const subscription = await this.registerBackgroundPush();
        if (!subscription) throw new Error(this.t('notificationNoSubscription'));
        await this.pushRequest(
            `/api/push/test?clientId=${encodeURIComponent(this.getPushClientId())}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    locale: this.currentLanguage,
                    title: this.t('notificationTestTitle'),
                    body: this.t('notificationTestBody'),
                    tag: 'timerhub-push-test'
                })
            }
        );
    }

    async updateNotificationStatus() {
        const status = document.getElementById('notificationStatus');
        const button = document.getElementById('notificationEnableBtn');

        if (!status || !button) return;

        if (this.notificationInterval === 0) {
            status.textContent = this.t('notificationOffStatus');
            button.textContent = this.t('enableNotifications');
            return;
        }

        if (!('Notification' in window)) {
            status.textContent = this.t('notificationUnsupported');
            return;
        }

        if (Notification.permission === 'granted') {
            status.textContent = this.t('notificationPermissionGranted', { minutes: this.notificationInterval });
            button.textContent = this.t('notificationsEnabled');
        } else if (Notification.permission === 'denied') {
            status.textContent = this.t('notificationPermissionBlocked');
            button.textContent = this.t('notificationsBlocked');
        } else {
            status.textContent = this.t('notificationIntervalStatus', { minutes: this.notificationInterval });
            button.textContent = this.t('enableNotifications');
        }
    }

    async requestNotificationPermission() {
        if (!("Notification" in window)) {
            alert(this.t('notificationUnsupported'));
            return;
        }

        if (!("serviceWorker" in navigator)) {
            alert(this.t('serviceWorkerUnsupported'));
            return;
        }

        try {
            const permission =
                await Notification.requestPermission();

            if (permission === "granted") {
                const registration =
                    await navigator.serviceWorker.ready;

                await registration.showNotification(
                    "TimerHub",
                    {
                        body: this.t('notificationEnabledBody'),
                        tag: "timerhub-test",
                        renotify: true,
                        vibrate: [200, 100, 200]
                    }
                );

                try {
                    await this.registerBackgroundPush();

                    const activeEntry = this.activeTimerEntry();
                    if (activeEntry && Number(this.notificationInterval) > 0) {
                        await this.scheduleBackgroundAlarm(activeEntry, {
                            createIfMissing: false,
                            subscriptionRegistered: true
                        });
                    } else {
                        this.showPushStatus(this.t('notificationPushRegisteredStart'));
                    }

                    console.log(
                        "TimerHub: Background Push subscription registered"
                    );
                } catch (pushError) {
                    console.error(
                        "TimerHub: Background Push registration failed:",
                        pushError
                    );

                    const status =
                        document.getElementById(
                            "notificationStatus"
                        );

                    if (status) {
                        status.textContent = this.notificationError('notificationSetupFailed', pushError);
                    }
                }
            } else {
                this.updateNotificationStatus();
            }
        } catch (error) {
            console.error(
                "Notification permission error:",
                error
            );
            this.showPushStatus(this.notificationError('notificationSetupFailed', error));
        }
    }

    async toggleActivity(activityId) {
        const now = Date.now();

        // Cancel any previously scheduled local notification.
        if (this.notificationTimeout) {
            clearTimeout(this.notificationTimeout);
            this.notificationTimeout = null;
        }

        if (this.activeActivityId === activityId) {
            const entry = this.timeEntries.find(
                e => e.activityId === activityId && e.endTimestamp === null
            );

            if (entry) {
                entry.endTimestamp = now;
                entry.updatedAt = now;
                await this.storage.saveTimeEntry(entry);
                try {
                    await this.cancelBackgroundAlarm();
                } catch (error) {
                    console.error("TimerHub server alarm cancel error:", error);
                    this.showPushStatus(this.notificationError('notificationCancelFailed', error));
                }
                this.activeActivityId = null;
                this.renderMain();
            }
        } else {
            // Stop previous activity.
                if (this.activeActivityId) {
                    const prevEntry = this.timeEntries.find(
                        e => e.activityId === this.activeActivityId &&
                             e.endTimestamp === null
                    );
                    if (prevEntry) {
                        prevEntry.endTimestamp = now;
                        prevEntry.updatedAt = now;
                        await this.storage.saveTimeEntry(prevEntry);
                    }
                    try {
                        await this.cancelBackgroundAlarm();
                    } catch (error) {
                        console.error("TimerHub server alarm cancel error:", error);
                        this.showPushStatus(this.notificationError('notificationPreviousCancelFailed', error));
                    }
                }

            // Start new activity.
            const activity = this.activities.find(a => a.id === activityId);

            if (activity) {
                const entry = {
                    id: this.generateId(),
                    activityId: activityId,
                    activityNameSnapshot: activity.name,
                    startTimestamp: now,
                    endTimestamp: null,
                    createdAt: now,
                    updatedAt: now
                };

                this.timeEntries.push(entry);
                await this.storage.saveTimeEntry(entry);
                this.activeActivityId = activityId;
                this.renderMain();

                // Schedule only after the push subscription has been saved.
                if (Number(this.notificationInterval) > 0) {
                    try {
                        await this.scheduleBackgroundAlarm(entry);
                    } catch (error) {
                        console.error("TimerHub server alarm error:", error);
                        this.showPushStatus(this.notificationError('notificationScheduleFailed', error));
                    }
                }
            }
        }
    }

    showActivityModal(activityId = null) {
        this.editingActivityId = activityId;
        const modal = document.getElementById('activityModal');
        const title = document.getElementById('modalTitle');

        if (activityId) {
            const activity = this.activities.find(a => a.id === activityId);
            if (!activity) return;
            title.textContent = this.t('editActivity');
            document.getElementById('activityName').value = activity.name;

            // Select color
            document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
            const colorOpt = Array.from(document.querySelectorAll('.color-option:not(.color-option-custom)'))
                .find(opt => this.rgbStringToHex(opt.style.backgroundColor).toLowerCase() === this.rgbStringToHex(activity.color).toLowerCase());
            if (colorOpt) {
                colorOpt.classList.add('selected');
            } else {
                // Not a preset color — show it on the custom swatch instead
                const customBtn = document.getElementById('customColorSwatch');
                const customInput = document.getElementById('customColorInput');
                if (customBtn && customInput) {
                    const hex = this.rgbStringToHex(activity.color);
                    customInput.value = hex;
                    customBtn.style.backgroundColor = activity.color;
                    customBtn.style.backgroundImage = 'none';
                    customBtn.dataset.color = hex;
                    customBtn.setAttribute('aria-label', this.t('colorSample', { color: hex }));
                    customBtn.textContent = '';
                    customBtn.classList.add('selected');
                }
            }

            // Select shape
            document.querySelectorAll('.shape-option').forEach(opt => opt.classList.remove('selected'));
            const shapeOpt = Array.from(document.querySelectorAll('.shape-option'))
                .find(opt => opt.dataset.shape === activity.shape);
            if (shapeOpt) shapeOpt.classList.add('selected');

            // Select size
            document.querySelectorAll('.size-btn').forEach(opt => opt.classList.remove('selected'));
            const sizeOpt = document.querySelector(`.size-btn[data-size="${activity.size}"]`);
            if (sizeOpt) sizeOpt.classList.add('selected');
        } else {
            title.textContent = this.t('createActivity');
            document.getElementById('activityName').value = '';
            document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
            document.querySelectorAll('.color-option')[0]?.classList.add('selected');
            // Reset custom swatch back to its default "+" state
            const customBtn = document.getElementById('customColorSwatch');
            if (customBtn) {
                customBtn.style.backgroundColor = '';
                customBtn.style.backgroundImage = '';
                customBtn.textContent = '+';
                customBtn.dataset.color = '#4A90E2';
                customBtn.setAttribute('aria-label', this.t('customColor'));
            }
            const customInput = document.getElementById('customColorInput');
            if (customInput) customInput.value = '#4A90E2';
            document.querySelectorAll('.shape-option').forEach(opt => opt.classList.remove('selected'));
            document.querySelectorAll('.shape-option')[0]?.classList.add('selected');
            document.querySelectorAll('.size-btn').forEach(opt => opt.classList.remove('selected'));
            document.querySelector('.size-btn[data-size="medium"]')?.classList.add('selected');
        }

        modal.classList.add('active');
        document.getElementById('activityName').focus();
    }

    closeActivityModal() {
        document.getElementById('activityModal').classList.remove('active');
        this.editingActivityId = null;
    }

    async saveActivity() {
        const name = document.getElementById('activityName').value.trim();
        if (!name) {
            this.showToast(this.t('pleaseEnterName'));
            return;
        }

        const selectedColor = document.querySelector('.color-option.selected');
        const selectedShape = document.querySelector('.shape-option.selected');
        const selectedSize = document.querySelector('.size-btn.selected');

        const color = selectedColor ? selectedColor.style.backgroundColor : this.COLORS[0];
        const shape = selectedShape ? selectedShape.dataset.shape : 'circle';
        const size = selectedSize ? selectedSize.dataset.size : 'medium';

        const now = Date.now();

        if (this.editingActivityId) {
            // Edit
            const activity = this.activities.find(a => a.id === this.editingActivityId);
            if (activity) {
                activity.name = name;
                activity.color = color;
                activity.shape = shape;
                activity.size = size;
                activity.updatedAt = now;
                await this.storage.saveActivity(activity);
            }
        } else {
            // Create
            const activity = {
                id: this.generateId(),
                name: name,
                color: color,
                shape: shape,
                size: size,
                position: this.activities.length,
                archived: false,
                createdAt: now,
                updatedAt: now
            };
            this.activities.push(activity);
            await this.storage.saveActivity(activity);
        }

        this.closeActivityModal();
        this.renderMain();
    }

    showActivityMenu(activityId) {
        this.editingActivityId = activityId;
        const activity = this.activities.find(a => a.id === activityId);
        if (activity) {
            document.getElementById('activityMenuTitle').textContent = activity.name;
            document.getElementById('activityMenuModal').classList.add('active');
        }
    }

    closeActivityMenu() {
        document.getElementById('activityMenuModal').classList.remove('active');
    }

    editActivity() {
        this.closeActivityMenu();
        this.showActivityModal(this.editingActivityId);
    }

    async archiveActivity() {
        const activity = this.activities.find(a => a.id === this.editingActivityId);
        if (activity) {
            activity.archived = true;
            activity.updatedAt = Date.now();
            await this.storage.saveActivity(activity);
            this.activities = this.activities.filter(a => !a.archived);
        }
        this.closeActivityMenu();
        this.renderMain();
    }

    async deleteActivity() {
        if (this.confirmDelete && !confirm(this.t('deleteConfirm'))) {
            return;
        }

        const activity = this.activities.find(a => a.id === this.editingActivityId);
        if (activity) {
            await this.storage.deleteActivity(activity.id);
            this.activities = this.activities.filter(a => a.id !== activity.id);
        }
        this.closeActivityMenu();
        this.renderMain();
    }

    renderLog() {
        const filterType = document.getElementById('logDateFilter').value;
        const filterActivity = document.getElementById('logActivityFilter').value;
        const content = document.getElementById('logContent');

        const dateRange = this.getDateRange(filterType);
        let entries = this.timeEntries.filter(e => {
            if (e.endTimestamp === null) return false;
            const date = new Date(e.startTimestamp);
            const end = new Date(e.endTimestamp);
            return date < dateRange[1] && end > dateRange[0];
        });

        if (filterActivity) {
            entries = entries.filter(e => e.activityId === filterActivity);
        }

        entries.sort((a, b) => a.startTimestamp - b.startTimestamp);

        if (entries.length === 0) {
            content.innerHTML = `<div class="log-empty">${this.t('noEntries')}</div>`;
            return;
        }

        // Group by day
        const byDay = new Map();
        entries.forEach(entry => {
            const date = this.toDateString(new Date(entry.startTimestamp));
            if (!byDay.has(date)) byDay.set(date, []);
            byDay.get(date).push(entry);
        });

        let html = '';
        for (const [date, dayEntries] of [...byDay.entries()].sort(([a], [b]) => b.localeCompare(a))) {
            const dayTotal = dayEntries.reduce((sum, e) => sum + (e.endTimestamp - e.startTimestamp), 0);
            const activityTotals = {};
            
            dayEntries.forEach(e => {
                if (!activityTotals[e.activityId]) activityTotals[e.activityId] = 0;
                activityTotals[e.activityId] += (e.endTimestamp - e.startTimestamp);
            });

            html += `<div class="log-day">
                <div class="log-day-header">${this.escapeHtml(this.getDateString(new Date(`${date}T00:00:00`).getTime()))}</div>
                <div class="log-day-stats">
                    <div class="log-day-total">${this.t('total')}: ${this.formatDuration(dayTotal)}</div>
                    ${Object.entries(activityTotals).map(([actId, total]) => {
                        const act = this.activities.find(a => a.id === actId);
                        const snapshot = dayEntries.find(e => e.activityId === actId)?.activityNameSnapshot;
                        return `<div class="log-activity-stat">${this.escapeHtml(snapshot)} — ${this.formatDuration(total)}</div>`;
                    }).join('')}
                </div>`;

            dayEntries.forEach(entry => {
                const snapshot = entry.activityNameSnapshot;
                const duration = entry.endTimestamp - entry.startTimestamp;
                const start = this.formatDateTime(entry.startTimestamp);
                const end = this.formatDateTime(entry.endTimestamp);

                html += `<div class="log-entry" data-entry-id="${this.escapeHtml(entry.id)}">
                    <div class="log-entry-time">${start} – ${end}</div>
                    <div class="log-entry-activity">${this.escapeHtml(snapshot)}</div>
                    <div class="log-entry-duration">${this.formatDuration(duration)}</div>
                </div>`;
            });

            html += '</div>';
        }

        content.innerHTML = html;

        // Add click handlers
        document.querySelectorAll('.log-entry').forEach(el => {
            el.addEventListener('click', () => {
                this.showEntryEditModal(el.dataset.entryId);
            });
        });
    }

    showEntryEditModal(entryId) {
        this.editingEntryId = entryId;
        const entry = this.timeEntries.find(e => e.id === entryId);
        if (!entry) return;

        // Populate activity selector
        const activitySelect = document.getElementById('entryEditActivity');
        activitySelect.innerHTML = '';
        this.activities.forEach(a => {
            const opt = document.createElement('option');
            opt.value = a.id;
            opt.textContent = a.name;
            if (a.id === entry.activityId) opt.selected = true;
            activitySelect.appendChild(opt);
        });

        const startDate = new Date(entry.startTimestamp);
        const endDate = new Date(entry.endTimestamp);

        document.getElementById('entryEditDate').value = this.toDateString(startDate);
        document.getElementById('entryEditStart').value = this.toTimeString(startDate);
        document.getElementById('entryEditEnd').value = this.toTimeString(endDate);

        document.getElementById('entryEditActivity').value = entry.activityId;

        document.getElementById('entryConflictWarning').style.display = 'none';

        document.getElementById('entryEditModal').classList.add('active');
    }

    closeEntryEditModal() {
        document.getElementById('entryEditModal').classList.remove('active');
        this.editingEntryId = null;
    }

    async saveTimeEntry() {
        const entry = this.timeEntries.find(e => e.id === this.editingEntryId);
        if (!entry) return;

        const date = document.getElementById('entryEditDate').value;
        const startTime = document.getElementById('entryEditStart').value;
        const endTime = document.getElementById('entryEditEnd').value;
        const activityId = document.getElementById('entryEditActivity').value;

        if (!date || !startTime || !endTime) {
            this.showToast(this.t('pleaseFillAllFields'));
            return;
        }

        const start = new Date(`${date}T${startTime}`).getTime();
        const end = new Date(`${date}T${endTime}`).getTime();

        if (start >= end) {
            this.showToast(this.t('startBeforeEnd'));
            return;
        }

        // Check for conflicts
        const hasConflict = this.timeEntries.some(e => {
            if (e.id === entry.id || e.endTimestamp === null) return false;
            return !(end <= e.startTimestamp || start >= e.endTimestamp);
        });

        if (hasConflict) {
            document.getElementById('entryConflictWarning').style.display = 'block';
            return;
        }

        entry.startTimestamp = start;
        entry.endTimestamp = end;
        entry.activityId = activityId;
        entry.updatedAt = Date.now();

        const activity = this.activities.find(a => a.id === activityId);
        if (activity) {
            entry.activityNameSnapshot = activity.name;
        }

        await this.storage.saveTimeEntry(entry);
        this.closeEntryEditModal();
        this.renderLog();
    }

    async deleteTimeEntry() {
        if (this.confirmDelete && !confirm(this.t('deleteConfirm'))) {
            return;
        }

        const entry = this.timeEntries.find(e => e.id === this.editingEntryId);
        if (entry) {
            this.deletedEntry = entry;
            this.timeEntries = this.timeEntries.filter(e => e.id !== entry.id);
            await this.storage.deleteTimeEntry(entry.id);
            this.closeEntryEditModal();
            this.renderLog();

            // Show undo option
            this.showToast(`${this.t('deleted')} - ${this.t('undo')}`, 5000, () => this.undoDeleteEntry());
        }
    }

    async undoDeleteEntry() {
        if (this.deletedEntry) {
            this.timeEntries.push(this.deletedEntry);
            await this.storage.saveTimeEntry(this.deletedEntry);
            this.deletedEntry = null;
            this.renderLog();
        }
    }

    renderSettings() {
        document.getElementById('themeSelect').value = this.currentTheme;
        document.getElementById('languageSelect').value = this.currentLanguage;
        document.getElementById('timeFormatSelect').value = this.timeFormat;
        document.getElementById('firstDaySelect').value = this.firstDayOfWeek;
        document.getElementById('confirmDeleteCheckbox').checked = this.confirmDelete;
        const notificationSelect =
            document.getElementById('notificationIntervalSelect');

        const notificationCustom =
            document.getElementById('notificationCustomMinutes');

        if (notificationSelect) {
            const values = ['0', '5', '10', '20', '30', '60'];
            notificationSelect.value =
                values.includes(String(this.notificationInterval))
                    ? String(this.notificationInterval)
                    : 'custom';
        }

        if (notificationCustom) {
            notificationCustom.value =
                this.notificationCustomMinutes || 20;
            notificationCustom.style.display =
                notificationSelect?.value === 'custom'
                    ? 'block'
                    : 'none';
        }

        this.updateNotificationStatus();
    }

    populateActivityFilter() {
        const select = document.getElementById('logActivityFilter');
        const current = select.value;
        select.innerHTML = `<option value="">${this.t('allActivities')}</option>`;
        this.activities.forEach(a => {
            const opt = document.createElement('option');
            opt.value = a.id;
            opt.textContent = a.name;
            select.appendChild(opt);
        });
        select.value = current;
    }

    async copyLog() {
        const logText = this.getLogAsText();
        try {
            await navigator.clipboard.writeText(logText);
            this.showToast(this.t('copied'));
        } catch (err) {
            this.showToast(this.t('failedToCopy'));
        }
    }

    async shareLog() {
        const logText = this.getLogAsText();
        if (navigator.share) {
            try {
                await navigator.share({
                    title: this.t('timeLog'),
                    text: logText
                });
            } catch (err) {
                console.log('Share failed:', err);
            }
        } else {
            this.copyLog();
        }
    }

    exportLog(format) {
        const entries = [...this.timeEntries].filter(e => e.endTimestamp !== null).sort((a, b) => a.startTimestamp - b.startTimestamp);
        let content = '';
        let filename = `${this.t('logFilename')}_${Date.now()}`;

        if (format === 'txt') {
            content = this.getLogAsText();
            filename += '.txt';
        } else if (format === 'csv') {
            content = this.getLogAsCSV();
            filename += '.csv';
        } else if (format === 'json') {
            content = JSON.stringify(entries, null, 2);
            filename += '.json';
        }

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showToast(this.t('exportedAs', { format: format.toUpperCase() }));
    }

    getLogAsText() {
        const entries = [...this.timeEntries].filter(e => e.endTimestamp !== null).sort((a, b) => a.startTimestamp - b.startTimestamp);
        
        let text = '';
        const byDay = new Map();
        entries.forEach(entry => {
            const date = this.toDateString(new Date(entry.startTimestamp));
            if (!byDay.has(date)) byDay.set(date, []);
            byDay.get(date).push(entry);
        });

        for (const [date, dayEntries] of [...byDay.entries()].sort(([a], [b]) => a.localeCompare(b))) {
            const dayTotal = dayEntries.reduce((sum, e) => sum + (e.endTimestamp - e.startTimestamp), 0);
            text += `\n${this.getDateString(new Date(`${date}T00:00:00`).getTime())}\n`;
            text += `${this.t('textLogTotal')}: ${this.formatDuration(dayTotal)}\n\n`;

            dayEntries.forEach(entry => {
                const start = this.formatDateTime(entry.startTimestamp);
                const end = this.formatDateTime(entry.endTimestamp);
                const duration = this.formatDuration(entry.endTimestamp - entry.startTimestamp);
                text += `${start} – ${end} | ${entry.activityNameSnapshot} | ${duration}\n`;
            });
        }

        return text;
    }

    getLogAsCSV() {
        const entries = [...this.timeEntries].filter(e => e.endTimestamp !== null).sort((a, b) => a.startTimestamp - b.startTimestamp);
        
        const csvCell = value => `"${String(value ?? '').replace(/"/g, '""')}"`;
        let csv = [
            this.t('date'), this.t('startTime'), this.t('endTime'),
            this.t('activity'), this.t('duration')
        ].map(csvCell).join(',') + '\n';
        entries.forEach(entry => {
            const date = this.getDateString(entry.startTimestamp);
            const start = this.formatTime(entry.startTimestamp);
            const end = this.formatTime(entry.endTimestamp);
            const duration = this.formatDuration(entry.endTimestamp - entry.startTimestamp);
            csv += [date, start, end, entry.activityNameSnapshot, duration].map(csvCell).join(',') + '\n';
        });

        return csv;
    }

    async backupData() {
        try {
            const data = await this.storage.exportAll();
            const json = JSON.stringify(data, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${this.t('backupFilename')}_${Date.now()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            this.showToast(this.t('backupSuccess'));
        } catch (error) {
            this.showToast(this.t('backupFailed'));
            console.error(error);
        }
    }

    async restoreData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = async (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    
                    const merge = confirm(this.t('mergeExistingData'));
                    
                    await this.storage.importAll(data, merge);
                    
                    await this.loadActivities();
                    await this.loadTimeEntries();
                    this.renderAll();
                    
                    this.showToast(this.t('restoreSuccess'));
                } catch (error) {
                    this.showToast(this.t('restoreFailed'));
                    console.error(error);
                }
            };
            reader.readAsText(file);
        });
        input.click();
    }

    async loadDemoData() {
        const now = Date.now();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const demoActivities = [
            { name: this.t('demoMasking'), color: '#E74C3C', shape: 'square' },
            { name: this.t('demoPainting'), color: '#3498DB', shape: 'circle' },
            { name: this.t('demoWallpapering'), color: '#9B59B6', shape: 'rounded' },
            { name: this.t('demoUnloading'), color: '#E67E22', shape: 'square' },
            { name: this.t('demoTravel'), color: '#27AE60', shape: 'square' },
            { name: this.t('demoBreak'), color: '#95A5A6', shape: 'oval' }
        ];

        // Clear existing
        this.activities = [];
        this.timeEntries = [];
        
        const txAct = this.storage.db.transaction(['activities'], 'readwrite');
        const storeAct = txAct.objectStore('activities');
        await new Promise((resolve, reject) => {
            const request = storeAct.clear();
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });

        const txEntry = this.storage.db.transaction(['timeEntries'], 'readwrite');
        const storeEntry = txEntry.objectStore('timeEntries');
        await new Promise((resolve, reject) => {
            const request = storeEntry.clear();
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });

        // Create demo activities
        for (let i = 0; i < demoActivities.length; i++) {
            const act = demoActivities[i];
            const activity = {
                id: this.generateId(),
                name: act.name,
                color: act.color,
                shape: act.shape || 'circle',
                size: 'medium',
                position: i,
                archived: false,
                createdAt: now,
                updatedAt: now
            };
            this.activities.push(activity);
            await this.storage.saveActivity(activity);
        }

        // Create demo entries
        let time = today.getTime() + (8 * 60 * 60 * 1000); // 08:00
        const durations = [77, 80, 65, 45, 90, 30]; // minutes

        for (let i = 0; i < 6; i++) {
            const entry = {
                id: this.generateId(),
                activityId: this.activities[i % this.activities.length].id,
                activityNameSnapshot: this.activities[i % this.activities.length].name,
                startTimestamp: time,
                endTimestamp: time + (durations[i] * 60 * 1000),
                createdAt: now,
                updatedAt: now
            };
            this.timeEntries.push(entry);
            await this.storage.saveTimeEntry(entry);
            time = entry.endTimestamp;
        }

        this.renderAll();
        this.showToast(this.t('demoDataLoaded'));
    }

    showOnboarding() {
        // This could be a modal, but for now we'll just suggest creating first activity
        // The + button is visible and ready to use
    }

    // Utility methods

    generateId() {
        return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    escapeHtml(value) {
        return String(value ?? '').replace(/[&<>"']/g, character => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        })[character]);
    }

    getActiveDuration() {
        const entry = this.timeEntries.find(e => e.activityId === this.activeActivityId && e.endTimestamp === null);
        if (!entry) return 0;
        return Date.now() - entry.startTimestamp;
    }

    formatDuration(ms) {
        const seconds = Math.floor(ms / 1000);
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    formatTime(timestamp) {
        const locale = { en: 'en-US', de: 'de-DE', ru: 'ru-RU' }[this.currentLanguage] || 'en-US';
        return new Intl.DateTimeFormat(locale, {
            hour: '2-digit', minute: '2-digit',
            hourCycle: this.timeFormat === '12h' ? 'h12' : 'h23'
        }).format(new Date(timestamp));
    }

    formatDateTime(timestamp) {
        const locale = { en: 'en-US', de: 'de-DE', ru: 'ru-RU' }[this.currentLanguage] || 'en-US';
        return new Intl.DateTimeFormat(locale, {
            dateStyle: 'short', timeStyle: 'medium',
            hourCycle: this.timeFormat === '12h' ? 'h12' : 'h23'
        }).format(new Date(timestamp));
    }

    getDateString(timestamp) {
        const locale = { en: 'en-US', de: 'de-DE', ru: 'ru-RU' }[this.currentLanguage] || 'en-US';
        return new Intl.DateTimeFormat(locale, {
            year: 'numeric', month: '2-digit', day: '2-digit'
        }).format(new Date(timestamp));
    }

    toDateString(date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    toTimeString(date) {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    getDateRange(type) {
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (type === 'today') {
            return [now.getTime(), tomorrow.getTime()];
        } else if (type === 'yesterday') {
            const yesterday = new Date(now);
            yesterday.setDate(yesterday.getDate() - 1);
            return [yesterday.getTime(), now.getTime()];
        } else if (type === 'range') {
            const from = new Date(document.getElementById('dateFrom').value || now);
            from.setHours(0, 0, 0, 0);
            const to = new Date(document.getElementById('dateTo').value || tomorrow);
            to.setHours(23, 59, 59, 999);
            return [from.getTime(), to.getTime()];
        } else {
            return [0, Date.now() + (24 * 60 * 60 * 1000)];
        }
    }

    updateLogView() {
        const rangeFilter = document.getElementById('logDateFilter').value;
        if (rangeFilter === 'range') {
            document.getElementById('dateRangeFilter').style.display = 'grid';
        } else {
            document.getElementById('dateRangeFilter').style.display = 'none';
        }
        this.renderLog();
    }

    showToast(message, duration = 3000, action = null) {
        const toast = document.getElementById('toast');
        if (this.toastTimeout) clearTimeout(this.toastTimeout);
        toast.textContent = message;
        toast.classList.add('show');

        if (action) {
            const btn = document.createElement('button');
            btn.textContent = this.t('undo');
            btn.style.marginLeft = '8px';
            btn.style.background = 'none';
            btn.style.border = 'none';
            btn.style.color = 'inherit';
            btn.style.cursor = 'pointer';
            btn.style.textDecoration = 'underline';
            btn.addEventListener('click', action);
            toast.appendChild(btn);
        }

        this.toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
            toast.replaceChildren();
            this.toastTimeout = null;
        }, duration);
    }

    clearToast() {
        const toast = document.getElementById('toast');
        if (this.toastTimeout) clearTimeout(this.toastTimeout);
        this.toastTimeout = null;
        if (!toast) return;
        toast.classList.remove('show');
        toast.replaceChildren();
    }
}

// Initialize app
window.addEventListener('load', async () => {
    const app = new TimerHubApp();
    await app.init();
    window.timerHubApp = app; // For debugging
});
