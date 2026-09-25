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
        exportData: 'Export',
        importData: 'Import',
        version: 'Version',
        dataStoredLocally: 'Data stored locally',
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
        firstDayOfWeek: 'Erste Wochentag',
        confirmDelete: 'Vor dem Löschen bestätigen',
        backupData: 'Daten sichern',
        restoreData: 'Daten wiederherstellen',
        exportData: 'Exportieren',
        importData: 'Importieren',
        version: 'Version',
        dataStoredLocally: 'Daten werden lokal gespeichert',
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
        createActivity: 'Создать деятельность',
        editActivity: 'Редактировать деятельность',
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
        allActivities: 'Все деятельности',
        copied: 'Скопировано в буфер обмена',
        total: 'Всего',
        settings: 'Настройки',
        theme: 'Тема',
        language: 'Язык',
        timeFormat: 'Формат времени',
        firstDayOfWeek: 'Первый день недели',
        confirmDelete: 'Подтверждать перед удалением',
        backupData: 'Резервная копия',
        restoreData: 'Восстановить данные',
        exportData: 'Экспортировать',
        importData: 'Импортировать',
        version: 'Версия',
        dataStoredLocally: 'Данные хранятся локально',
        noEntries: 'Записи не найдены',
        since: 'с',
        deleteEntry: 'Удалить запись',
        editEntry: 'Редактировать запись',
        startTime: 'Время начала',
        endTime: 'Время окончания',
        date: 'Дата',
        activity: 'Деятельность',
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
            { id: 'circle', label: '●', svg: 'M 50 50 C 50 77.6 27.6 100 0 100 C -27.6 100 -50 77.6 -50 50 C -50 22.4 -27.6 0 0 0 C 27.6 0 50 22.4 50 50' },
            { id: 'square', label: '■', svg: 'M -50 -50 L 50 -50 L 50 50 L -50 50 Z' },
            { id: 'rounded', label: '▬', svg: 'M -50 -30 L 50 -30 Q 50 -50 30 -50 L -30 -50 Q -50 -50 -50 -30 L -50 30 Q -50 50 -30 50 L 30 50 Q 50 50 50 30 L 50 -30 Z' },
            { id: 'diamond', label: '◆', svg: 'M 0 -50 L 50 0 L 0 50 L -50 0 Z' },
            { id: 'triangle', label: '▲', svg: 'M 0 -50 L 50 50 L -50 50 Z' },
            { id: 'hexagon', label: '⬡', svg: 'M 0 -50 L 43.3 -25 L 43.3 25 L 0 50 L -43.3 25 L -43.3 -25 Z' },
            { id: 'octagon', label: '⬢', svg: 'M -29.29 -50 L 29.29 -50 L 50 -29.29 L 50 29.29 L 29.29 50 L -29.29 50 L -50 29.29 L -50 -29.29 Z' },
            { id: 'star', label: '★', svg: 'M 0 -50 L 15 -20 L 50 -20 L 25 5 L 40 40 L 0 15 L -40 40 L -25 5 L -50 -20 L -15 -20 Z' },
            { id: 'heart', label: '♥', svg: 'M 0 10 C -30 -20 -50 -10 -50 -20 C -50 -40 -30 -50 -15 -50 C 0 -60 15 -50 15 -50 C 30 -50 50 -40 50 -20 C 50 -10 30 -20 0 10' },
            { id: 'oval', label: '⬭', svg: 'M -50 0 A 50 30 0 0 1 50 0 A 50 30 0 0 1 -50 0' }
        ];
    }

    isDevMode() {
        return window.location.hostname === 'localhost' || 
               window.location.hostname === '127.0.0.1' ||
               window.location.hostname === '';
    }

    t(key) {
        return translations[this.currentLanguage]?.[key] || translations.en[key] || key;
    }

    async init() {
        try {
            await this.storage.init();
            await this.loadSettings();
            await this.loadActivities();
            await this.loadTimeEntries();
            this.setupUI();
            this.applyTheme();
            this.startUIUpdateLoop();
            this.renderMain();

            // Show initial onboarding if no activities
            if (this.activities.length === 0) {
                this.showOnboarding();
            }
        } catch (error) {
            console.error('Init error:', error);
            alert(
                'TimerHub initialization error:\n\n' +
                (error?.stack || error?.message || String(error))
            );
        }
    }

    async loadSettings() {
        this.currentLanguage = await this.storage.getSetting('language', 'en');
        this.currentTheme = await this.storage.getSetting('theme', 'system');
        this.timeFormat = await this.storage.getSetting('timeFormat', '24h');
        this.firstDayOfWeek = await this.storage.getSetting('firstDayOfWeek', 1);
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

        sel('languageSelect')?.addEventListener('change', (e) => {
            this.currentLanguage = e.target.value;
            this.storage.setSetting('language', this.currentLanguage);
            this.renderAll();
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
        });

        sel('notificationEnableBtn')?.addEventListener('click', async () => {
            const status = document.getElementById('notificationStatus');
            if (status) status.textContent = 'CLICK RECEIVED';
            console.log('TimerHub: notification button clicked');

            try {
                await this.requestNotificationPermission();
            } catch (error) {
                console.error('TimerHub notification error:', error);
                if (status) {
                    status.textContent = 'ERROR: ' + error.message;
                }
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
            btn.setAttribute('aria-label', color);
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
        customBtn.title = this.t('customColor') || 'Custom color';
        customBtn.setAttribute('aria-label', customBtn.title);

        const customInput = document.createElement('input');
        customInput.type = 'color';
        customInput.id = 'customColorInput';
        customInput.className = 'custom-color-input';
        customInput.value = '#4A90E2';

        customBtn.addEventListener('click', () => customInput.click());
        customInput.addEventListener('input', () => {
            customBtn.style.backgroundColor = customInput.value;
            customBtn.style.backgroundImage = 'none';
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
        if (rgb.startsWith('#')) return rgb;
        const nums = rgb.match(/\d+/g);
        if (!nums) return '#000000';
        return '#' + nums.slice(0, 3).map(n => Number(n).toString(16).padStart(2, '0')).join('');
    }

    populateShapePicker() {
        const picker = document.getElementById('shapePicker');
        this.SHAPES.forEach(shape => {
            const btn = document.createElement('button');
            btn.className = 'shape-option';
            btn.textContent = shape.label;
            btn.dataset.shape = shape.id;
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
        this.renderMain();
        this.renderLog();
        this.renderSettings();
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
            btn.style.backgroundColor = activity.color;

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
        let clientId = localStorage.getItem(timerhubPushClientId);

        if (!clientId) {
            clientId = crypto.randomUUID
                ? crypto.randomUUID().replace(/-/g, )
                : Date.now().toString(36) +
                  Math.random().toString(36).slice(2) +
                  Math.random().toString(36).slice(2);

            localStorage.setItem(
                timerhubPushClientId,
                clientId
            );
        }

        return clientId;
    }

    urlBase64ToUint8Array(base64String) {
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

        return outputArray;
    }

    async registerBackgroundPush() {
        if (
            !("serviceWorker" in navigator) ||
            !("PushManager" in window)
        ) {
            throw new Error(
                "Background Push is not supported by this browser."
            );
        }

        const configResponse =
            await fetch("/api/push/config");

        if (!configResponse.ok) {
            throw new Error(
                "Could not load Push configuration."
            );
        }

        const config = await configResponse.json();

        if (!config.publicKey) {
            throw new Error(
                "Push public key is missing."
            );
        }

        const registration =
            await navigator.serviceWorker.ready;

        let subscription =
            await registration.pushManager.getSubscription();

        if (!subscription) {
            subscription =
                await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey:
                        this.urlBase64ToUint8Array(
                            config.publicKey
                        )
                });
        }

        const response = await fetch(
            "/api/push/subscribe?clientId=" +
            encodeURIComponent(
                this.getPushClientId()
            ),
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(subscription)
            }
        );

        if (!response.ok) {
            throw new Error(
                "Could not save Push subscription: " +
                await response.text()
            );
        }

        return subscription;
    }

    async updateNotificationStatus() {
        const status = document.getElementById('notificationStatus');
        const button = document.getElementById('notificationEnableBtn');

        if (!status || !button) return;

        if (this.notificationInterval === 0) {
            status.textContent = 'Notifications are off.';
            button.textContent = 'Enable notifications';
            return;
        }

        if (!('Notification' in window)) {
            status.textContent =
                'Notifications are not supported by this browser.';
            return;
        }

        if (Notification.permission === 'granted') {
            status.textContent =
                `Permission granted. Interval: ${this.notificationInterval} min.`;
            button.textContent = 'Notifications enabled';
        } else if (Notification.permission === 'denied') {
            status.textContent =
                'Notifications are blocked in browser settings.';
            button.textContent = 'Notifications blocked';
        } else {
            status.textContent =
                `Interval: ${this.notificationInterval} min.`;
            button.textContent = 'Enable notifications';
        }
    }

    async requestNotificationPermission() {
        if (!("Notification" in window)) {
            alert("This browser does not support notifications.");
            return;
        }

        if (!("serviceWorker" in navigator)) {
            alert("Service Worker is not supported.");
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
                        body: "Notifications are enabled.",
                        tag: "timerhub-test",
                        renotify: true,
                        vibrate: [200, 100, 200]
                    }
                );

                try {
                    await this.registerBackgroundPush();

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
                        status.textContent =
                            "Notifications enabled, but Background Push setup failed: " +
                            pushError.message;
                    }
                }
            }

            this.updateNotificationStatus();
        } catch (error) {
            console.error(
                "Notification permission error:",
                error
            );
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
                    const clientId = this.getPushClientId();
                    await fetch(`/api/push/cancel?clientId=${encodeURIComponent(clientId)}`, {
                        method: "POST"
                    });
                } catch (error) {
                    console.error("TimerHub server alarm cancel error:", error);
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
                        const clientId = this.getPushClientId();
                        await fetch(`/api/push/cancel?clientId=${encodeURIComponent(clientId)}`, {
                            method: "POST"
                        });
                    } catch (error) {
                        console.error("TimerHub server alarm cancel error:", error);
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

                // Schedule recurring background notifications on the server.
                const intervalMinutes = Number(this.notificationInterval);

                if (
                    intervalMinutes > 0 &&
                    "Notification" in window &&
                    Notification.permission === "granted"
                ) {
                    try {
                        const clientId = this.getPushClientId();
                        const intervalMs = intervalMinutes * 60 * 1000;
                        const alarmId = activityId + "-" + now;

                        await fetch(
                            `/api/push/schedule?clientId=${encodeURIComponent(clientId)}`,
                            {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    alarmId,
                                    timestamp: now + intervalMs,
                                    intervalMs,
                                    title: "TimerHub",
                                    body: `Timer is still running: ${activity.name}`,
                                    tag: "timerhub-timer"
                                })
                            }
                        );
                    } catch (error) {
                        console.error("TimerHub server alarm error:", error);
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
            title.textContent = this.t('editActivity');
            document.getElementById('activityName').value = activity.name;

            // Select color
            document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
            const colorOpt = Array.from(document.querySelectorAll('.color-option:not(.color-option-custom)'))
                .find(opt => opt.style.backgroundColor === activity.color);
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
            }
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
            this.showToast('Please enter a name');
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
            if (e.endTimestamp) {
                const end = new Date(e.endTimestamp);
                const hasOverlapStart = date >= dateRange[0] && date < dateRange[1];
                const hasOverlapEnd = end > dateRange[0] && end <= dateRange[1];
                return hasOverlapStart || hasOverlapEnd;
            }
            return date >= dateRange[0] && date < dateRange[1];
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
        const byDay = {};
        entries.forEach(entry => {
            const date = this.getDateString(entry.startTimestamp);
            if (!byDay[date]) byDay[date] = [];
            byDay[date].push(entry);
        });

        let html = '';
        for (const [date, dayEntries] of Object.entries(byDay).sort().reverse()) {
            const dayTotal = dayEntries.reduce((sum, e) => sum + (e.endTimestamp - e.startTimestamp), 0);
            const activityTotals = {};
            
            dayEntries.forEach(e => {
                if (!activityTotals[e.activityId]) activityTotals[e.activityId] = 0;
                activityTotals[e.activityId] += (e.endTimestamp - e.startTimestamp);
            });

            html += `<div class="log-day">
                <div class="log-day-header">${date}</div>
                <div class="log-day-stats">
                    <div class="log-day-total">${this.t('total')}: ${this.formatDuration(dayTotal)}</div>
                    ${Object.entries(activityTotals).map(([actId, total]) => {
                        const act = this.activities.find(a => a.id === actId);
                        const snapshot = dayEntries.find(e => e.activityId === actId)?.activityNameSnapshot;
                        return `<div class="log-activity-stat">${snapshot} — ${this.formatDuration(total)}</div>`;
                    }).join('')}
                </div>`;

            dayEntries.forEach(entry => {
                const snapshot = entry.activityNameSnapshot;
                const duration = entry.endTimestamp - entry.startTimestamp;
                const start = this.formatDateTime(entry.startTimestamp);
                const end = this.formatDateTime(entry.endTimestamp);

                html += `<div class="log-entry" data-entry-id="${entry.id}">
                    <div class="log-entry-time">${start} – ${end}</div>
                    <div class="log-entry-activity">${snapshot}</div>
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
            this.showToast('Please fill all fields');
            return;
        }

        const start = new Date(`${date}T${startTime}`).getTime();
        const end = new Date(`${date}T${endTime}`).getTime();

        if (start >= end) {
            this.showToast('Start time must be before end time');
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
            this.showToast('Failed to copy');
        }
    }

    async shareLog() {
        const logText = this.getLogAsText();
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Time Log',
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
        let filename = `timelog_${Date.now()}`;

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

        this.showToast(`Exported as ${format.toUpperCase()}`);
    }

    getLogAsText() {
        const entries = [...this.timeEntries].filter(e => e.endTimestamp !== null).sort((a, b) => a.startTimestamp - b.startTimestamp);
        
        let text = '';
        const byDay = {};
        entries.forEach(entry => {
            const date = this.getDateString(entry.startTimestamp);
            if (!byDay[date]) byDay[date] = [];
            byDay[date].push(entry);
        });

        for (const [date, dayEntries] of Object.entries(byDay).sort()) {
            const dayTotal = dayEntries.reduce((sum, e) => sum + (e.endTimestamp - e.startTimestamp), 0);
            text += `\n${date}\n`;
            text += `Total: ${this.formatDuration(dayTotal)}\n\n`;

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
        
        let csv = 'Date,Start Time,End Time,Activity,Duration\n';
        entries.forEach(entry => {
            const date = this.getDateString(entry.startTimestamp);
            const start = this.formatDateTime(entry.startTimestamp).split(' ')[1];
            const end = this.formatDateTime(entry.endTimestamp).split(' ')[1];
            const duration = this.formatDuration(entry.endTimestamp - entry.startTimestamp);
            csv += `"${date}","${start}","${end}","${entry.activityNameSnapshot}","${duration}"\n`;
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
            a.download = `timerhub_backup_${Date.now()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            this.showToast(this.t('backupSuccess'));
        } catch (error) {
            this.showToast('Backup failed');
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
                    
                    const merge = confirm('Merge with existing data? (Cancel to replace)');
                    
                    await this.storage.importAll(data, merge);
                    
                    await this.loadActivities();
                    await this.loadTimeEntries();
                    this.renderAll();
                    
                    this.showToast(this.t('restoreSuccess'));
                } catch (error) {
                    this.showToast('Restore failed');
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
            { name: 'Abkleben', color: '#E74C3C', shape: 'square' },
            { name: 'Malen', color: '#3498DB', shape: 'circle' },
            { name: 'Tapezieren', color: '#9B59B6', shape: 'rounded' },
            { name: 'Entladen', color: '#E67E22', shape: 'square' },
            { name: 'Anfahrt', color: '#27AE60', shape: 'rectangle' },
            { name: 'Pause', color: '#95A5A6', shape: 'oval' }
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
        this.showToast('Demo data loaded');
    }

    showOnboarding() {
        // This could be a modal, but for now we'll just suggest creating first activity
        // The + button is visible and ready to use
    }

    // Utility methods

    generateId() {
        return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
        const date = new Date(timestamp);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    formatDateTime(timestamp) {
        const date = new Date(timestamp);
        const dateStr = this.getDateString(timestamp);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${dateStr} ${hours}:${minutes}:${seconds}`;
    }

    getDateString(timestamp) {
        const date = new Date(timestamp);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
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

        setTimeout(() => {
            toast.classList.remove('show');
        }, duration);
    }
}

// Initialize app
window.addEventListener('load', async () => {
    const app = new TimerHubApp();
    await app.init();
    window.timerHubApp = app; // For debugging
});
