// ============================================================================
// TIMERHUB - Time Tracking Application
// Vanilla JavaScript - No frameworks, no external dependencies
// ============================================================================

// ============================================================================
// TRANSLATIONS
// ============================================================================

const translations = {
    en: {
        timerRunning: 'Timer running',
        timerStatusRunning: 'Timer running: {activity} · {duration}',
        timerSaving: 'Saving timer…', timerSaveFailed: 'Could not save the timer. Check device storage and try again.',
        activityStartHint: 'Tap to start or switch', activityStopHint: 'Tap to stop',
        activityStartAria: 'Start or switch to {activity}', activityStopAria: 'Stop timing {activity}',
        activityCanvas: 'Activity canvas',
        activityResize: 'Resize {activity}', canvasLayoutSaveFailed: 'Could not save this activity position. Try again.',
        noActivitiesTitle: 'No activities yet', noActivitiesMessage: 'Add an activity to start tracking your work.',
        appName: 'TimerHub',
        loadingApp: 'Loading TimerHub…', reloadApp: 'Reload TimerHub',
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
        backupData: 'Create backup',
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
        backupSuccess: 'Backup file created successfully',
        small: 'Small',
        medium: 'Medium',
        large: 'Large',
    },
    de: {
        timerRunning: 'Timer läuft',
        timerStatusRunning: 'Timer läuft: {activity} · {duration}',
        timerSaving: 'Timer wird gespeichert…', timerSaveFailed: 'Timer konnte nicht gespeichert werden. Prüfe den Gerätespeicher und versuche es erneut.',
        activityStartHint: 'Tippen zum Starten oder Wechseln', activityStopHint: 'Tippen zum Stoppen',
        activityStartAria: '{activity} starten oder dorthin wechseln', activityStopAria: 'Zeit für {activity} stoppen',
        activityCanvas: 'Aktivitätsfläche',
        activityResize: 'Größe von {activity} ändern', canvasLayoutSaveFailed: 'Position konnte nicht gespeichert werden. Bitte erneut versuchen.',
        noActivitiesTitle: 'Noch keine Aktivitäten', noActivitiesMessage: 'Füge eine Aktivität hinzu, um deine Arbeit zu erfassen.',
        appName: 'TimerHub',
        loadingApp: 'TimerHub wird geladen…', reloadApp: 'TimerHub neu laden',
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
        backupData: 'Sicherung erstellen',
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
        backupSuccess: 'Sicherungsdatei wurde erstellt',
        small: 'Klein',
        medium: 'Mittel',
        large: 'Groß',
    },
    ru: {
        timerRunning: 'Таймер запущен',
        timerStatusRunning: 'Таймер работает: {activity} · {duration}',
        timerSaving: 'Сохранение таймера…', timerSaveFailed: 'Не удалось сохранить таймер. Проверьте память устройства и попробуйте снова.',
        activityStartHint: 'Нажмите, чтобы начать или переключить', activityStopHint: 'Нажмите, чтобы остановить',
        activityStartAria: 'Начать или переключиться на «{activity}»', activityStopAria: 'Остановить отсчёт для «{activity}»',
        activityCanvas: 'Поле занятий',
        activityResize: 'Изменить размер: {activity}', canvasLayoutSaveFailed: 'Не удалось сохранить расположение занятия. Попробуйте ещё раз.',
        noActivitiesTitle: 'Занятий пока нет', noActivitiesMessage: 'Добавьте занятие, чтобы начать учёт времени.',
        appName: 'TimerHub',
        loadingApp: 'Загрузка TimerHub…', reloadApp: 'Перезагрузить TimerHub',
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
        backupData: 'Создать резервную копию',
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
        backupSuccess: 'Файл резервной копии создан',
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
        timerScreen: 'Timer',
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
        exportedAs: 'Exported as {format}', backupFailed: 'Could not create the backup file. Try again.', restoreFailed: 'Could not restore this backup. Your current data was kept.',
        demoDataLoaded: 'Demo data loaded',
        backupSectionTitle: 'Backups and restore', manualBackupTitle: 'Manual backup file',
        appearanceSettings: 'Appearance and regional settings', timerAndNotifications: 'Timer and notifications',
        confirmationsSettings: 'Confirmations', connectionSection: 'Connection',
        entryDefaultsSection: 'Entry defaults', dangerousActions: 'Dangerous actions',
        clockodoDefaultsHelp: 'Customer, project, and service values are used when creating entries. They are not needed to check the connection.',
        manualBackupDescription: 'Create a file you can save or move to another device.',
        backupCredentialNote: 'Clockodo credentials, including the API key, are never included.',
        automaticSnapshotsTitle: 'Automatic local snapshots',
        automaticSnapshotsDescription: 'TimerHub keeps the 20 most recent safety snapshots on this device after saved changes.',
        automaticSnapshotsNone: 'No automatic snapshots yet.',
        automaticSnapshotsLatest: 'Latest local snapshot: {date}',
        automaticSnapshotsFailed: 'A local snapshot could not be saved. Your change was still saved.',
        selectSnapshot: 'Choose a local snapshot', restoreFromFile: 'Restore from backup file',
        restoreSnapshot: 'Restore selected snapshot', invalidBackup: 'This file is not a valid TimerHub backup.',
        restoreConfirmTitle: 'Restore TimerHub data?',
        restoreConfirmDesc: 'Choose whether to merge this backup with current data or replace current data. Clockodo credentials are not included.',
        restoreMergeAction: 'Merge data', restoreReplaceAction: 'Replace current data',
        snapshotDateFormat: '{date}',
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
        endOfDayReview: 'End-of-Day Review', dayReview: 'Day Review',
        reviewDate: 'Review date', previousDay: 'Previous day', nextDay: 'Next day',
        reviewAndSync: 'Review & Sync', addEntry: 'Add Entry',
        noEntriesForDay: 'No time entries recorded for this day.',
        totalTrackedTime: 'Total Tracked Time', entriesCount: '{count} entries', gap: 'Gap',
        syncedCount: '{count} synced', unsyncedCount: '{count} unsynced',
        statusSynced: 'Synced', statusLocal: 'Local only', statusConfirmed: 'Confirmed',
        statusPending: 'Pending', statusSyncing: 'Syncing...', statusFailed: 'Sync failed',
        statusUnknown: 'Outcome unknown',
        statusLocalOnly: 'Local edit; Clockodo unchanged',
        syncLocalOnlyNotice: 'This entry already exists in Clockodo. The confirmed local edit was kept in TimerHub; Clockodo was not changed.',
        syncLocalOnlyToast: '{count} confirmed local edit(s) were kept in TimerHub. Existing Clockodo entries were left unchanged.',
        statusPartial: 'Partially synchronized',
        syncProgress: '{done} of {total} entries processed',
        syncOutcomeUnknown: 'Clockodo may have accepted this entry. Check Clockodo before attempting a manual resend.',
        confirmSyncDescLocal: 'Review {count} entries. Confirming saves them locally; configure Clockodo later to send.',
        clockodoBillable: 'Default billable status', clockodoBillableYes: 'Billable', clockodoBillableNo: 'Not billable',
        suspiciousNotice: '{count} entries require attention',
        issueRunning: 'Timer currently running',
        issueZeroDuration: 'Zero or negative duration',
        issueOverlapping: 'Overlaps with another entry',
        issueUnusuallyLong: 'Unusually long (>16h)',
        notes: 'Notes', project: 'Project', service: 'Service', endDate: 'End Date',
        entryTooLong: 'An entry cannot be longer than 24 hours.',
        confirmSyncTitle: 'Confirm Clockodo Synchronization',
        confirmSyncDesc: 'Review these {count} entries. Confirming saves a fixed local snapshot for Clockodo; nothing is sent yet.',
        confirmSyncBtn: 'Confirm & Send',
        confirmDayBtn: 'Confirm Day for Clockodo',
        dayReviewConfirmed: 'Day confirmed and saved for Clockodo synchronization.',
        dayReviewInvalid: 'Resolve incomplete or invalid entries before confirming this day.',
        confirmedEntryLocked: 'This entry is frozen in a confirmed Clockodo batch.',
        syncSummaryTotal: 'Total duration',
        alreadySyncedNotice: '{count} already synced entries will not be sent again',
        noEntriesToSync: 'No unsynced entries to synchronize.',
        clockodoSettings: 'Clockodo Integration',
        clockodoApiKey: 'Clockodo API Key',
        clockodoApiUser: 'Clockodo Email',
        clockodoCustomerId: 'Default Customer ID',
        clockodoProjectId: 'Default Project ID',
        clockodoServiceId: 'Default Service ID',
        clockodoSaveConfig: 'Save Clockodo Settings',
        clockodoConfigSaved: 'Clockodo settings saved',
        clockodoConfigMissing: 'Please configure Clockodo API key and email in Settings.',
        clockodoSecurityNote: 'The API key is encrypted in TimerHub Cloudflare storage and is never saved in this browser. A local access token protects this device connection.',
        clockodoApiKeyPlaceholder: 'Enter key to set or replace',
        clockodoEmailPlaceholder: 'name@example.com',
        clockodoTestConnection: 'Check connection',
        clockodoRemoveConfig: 'Remove Clockodo configuration',
        clockodoConnectionStatus: 'Connection status',
        clockodoStatusNotConfigured: 'Credentials not configured',
        clockodoStatusConfigured: 'Credentials configured · connection not checked',
        clockodoStatusChecking: 'Checking connection…',
        clockodoStatusConnected: 'Connection successful',
        clockodoStatusFailed: 'Connection check failed',
        clockodoConfigRemoved: 'Clockodo configuration removed.',
        clockodoTestSuccess: 'Clockodo connection verified.',
        clockodoRequiredFields: 'Enter a valid Clockodo email and API key.',
        clockodoAssignmentMissing: 'Add a valid customer and service ID in Clockodo settings before syncing this entry.',
        clockodoNetworkError: 'Could not reach the TimerHub service. Check your connection and retry.',
        clockodoTimeout: 'Clockodo did not respond before the request timed out.',
        clockodoInvalidCredentials: 'Clockodo rejected these credentials. Check the email and API key.',
        clockodoRateLimited: 'Clockodo is receiving too many requests. Wait and retry.',
        clockodoServiceError: 'Clockodo is temporarily unavailable. Retry later.',
        clockodoRequestRejected: 'Clockodo rejected the request. Check your account permissions and try again.',
        clockodoResponseInvalid: 'Clockodo returned an unexpected response. Try again later.',
        clockodoRejectionDetail: 'Clockodo rejected the entry ({status}): {message}',
        clockodoRejectionMessage: 'Clockodo rejected the entry: {message}',
        clockodoRejectionStatus: 'Clockodo rejected the entry ({status}).',
        projectPlaceholder: 'Project name or ID', servicePlaceholder: 'Service name or ID', notesPlaceholder: 'Description of work done',
        customerIdPlaceholder: 'Clockodo customer ID', projectIdPlaceholder: 'Clockodo project ID', serviceIdPlaceholder: 'Clockodo service ID',
        clockodoAssignment: 'Clockodo assignment',
        clockodoCustomerSelectLabel: 'Clockodo customer',
        clockodoServiceSelectLabel: 'Clockodo service',
        clockodoAssignmentNone: 'No Clockodo assignment',
        clockodoAssignmentLoading: 'Loading Clockodo data…',
        clockodoAssignmentNotConfigured: 'Clockodo is not configured. Add credentials in Settings to choose a customer and service.',
        clockodoAssignmentLoadFailed: 'Could not load Clockodo customers and services.',
        clockodoAssignmentReload: 'Reload',
        clockodoAssignmentHelp: 'Type to search. Leave empty for no Clockodo assignment.',
        clockodoServiceNotAllowedForCustomer: 'The selected service is not allowed for this customer. Choose a valid service.',
        showSecret: 'Show', hideSecret: 'Hide',
        syncSuccessToast: 'Successfully synchronized {count} entries to Clockodo',
        syncPartialFailureToast: '{success} entries synced, {failed} failed. Failed entries can be retried.',
        syncFailedToast: 'Clockodo synchronization failed: {error}',
        retry: 'Retry',
        retryDiagnosticTitle: 'Retry failed',
        retryDiagnosticError: 'Error',
        retryDiagnosticStatus: 'Status',
        retryDiagnosticDetails: 'Details',
        retryDiagnosticUnavailable: 'The batch is not in a retryable state.',
        resendSyncNotice: 'These entries have already been synced to Clockodo. Do you really want to send them again? This can create duplicate Clockodo entries.',
        resendSyncBtn: 'Send again',
        createGroup: 'Create Group', createGroupFromSelection: 'Group selection ({count})',
        groupName: 'Group name', groupNamePlaceholder: 'e.g., Site A',
        groupDefaultName: 'Group {number}', groupCreated: 'Group "{name}" created',
        groupCreateFailed: 'Could not create the group. Try again.',
        selectActivitiesFirst: 'Select at least one activity first',
        collapseGroup: 'Collapse group', expandGroup: 'Expand group',
        collapseAllGroups: 'Collapse all', expandAllGroups: 'Expand all',
        duplicateGroup: 'Duplicate group', groupCopyName: '{name} (copy)',
        groupDuplicated: 'Group "{name}" duplicated',
        canvasToolbar: 'Canvas actions',
    },
    de: {
        activityFilter: 'Aktivitätsfilter',
        timerScreen: 'Timer',
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
        exportedAs: 'Als {format} exportiert', backupFailed: 'Sicherungsdatei konnte nicht erstellt werden. Versuche es erneut.', restoreFailed: 'Sicherung konnte nicht wiederhergestellt werden. Deine aktuellen Daten blieben erhalten.',
        demoDataLoaded: 'Demodaten geladen',
        backupSectionTitle: 'Sicherung und Wiederherstellung', manualBackupTitle: 'Manuelle Sicherungsdatei',
        appearanceSettings: 'Darstellung und Region', timerAndNotifications: 'Timer und Benachrichtigungen',
        confirmationsSettings: 'Bestätigungen', connectionSection: 'Verbindung',
        entryDefaultsSection: 'Vorgaben für Einträge', dangerousActions: 'Kritische Aktionen',
        clockodoDefaultsHelp: 'Kunde, Projekt und Leistung werden beim Erstellen von Einträgen verwendet. Für den Verbindungstest sind sie nicht erforderlich.',
        manualBackupDescription: 'Erstellt eine Datei, die du speichern oder auf ein anderes Gerät übertragen kannst.',
        backupCredentialNote: 'Clockodo-Zugangsdaten einschließlich API-Schlüssel werden niemals einbezogen.',
        automaticSnapshotsTitle: 'Automatische lokale Sicherungen',
        automaticSnapshotsDescription: 'TimerHub speichert nach Änderungen die 20 letzten Sicherungen auf diesem Gerät.',
        automaticSnapshotsNone: 'Noch keine automatischen Sicherungen vorhanden.',
        automaticSnapshotsLatest: 'Letzte lokale Sicherung: {date}',
        automaticSnapshotsFailed: 'Lokale Sicherung fehlgeschlagen. Deine Änderung wurde trotzdem gespeichert.',
        selectSnapshot: 'Lokale Sicherung auswählen', restoreFromFile: 'Aus Sicherungsdatei wiederherstellen',
        restoreSnapshot: 'Ausgewählte Sicherung wiederherstellen', invalidBackup: 'Diese Datei ist keine gültige TimerHub-Sicherung.',
        restoreConfirmTitle: 'TimerHub-Daten wiederherstellen?',
        restoreConfirmDesc: 'Wähle, ob du diese Sicherung mit den aktuellen Daten zusammenführen oder sie ersetzen möchtest. Clockodo-Zugangsdaten sind nicht enthalten.',
        restoreMergeAction: 'Daten zusammenführen', restoreReplaceAction: 'Aktuelle Daten ersetzen',
        snapshotDateFormat: '{date}',
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
        endOfDayReview: 'Tagesabschluss-Prüfung', dayReview: 'Tagesübersicht',
        reviewDate: 'Datum der Prüfung', previousDay: 'Vorheriger Tag', nextDay: 'Nächster Tag',
        reviewAndSync: 'Prüfen & Synchronisieren', addEntry: 'Eintrag hinzufügen',
        noEntriesForDay: 'Keine Zeiteinträge für diesen Tag aufgezeichnet.',
        totalTrackedTime: 'Gesamte erfasste Zeit', entriesCount: '{count} Einträge', gap: 'Lücke',
        syncedCount: '{count} synchronisiert', unsyncedCount: '{count} nicht synchronisiert',
        statusSynced: 'Synchronisiert', statusLocal: 'Nur lokal', statusConfirmed: 'Bestätigt',
        statusPending: 'Ausstehend', statusSyncing: 'Synchronisiere...', statusFailed: 'Fehlgeschlagen',
        statusUnknown: 'Ergebnis unklar',
        statusLocalOnly: 'Lokal geändert; Clockodo unverändert',
        syncLocalOnlyNotice: 'Dieser Eintrag existiert bereits in Clockodo. Die bestätigte lokale Änderung bleibt in TimerHub; Clockodo wurde nicht geändert.',
        syncLocalOnlyToast: '{count} bestätigte lokale Änderung(en) bleiben in TimerHub. Bestehende Clockodo-Einträge wurden nicht geändert.',
        statusPartial: 'Teilweise synchronisiert',
        syncProgress: '{done} von {total} Einträgen verarbeitet',
        syncOutcomeUnknown: 'Clockodo könnte den Eintrag angenommen haben. Prüfe Clockodo vor einem erneuten manuellen Versand.',
        confirmSyncDescLocal: 'Prüfe {count} Einträge. Die Bestätigung speichert sie lokal; Clockodo kann später konfiguriert werden.',
        clockodoBillable: 'Standard-Abrechenbarkeit', clockodoBillableYes: 'Abrechenbar', clockodoBillableNo: 'Nicht abrechenbar',
        suspiciousNotice: '{count} Einträge erfordern Aufmerksamkeit',
        issueRunning: 'Timer läuft noch',
        issueZeroDuration: 'Keine oder negative Dauer',
        issueOverlapping: 'Überlappt mit einem anderen Eintrag',
        issueUnusuallyLong: 'Ungewöhnlich lang (>16h)',
        notes: 'Notizen', project: 'Projekt', service: 'Leistung', endDate: 'Enddatum',
        entryTooLong: 'Ein Eintrag darf nicht länger als 24 Stunden sein.',
        confirmSyncTitle: 'Clockodo-Synchronisation bestätigen',
        confirmSyncDesc: 'Prüfe diese {count} Einträge. Die Bestätigung speichert einen festen lokalen Datensatz für Clockodo; es wird noch nichts gesendet.',
        confirmSyncBtn: 'Bestätigen & Senden',
        confirmDayBtn: 'Tag für Clockodo bestätigen',
        dayReviewConfirmed: 'Tag bestätigt und für die Clockodo-Synchronisierung gespeichert.',
        dayReviewInvalid: 'Unvollständige oder ungültige Einträge müssen vor der Bestätigung behoben werden.',
        confirmedEntryLocked: 'Dieser Eintrag ist in einem bestätigten Clockodo-Datensatz eingefroren.',
        syncSummaryTotal: 'Gesamtdauer',
        alreadySyncedNotice: '{count} bereits synchronisierte Einträge werden nicht erneut gesendet',
        noEntriesToSync: 'Keine ungesendeten Einträge zum Synchronisieren.',
        clockodoSettings: 'Clockodo-Integration',
        clockodoApiKey: 'Clockodo-API-Schlüssel',
        clockodoApiUser: 'Clockodo-E-Mail',
        clockodoCustomerId: 'Standard-Kunden-ID',
        clockodoProjectId: 'Standard-Projekt-ID',
        clockodoServiceId: 'Standard-Leistungs-ID',
        clockodoSaveConfig: 'Clockodo-Einstellungen speichern',
        clockodoConfigSaved: 'Clockodo-Einstellungen gespeichert',
        clockodoConfigMissing: 'Bitte Clockodo-API-Schlüssel und E-Mail in den Einstellungen konfigurieren.',
        clockodoSecurityNote: 'Der API-Schlüssel wird verschlüsselt in TimerHubs Cloudflare-Speicher abgelegt und nie in diesem Browser gespeichert. Ein lokales Zugriffstoken schützt die Geräteverbindung.',
        clockodoApiKeyPlaceholder: 'Schlüssel eingeben zum Speichern oder Ersetzen',
        clockodoEmailPlaceholder: 'name@beispiel.de',
        clockodoTestConnection: 'Verbindung prüfen',
        clockodoRemoveConfig: 'Clockodo-Konfiguration entfernen',
        clockodoConnectionStatus: 'Verbindungsstatus',
        clockodoStatusNotConfigured: 'Zugangsdaten nicht eingerichtet',
        clockodoStatusConfigured: 'Zugangsdaten eingerichtet · Verbindung nicht geprüft',
        clockodoStatusChecking: 'Verbindung wird geprüft …',
        clockodoStatusConnected: 'Verbindung erfolgreich',
        clockodoStatusFailed: 'Verbindungsprüfung fehlgeschlagen',
        clockodoConfigRemoved: 'Clockodo-Konfiguration entfernt.',
        clockodoTestSuccess: 'Clockodo-Verbindung bestätigt.',
        clockodoRequiredFields: 'Gib eine gültige Clockodo-E-Mail und einen API-Schlüssel ein.',
        clockodoAssignmentMissing: 'Füge vor der Synchronisierung eine gültige Kunden- und Leistungs-ID in den Clockodo-Einstellungen hinzu.',
        clockodoNetworkError: 'TimerHub ist nicht erreichbar. Prüfe die Verbindung und versuche es erneut.',
        clockodoTimeout: 'Clockodo hat vor Ablauf der Zeitüberschreitung nicht geantwortet.',
        clockodoInvalidCredentials: 'Clockodo hat die Zugangsdaten abgelehnt. Prüfe E-Mail und API-Schlüssel.',
        clockodoRateLimited: 'Clockodo erhält zu viele Anfragen. Warte kurz und versuche es erneut.',
        clockodoServiceError: 'Clockodo ist vorübergehend nicht verfügbar. Versuche es später erneut.',
        clockodoRequestRejected: 'Clockodo hat die Anfrage abgelehnt. Prüfe die Kontoberechtigungen und versuche es erneut.',
        clockodoResponseInvalid: 'Clockodo hat eine unerwartete Antwort gesendet. Versuche es später erneut.',
        clockodoRejectionDetail: 'Clockodo hat den Eintrag abgelehnt ({status}): {message}',
        clockodoRejectionMessage: 'Clockodo hat den Eintrag abgelehnt: {message}',
        clockodoRejectionStatus: 'Clockodo hat den Eintrag abgelehnt ({status}).',
        projectPlaceholder: 'Projektname oder ID', servicePlaceholder: 'Leistungsname oder ID', notesPlaceholder: 'Beschreibung der ausgeführten Arbeit',
        customerIdPlaceholder: 'Clockodo-Kunden-ID', projectIdPlaceholder: 'Clockodo-Projekt-ID', serviceIdPlaceholder: 'Clockodo-Leistungs-ID',
        clockodoAssignment: 'Clockodo-Zuordnung',
        clockodoCustomerSelectLabel: 'Clockodo-Kunde',
        clockodoServiceSelectLabel: 'Clockodo-Leistung',
        clockodoAssignmentNone: 'Keine Clockodo-Zuordnung',
        clockodoAssignmentLoading: 'Clockodo-Daten werden geladen …',
        clockodoAssignmentNotConfigured: 'Clockodo ist nicht konfiguriert. Hinterlege die Zugangsdaten in den Einstellungen, um Kunde und Leistung auszuwählen.',
        clockodoAssignmentLoadFailed: 'Clockodo-Kunden und -Leistungen konnten nicht geladen werden.',
        clockodoAssignmentReload: 'Neu laden',
        clockodoAssignmentHelp: 'Tippen zum Suchen. Leer lassen für keine Clockodo-Zuordnung.',
        clockodoServiceNotAllowedForCustomer: 'Die gewählte Leistung ist für diesen Kunden nicht zulässig. Wähle eine gültige Leistung.',
        showSecret: 'Anzeigen', hideSecret: 'Verbergen',
        syncSuccessToast: '{count} Einträge erfolgreich nach Clockodo synchronisiert',
        syncPartialFailureToast: '{success} Einträge synchronisiert, {failed} fehlgeschlagen. Fehlgeschlagene können wiederholt werden.',
        syncFailedToast: 'Clockodo-Synchronisation fehlgeschlagen: {error}',
        retry: 'Wiederholen',
        retryDiagnosticTitle: 'Wiederholung fehlgeschlagen',
        retryDiagnosticError: 'Fehler',
        retryDiagnosticStatus: 'Status',
        retryDiagnosticDetails: 'Details',
        retryDiagnosticUnavailable: 'Der Stapel kann derzeit nicht wiederholt werden.',
        resendSyncNotice: 'Diese Einträge wurden bereits mit Clockodo synchronisiert. Möchtest du sie wirklich erneut senden? Dadurch können doppelte Clockodo-Einträge entstehen.',
        resendSyncBtn: 'Erneut senden',
        createGroup: 'Gruppe erstellen', createGroupFromSelection: 'Auswahl gruppieren ({count})',
        groupName: 'Gruppenname', groupNamePlaceholder: 'z. B. Baustelle A',
        groupDefaultName: 'Gruppe {number}', groupCreated: 'Gruppe "{name}" erstellt',
        groupCreateFailed: 'Gruppe konnte nicht erstellt werden. Bitte erneut versuchen.',
        selectActivitiesFirst: 'Wähle zuerst mindestens eine Aktivität aus',
        collapseGroup: 'Gruppe einklappen', expandGroup: 'Gruppe ausklappen',
        collapseAllGroups: 'Alle einklappen', expandAllGroups: 'Alle ausklappen',
        duplicateGroup: 'Gruppe duplizieren', groupCopyName: '{name} (Kopie)',
        groupDuplicated: 'Gruppe "{name}" dupliziert',
        canvasToolbar: 'Canvas-Aktionen',
    },
    ru: {
        activityFilter: 'Фильтр занятий',
        timerScreen: 'Таймер',
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
        exportedAs: 'Экспортировано в формате {format}', backupFailed: 'Не удалось создать файл копии. Попробуйте ещё раз.', restoreFailed: 'Не удалось восстановить данные. Текущие данные сохранены.',
        demoDataLoaded: 'Демонстрационные данные загружены',
        backupSectionTitle: 'Резервное копирование и восстановление', manualBackupTitle: 'Файл резервной копии',
        appearanceSettings: 'Внешний вид и региональные настройки', timerAndNotifications: 'Таймер и уведомления',
        confirmationsSettings: 'Подтверждения', connectionSection: 'Подключение',
        entryDefaultsSection: 'Параметры записей', dangerousActions: 'Опасные действия',
        clockodoDefaultsHelp: 'Клиент, проект и услуга используются при создании записей. Для проверки подключения они не нужны.',
        manualBackupDescription: 'Создаёт файл, который можно сохранить или перенести на другое устройство.',
        backupCredentialNote: 'Данные Clockodo, включая API-ключ, никогда не добавляются в копию.',
        automaticSnapshotsTitle: 'Автоматические локальные копии',
        automaticSnapshotsDescription: 'После сохранения изменений TimerHub хранит на устройстве 20 последних копий.',
        automaticSnapshotsNone: 'Автоматических копий пока нет.',
        automaticSnapshotsLatest: 'Последняя локальная копия: {date}',
        automaticSnapshotsFailed: 'Не удалось сохранить локальную копию. Изменение всё равно сохранено.',
        selectSnapshot: 'Выберите локальную копию', restoreFromFile: 'Восстановить из файла',
        restoreSnapshot: 'Восстановить выбранную копию', invalidBackup: 'Этот файл не является резервной копией TimerHub.',
        restoreConfirmTitle: 'Восстановить данные TimerHub?',
        restoreConfirmDesc: 'Выберите, объединить эту копию с текущими данными или заменить их. Данные Clockodo не включены.',
        restoreMergeAction: 'Объединить данные', restoreReplaceAction: 'Заменить текущие данные',
        snapshotDateFormat: '{date}',
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
        endOfDayReview: 'Итоги дня', dayReview: 'Обзор дня',
        reviewDate: 'Дата проверки', previousDay: 'Предыдущий день', nextDay: 'Следующий день',
        reviewAndSync: 'Проверить и синхронизировать', addEntry: 'Добавить запись',
        noEntriesForDay: 'Нет записей времени за этот день.',
        totalTrackedTime: 'Всего учтено времени', entriesCount: '{count} записей', gap: 'Перерыв',
        syncedCount: '{count} синхронизировано', unsyncedCount: '{count} не синхронизировано',
        statusSynced: 'Синхронизировано', statusLocal: 'Только локально', statusConfirmed: 'Подтверждено',
        statusPending: 'В ожидании', statusSyncing: 'Синхронизация...', statusFailed: 'Ошибка синхронизации',
        statusUnknown: 'Результат неизвестен',
        statusLocalOnly: 'Локальное изменение; Clockodo без изменений',
        syncLocalOnlyNotice: 'Эта запись уже существует в Clockodo. Подтверждённое локальное изменение сохранено в TimerHub; Clockodo не изменён.',
        syncLocalOnlyToast: 'Подтверждённые локальные изменения ({count}) сохранены в TimerHub. Существующие записи Clockodo не изменялись.',
        statusPartial: 'Синхронизировано частично',
        syncProgress: 'Обработано записей: {done} из {total}',
        syncOutcomeUnknown: 'Clockodo мог принять запись. Проверьте Clockodo перед повторной отправкой вручную.',
        confirmSyncDescLocal: 'Проверьте записи ({count}). Подтверждение сохранит их локально; Clockodo можно настроить позже.',
        clockodoBillable: 'Стандартная оплачиваемость', clockodoBillableYes: 'Оплачиваемая', clockodoBillableNo: 'Неоплачиваемая',
        suspiciousNotice: '{count} записей требуют внимания',
        issueRunning: 'Таймер ещё работает',
        issueZeroDuration: 'Нулевая или отрицательная длительность',
        issueOverlapping: 'Пересекается с другой записью',
        issueUnusuallyLong: 'Необычно долго (>16 ч)',
        notes: 'Заметки', project: 'Проект', service: 'Услуга', endDate: 'Дата окончания',
        entryTooLong: 'Запись не может длиться более 24 часов.',
        confirmSyncTitle: 'Подтверждение синхронизации с Clockodo',
        confirmSyncDesc: 'Проверьте эти записи ({count}). Подтверждение сохранит локальный снимок для Clockodo; отправки пока не будет.',
        confirmSyncBtn: 'Подтвердить и отправить',
        confirmDayBtn: 'Подтвердить день для Clockodo',
        dayReviewConfirmed: 'День подтверждён и сохранён для синхронизации с Clockodo.',
        dayReviewInvalid: 'Перед подтверждением исправьте незавершённые или недопустимые записи.',
        confirmedEntryLocked: 'Запись заморожена в подтверждённом пакете Clockodo.',
        syncSummaryTotal: 'Общая длительность',
        alreadySyncedNotice: '{count} уже синхронизированных записей не будут отправлены повторно',
        noEntriesToSync: 'Нет несинхронизированных записей для отправки.',
        clockodoSettings: 'Интеграция с Clockodo',
        clockodoApiKey: 'API-ключ Clockodo',
        clockodoApiUser: 'Эл. почта Clockodo',
        clockodoCustomerId: 'ID клиента по умолчанию',
        clockodoProjectId: 'ID проекта по умолчанию',
        clockodoServiceId: 'ID услуги по умолчанию',
        clockodoSaveConfig: 'Сохранить настройки Clockodo',
        clockodoConfigSaved: 'Настройки Clockodo сохранены',
        clockodoConfigMissing: 'Пожалуйста, укажите API-ключ и email Clockodo в Настройках.',
        clockodoSecurityNote: 'API-ключ хранится в зашифрованном виде в Cloudflare-хранилище TimerHub и не сохраняется в браузере. Локальный токен защищает подключение устройства.',
        clockodoApiKeyPlaceholder: 'Введите ключ для сохранения или замены',
        clockodoEmailPlaceholder: 'имя@пример.рф',
        clockodoTestConnection: 'Проверить соединение',
        clockodoRemoveConfig: 'Удалить настройки Clockodo',
        clockodoConnectionStatus: 'Состояние соединения',
        clockodoStatusNotConfigured: 'Данные доступа не настроены',
        clockodoStatusConfigured: 'Данные доступа настроены · соединение не проверено',
        clockodoStatusChecking: 'Проверка соединения…',
        clockodoStatusConnected: 'Соединение установлено',
        clockodoStatusFailed: 'Не удалось проверить соединение',
        clockodoConfigRemoved: 'Настройки Clockodo удалены.',
        clockodoTestSuccess: 'Соединение с Clockodo подтверждено.',
        clockodoRequiredFields: 'Укажите действующий email Clockodo и API-ключ.',
        clockodoAssignmentMissing: 'Перед синхронизацией записи укажите в настройках Clockodo действительные ID клиента и услуги.',
        clockodoNetworkError: 'Не удалось связаться с TimerHub. Проверьте подключение и повторите.',
        clockodoTimeout: 'Clockodo не ответил до истечения времени ожидания.',
        clockodoInvalidCredentials: 'Clockodo отклонил данные. Проверьте email и API-ключ.',
        clockodoRateLimited: 'Слишком много запросов к Clockodo. Подождите и повторите.',
        clockodoServiceError: 'Clockodo временно недоступен. Повторите позже.',
        clockodoRequestRejected: 'Clockodo отклонил запрос. Проверьте права доступа к аккаунту и повторите попытку.',
        clockodoResponseInvalid: 'Clockodo вернул неожиданный ответ. Повторите попытку позже.',
        clockodoRejectionDetail: 'Clockodo отклонил запись ({status}): {message}',
        clockodoRejectionMessage: 'Clockodo отклонил запись: {message}',
        clockodoRejectionStatus: 'Clockodo отклонил запись ({status}).',
        projectPlaceholder: 'Название или ID проекта', servicePlaceholder: 'Название или ID услуги', notesPlaceholder: 'Описание выполненной работы',
        customerIdPlaceholder: 'ID клиента Clockodo', projectIdPlaceholder: 'ID проекта Clockodo', serviceIdPlaceholder: 'ID услуги Clockodo',
        clockodoAssignment: 'Привязка Clockodo',
        clockodoCustomerSelectLabel: 'Клиент Clockodo',
        clockodoServiceSelectLabel: 'Услуга Clockodo',
        clockodoAssignmentNone: 'Без привязки к Clockodo',
        clockodoAssignmentLoading: 'Загрузка данных Clockodo…',
        clockodoAssignmentNotConfigured: 'Clockodo не настроен. Добавьте данные доступа в настройках, чтобы выбрать клиента и услугу.',
        clockodoAssignmentLoadFailed: 'Не удалось загрузить клиентов и услуги Clockodo.',
        clockodoAssignmentReload: 'Обновить',
        clockodoAssignmentHelp: 'Введите текст для поиска. Оставьте пустым, чтобы не привязывать.',
        clockodoServiceNotAllowedForCustomer: 'Выбранная услуга недоступна для этого клиента. Выберите допустимую услугу.',
        showSecret: 'Показать', hideSecret: 'Скрыть',
        syncSuccessToast: 'Успешно синхронизировано записей в Clockodo: {count}',
        syncPartialFailureToast: 'Синхронизировано: {success}, с ошибкой: {failed}. Записи с ошибкой можно отправить повторно.',
        syncFailedToast: 'Ошибка синхронизации с Clockodo: {error}',
        retry: 'Повторить',
        retryDiagnosticTitle: 'Повторная попытка не удалась',
        retryDiagnosticError: 'Ошибка',
        retryDiagnosticStatus: 'Статус',
        retryDiagnosticDetails: 'Подробности',
        retryDiagnosticUnavailable: 'Пакет сейчас нельзя повторить.',
        resendSyncNotice: 'Эти записи уже синхронизированы с Clockodo. Вы действительно хотите отправить их снова? Это может создать дубликаты записей Clockodo.',
        resendSyncBtn: 'Отправить повторно',
        createGroup: 'Создать группу', createGroupFromSelection: 'Сгруппировать ({count})',
        groupName: 'Название группы', groupNamePlaceholder: 'например, Объект A',
        groupDefaultName: 'Группа {number}', groupCreated: 'Группа «{name}» создана',
        groupCreateFailed: 'Не удалось создать группу. Попробуйте ещё раз.',
        selectActivitiesFirst: 'Сначала выберите хотя бы одно занятие',
        collapseGroup: 'Свернуть группу', expandGroup: 'Развернуть группу',
        collapseAllGroups: 'Свернуть все', expandAllGroups: 'Развернуть все',
        duplicateGroup: 'Дублировать группу', groupCopyName: '{name} (копия)',
        groupDuplicated: 'Группа «{name}» дублирована',
        canvasToolbar: 'Действия на холсте',
    }
};
for (const language of Object.keys(translations)) {
    Object.assign(translations[language], extendedTranslations[language]);
}

// ============================================================================
// SYNCHRONIZATION STATUS CONSTANTS
// ============================================================================

const SYNC_STATUS = Object.freeze({
    UNSYNCED: 'unsynced',
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    SYNCING: 'syncing',
    SYNCED: 'synced',
    FAILED: 'failed',
    UNKNOWN: 'unknown',
    LOCAL_ONLY: 'local_only'
});

const CANVAS_GRID_SIZE = 16;
const CANVAS_SELECT_LONG_PRESS_MS = 1000;
const CANVAS_SELECT_MOVE_TOLERANCE = 12;
const CANVAS_GROUP_PADDING = 20;
const CANVAS_GROUP_HEADER = 36;
const CANVAS_GROUP_COLLAPSED_WIDTH = 220;
const CANVAS_GROUP_COLLAPSED_HEIGHT = 46;
const CANVAS_GROUP_DUPLICATE_OFFSET = 48;

// ============================================================================
// STORAGE REPOSITORY
// ============================================================================

class StorageRepository {
    constructor() {
        this.dbName = 'TimerHubDB';
        this.version = 4;
        this.db = null;
        this.mutationQueue = Promise.resolve();
        this.snapshotSequence = 0;
        this.snapshotStatus = 'idle';
        this.lastSnapshotAt = null;
        this.onSnapshotStatus = null;
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
                if (!db.objectStoreNames.contains('syncBatches')) {
                    const batchStore = db.createObjectStore('syncBatches', { keyPath: 'id' });
                    batchStore.createIndex('date', 'date', { unique: false });
                }
                if (!db.objectStoreNames.contains('snapshots')) {
                    const snapshotStore = db.createObjectStore('snapshots', { keyPath: 'id' });
                    snapshotStore.createIndex('createdAt', 'createdAt', { unique: false });
                }

                // Groups store (canvas activity groups)
                if (!db.objectStoreNames.contains('groups')) {
                    db.createObjectStore('groups', { keyPath: 'id' });
                }
            };
        });
    }

    async persistMutation(storeNames, enqueueWrites) {
        const operation = this.mutationQueue.then(() => new Promise((resolve, reject) => {
            let tx;
            let result;
            try {
                tx = this.db.transaction(storeNames, 'readwrite');
                result = enqueueWrites(tx);
            } catch (error) {
                reject(error);
                return;
            }
            tx.oncomplete = async () => {
                await this.writeAutomaticSnapshotSafely();
                resolve(result);
            };
            tx.onerror = () => reject(tx.error || new Error('storage_write_failed'));
            tx.onabort = () => reject(tx.error || new Error('storage_write_aborted'));
        }));
        this.mutationQueue = operation.catch(() => undefined);
        return operation;
    }

    async writeAutomaticSnapshotSafely() {
        try {
            const snapshot = {
                id: `${Date.now()}-${++this.snapshotSequence}`,
                format: 'timerhub-snapshot',
                version: 1,
                createdAt: Date.now(),
                data: await this.exportAll()
            };
            await new Promise((resolve, reject) => {
                const tx = this.db.transaction(['snapshots'], 'readwrite');
                const store = tx.objectStore('snapshots');
                store.put(snapshot);
                const listRequest = store.getAll();
                listRequest.onsuccess = () => {
                    const ordered = listRequest.result
                        .sort((a, b) => a.createdAt - b.createdAt || a.id.localeCompare(b.id));
                    ordered.slice(0, Math.max(0, ordered.length - 20))
                        .forEach(item => store.delete(item.id));
                };
                tx.oncomplete = resolve;
                tx.onerror = () => reject(tx.error || new Error('snapshot_write_failed'));
                tx.onabort = () => reject(tx.error || new Error('snapshot_write_aborted'));
            });
            this.snapshotStatus = 'saved';
            this.lastSnapshotAt = snapshot.createdAt;
            Promise.resolve().then(() => this.onSnapshotStatus?.()).catch(() => {
                console.warn('TimerHub automatic snapshot status refresh failed');
            });
            return true;
        } catch {
            this.snapshotStatus = 'failed';
            Promise.resolve().then(() => this.onSnapshotStatus?.()).catch(() => {});
            console.warn('TimerHub automatic snapshot failed (snapshot_write_failed)');
            return false;
        }
    }

    async getAutomaticSnapshots() {
        const tx = this.db.transaction(['snapshots'], 'readonly');
        return new Promise((resolve, reject) => {
            const request = tx.objectStore('snapshots').getAll();
            request.onsuccess = () => resolve(request.result.sort((a, b) => b.createdAt - a.createdAt));
            request.onerror = () => reject(request.error);
        });
    }

    async removeSettingWithoutSnapshot(key) {
        const tx = this.db.transaction(['settings'], 'readwrite');
        return new Promise((resolve, reject) => {
            tx.objectStore('settings').delete(key);
            tx.oncomplete = resolve;
            tx.onerror = () => reject(tx.error || new Error('storage_write_failed'));
            tx.onabort = () => reject(tx.error || new Error('storage_write_aborted'));
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
        return this.persistMutation(['activities'], tx => tx.objectStore('activities').put(activity) && activity);
    }

    async deleteActivity(id) {
        return this.persistMutation(['activities'], tx => { tx.objectStore('activities').delete(id); });
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
        return this.persistMutation(['timeEntries'], tx => tx.objectStore('timeEntries').put(entry) && entry);
    }

    async deleteTimeEntry(id) {
        return this.persistMutation(['timeEntries'], tx => { tx.objectStore('timeEntries').delete(id); });
    }

    async getSyncBatches() {
        const tx = this.db.transaction(['syncBatches'], 'readonly');
        return new Promise((resolve, reject) => {
            const request = tx.objectStore('syncBatches').getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async saveConfirmedBatch(batch, entries) {
        return this.persistMutation(['syncBatches', 'timeEntries'], tx => {
            tx.objectStore('syncBatches').put(batch);
            const entryStore = tx.objectStore('timeEntries');
            entries.forEach(entry => entryStore.put(entry));
            return batch;
        });
    }

    async saveSyncProgress(batch, entries) {
        return this.saveConfirmedBatch(batch, entries);
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
        return this.persistMutation(['settings'], tx => { tx.objectStore('settings').put({ key, value }); });
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
        return this.persistMutation(['layout'], tx => { tx.objectStore('layout').put(layout); });
    }

    // Groups
    async getGroups() {
        const tx = this.db.transaction(['groups'], 'readonly');
        const store = tx.objectStore('groups');
        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async saveGroup(group) {
        return this.persistMutation(['groups'], tx => { tx.objectStore('groups').put(group); });
    }

    async replaceWorkData(activities, timeEntries) {
        return this.persistMutation(['activities', 'timeEntries'], tx => {
            const activityStore = tx.objectStore('activities');
            const entryStore = tx.objectStore('timeEntries');
            activityStore.clear();
            entryStore.clear();
            activities.forEach(activity => activityStore.put(activity));
            timeEntries.forEach(entry => entryStore.put(entry));
        });
    }

    // Bulk export/import
    isSensitiveBackupKey(key) {
        return /api.?key|(?:access|refresh|id)?.?token|secret|password|credential|authorization|^auth(?:entication|orization)?$/i.test(key) ||
            /^(clockodoEmail|clockodoApiUser)$/i.test(key);
    }

    stripSensitiveBackupFields(value) {
        if (Array.isArray(value)) return value.map(item => this.stripSensitiveBackupFields(item));
        if (value && typeof value === 'object') {
            return Object.fromEntries(Object.entries(value)
                .filter(([key]) => !this.isSensitiveBackupKey(key))
                .map(([key, nested]) => [key, this.stripSensitiveBackupFields(nested)]));
        }
        return value;
    }

    async exportAll() {
        const [activities, timeEntries, settings, syncBatches, layout, groups] = await Promise.all([
            this.getActivities(),
            this.getTimeEntries(),
            new Promise((resolve, reject) => {
                const request = this.db.transaction(['settings'], 'readonly')
                    .objectStore('settings').getAll();
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            }),
            this.getSyncBatches(),
            this.getLayout(),
            this.getGroups()
        ]);

        return {
            format: 'timerhub-backup',
            version: 1,
            activities: this.stripSensitiveBackupFields(activities),
            timeEntries: this.stripSensitiveBackupFields(timeEntries),
            syncBatches: this.stripSensitiveBackupFields(syncBatches),
            layout: this.stripSensitiveBackupFields(layout),
            groups: this.stripSensitiveBackupFields(groups),
            settings: Object.fromEntries(settings
                .filter(s => !/(clockodo|api.?key|token|secret|password|credential|auth)/i.test(s.key))
                .map(s => [s.key, this.stripSensitiveBackupFields(s.value)])),
            exportedAt: Date.now()
        };
    }

    validateBackupData(data) {
        const isRecord = value => value !== null && typeof value === 'object' && !Array.isArray(value);
        if (!isRecord(data) || (data.format !== undefined && (data.format !== 'timerhub-backup' || data.version !== 1)) ||
            !Array.isArray(data.activities) || !Array.isArray(data.timeEntries) ||
            (data.syncBatches !== undefined && !Array.isArray(data.syncBatches)) ||
            (data.layout !== undefined && !Array.isArray(data.layout)) ||
            (data.groups !== undefined && !Array.isArray(data.groups)) ||
            (data.settings !== undefined && !isRecord(data.settings))) {
            throw new Error('invalid_backup');
        }
        return data;
    }

    async importAll(data, merge = false) {
        this.validateBackupData(data);
        const stores = ['activities', 'timeEntries', 'settings', 'syncBatches', 'layout', 'groups'];
        return this.persistMutation(stores, tx => {
            const activities = tx.objectStore('activities');
            const timeEntries = tx.objectStore('timeEntries');
            const syncBatches = tx.objectStore('syncBatches');
            const layout = tx.objectStore('layout');
            const groups = tx.objectStore('groups');
            const settings = tx.objectStore('settings');
            if (!merge) {
                activities.clear();
                timeEntries.clear();
                syncBatches.clear();
                layout.clear();
                groups.clear();
            }
            data.activities.forEach(item => activities.put(this.stripSensitiveBackupFields(item)));
            data.timeEntries.forEach(item => timeEntries.put(this.stripSensitiveBackupFields(item)));
            (data.syncBatches || []).forEach(item => syncBatches.put(this.stripSensitiveBackupFields(item)));
            (data.layout || []).forEach(item => layout.put(this.stripSensitiveBackupFields(item)));
            (data.groups || []).forEach(item => groups.put(this.stripSensitiveBackupFields(item)));
            for (const [key, value] of Object.entries(data.settings || {})) {
                if (/(clockodo|api.?key|token|secret|password|credential|auth)/i.test(key)) continue;
                settings.put({ key, value: this.stripSensitiveBackupFields(value) });
            }
        });
    }
}

// ============================================================================
// MAIN APPLICATION
// ============================================================================

class TimerHubApp {
    static get SYNC_STATUS() {
        return SYNC_STATUS;
    }

    constructor() {
        this.storage = new StorageRepository();
        this.pendingRestoreData = null;
        this.backupSnapshots = [];
        this.activities = [];
        this.archivedActivities = [];
        this.groups = [];
        this.timeEntries = [];
        this.activeActivityId = null;
        this.currentLanguage = 'en';
        this.currentTheme = 'system';
        this.timeFormat = '24h';
        this.firstDayOfWeek = 1; // Monday
        this.confirmDelete = true;
        this.currentScreen = 'main';
        this.activityLayouts = new Map();
        this.canvasPan = this.readCanvasPan();
        this.canvasZoom = this.readCanvasZoom();
        this.canvasPointers = new Map();
        this.canvasPinch = null;
        this.canvasZIndex = 1;
        this.canvasGesture = null;
        this.canvasSelectionElement = null;
        this.selectedActivityIds = new Set();
        this.groupDisplayOffsets = new Map();
        this.suppressActivityClick = null;
        this.editingActivityId = null;
        this.editingEntryId = null;
        this.retryDiagnostic = null;
        this.deletedEntry = null;
        this.uiUpdateInterval = null;
        this.notificationTimeout = null;
        this.timerActionInProgress = false;
        this.timerActionState = 'idle';
        this.toastTimeout = null;
        this.notificationTestMode = false;
        this.isDemoMode = this.isDevMode();
        this.reviewDate = this.toDateString(new Date());
        this.clockodoEmail = '';
        this.clockodoCustomerId = '';
        this.clockodoProjectId = '';
        this.clockodoServiceId = '';
        this.clockodoBillable = true;
        this.clockodoConfigured = false;
        this.clockodoStatus = 'unconfigured';
        this.clockodoConfigVersion = 0;
        this.confirmedSyncEntries = [];
        this.syncConfirmationOpen = false;
        this.syncResendMode = false;
        this.syncBatches = [];
        this.syncOperations = new Map();
        this.clockodoClient = window.ClockodoClient ? new window.ClockodoClient() : null;
        this.clockodoCustomers = [];
        this.clockodoServices = [];
        this.clockodoReferenceStatus = 'idle';
        this.clockodoReferenceError = null;
        this.clockodoReferencePromise = null;
        this.clockodoCombobox = null;
        this.clockodoComboboxBlurTimer = null;
        this.clockodoComboboxDocumentHandler = null;
        this.clockodoComboboxViewportHandler = null;

        this.COLORS = [
            '#E74C3C', '#C0392B', '#E67E22', '#D35400', '#F39C12',
            '#F1C40F', '#27AE60', '#2ECC71', '#16A085', '#1ABC9C',
            '#3498DB', '#2980B9', '#4A5F9F', '#34495E', '#9B59B6',
            '#8E44AD', '#E91E63', '#FF6FA3', '#795548', '#7CB342',
            '#95A5A6', '#2C3E50', '#000000', '#FFFFFF'
        ];

        this.SHAPES = [
            { id: 'circle', key: 'shapeCircle', svg: 'M 0 -50 A 50 50 0 1 0 0 50 A 50 50 0 1 0 0 -50 Z' },
            { id: 'square', key: 'shapeSquare', svg: 'M -50 -50 L 50 -50 L 50 50 L -50 50 Z' },
            { id: 'rounded', key: 'shapeRounded', svg: 'M -50 -30 L 50 -30 Q 50 -50 30 -50 L -30 -50 Q -50 -50 -50 -30 L -50 30 Q -50 50 -30 50 L 30 50 Q 50 50 50 30 L 50 -30 Z' },
            { id: 'diamond', key: 'shapeDiamond', svg: 'M 0 -50 L 50 0 L 0 50 L -50 0 Z' },
            { id: 'triangle', key: 'shapeTriangle', svg: 'M 0 -50 L 50 50 L -50 50 Z' },
            { id: 'hexagon', key: 'shapeHexagon', svg: 'M 0 -50 L 43.3 -25 L 43.3 25 L 0 50 L -43.3 25 L -43.3 -25 Z' },
            { id: 'octagon', key: 'shapeOctagon', svg: 'M -29.29 -50 L 29.29 -50 L 50 -29.29 L 50 29.29 L 29.29 50 L -29.29 50 L -50 29.29 L -50 -29.29 Z' },
            { id: 'star', key: 'shapeStar', svg: 'M 0 -50 L 15 -20 L 50 -20 L 25 5 L 40 40 L 0 15 L -40 40 L -25 5 L -50 -20 L -15 -20 Z' },
            { id: 'heart', key: 'shapeHeart', svg: 'M 0 10 C -30 -20 -50 -10 -50 -20 C -50 -40 -30 -50 -15 -50 C 0 -60 15 -50 15 -50 C 30 -50 50 -40 50 -20 C 50 -10 30 -20 0 10' },
            { id: 'oval', key: 'shapeOval', svg: 'M -50 0 A 50 30 0 0 1 50 0 A 50 30 0 0 1 -50 0' }
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
            this.storage.onSnapshotStatus = () => this.refreshAutomaticBackupStatus();
            await this.loadSettings();
            await this.refreshClockodoConfigurationStatus();
            await this.loadActivities();
            await this.loadGroups();
            await this.loadTimeEntries();
            this.applyTranslations();
            this.setupUI();
            this.applyTheme();
            this.syncServiceWorkerLocale();
            this.startUIUpdateLoop();
            this.renderMain();
            const loading = document.getElementById('appLoading');
            if (loading) loading.hidden = true;

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
        } catch {
            console.error('TimerHub initialization failed');
            const loading = document.getElementById('appLoading');
            if (loading) loading.hidden = true;
            const panel = document.getElementById('initErrorPanel');
            if (panel) panel.hidden = false;
            this.applyTranslations();
            document.getElementById('initReloadBtn')?.addEventListener('click', () => window.location.reload());
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
        await this.storage.removeSettingWithoutSnapshot('clockodoApiKey');
        this.clockodoEmail = await this.storage.getSetting('clockodoEmail', '');
        this.clockodoCustomerId = await this.storage.getSetting('clockodoCustomerId', '');
        this.clockodoProjectId = await this.storage.getSetting('clockodoProjectId', '');
        this.clockodoServiceId = await this.storage.getSetting('clockodoServiceId', '');
        this.clockodoBillable = await this.storage.getSetting('clockodoBillable', true);
    }

    async loadActivities() {
        const [activities, layouts] = await Promise.all([
            this.storage.getActivities(),
            typeof this.storage.getLayout === 'function' ? this.storage.getLayout() : Promise.resolve([])
        ]);
        this.activityLayouts = new Map(layouts.map(layout => [layout.activityId, layout]));
        this.archivedActivities = activities.filter(a => a.archived);
        this.activities = activities
            .filter(a => !a.archived)
            .sort((a, b) => (a.position || 0) - (b.position || 0));
    }

    async loadGroups() {
        const groups = typeof this.storage.getGroups === 'function'
            ? await this.storage.getGroups()
            : [];
        this.groups = Array.isArray(groups)
            ? groups
                .filter(group => group && typeof group === 'object')
                .map(group => ({
                    id: String(group.id || this.generateId()),
                    name: String(group.name || ''),
                    x: this.clampCanvasCoordinate(group.x, 0, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY),
                    y: this.clampCanvasCoordinate(group.y, 0, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY),
                    collapsed: group.collapsed === true
                }))
            : [];
    }

    normalizeClockodoId(value) {
        const text = String(value ?? '').trim();
        return /^\d+$/.test(text) ? text : null;
    }

    normalizeClockodoErrorDetails(raw) {
        if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
        const details = {};
        const status = Number(raw.status);
        if (Number.isSafeInteger(status) && status > 0) details.status = status;
        for (const key of ['code', 'message', 'path']) {
            if (typeof raw[key] === 'string' && raw[key].trim()) {
                details[key] = raw[key].trim().slice(0, 300);
            }
        }
        if (Array.isArray(raw.fields)) {
            const fields = raw.fields
                .filter(field => typeof field === 'string' && field.trim())
                .map(field => field.trim().slice(0, 100))
                .slice(0, 5);
            if (fields.length) details.fields = fields;
        }
        return Object.keys(details).length ? details : null;
    }

    normalizeTimeEntry(raw = {}) {
        if (!raw || typeof raw !== 'object') {
            raw = {};
        }
        const now = Date.now();
        const startTimestamp = Number.isFinite(Number(raw.startTimestamp))
            ? Number(raw.startTimestamp)
            : now;
        const endTimestamp = raw.endTimestamp !== null && raw.endTimestamp !== undefined && Number.isFinite(Number(raw.endTimestamp))
            ? Number(raw.endTimestamp)
            : null;

        const allowedStatuses = Object.values(SYNC_STATUS);
        let syncStatus = typeof raw.syncStatus === 'string' ? raw.syncStatus.toLowerCase() : '';
        if (!allowedStatuses.includes(syncStatus)) {
            syncStatus = raw.clockodoEntryId ? SYNC_STATUS.SYNCED : SYNC_STATUS.UNSYNCED;
        }

        const clockodoEntryId = raw.clockodoEntryId !== null && raw.clockodoEntryId !== undefined && raw.clockodoEntryId !== ''
            ? (Number.isFinite(Number(raw.clockodoEntryId)) ? Number(raw.clockodoEntryId) : String(raw.clockodoEntryId))
            : null;

        return {
            id: String(raw.id || this.generateId()),
            activityId: String(raw.activityId || ''),
            activityNameSnapshot: String(raw.activityNameSnapshot || ''),
            startTimestamp,
            endTimestamp,
            createdAt: Number.isFinite(Number(raw.createdAt)) ? Number(raw.createdAt) : startTimestamp,
            updatedAt: Number.isFinite(Number(raw.updatedAt)) ? Number(raw.updatedAt) : now,
            notes: typeof raw.notes === 'string' ? raw.notes : (typeof raw.note === 'string' ? raw.note : ''),
            project: typeof raw.project === 'string' ? raw.project : '',
            service: typeof raw.service === 'string' ? raw.service : '',
            customerId: this.normalizeClockodoId(raw.customerId),
            serviceId: this.normalizeClockodoId(raw.serviceId),
            customerName: typeof raw.customerName === 'string' ? raw.customerName : '',
            serviceName: typeof raw.serviceName === 'string' ? raw.serviceName : '',
            source: raw.source === 'manual' ? 'manual' : 'timer',
            isEdited: raw.isEdited === true || (raw.editedAt !== null && raw.editedAt !== undefined && Number.isFinite(Number(raw.editedAt)) && Number(raw.editedAt) > 0),
            editedAt: raw.editedAt !== null && raw.editedAt !== undefined && Number.isFinite(Number(raw.editedAt)) && Number(raw.editedAt) > 0 ? Number(raw.editedAt) : null,
            syncStatus,
            syncBatchId: raw.syncBatchId ? String(raw.syncBatchId) : null,
            clockodoEntryId,
            clockodoSyncedAt: raw.clockodoSyncedAt && Number.isFinite(Number(raw.clockodoSyncedAt)) ? Number(raw.clockodoSyncedAt) : null,
            clockodoError: raw.clockodoError ? String(raw.clockodoError) : null,
            clockodoErrorDetails: this.normalizeClockodoErrorDetails(raw.clockodoErrorDetails)
        };
    }

    createTimeEntry(data = {}) {
        const now = Date.now();
        const base = {
            id: data.id || this.generateId(),
            activityId: data.activityId || '',
            activityNameSnapshot: data.activityNameSnapshot || '',
            startTimestamp: data.startTimestamp !== undefined ? Number(data.startTimestamp) : now,
            endTimestamp: data.endTimestamp !== undefined && data.endTimestamp !== null ? Number(data.endTimestamp) : null,
            createdAt: data.createdAt ? Number(data.createdAt) : now,
            updatedAt: data.updatedAt ? Number(data.updatedAt) : now,
            notes: data.notes || data.note || '',
            project: data.project || '',
            service: data.service || '',
            customerId: this.normalizeClockodoId(data.customerId),
            serviceId: this.normalizeClockodoId(data.serviceId),
            customerName: data.customerName || '',
            serviceName: data.serviceName || '',
            source: data.source || (data.endTimestamp !== null ? 'manual' : 'timer'),
            isEdited: data.isEdited === true,
            editedAt: data.editedAt || null,
            syncStatus: data.syncStatus || SYNC_STATUS.UNSYNCED,
            syncBatchId: data.syncBatchId || null,
            clockodoEntryId: data.clockodoEntryId || null,
            clockodoSyncedAt: data.clockodoSyncedAt || null,
            clockodoError: data.clockodoError || null,
            clockodoErrorDetails: this.normalizeClockodoErrorDetails(data.clockodoErrorDetails)
        };
        return this.normalizeTimeEntry(base);
    }

    validateTimeEntry(entry) {
        if (!entry || typeof entry !== 'object') {
            return { valid: false, error: 'invalidEntryObject' };
        }
        if (!entry.activityId || typeof entry.activityId !== 'string' || !entry.activityId.trim()) {
            return { valid: false, error: 'missingActivity' };
        }
        if (!Number.isFinite(entry.startTimestamp) || entry.startTimestamp <= 0) {
            return { valid: false, error: 'invalidStartTime' };
        }
        if (entry.endTimestamp !== null && entry.endTimestamp !== undefined) {
            if (!Number.isFinite(entry.endTimestamp) || entry.endTimestamp <= 0) {
                return { valid: false, error: 'invalidEndTime' };
            }
            if (entry.endTimestamp <= entry.startTimestamp) {
                return { valid: false, error: 'startBeforeEnd' };
            }
            if (entry.endTimestamp - entry.startTimestamp > 24 * 60 * 60 * 1000) {
                return { valid: false, error: 'durationTooLong' };
            }
        }
        const allowedStatuses = Object.values(SYNC_STATUS);
        if (entry.syncStatus && !allowedStatuses.includes(entry.syncStatus)) {
            return { valid: false, error: 'invalidSyncStatus' };
        }
        return { valid: true };
    }

    getEntryDuration(entry, now = Date.now()) {
        if (!entry) return 0;
        const start = Number(entry.startTimestamp) || 0;
        const end = entry.endTimestamp !== null && entry.endTimestamp !== undefined
            ? Number(entry.endTimestamp)
            : now;
        return Math.max(0, end - start);
    }

    getEntryDate(entry) {
        if (!entry || !entry.startTimestamp) return this.toDateString(new Date());
        return this.toDateString(new Date(entry.startTimestamp));
    }

    getDayEntries(dateString) {
        if (!dateString) dateString = this.toDateString(new Date());
        return this.timeEntries
            .filter(entry => this.getEntryDate(entry) === dateString)
            .sort((a, b) => a.startTimestamp - b.startTimestamp);
    }

    calculateDayTotal(dateString) {
        const entries = this.getDayEntries(dateString);
        return entries.reduce((sum, entry) => sum + this.getEntryDuration(entry), 0);
    }

    getSuspiciousEntries(dateString) {
        const entries = this.getDayEntries(dateString);
        const suspicious = [];

        for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];
            const issues = [];

            if (entry.endTimestamp === null) {
                issues.push('running');
            } else {
                const duration = entry.endTimestamp - entry.startTimestamp;
                if (duration <= 0) {
                    issues.push('zeroDuration');
                } else if (duration > 16 * 60 * 60 * 1000) {
                    issues.push('unusuallyLong');
                }

                for (let j = 0; j < entries.length; j++) {
                    if (i === j) continue;
                    const other = entries[j];
                    if (other.endTimestamp !== null) {
                        const hasOverlap = !(entry.endTimestamp <= other.startTimestamp || entry.startTimestamp >= other.endTimestamp);
                        if (hasOverlap) {
                            issues.push('overlapping');
                            break;
                        }
                    }
                }
            }

            if (issues.length > 0) {
                suspicious.push({ entry, issues });
            }
        }

        return suspicious;
    }

    async addEntry(data) {
        const entryData = { ...data };
        if (entryData.activityId &&
            (entryData.customerId === undefined || entryData.serviceId === undefined)) {
            const activity = this.activities.find(item => item.id === entryData.activityId);
            if (activity) {
                if (entryData.customerId === undefined) entryData.customerId = activity.customerId || '';
                if (entryData.serviceId === undefined) entryData.serviceId = activity.serviceId || '';
                if (entryData.customerName === undefined) entryData.customerName = activity.customerName || '';
                if (entryData.serviceName === undefined) entryData.serviceName = activity.serviceName || '';
            }
        }
        const entry = this.createTimeEntry(entryData);
        const validation = this.validateTimeEntry(entry);
        if (!validation.valid) {
            throw new Error(`Invalid entry: ${validation.error}`);
        }
        this.timeEntries.push(entry);
        await this.storage.saveTimeEntry(entry);
        return entry;
    }

    async updateEntry(id, updates = {}) {
        const index = this.timeEntries.findIndex(e => e.id === id);
        if (index === -1) {
            throw new Error(`Entry not found: ${id}`);
        }
        const existing = this.timeEntries[index];
        const merged = { ...existing, ...updates, updatedAt: Date.now() };

        // Post-sync edit detection:
        // Any material change resets syncStatus to 'unsynced' so explicit re-confirmation is required.
        const workFieldsChanged =
            merged.startTimestamp !== existing.startTimestamp ||
            merged.endTimestamp !== existing.endTimestamp ||
            merged.activityId !== existing.activityId ||
            merged.notes !== existing.notes ||
            merged.project !== existing.project ||
            merged.service !== existing.service ||
            merged.customerId !== existing.customerId ||
            merged.serviceId !== existing.serviceId;

        if (workFieldsChanged) {
            if ([SYNC_STATUS.CONFIRMED, SYNC_STATUS.SYNCING].includes(existing.syncStatus)) {
                throw new Error('Confirmed time entry is frozen until synchronization resolves');
            }
            merged.isEdited = true;
            merged.editedAt = Date.now();
            if (existing.syncStatus === SYNC_STATUS.SYNCED || existing.syncStatus === SYNC_STATUS.LOCAL_ONLY || existing.syncStatus === SYNC_STATUS.CONFIRMED) {
                merged.syncStatus = SYNC_STATUS.UNSYNCED;
                merged.clockodoError = null;
                merged.clockodoErrorDetails = null;
            }
        }

        const normalized = this.normalizeTimeEntry(merged);
        const validation = this.validateTimeEntry(normalized);
        if (!validation.valid) {
            throw new Error(`Invalid entry update: ${validation.error}`);
        }

        this.timeEntries[index] = normalized;
        await this.storage.saveTimeEntry(normalized);
        if (workFieldsChanged) await this.refreshFailedBatchEntry(normalized);
        return normalized;
    }

    async refreshFailedBatchEntry(entry) {
        if (!entry?.syncBatchId) return false;
        const batch = this.syncBatches.find(item => item.id === entry.syncBatchId);
        if (!batch || ![SYNC_STATUS.FAILED, 'partial'].includes(batch.state)) return false;
        const index = batch.entries.findIndex(item => item.id === entry.id);
        if (index < 0 || batch.entries[index].syncStatus !== SYNC_STATUS.FAILED) return false;
        batch.entries[index] = {
            ...batch.entries[index],
            activityId: entry.activityId,
            activityNameSnapshot: entry.activityNameSnapshot,
            startTimestamp: entry.startTimestamp,
            endTimestamp: entry.endTimestamp,
            durationMs: entry.endTimestamp - entry.startTimestamp,
            notes: entry.notes,
            project: entry.project,
            service: entry.service,
            customerId: entry.customerId,
            serviceId: entry.serviceId,
            customerName: entry.customerName,
            serviceName: entry.serviceName,
            isEdited: entry.isEdited,
            editedAt: entry.editedAt,
            clockodoPayload: null
        };
        await this.storage.saveSyncProgress(batch, [batch.entries[index]]);
        const batchIndex = this.syncBatches.findIndex(item => item.id === batch.id);
        if (batchIndex >= 0) this.syncBatches[batchIndex] = batch;
        return true;
    }

    async deleteEntry(id) {
        const index = this.timeEntries.findIndex(e => e.id === id);
        if (index === -1) return null;
        if ([SYNC_STATUS.CONFIRMED, SYNC_STATUS.SYNCING].includes(this.timeEntries[index].syncStatus)) {
            throw new Error('Confirmed time entry is frozen until synchronization resolves');
        }
        const [removed] = this.timeEntries.splice(index, 1);
        await this.storage.deleteTimeEntry(id);
        return removed;
    }

    async loadTimeEntries() {
        const rawEntries = await this.storage.getTimeEntries() || [];
        this.timeEntries = rawEntries.map(e => this.normalizeTimeEntry(e));
        this.syncBatches = this.storage.getSyncBatches
            ? await this.storage.getSyncBatches()
            : [];
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
        this.setupDialogAccessibility();
        this.setupActivityCanvasInteractions();

        // Navigation
        sel('navTimer')?.addEventListener('click', () => this.switchScreen('main'));
        sel('navReview')?.addEventListener('click', () => this.switchScreen('review'));
        sel('navLog')?.addEventListener('click', () => this.switchScreen('log'));
        sel('navSettings')?.addEventListener('click', () => this.switchScreen('settings'));
        sel('navHome')?.addEventListener('click', () => this.switchScreen('main'));
        sel('navHome')?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.switchScreen('main');
            }
        });

        // Day Review controls
        sel('reviewPrevDayBtn')?.addEventListener('click', () => this.changeReviewDay(-1));
        sel('reviewNextDayBtn')?.addEventListener('click', () => this.changeReviewDay(1));
        sel('reviewTodayBtn')?.addEventListener('click', () => this.setReviewDay(this.toDateString(new Date())));
        sel('reviewDateInput')?.addEventListener('change', (e) => this.setReviewDay(e.target.value));
        sel('reviewAddEntryBtn')?.addEventListener('click', () => this.showAddEntryModal());
        sel('reviewConfirmSyncBtn')?.addEventListener('click', () => this.showSyncConfirmationModal());

        // Sync confirmation modal
        sel('syncConfirmCloseBtn')?.addEventListener('click', () => this.closeSyncConfirmationModal());
        sel('syncConfirmCancelBtn')?.addEventListener('click', () => this.closeSyncConfirmationModal());
        sel('syncConfirmSubmitBtn')?.addEventListener('click', () => this.confirmAndSyncClockodo());

        // Clockodo settings
        sel('clockodoToggleKeyBtn')?.addEventListener('click', () => this.toggleClockodoKeyVisibility());
        sel('clockodoSaveBtn')?.addEventListener('click', () => this.saveClockodoSettings());
        sel('clockodoTestBtn')?.addEventListener('click', () => this.testClockodoConnection());
        sel('clockodoRemoveBtn')?.addEventListener('click', () => this.removeClockodoSettings());

        // Add activity button
        sel('addActivityBtn')?.addEventListener('click', () => this.showActivityModal());

        // Activity modal
        sel('modalCloseBtn')?.addEventListener('click', () => this.closeActivityModal());
        sel('modalCancelBtn')?.addEventListener('click', () => this.closeActivityModal());
        sel('modalSaveBtn')?.addEventListener('click', () => this.saveActivity());

        // Group creation
        sel('createGroupBtn')?.addEventListener('click', () => this.openGroupModal());
        sel('groupToggleAllBtn')?.addEventListener('click', () => {
            if (this.groups.some(group => !group.collapsed)) this.collapseAllGroups();
            else this.expandAllGroups();
        });
        sel('groupModalCloseBtn')?.addEventListener('click', () => this.closeGroupModal());
        sel('groupModalCancelBtn')?.addEventListener('click', () => this.closeGroupModal());
        sel('groupModalSaveBtn')?.addEventListener('click', async () => {
            const input = document.getElementById('groupNameInput');
            const group = await this.createGroupFromSelection(input?.value);
            if (group) this.closeGroupModal();
        });

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
        sel('entryEditActivity')?.addEventListener('change', (e) => {
            const activity = this.activities.find(item => item.id === e.target.value);
            this.populateClockodoAssignmentSelects('entry', activity?.customerId, activity?.serviceId, activity?.customerName, activity?.serviceName);
        });
        sel('activityClockodoRetryBtn')?.addEventListener('click', () => this.reloadClockodoReferenceData());
        sel('entryEditClockodoRetryBtn')?.addEventListener('click', () => this.reloadClockodoReferenceData());
        for (const [context, fieldName] of [
            ['activity', 'customer'], ['activity', 'service'],
            ['entry', 'customer'], ['entry', 'service']
        ]) {
            const combobox = this.clockodoComboboxIds(context, fieldName);
            sel(combobox.input)?.addEventListener('focus', () => this.openClockodoCombobox(context, fieldName));
            sel(combobox.input)?.addEventListener('input', () => this.applyClockodoAssignmentInput(context, fieldName));
            sel(combobox.input)?.addEventListener('keydown', (event) => this.onClockodoComboboxKeydown(context, fieldName, event));
            sel(combobox.input)?.addEventListener('blur', () => this.scheduleClockodoComboboxClose(context, fieldName));
            sel(combobox.list)?.addEventListener('pointerdown', () => this.cancelClockodoComboboxClose());
            sel(combobox.list)?.addEventListener('mousedown', (event) => event.preventDefault());
            sel(combobox.list)?.addEventListener('click', (event) => this.onClockodoComboboxListClick(context, fieldName, event));
        }

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
        sel('automaticSnapshotSelect')?.addEventListener('change', e => {
            const restoreButton = document.getElementById('restoreSnapshotBtn');
            if (restoreButton) restoreButton.disabled = !e.target.value;
        });
        sel('restoreSnapshotBtn')?.addEventListener('click', () => this.restoreSelectedSnapshot());
        sel('backupRestoreCloseBtn')?.addEventListener('click', () => this.cancelPendingRestore());
        sel('backupRestoreCancelBtn')?.addEventListener('click', () => this.cancelPendingRestore());
        sel('backupRestoreMergeBtn')?.addEventListener('click', () => this.restorePendingData(true));
        sel('backupRestoreReplaceBtn')?.addEventListener('click', () => this.restorePendingData(false));
        this.storage.onSnapshotStatus = () => this.refreshAutomaticBackupStatus();
        this.refreshAutomaticBackupStatus();

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

    setupDialogAccessibility() {
        if (this.dialogAccessibilityReady) return;
        this.dialogAccessibilityReady = true;
        let opener = null;
        let activeModal = null;
        const focusable = modal => [...modal.querySelectorAll('button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])')]
            .filter(element => element.getClientRects().length > 0);
        const observer = new MutationObserver(() => {
            const modal = [...document.querySelectorAll('.modal.active')].at(-1) || null;
            if (modal && modal !== activeModal) {
                if (!activeModal) opener = document.activeElement;
                activeModal = modal;
                const first = focusable(modal)[0];
                if (first) requestAnimationFrame(() => first.focus());
            } else if (!modal && activeModal) {
                activeModal = null;
                const restore = opener;
                opener = null;
                if (restore?.isConnected) requestAnimationFrame(() => restore.focus());
            }
        });
        document.querySelectorAll('.modal').forEach(modal => observer.observe(modal, { attributes: true, attributeFilter: ['class'] }));
        document.addEventListener('keydown', event => {
            if (!activeModal) return;
            if (event.key === 'Escape') {
                event.preventDefault();
                activeModal.querySelector('.modal-close')?.click();
                return;
            }
            if (event.key !== 'Tab') return;
            const items = focusable(activeModal);
            if (!items.length) return;
            const first = items[0];
            const last = items[items.length - 1];
            if (event.shiftKey && (document.activeElement === first || !activeModal.contains(document.activeElement))) {
                event.preventDefault(); last.focus();
            } else if (!event.shiftKey && (document.activeElement === last || !activeModal.contains(document.activeElement))) {
                event.preventDefault(); first.focus();
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
            const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            icon.setAttribute('viewBox', '-60 -60 120 120');
            icon.setAttribute('aria-hidden', 'true');
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', shape.svg);
            icon.appendChild(path);
            btn.appendChild(icon);
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

    updateTimerStatus() {
        const status = document.getElementById('timerRunningStatus');
        if (!status) return;
        const activeActivity = this.activities.find(activity => activity.id === this.activeActivityId);
        const actionState = this.timerActionState || 'idle';
        status.hidden = !activeActivity && actionState === 'idle';
        status.textContent = status.hidden ? '' : actionState === 'saving'
            ? this.t('timerSaving')
            : actionState === 'error'
                ? this.t('timerSaveFailed')
                : this.t('timerStatusRunning', { activity: activeActivity.name, duration: this.formatDuration(this.getActiveDuration()) });
        status.dataset.state = actionState === 'error' ? 'error' : actionState === 'saving' ? 'saving' : activeActivity ? 'running' : 'idle';
        status.classList.toggle('is-running', Boolean(activeActivity) && actionState === 'idle');
        status.classList.toggle('is-saving', actionState === 'saving');
        status.classList.toggle('is-error', actionState === 'error');
    }

    startUIUpdateLoop() {
        if (this.uiUpdateInterval) clearInterval(this.uiUpdateInterval);
        
        this.uiUpdateInterval = setInterval(() => {
            this.updateTimerStatus();
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
        if (screen !== 'main' && this.selectedActivityIds?.size) this.setCanvasSelection([]);

        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        
        switch (screen) {
            case 'review':
                document.getElementById('reviewScreen')?.classList.add('active');
                this.renderReview();
                break;
            case 'log':
                document.getElementById('logScreen')?.classList.add('active');
                this.renderLog();
                break;
            case 'settings':
                document.getElementById('settingsScreen')?.classList.add('active');
                this.renderSettings();
                break;
            default:
                document.getElementById('mainScreen')?.classList.add('active');
                this.renderMain();
        }
        document.querySelectorAll('.nav-btn').forEach(button => {
            const selected = ((screen === 'main' || !['review', 'log', 'settings'].includes(screen)) && button.id === 'navTimer') ||
                (screen === 'review' && button.id === 'navReview') ||
                (screen === 'log' && button.id === 'navLog') ||
                (screen === 'settings' && button.id === 'navSettings');
            button.classList.toggle('selected', selected);
            if (selected) button.setAttribute('aria-current', 'page');
            else button.removeAttribute('aria-current');
        });
    }

    changeReviewDay(offset) {
        const date = new Date(`${this.reviewDate}T12:00:00`);
        date.setDate(date.getDate() + offset);
        this.setReviewDay(this.toDateString(date));
    }

    setReviewDay(dateString) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return;
        const parsed = new Date(`${dateString}T12:00:00`);
        if (Number.isNaN(parsed.getTime()) || this.toDateString(parsed) !== dateString) return;
        this.reviewDate = dateString;
        this.renderReview();
    }

    renderReview() {
        const dateInput = document.getElementById('reviewDateInput');
        const summary = document.getElementById('reviewSummaryBar');
        const list = document.getElementById('reviewEntriesList');
        const banner = document.getElementById('reviewSuspiciousBanner');
        if (!dateInput || !summary || !list || !banner) return;

        dateInput.value = this.reviewDate;
        const entries = this.getDayEntries(this.reviewDate);
        const total = this.calculateDayTotal(this.reviewDate);
        const syncedCount = entries.filter(entry => entry.syncStatus === SYNC_STATUS.SYNCED).length;
        const unsyncedCount = entries.length - syncedCount;
        summary.innerHTML = `<div class="review-summary-stat highlight"><span class="review-summary-label">${this.t('totalTrackedTime')}</span>${this.formatDuration(total)}</div><div class="review-summary-stat"><span class="review-summary-label">${this.t('entriesCount', { count: entries.length })}</span></div><div class="review-summary-stat"><span class="review-summary-label">${this.t('syncedCount', { count: syncedCount })}</span></div><div class="review-summary-stat"><span class="review-summary-label">${this.t('unsyncedCount', { count: unsyncedCount })}</span></div>`;
        const latestBatch = this.syncBatches.filter(batch => batch.date === this.reviewDate).sort((a, b) => b.version - a.version)[0];
        if (latestBatch) {
            const done = latestBatch.entries.filter(entry => [SYNC_STATUS.SYNCED, SYNC_STATUS.LOCAL_ONLY, SYNC_STATUS.FAILED, SYNC_STATUS.UNKNOWN].includes(entry.syncStatus)).length;
            const batchStatusKey = { partial: 'statusPartial', unknown: 'statusUnknown', confirmed: 'statusConfirmed', syncing: 'statusSyncing', failed: 'statusFailed', synced: 'statusSynced', local_only: 'statusLocalOnly' }[latestBatch.state] || 'statusPending';
            summary.innerHTML += `<div class="review-summary-stat"><span class="review-summary-label">${this.t('syncProgress', { done, total: latestBatch.entries.length })}</span>${this.t(batchStatusKey)}</div>`;
        }

        const suspicious = this.getSuspiciousEntries(this.reviewDate);
        if (suspicious.length) {
            banner.style.display = '';
            banner.textContent = this.t('suspiciousNotice', { count: suspicious.length });
        } else {
            banner.style.display = 'none';
            banner.textContent = '';
        }

        if (!entries.length) {
            list.innerHTML = `<div class="review-empty">${this.t('noEntriesForDay')}</div>`;
            return;
        }

        const issueKeys = { running: this.t('issueRunning'), zeroDuration: this.t('issueZeroDuration'), overlapping: this.t('issueOverlapping'), unusuallyLong: this.t('issueUnusuallyLong') };
        const statusKeys = {
            unsynced: this.t('statusLocal'), pending: this.t('statusPending'), confirmed: this.t('statusConfirmed'),
            syncing: this.t('statusSyncing'), synced: this.t('statusSynced'), failed: this.t('statusFailed'),
            unknown: this.t('statusUnknown'), partial: this.t('statusPartial'), local_only: this.t('statusLocalOnly')
        };
        list.innerHTML = entries.map((entry, index) => {
            const activity = this.activities.find(item => item.id === entry.activityId);
            const issues = suspicious.find(item => item.entry.id === entry.id)?.issues || [];
            const start = this.formatTime(this.clockodoSendTimestamp(entry.startTimestamp));
            const end = entry.endTimestamp === null ? '—' : this.formatTime(this.clockodoSendTimestamp(entry.endTimestamp));
            const duration = this.formatDuration(this.getEntryDuration(entry));
            const status = statusKeys[entry.syncStatus] || this.t('statusLocal');
            const previous = entries[index - 1];
            const gap = previous?.endTimestamp !== null && previous?.endTimestamp !== undefined && previous.endTimestamp < entry.startTimestamp
                ? `<div class="review-gap" aria-label="${this.t('gap')}"><span>${this.t('gap')}</span><time>${this.escapeHtml(this.formatTime(previous.endTimestamp))}–${this.escapeHtml(this.formatTime(entry.startTimestamp))}</time><strong>${this.formatDuration(entry.startTimestamp - previous.endTimestamp)}</strong></div>`
                : '';
            const meta = [entry.project, entry.service].filter(Boolean).map(value => this.escapeHtml(value)).join(' · ');
            const notes = entry.notes ? `<div class="review-entry-notes">${this.escapeHtml(entry.notes)}</div>` : '';
            const issueText = issues.map(issue => issueKeys[issue]).filter(Boolean).join(' · ');
            const batch = entry.syncBatchId ? this.syncBatches.find(item => item.id === entry.syncBatchId) : null;
            const activityLabel = activity?.name || entry.activityNameSnapshot || this.t('activity');
            const retryButton = entry.syncStatus === SYNC_STATUS.FAILED && batch
                ? `<button class="review-action-btn review-retry-entry" type="button" data-batch-id="${this.escapeHtml(batch.id)}" data-entry-id="${this.escapeHtml(entry.id)}" aria-label="${this.escapeHtml(`${this.t('retry')}: ${activityLabel}`)}"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M20 7v5h-5M4.8 9a7.5 7.5 0 0 1 12.7-2L20 12M4 17v-5h5m10.2 3a7.5 7.5 0 0 1-12.7 2L4 12"/></svg>${this.t('retry')}</button>`
                : '';
            const unknownNotice = entry.syncStatus === SYNC_STATUS.UNKNOWN ? `<small>${this.t('syncOutcomeUnknown')}</small>` : '';
            const localOnlyNotice = entry.syncStatus === SYNC_STATUS.LOCAL_ONLY ? `<small>${this.t('syncLocalOnlyNotice')}</small>` : '';
            const errorNotice = entry.clockodoError && entry.syncStatus === SYNC_STATUS.FAILED
                ? `<small>${this.escapeHtml(this.clockodoErrorMessage({ code: entry.clockodoError, details: entry.clockodoErrorDetails }))}</small>`
                : '';
            const retryDiagnostic = this.retryDiagnostic && !this.retryDiagnostic.pending && String(this.retryDiagnostic.entryId) === String(entry.id)
                ? this.renderRetryDiagnostic(this.retryDiagnostic)
                : '';
            return `${gap}<article class="review-entry-card${issues.length ? ' suspicious-entry' : ''}" data-entry-id="${this.escapeHtml(entry.id)}">
                <div class="review-entry-header">
                <div class="review-entry-times"><strong>${this.escapeHtml(start)}</strong><span>–</span><strong>${this.escapeHtml(end)}</strong></div>
                <span class="review-entry-duration">${this.escapeHtml(duration)}</span></div>
                <div class="review-entry-title"><span class="review-activity-dot" style="background-color:${this.escapeHtml(activity?.color || '#27AE60')}"></span>${this.escapeHtml(activityLabel)}</div>
                ${meta ? `<div class="review-entry-tags">${entry.project ? `<span class="review-tag">${this.escapeHtml(entry.project)}</span>` : ''}${entry.service ? `<span class="review-tag">${this.escapeHtml(entry.service)}</span>` : ''}</div>` : ''}${notes}${issueText ? `<small>${this.escapeHtml(issueText)}</small>` : ''}${errorNotice}${unknownNotice}${localOnlyNotice}
                <div class="review-entry-footer"><span class="sync-badge ${this.escapeHtml(entry.syncStatus)}">${this.escapeHtml(status)}</span><div class="review-entry-actions"><button class="review-action-btn review-edit-entry" type="button" data-entry-id="${this.escapeHtml(entry.id)}" aria-label="${this.escapeHtml(`${this.t('edit')}: ${activityLabel}`)}" ${entry.syncStatus === SYNC_STATUS.CONFIRMED || entry.syncStatus === SYNC_STATUS.SYNCING ? `disabled title="${this.escapeHtml(this.t('confirmedEntryLocked'))}"` : ''}><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m4 16.5-.8 4.3 4.3-.8L19 8.5 15.5 5 4 16.5Z"/><path d="m13.5 7 3.5 3.5"/></svg>${this.t('edit')}</button>${retryButton}</div></div>${retryDiagnostic}
            </article>`;
        }).join('');
        list.querySelectorAll('.review-edit-entry').forEach(button => button.addEventListener('click', () => this.showEntryEditModal(button.dataset.entryId)));
        list.querySelectorAll('.review-retry-entry').forEach(button => button.addEventListener('click', () => this.retryFailedEntry(button.dataset.batchId, button.dataset.entryId)));
    }

    showSyncConfirmationModal() {
        const entries = this.getDayEntries(this.reviewDate);
        const latestBatch = this.syncBatches.filter(batch => batch.date === this.reviewDate).sort((a, b) => b.version - a.version)[0];
        const pendingBatch = latestBatch && [SYNC_STATUS.CONFIRMED, SYNC_STATUS.SYNCING, SYNC_STATUS.FAILED, 'partial']
            .includes(latestBatch.state) && latestBatch.entries.some(entry => [SYNC_STATUS.CONFIRMED, SYNC_STATUS.SYNCING, SYNC_STATUS.FAILED].includes(entry.syncStatus))
            ? latestBatch
            : null;
        const unsynced = entries.filter(entry => [SYNC_STATUS.UNSYNCED, SYNC_STATUS.FAILED].includes(entry.syncStatus));
        const synced = entries.filter(entry => entry.syncStatus === SYNC_STATUS.SYNCED);
        const resend = this.clockodoConfigured && !pendingBatch && unsynced.length === 0 && synced.length > 0;
        this.syncResendMode = resend;
        const eligible = pendingBatch
            ? pendingBatch.entries.filter(entry => [SYNC_STATUS.CONFIRMED, SYNC_STATUS.SYNCING, SYNC_STATUS.FAILED].includes(entry.syncStatus))
            : (resend ? synced : unsynced);
        const alreadySynced = synced.length;
        const invalid = eligible.some(entry => entry.endTimestamp === null || this.getEntryDuration(entry) <= 0 || this.getEntryDuration(entry) > 24 * 60 * 60 * 1000);
        const list = document.getElementById('syncConfirmEntriesList');
        const desc = document.getElementById('syncConfirmDesc');
        const summary = document.getElementById('syncConfirmSummary');
        const notice = document.getElementById('syncConfirmAlreadySyncedNotice');
        const submit = document.getElementById('syncConfirmSubmitBtn');
        this.syncConfirmationOpen = true;

        this.confirmedSyncEntries = eligible.map(entry => ({ ...entry }));
        desc.textContent = this.clockodoConfigured
            ? this.t('confirmSyncDesc', { count: eligible.length })
            : this.t('confirmSyncDescLocal', { count: eligible.length });
        list.innerHTML = eligible.map(entry => {
            const activity = this.activities.find(item => item.id === entry.activityId);
            const title = activity?.name || entry.activityNameSnapshot || this.t('activity');
            const sendStart = this.clockodoSendTimestamp(entry.startTimestamp);
            const sendEnd = this.clockodoSendTimestamp(entry.endTimestamp);
            return `<div class="sync-confirm-item"><span>${this.escapeHtml(title)} · ${this.escapeHtml(this.formatTime(sendStart))}–${this.escapeHtml(this.formatTime(sendEnd))}</span><strong>${this.formatDuration(this.getEntryDuration(entry))}</strong></div>`;
        }).join('') || `<div class="review-empty">${this.t('noEntriesToSync')}</div>`;
        const total = eligible.reduce((sum, entry) => sum + this.getEntryDuration(entry), 0);
        summary.innerHTML = `<span>${this.t('syncSummaryTotal')}</span><strong>${this.formatDuration(total)}</strong>`;
        notice.textContent = resend
            ? this.t('resendSyncNotice')
            : this.t('alreadySyncedNotice', { count: alreadySynced });
        notice.style.display = resend || alreadySynced ? '' : 'none';
        submit.disabled = invalid || eligible.length === 0;
        submit.textContent = resend
            ? this.t('resendSyncBtn')
            : (this.clockodoConfigured ? this.t('confirmSyncBtn') : this.t('confirmDayBtn'));
        if (invalid) {
            notice.textContent = this.t('dayReviewInvalid');
            notice.style.display = '';
        }
        document.getElementById('syncConfirmModal').classList.add('active');
    }

    closeSyncConfirmationModal() {
        document.getElementById('syncConfirmModal')?.classList.remove('active');
        this.confirmedSyncEntries = [];
        this.syncConfirmationOpen = false;
        this.syncResendMode = false;
    }

    async confirmDayReview({ resend = false } = {}) {
        const statuses = resend
            ? [SYNC_STATUS.SYNCED]
            : [SYNC_STATUS.UNSYNCED, SYNC_STATUS.FAILED];
        const entries = this.getDayEntries(this.reviewDate)
            .filter(entry => statuses.includes(entry.syncStatus));
        if (!entries.length) return false;
        if (entries.some(entry => entry.endTimestamp === null || entry.endTimestamp <= entry.startTimestamp || entry.endTimestamp - entry.startTimestamp > 24 * 60 * 60 * 1000)) {
            this.showToast(this.t('dayReviewInvalid'));
            return false;
        }

        const dateBatches = this.syncBatches.filter(batch => batch.date === this.reviewDate);
        const version = dateBatches.reduce((latest, batch) => Math.max(latest, Number(batch.version) || 0), 0) + 1;
        const batchId = this.generateId();
        const confirmedAt = Date.now();
        const frozenEntries = entries.map(entry => ({
            ...entry,
            syncStatus: SYNC_STATUS.CONFIRMED,
            syncBatchId: batchId,
            clockodoResend: resend,
            clockodoIdempotencyKey: resend ? `timerhub-entry:${entry.id}:resend:${batchId}` : null,
            clockodoPayload: null
        }));
        const batch = {
            id: batchId,
            date: this.reviewDate,
            version,
            state: SYNC_STATUS.CONFIRMED,
            confirmedAt,
            entries: frozenEntries.map(entry => ({ ...entry, durationMs: entry.endTimestamp - entry.startTimestamp }))
        };

        await this.storage.saveConfirmedBatch(batch, frozenEntries);
        const frozenById = new Map(frozenEntries.map(entry => [entry.id, entry]));
        this.timeEntries = this.timeEntries.map(entry => frozenById.get(entry.id) || entry);
        this.syncBatches.push(batch);
        this.closeSyncConfirmationModal();
        this.renderReview();
        this.showToast(this.t('dayReviewConfirmed'));
        return batch;
    }

    async confirmAndSyncClockodo() {
        if (!this.syncConfirmationOpen) return false;
        const resend = this.syncResendMode === true;
        let batch = null;
        if (!resend) {
            batch = this.syncBatches.filter(item => item.date === this.reviewDate)
                .sort((a, b) => b.version - a.version)
                .find(item => [SYNC_STATUS.CONFIRMED, SYNC_STATUS.FAILED, SYNC_STATUS.SYNCING, 'partial'].includes(item.state) &&
                    item.entries.some(entry => [SYNC_STATUS.CONFIRMED, SYNC_STATUS.FAILED, SYNC_STATUS.SYNCING].includes(entry.syncStatus)));
        }
        if (!batch) batch = await this.confirmDayReview({ resend });
        else this.closeSyncConfirmationModal();
        if (!batch) return false;
        if (!this.clockodoConfigured) {
            this.showToast(this.t('dayReviewConfirmed'));
            return batch;
        }
        return this.syncConfirmedBatch(batch.id);
    }

    async persistSyncProgress(batch) {
        const currentById = new Map(this.timeEntries.map(entry => [entry.id, entry]));
        const updatedEntries = batch.entries.map(snapshot => {
            const local = currentById.get(snapshot.id);
            const updated = { ...snapshot };
            if (local) Object.assign(local, updated);
            else this.timeEntries.push(updated);
            return updated;
        });
        await this.storage.saveSyncProgress(batch, updatedEntries);
        const index = this.syncBatches.findIndex(item => item.id === batch.id);
        if (index < 0) this.syncBatches.push(batch);
        else this.syncBatches[index] = batch;
        this.renderReview();
    }

    syncConfirmedBatch(batchId) {
        if (this.syncOperations.has(batchId)) return this.syncOperations.get(batchId);
        const operation = this.performConfirmedBatchSync(batchId);
        this.syncOperations.set(batchId, operation);
        return operation.finally(() => {
            if (this.syncOperations.get(batchId) === operation) this.syncOperations.delete(batchId);
        });
    }

    async performConfirmedBatchSync(batchId) {
        const batch = this.syncBatches.find(item => item.id === batchId);
        if (!batch || ![SYNC_STATUS.CONFIRMED, SYNC_STATUS.FAILED, SYNC_STATUS.SYNCING, 'partial'].includes(batch.state)) return false;
        if (!this.clockodoConfigured || !this.clockodoClient) {
            this.showToast(this.t('clockodoConfigMissing'));
            return false;
        }
        const pending = batch.entries.filter(entry => [SYNC_STATUS.CONFIRMED, SYNC_STATUS.FAILED, SYNC_STATUS.SYNCING].includes(entry.syncStatus));
        if (!pending.length) return false;
        const accessToken = this.getClockodoAccessToken();
        const clientId = this.getPushClientId();
        batch.state = SYNC_STATUS.SYNCING;
        batch.startedAt = Date.now();
        await this.persistSyncProgress(batch);

        for (const snapshot of pending) {
            const entry = batch.entries.find(item => item.id === snapshot.id);
            if (entry.clockodoEntryId && !entry.clockodoResend) {
                entry.syncStatus = SYNC_STATUS.LOCAL_ONLY;
                entry.clockodoError = null;
                entry.clockodoErrorDetails = null;
                await this.persistSyncProgress(batch);
                continue;
            }
            entry.syncStatus = SYNC_STATUS.SYNCING;
            entry.clockodoError = null;
            entry.clockodoErrorDetails = null;
            if (entry.clockodoPayload &&
                typeof this.clockodoClient.isNormalizedEntryPayload === 'function' &&
                !this.clockodoClient.isNormalizedEntryPayload(entry.clockodoPayload)) {
                entry.clockodoPayload = null;
            }
            if (!entry.clockodoPayload) {
                try {
                    const activity = this.activities.find(item => item.id === entry.activityId)
                        || this.archivedActivities?.find(item => item.id === entry.activityId);
                    entry.clockodoPayload = this.clockodoClient.buildEntryPayload(entry, {
                        customerId: activity?.customerId || this.clockodoCustomerId,
                        projectId: this.clockodoProjectId,
                        serviceId: activity?.serviceId || this.clockodoServiceId,
                        billable: this.clockodoBillable
                    });
                } catch (error) {
                    entry.syncStatus = SYNC_STATUS.FAILED;
                    entry.clockodoError = error?.code || 'invalid_assignment';
                    entry.clockodoErrorDetails = null;
                    await this.persistSyncProgress(batch);
                    continue;
                }
            }
            await this.persistSyncProgress(batch);
            try {
                // Use the local entry identity across batch versions. A restored older backup
                // must not create a second Clockodo record for an entry already accepted.
                const idempotencyKey = entry.clockodoIdempotencyKey || `timerhub-entry:${entry.id}`;
                const result = await this.clockodoClient.createEntry(clientId, accessToken, entry.clockodoPayload, idempotencyKey);
                if (result.created !== true || !Number.isSafeInteger(Number(result.entryId)) || Number(result.entryId) <= 0) {
                    entry.syncStatus = SYNC_STATUS.UNKNOWN;
                    entry.clockodoError = 'malformed_response';
                    entry.clockodoErrorDetails = null;
                } else {
                    entry.syncStatus = SYNC_STATUS.SYNCED;
                    entry.clockodoEntryId = Number(result.entryId);
                    entry.clockodoSyncedAt = Date.now();
                    entry.clockodoError = null;
                    entry.clockodoErrorDetails = null;
                }
            } catch (error) {
                const uncertain = ['network_error', 'timeout', 'malformed_response', 'network_outcome_unknown', 'timeout_outcome_unknown', 'operation_outcome_unknown', 'clockodo_outcome_unknown'].includes(error?.code);
                entry.syncStatus = uncertain ? SYNC_STATUS.UNKNOWN : SYNC_STATUS.FAILED;
                entry.clockodoError = error?.code || 'request_rejected';
                entry.clockodoErrorDetails = uncertain ? null : this.normalizeClockodoErrorDetails(error?.details);
            }
            await this.persistSyncProgress(batch);
        }

        const states = batch.entries.map(entry => entry.syncStatus);
        const succeeded = states.filter(state => state === SYNC_STATUS.SYNCED).length;
        const failed = states.filter(state => state === SYNC_STATUS.FAILED).length;
        const unknown = states.filter(state => state === SYNC_STATUS.UNKNOWN).length;
        const localOnly = states.filter(state => state === SYNC_STATUS.LOCAL_ONLY).length;
        if (states.every(state => state === SYNC_STATUS.SYNCED)) batch.state = SYNC_STATUS.SYNCED;
        else if (succeeded > 0) batch.state = 'partial';
        else if (unknown > 0) batch.state = SYNC_STATUS.UNKNOWN;
        else if (localOnly > 0 && failed === 0) batch.state = SYNC_STATUS.LOCAL_ONLY;
        else batch.state = SYNC_STATUS.FAILED;
        batch.finishedAt = Date.now();
        await this.persistSyncProgress(batch);

        if (batch.state === SYNC_STATUS.SYNCED) this.showToast(this.t('syncSuccessToast', { count: succeeded }));
        else if (batch.state === SYNC_STATUS.LOCAL_ONLY) this.showToast(this.t('syncLocalOnlyToast', { count: localOnly }));
        else if (localOnly > 0 && failed === 0 && unknown === 0) this.showToast(this.t('syncLocalOnlyToast', { count: localOnly }));
        else if (batch.state === SYNC_STATUS.UNKNOWN) this.showToast(this.t('syncOutcomeUnknown'));
        else if (batch.state === SYNC_STATUS.FAILED) {
            const firstFailure = batch.entries.find(entry => entry.syncStatus === SYNC_STATUS.FAILED);
            this.showToast(this.t('syncFailedToast', {
                error: this.clockodoErrorMessage({
                    code: firstFailure?.clockodoError,
                    details: firstFailure?.clockodoErrorDetails
                })
            }));
        } else this.showToast(this.t('syncPartialFailureToast', { success: succeeded, failed: failed + unknown }));
        return batch;
    }

    retrySyncBatch(batchId) {
        return this.syncConfirmedBatch(batchId);
    }

    async retryFailedEntry(batchId, entryId) {
        this.retryDiagnostic = { entryId: String(entryId), pending: true };
        this.renderReview();
        let thrown = null;
        let result = null;
        try {
            result = await this.retrySyncBatch(batchId);
        } catch (error) {
            thrown = error;
        }
        const batch = this.syncBatches.find(item => item.id === batchId) || null;
        const entries = Array.isArray(batch?.entries) ? batch.entries : [];
        const pressed = entries.find(entry => String(entry.id) === String(entryId));
        const failedEntry = pressed && pressed.syncStatus === SYNC_STATUS.FAILED
            ? pressed
            : entries.find(entry => entry.syncStatus === SYNC_STATUS.FAILED) || null;
        if (failedEntry || thrown || result === false) {
            this.retryDiagnostic = this.buildRetryDiagnostic({
                entryId: failedEntry?.id ?? entryId,
                entry: failedEntry,
                error: thrown,
                batchState: batch?.state ?? null,
                retryResult: result
            });
        } else {
            this.retryDiagnostic = null;
        }
        this.renderReview();
        return result;
    }

    buildRetryDiagnostic({ entryId, entry, error, batchState, retryResult }) {
        const details = this.normalizeClockodoErrorDetails(entry?.clockodoErrorDetails)
            || this.normalizeClockodoErrorDetails(error?.details);
        const code = this.sanitizeRetryText(error?.code || entry?.clockodoError || '');
        const statusValue = Number(details?.status ?? error?.status);
        const status = Number.isSafeInteger(statusValue) && statusValue > 0 ? statusValue : null;
        let message = this.sanitizeRetryText(details?.message || '');
        if (!message && error?.message && !error?.code) message = this.sanitizeRetryText(error.message);
        if (!message && code) message = this.sanitizeRetryText(this.clockodoErrorMessage({ code, details }));
        if (!message && retryResult === false) {
            message = this.sanitizeRetryText(`${this.t('retryDiagnosticUnavailable')}${batchState ? ` [${batchState}]` : ''}`);
        }
        const detailParts = [];
        if (details?.code && String(details.code) !== code) detailParts.push(String(details.code));
        if (details?.path) detailParts.push(`path: ${details.path}`);
        if (Array.isArray(details?.fields) && details.fields.length) detailParts.push(`fields: ${details.fields.join(', ')}`);
        if (batchState) detailParts.push(`batch: ${batchState}`);
        return {
            entryId: String(entryId),
            code: code || null,
            status,
            message: message || null,
            details: detailParts.length ? this.sanitizeRetryText(detailParts.join(' · ')) : null
        };
    }

    sanitizeRetryText(value) {
        return String(value ?? '')
            .replace(/[\u0000-\u001f\u007f]+/g, ' ')
            .replace(/\b(Bearer|Basic)\s+[A-Za-z0-9._~+/=-]+/gi, '$1 [redacted]')
            .replace(/((?:api[_-]?key|token|secret|password|authorization|client[_-]?id)\s*[=:]\s*)[^\s,;]+/gi, '$1[redacted]')
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 300);
    }

    renderRetryDiagnostic(diagnostic) {
        const lines = [];
        const errorText = [diagnostic.code, diagnostic.message].filter(Boolean).join(' · ');
        if (errorText) lines.push(`${this.t('retryDiagnosticError')}: ${errorText}`);
        if (diagnostic.status) lines.push(`${this.t('retryDiagnosticStatus')}: ${diagnostic.status}`);
        if (diagnostic.details) lines.push(`${this.t('retryDiagnosticDetails')}: ${diagnostic.details}`);
        return `<div class="warning retry-diagnostic" role="alert" style="display:block;margin-top:8px;"><strong>${this.escapeHtml(this.t('retryDiagnosticTitle'))}</strong>${lines.map(line => `<small style="display:block;">${this.escapeHtml(line)}</small>`).join('')}</div>`;
    }

    renderAll() {
        this.applyTranslations();
        this.renderMain();
        this.renderReview();
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

        const keyInput = document.getElementById('clockodoApiKeyInput');
        const keyToggle = document.getElementById('clockodoToggleKeyBtn');
        if (keyInput && keyToggle) {
            keyToggle.textContent = keyInput.type === 'password' ? this.t('showSecret') : this.t('hideSecret');
        }

        const syncModal = document.getElementById('syncConfirmModal');
        if (this.syncConfirmationOpen && syncModal?.classList.contains('active')) {
            this.showSyncConfirmationModal();
        }

        this.refreshClockodoAssignmentViews();
    }

    renderMain() {
        const grid = document.getElementById('activitiesGrid');
        this.updateTimerStatus();
        if (!grid) return;
        this.updateCanvasGroupAction();
        grid.setAttribute('aria-busy', String(Boolean(this.timerActionInProgress)));
        grid.replaceChildren();
        this.canvasZIndex = 1;
        this.applyCanvasTransform(grid);
        this.groupDisplayOffsets = this.computeGroupDisplayOffsets();

        if (!this.activities.length) {
            const empty = document.createElement('div');
            empty.className = 'activity-empty';
            const title = document.createElement('h3');
            title.textContent = this.t('noActivitiesTitle');
            const message = document.createElement('p');
            message.textContent = this.t('noActivitiesMessage');
            empty.append(title, message);
            grid.appendChild(empty);
            this.populateActivityFilter();
            return;
        }

        this.renderGroups(grid);

        this.activities.forEach((activity, index) => {
            if (this.activityGroup(activity)?.collapsed) return;
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = `activity-btn activity-node ${activity.size || 'medium'}`;
            if (this.activeActivityId === activity.id) {
                btn.classList.add('active');
            }
            if (this.selectedActivityIds?.has(activity.id)) {
                btn.classList.add('selected');
            }
            btn.dataset.activityId = activity.id;
            btn.disabled = Boolean(this.timerActionInProgress);
            const layout = this.getActivityCanvasLayout(activity, index);
            btn.style.left = `${layout.x}px`;
            btn.style.top = `${layout.y}px`;
            btn.style.width = `${layout.width}px`;
            btn.style.height = `${layout.height}px`;
            const nodeZIndex = this.canvasZIndex;
            this.canvasZIndex += 2;
            btn.style.zIndex = String(nodeZIndex);
            const activityShape = ['circle', 'square', 'rounded', 'diamond', 'triangle', 'hexagon', 'octagon', 'star', 'heart', 'oval'].includes(activity.shape)
                ? activity.shape : 'rounded';
            btn.dataset.shape = activityShape;
            btn.classList.add(`activity-shape-${activityShape}`);
            btn.setAttribute('aria-pressed', String(this.activeActivityId === activity.id));
            btn.setAttribute('aria-label', this.activeActivityId === activity.id
                ? this.t('activityStopAria', { activity: activity.name })
                : this.t('activityStartAria', { activity: activity.name }));
            const activityColor = activity.color || '#18794e';
            btn.style.setProperty('--activity-accent', activityColor);
            // Activity text color MUST derive from the background: white -> black, black -> white.
            btn.style.setProperty('--activity-text-color', this.contrastingTextColor(activityColor));

            const name = document.createElement('div');
            name.className = 'btn-name';
            name.textContent = activity.name;

            const colorMark = document.createElement('span');
            colorMark.className = 'activity-color-mark';
            colorMark.style.backgroundColor = activity.color || '#18794e';
            colorMark.setAttribute('aria-hidden', 'true');
            btn.appendChild(colorMark);
            btn.appendChild(name);

            if (this.activeActivityId === activity.id) {
                const state = document.createElement('span');
                state.className = 'btn-state';
                state.textContent = this.t('timerRunning');
                btn.appendChild(state);
                const entry = this.timeEntries.find(e => e.activityId === activity.id && e.endTimestamp === null);
                if (entry) {
                    const timeEl = document.createElement('div');
                    timeEl.className = 'btn-time';
                    timeEl.textContent = `${this.t('since')} ${this.formatTime(entry.startTimestamp)}`;
                    
                    const durationEl = document.createElement('div');
                    durationEl.className = 'btn-duration';
                    durationEl.textContent = this.formatDuration(this.getActiveDuration());
                    
                    btn.appendChild(timeEl);
                    btn.appendChild(durationEl);
                }
                const hint = document.createElement('span');
                hint.className = 'btn-hint';
                hint.textContent = this.t('activityStopHint');
                btn.appendChild(hint);
            } else {
                const hint = document.createElement('span');
                hint.className = 'btn-hint';
                hint.textContent = this.t('activityStartHint');
                btn.appendChild(hint);
            }

            // Click events
            btn.addEventListener('click', async () => {
                if (this.suppressActivityClick?.activityId === activity.id && Date.now() < this.suppressActivityClick.until) {
                    this.suppressActivityClick = null;
                    return;
                }
                if (this.timerActionInProgress) return;
                this.timerActionInProgress = true;
                this.timerActionState = 'saving';
                this.renderMain();
                try {
                    await this.toggleActivity(activity.id);
                    this.timerActionState = 'idle';
                } catch {
                    this.timerActionState = 'error';
                    this.showToast(this.t('timerSaveFailed'));
                } finally {
                    this.timerActionInProgress = false;
                    this.renderMain();
                }
            });

            grid.appendChild(btn);

            const resize = document.createElement('button');
            resize.type = 'button';
            resize.className = 'activity-resize-handle';
            resize.dataset.activityId = activity.id;
            resize.style.left = `${layout.x + layout.width}px`;
            resize.style.top = `${layout.y + layout.height}px`;
            resize.style.zIndex = String(nodeZIndex + 1);
            resize.setAttribute('aria-label', this.t('activityResize', { activity: activity.name }));
            resize.title = this.t('activityResize', { activity: activity.name });
            resize.addEventListener('click', event => event.stopPropagation());
            grid.appendChild(resize);
        });

        this.populateActivityFilter();
    }

    renderGroups(grid) {
        for (const group of this.groups) {
            const members = this.activities.filter(activity => activity.groupId === group.id);
            if (!members.length) continue;
            const container = document.createElement('div');
            container.className = `group-container${group.collapsed ? ' is-collapsed' : ''}`;
            container.dataset.groupId = group.id;
            container.style.zIndex = '0';

            const title = document.createElement('div');
            title.className = 'group-title';
            title.dataset.groupId = group.id;

            const collapseButton = document.createElement('button');
            collapseButton.type = 'button';
            collapseButton.className = 'group-collapse-btn';
            collapseButton.dataset.groupId = group.id;
            collapseButton.setAttribute('aria-expanded', String(!group.collapsed));
            collapseButton.setAttribute('aria-label', group.collapsed ? this.t('expandGroup') : this.t('collapseGroup'));
            collapseButton.textContent = group.collapsed ? '▸' : '▾';
            collapseButton.addEventListener('pointerdown', event => event.stopPropagation());
            collapseButton.addEventListener('click', event => {
                event.stopPropagation();
                this.toggleGroupCollapsed(group.id);
            });

            const titleText = document.createElement('span');
            titleText.className = 'group-title-text';
            titleText.textContent = group.name;

            const duplicateButton = document.createElement('button');
            duplicateButton.type = 'button';
            duplicateButton.className = 'group-duplicate-btn';
            duplicateButton.dataset.groupId = group.id;
            duplicateButton.setAttribute('aria-label', this.t('duplicateGroup'));
            duplicateButton.textContent = '⧉';
            duplicateButton.addEventListener('pointerdown', event => event.stopPropagation());
            duplicateButton.addEventListener('click', event => {
                event.stopPropagation();
                this.duplicateGroup(group.id);
            });

            title.appendChild(collapseButton);
            title.appendChild(titleText);
            title.appendChild(duplicateButton);
            container.appendChild(title);

            if (group.collapsed) {
                container.style.left = `${group.x - CANVAS_GROUP_PADDING}px`;
                container.style.top = `${group.y - CANVAS_GROUP_HEADER}px`;
                container.style.width = `${CANVAS_GROUP_COLLAPSED_WIDTH}px`;
                container.style.height = `${CANVAS_GROUP_COLLAPSED_HEIGHT}px`;
            } else {
                this.applyGroupGeometry(container, this.groupMemberBoxes(group));
            }

            grid.appendChild(container);
        }
    }

    groupMemberBoxes(group, includeDisplayOffset = true) {
        return this.activities
            .filter(activity => activity.groupId === group.id)
            .map(activity => this.getActivityCanvasLayout(activity, this.activities.indexOf(activity), includeDisplayOffset));
    }

    groupDisplayOffset(groupId) {
        return this.groupDisplayOffsets?.get(groupId) || { x: 0, y: 0 };
    }

    groupContainerBounds(boxes) {
        const left = Math.min(...boxes.map(box => box.x)) - CANVAS_GROUP_PADDING;
        const top = Math.min(...boxes.map(box => box.y)) - CANVAS_GROUP_HEADER;
        const right = Math.max(...boxes.map(box => box.x + box.width)) + CANVAS_GROUP_PADDING;
        const bottom = Math.max(...boxes.map(box => box.y + box.height)) + CANVAS_GROUP_PADDING;
        return { left, top, right, bottom, width: right - left, height: bottom - top };
    }

    computeGroupDisplayOffsets() {
        const offsets = new Map();
        const placed = [];
        for (const group of this.groups) {
            if (group.collapsed) continue;
            const boxes = this.groupMemberBoxes(group, false);
            if (!boxes.length) continue;
            const bounds = this.groupContainerBounds(boxes);
            let left = bounds.left;
            let top = bounds.top;
            let shifted = true;
            while (shifted) {
                shifted = false;
                for (const other of placed) {
                    const candidate = { left, top, right: left + bounds.width, bottom: top + bounds.height };
                    if (!this.rectanglesIntersect(candidate, other)) continue;
                    const shiftRight = other.right + CANVAS_GROUP_PADDING - candidate.left;
                    const shiftDown = other.bottom + CANVAS_GROUP_PADDING - candidate.top;
                    if (shiftRight <= shiftDown) left += shiftRight;
                    else top += shiftDown;
                    shifted = true;
                }
            }
            placed.push({ left, top, right: left + bounds.width, bottom: top + bounds.height });
            offsets.set(group.id, { x: left - bounds.left, y: top - bounds.top });
        }
        return offsets;
    }

    applyGroupGeometry(container, boxes) {
        const minX = Math.min(...boxes.map(box => box.x));
        const minY = Math.min(...boxes.map(box => box.y));
        const maxX = Math.max(...boxes.map(box => box.x + box.width));
        const maxY = Math.max(...boxes.map(box => box.y + box.height));
        container.style.left = `${minX - CANVAS_GROUP_PADDING}px`;
        container.style.top = `${minY - CANVAS_GROUP_HEADER}px`;
        container.style.width = `${(maxX - minX) + CANVAS_GROUP_PADDING * 2}px`;
        container.style.height = `${(maxY - minY) + CANVAS_GROUP_HEADER + CANVAS_GROUP_PADDING}px`;
    }

    positionGroupVisuals(group) {
        const stage = document.getElementById('activitiesGrid');
        if (!stage) return;
        const boxes = [];
        for (const activity of this.activities) {
            if (activity.groupId !== group.id) continue;
            const layout = this.getActivityCanvasLayout(activity, this.activities.indexOf(activity));
            const button = stage.querySelector(
                `.activity-btn[data-activity-id="${CSS.escape(activity.id)}"]`
            );
            if (button) {
                button.style.left = `${layout.x}px`;
                button.style.top = `${layout.y}px`;
            }
            this.positionActivityResizeHandle(activity.id, layout);
            boxes.push(layout);
        }
        const container = stage.querySelector(
            `.group-container[data-group-id="${CSS.escape(group.id)}"]`
        );
        if (!container) return;
        container.children[0]?.classList.add('dragging');
        if (group.collapsed) {
            container.style.left = `${group.x - CANVAS_GROUP_PADDING}px`;
            container.style.top = `${group.y - CANVAS_GROUP_HEADER}px`;
        } else if (boxes.length) {
            this.applyGroupGeometry(container, boxes);
        }
    }

    async toggleGroupCollapsed(groupId) {
        const group = this.groups.find(item => item.id === groupId);
        if (!group) return null;
        group.collapsed = !group.collapsed;
        try {
            await this.storage.saveGroup?.(group);
        } catch {
            this.showToast(this.t('groupCreateFailed'));
        }
        this.renderMain();
        this.pruneCanvasSelection();
        return group;
    }

    async setAllGroupsCollapsed(collapsed) {
        if (!this.groups.length) return false;
        for (const group of this.groups) group.collapsed = collapsed;
        for (const group of this.groups) {
            try {
                await this.storage.saveGroup?.(group);
            } catch {
                this.showToast(this.t('groupCreateFailed'));
            }
        }
        this.renderMain();
        this.pruneCanvasSelection();
        return true;
    }

    async collapseAllGroups() {
        return this.setAllGroupsCollapsed(true);
    }

    async expandAllGroups() {
        return this.setAllGroupsCollapsed(false);
    }

    async duplicateGroup(groupId) {
        const group = this.groups.find(item => item.id === groupId);
        if (!group) return null;
        const members = this.activities.filter(activity => activity.groupId === group.id);
        const duplicate = {
            id: this.generateId(),
            name: this.t('groupCopyName', { name: group.name }),
            x: this.snapToCanvasGrid(group.x + CANVAS_GROUP_DUPLICATE_OFFSET),
            y: this.snapToCanvasGrid(group.y + CANVAS_GROUP_DUPLICATE_OFFSET),
            collapsed: false
        };
        const now = Date.now();
        let position = Math.max(0, ...this.activities.map(activity => Number(activity.position) || 0));
        const copies = members.map(activity => {
            const { id, groupId: _groupId, ...rest } = activity;
            const copy = {
                ...rest,
                id: this.generateId(),
                groupId: duplicate.id,
                position: ++position,
                createdAt: now,
                updatedAt: now
            };
            const saved = this.activityLayouts.get(activity.id);
            const layout = saved
                ? { ...saved, activityId: copy.id }
                : { activityId: copy.id, x: 0, y: 0, width: 260, height: 150 };
            return { copy, layout };
        });
        this.groups.push(duplicate);
        try {
            await this.storage.saveGroup?.(duplicate);
            for (const { copy, layout } of copies) {
                await this.storage.saveActivity(copy);
                await this.storage.saveLayout(layout);
                this.activities.push(copy);
                this.activityLayouts.set(copy.id, layout);
            }
        } catch {
            this.groups = this.groups.filter(item => item.id !== duplicate.id);
            for (const { copy } of copies) {
                this.activities = this.activities.filter(item => item.id !== copy.id);
                this.activityLayouts.delete(copy.id);
            }
            this.showToast(this.t('groupCreateFailed'));
            return null;
        }
        this.renderMain();
        this.showToast(this.t('groupDuplicated', { name: duplicate.name }));
        return duplicate;
    }

    getActivityCanvasLayout(activity, index, includeDisplayOffset = true) {
        const saved = this.activityLayouts.get(activity.id);
        const group = this.activityGroup(activity);
        const sizeDefaults = { small: [220, 120], medium: [260, 150], large: [320, 190] };
        const [defaultWidth, defaultHeight] = sizeDefaults[activity.size] || sizeDefaults.medium;
        const order = Number.isFinite(Number(activity.position)) ? Number(activity.position) : index;
        const angle = order * 2.399963229728653;
        const radius = 82 * Math.sqrt(Math.max(0, order));
        const layout = {
            x: this.clampCanvasCoordinate(
                saved?.x,
                24 + radius * (1 + Math.cos(angle)),
                group ? -10000 : 0,
                group ? 10000 : 2800
            ),
            y: this.clampCanvasCoordinate(
                saved?.y,
                24 + radius * (1 + Math.sin(angle)),
                group ? -10000 : 0,
                group ? 10000 : 1600
            ),
            width: this.clampCanvasCoordinate(saved?.width, defaultWidth, 160, 640),
            height: this.clampCanvasCoordinate(saved?.height, defaultHeight, 110, 520)
        };
        if (group) {
            layout.x += group.x;
            layout.y += group.y;
            if (includeDisplayOffset) {
                const offset = this.groupDisplayOffset(group.id);
                layout.x += offset.x;
                layout.y += offset.y;
            }
        }
        return layout;
    }

    activityGroup(activity) {
        if (!activity?.groupId) return null;
        return this.groups.find(group => group.id === activity.groupId) || null;
    }

    clampCanvasCoordinate(value, fallback, min, max) {
        const number = Number(value);
        return Number.isFinite(number) ? Math.max(min, Math.min(max, number)) : fallback;
    }

    snapToCanvasGrid(value) {
        const number = Number(value);
        return Number.isFinite(number)
            ? Math.round(number / CANVAS_GRID_SIZE) * CANVAS_GRID_SIZE
            : 0;
    }

    magneticActivityOthers(excludeId) {
        return this.activities
            .filter(activity => activity.id !== excludeId && !this.activityGroup(activity)?.collapsed)
            .map(activity => this.getActivityCanvasLayout(activity, this.activities.indexOf(activity)));
    }

    magneticActivityAdjustment(layout, others, threshold = CANVAS_GRID_SIZE) {
        const collect = (candidates, start, size, otherStart, otherSize) => {
            const targets = [otherStart, otherStart + otherSize, otherStart + otherSize / 2];
            const origins = [start, start + size, start + size / 2];
            for (const target of targets) {
                for (const origin of origins) {
                    const delta = target - origin;
                    if (Math.abs(delta) <= threshold) candidates.push(delta);
                }
            }
        };
        const x = [];
        const y = [];
        for (const other of others) {
            if (!other) continue;
            collect(x, layout.x, layout.width, other.x, other.width);
            collect(y, layout.y, layout.height, other.y, other.height);
        }
        const nearest = deltas => deltas.length
            ? deltas.reduce((best, delta) => (Math.abs(delta) < Math.abs(best) ? delta : best))
            : 0;
        return { x: nearest(x), y: nearest(y) };
    }

    selectionRectFromPoints(start, current) {
        return {
            left: Math.min(start.x, current.x),
            top: Math.min(start.y, current.y),
            right: Math.max(start.x, current.x),
            bottom: Math.max(start.y, current.y)
        };
    }

    rectanglesIntersect(a, b) {
        return a.left <= b.right && a.right >= b.left && a.top <= b.bottom && a.bottom >= b.top;
    }

    ensureCanvasSelectionRect(viewport) {
        if (this.canvasSelectionElement) return this.canvasSelectionElement;
        const element = document.createElement('div');
        element.className = 'canvas-selection-rect';
        element.setAttribute('aria-hidden', 'true');
        viewport.appendChild(element);
        this.canvasSelectionElement = element;
        return element;
    }

    beginCanvasSelection(gesture, viewport) {
        gesture.mode = 'select';
        gesture.started = true;
        gesture.selectStartX = gesture.startX;
        gesture.selectStartY = gesture.startY;
        this.ensureCanvasSelectionRect(viewport);
        this.updateCanvasSelection(gesture, gesture.lastX, gesture.lastY);
    }

    updateCanvasSelection(gesture, clientX, clientY) {
        gesture.selectCurrentX = clientX;
        gesture.selectCurrentY = clientY;
        const element = this.canvasSelectionElement;
        if (!element) return;
        const viewport = document.getElementById('activityCanvasViewport');
        const viewportRect = viewport && typeof viewport.getBoundingClientRect === 'function'
            ? viewport.getBoundingClientRect()
            : { left: 0, top: 0 };
        const bounds = this.selectionRectFromPoints(
            { x: gesture.selectStartX, y: gesture.selectStartY },
            { x: clientX, y: clientY }
        );
        element.style.display = 'block';
        element.style.left = `${bounds.left - viewportRect.left}px`;
        element.style.top = `${bounds.top - viewportRect.top}px`;
        element.style.width = `${bounds.right - bounds.left}px`;
        element.style.height = `${bounds.bottom - bounds.top}px`;
    }

    hideCanvasSelectionRect() {
        if (this.canvasSelectionElement) this.canvasSelectionElement.style.display = 'none';
    }

    setCanvasSelection(ids) {
        this.selectedActivityIds = new Set(ids);
        const buttons = document.querySelectorAll?.('.activity-btn') || [];
        for (const button of buttons) {
            button.classList.toggle('selected', this.selectedActivityIds.has(button.dataset.activityId));
        }
        this.updateCanvasGroupAction();
    }

    updateCanvasGroupAction() {
        const button = document.getElementById('createGroupBtn');
        if (button) {
            const count = this.selectedActivityIds?.size || 0;
            const label = this.t('createGroupFromSelection', { count });
            button.hidden = count === 0;
            button.setAttribute('aria-label', label);
            button.title = label;
        }
        const toggleAll = document.getElementById('groupToggleAllBtn');
        if (toggleAll) {
            const hasGroups = this.groups.length > 0;
            const anyExpanded = this.groups.some(group => !group.collapsed);
            const label = anyExpanded ? this.t('collapseAllGroups') : this.t('expandAllGroups');
            toggleAll.hidden = !hasGroups;
            toggleAll.setAttribute('aria-label', label);
            toggleAll.title = label;
            toggleAll.dataset.action = anyExpanded ? 'collapse' : 'expand';
        }
    }

    pruneCanvasSelection() {
        if (!this.selectedActivityIds?.size) return;
        const valid = new Set();
        for (const id of this.selectedActivityIds) {
            const activity = this.activities.find(item => item.id === id);
            if (!activity) continue;
            const group = this.activityGroup(activity);
            if (group?.collapsed) continue;
            valid.add(id);
        }
        if (valid.size !== this.selectedActivityIds.size) this.setCanvasSelection(valid);
    }

    openGroupModal() {
        if (!this.selectedActivityIds?.size) {
            this.showToast(this.t('selectActivitiesFirst'));
            return false;
        }
        const modal = document.getElementById('groupModal');
        const input = document.getElementById('groupNameInput');
        if (input) input.value = '';
        modal?.classList.add('active');
        input?.focus?.();
        return true;
    }

    closeGroupModal() {
        document.getElementById('groupModal')?.classList.remove('active');
    }

    async createGroupFromSelection(name) {
        const selected = [...(this.selectedActivityIds || [])];
        const members = this.activities.filter(activity => selected.includes(activity.id));
        if (!members.length) {
            this.showToast(this.t('selectActivitiesFirst'));
            return null;
        }
        const entries = members.map(activity => ({
            activity,
            layout: this.getActivityCanvasLayout(activity, this.activities.indexOf(activity))
        }));
        const minX = Math.min(...entries.map(entry => entry.layout.x));
        const minY = Math.min(...entries.map(entry => entry.layout.y));
        const group = {
            id: this.generateId(),
            name: String(name || '').trim() || this.t('groupDefaultName', { number: this.groups.length + 1 }),
            x: this.snapToCanvasGrid(minX),
            y: this.snapToCanvasGrid(minY),
            collapsed: false
        };
        this.groups.push(group);
        try {
            await this.storage.saveGroup?.(group);
            for (const { activity, layout } of entries) {
                activity.groupId = group.id;
                await this.storage.saveActivity(activity);
                const stored = {
                    activityId: activity.id,
                    x: layout.x - group.x,
                    y: layout.y - group.y,
                    width: layout.width,
                    height: layout.height
                };
                this.activityLayouts.set(activity.id, stored);
                await this.storage.saveLayout(stored);
            }
        } catch {
            this.groups = this.groups.filter(item => item.id !== group.id);
            this.showToast(this.t('groupCreateFailed'));
            return null;
        }
        this.renderMain();
        this.setCanvasSelection([]);
        this.showToast(this.t('groupCreated', { name: group.name }));
        return group;
    }

    finishCanvasSelection(gesture) {
        const bounds = this.selectionRectFromPoints(
            { x: gesture.selectStartX, y: gesture.selectStartY },
            { x: gesture.selectCurrentX, y: gesture.selectCurrentY }
        );
        const stage = document.getElementById('activitiesGrid');
        const selected = [];
        if (stage) {
            for (const activity of this.activities) {
                const button = stage.querySelector(
                    `.activity-btn[data-activity-id="${CSS.escape(activity.id)}"]`
                );
                if (!button || typeof button.getBoundingClientRect !== 'function') continue;
                const box = button.getBoundingClientRect();
                if (this.rectanglesIntersect(bounds, {
                    left: box.left,
                    top: box.top,
                    right: box.right,
                    bottom: box.bottom
                })) {
                    selected.push(activity.id);
                }
            }
        }
        this.setCanvasSelection(selected);
        this.hideCanvasSelectionRect();
    }

    readCanvasPan() {
        try {
            const value = JSON.parse(localStorage.getItem('timerhubActivityCanvasView') || '{}');
            return {
                x: this.clampCanvasCoordinate(value.x, 0, -10000, 10000),
                y: this.clampCanvasCoordinate(value.y, 0, -10000, 10000)
            };
        } catch {
            return { x: 0, y: 0 };
        }
    }

    readCanvasZoom() {
        try {
            const value = JSON.parse(localStorage.getItem('timerhubActivityCanvasView') || '{}');
            const zoom = Number(value.zoom);
            return Number.isFinite(zoom) ? Math.max(0.25, Math.min(3, zoom)) : 1;
        } catch {
            return 1;
        }
    }

    saveCanvasView() {
        try {
            localStorage.setItem('timerhubActivityCanvasView', JSON.stringify({
                x: this.canvasPan.x,
                y: this.canvasPan.y,
                zoom: this.canvasZoom
            }));
        } catch {}
    }

    applyCanvasTransform(stage = document.getElementById('activitiesGrid')) {
        if (!stage) return;
        stage.style.transform =
            `translate(${this.canvasPan.x}px, ${this.canvasPan.y}px) scale(${this.canvasZoom})`;
        stage.style.transformOrigin = '0 0';
        this.updateCanvasControls();
    }

    screenToWorld(x, y) {
        return {
            x: (x - this.canvasPan.x) / this.canvasZoom,
            y: (y - this.canvasPan.y) / this.canvasZoom
        };
    }

    zoomCanvasAt(nextZoom, clientX, clientY) {
        const viewport = document.getElementById('activityCanvasViewport');
        const stage = document.getElementById('activitiesGrid');
        if (!viewport || !stage) return;

        const rect = viewport.getBoundingClientRect();
        const localX = clientX - rect.left;
        const localY = clientY - rect.top;
        const world = this.screenToWorld(localX, localY);

        this.canvasZoom = Math.max(0.25, Math.min(3, nextZoom));
        this.canvasPan.x = localX - world.x * this.canvasZoom;
        this.canvasPan.y = localY - world.y * this.canvasZoom;

        this.applyCanvasTransform(stage);
        this.saveCanvasView();
    }

    setCanvasZoom(nextZoom) {
        const viewport = document.getElementById('activityCanvasViewport');
        if (!viewport) return;
        const rect = viewport.getBoundingClientRect();
        this.zoomCanvasAt(nextZoom, rect.left + rect.width / 2, rect.top + rect.height / 2);
    }

    resetCanvasView() {
        this.canvasPan = { x: 0, y: 0 };
        this.canvasZoom = 1;
        this.applyCanvasTransform();
        this.saveCanvasView();
    }

    fitCanvasToView() {
        const viewport = document.getElementById('activityCanvasViewport');
        if (!viewport || !this.activities.length) {
            this.resetCanvasView();
            return;
        }

        const rect = viewport.getBoundingClientRect();
        const padding = 48;
        const layouts = this.activities.map((activity, index) =>
            this.getActivityCanvasLayout(activity, index)
        );

        const minX = Math.min(...layouts.map(item => item.x));
        const minY = Math.min(...layouts.map(item => item.y));
        const maxX = Math.max(...layouts.map(item => item.x + item.width));
        const maxY = Math.max(...layouts.map(item => item.y + item.height));

        const contentWidth = Math.max(1, maxX - minX);
        const contentHeight = Math.max(1, maxY - minY);
        const availableWidth = Math.max(1, rect.width - padding * 2);
        const availableHeight = Math.max(1, rect.height - padding * 2);

        this.canvasZoom = Math.max(
            0.25,
            Math.min(3, availableWidth / contentWidth, availableHeight / contentHeight)
        );

        this.canvasPan = {
            x: (rect.width - contentWidth * this.canvasZoom) / 2 - minX * this.canvasZoom,
            y: (rect.height - contentHeight * this.canvasZoom) / 2 - minY * this.canvasZoom
        };

        this.applyCanvasTransform();
        this.saveCanvasView();
    }

    positionActivityResizeHandle(activityId, layout, zIndex) {
        const handle = document.querySelector(`.activity-resize-handle[data-activity-id="${CSS.escape(activityId)}"]`);
        if (!handle) return;
        handle.style.left = `${layout.x + layout.width}px`;
        handle.style.top = `${layout.y + layout.height}px`;
        if (zIndex !== undefined) handle.style.zIndex = String(zIndex + 1);
    }

    setupActivityCanvasInteractions() {
        const viewport = document.getElementById('activityCanvasViewport');
        const stage = document.getElementById('activitiesGrid');
        if (!viewport || !stage || viewport.dataset.canvasReady === 'true') return;
        viewport.dataset.canvasReady = 'true';

        const updatePinch = () => {
            const pointers = [...this.canvasPointers.values()];
            if (pointers.length < 2 || !this.canvasPinch) return;

            const [a, b] = pointers;
            const centerX = (a.clientX + b.clientX) / 2;
            const centerY = (a.clientY + b.clientY) / 2;
            const distance = Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY);
            if (!distance) return;

            const rect = viewport.getBoundingClientRect();
            const localCenterX = centerX - rect.left;
            const localCenterY = centerY - rect.top;
            const world = this.canvasPinch.world;
            const nextZoom = Math.max(
                0.25,
                Math.min(3, this.canvasPinch.startZoom * distance / this.canvasPinch.startDistance)
            );

            this.canvasZoom = nextZoom;
            this.canvasPan.x = localCenterX - world.x * nextZoom;
            this.canvasPan.y = localCenterY - world.y * nextZoom;
            this.applyCanvasTransform(stage);
        };

        viewport.addEventListener('pointerdown', event => {
            if (
                event.pointerType === 'mouse' &&
                (!event.isPrimary || event.button !== 0)
            ) return;

            this.canvasPointers.set(event.pointerId, {
                clientX: event.clientX,
                clientY: event.clientY
            });

            if (this.canvasPointers.size >= 2) {
                const pointers = [...this.canvasPointers.values()];
                const [a, b] = pointers;
                const centerX = (a.clientX + b.clientX) / 2;
                const centerY = (a.clientY + b.clientY) / 2;
                const distance = Math.max(1, Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY));
                const rect = viewport.getBoundingClientRect();

                this.canvasPinch = {
                    startDistance: distance,
                    startZoom: this.canvasZoom,
                    world: this.screenToWorld(
                        centerX - rect.left,
                        centerY - rect.top
                    )
                };

                if (this.canvasGesture) {
                    clearTimeout(this.canvasGesture.longPressTimer);
                    this.canvasGesture.activityButton?.classList.remove('dragging');
                    this.canvasGesture.groupTitle?.classList.remove('dragging');
                    if (this.canvasGesture.mode === 'select') this.hideCanvasSelectionRect();
                    this.canvasGesture = null;
                }

                try { viewport.setPointerCapture(event.pointerId); } catch {}
                event.preventDefault();
                return;
            }

            if (this.selectedActivityIds?.size) this.setCanvasSelection([]);

            const resizeHandle = event.target.closest?.('.activity-resize-handle');
            const activityButton = event.target.closest?.('.activity-btn') || (resizeHandle
                ? stage.querySelector(`.activity-btn[data-activity-id="${CSS.escape(resizeHandle.dataset.activityId)}"]`)
                : null);
            const activityId = resizeHandle?.dataset.activityId || activityButton?.dataset.activityId || null;
            const activity = activityId && this.activities.find(item => item.id === activityId);
            const mode = resizeHandle ? 'resize' : activityButton ? 'move' : 'pan';
            const layout = activity
                ? this.getActivityCanvasLayout(activity, this.activities.indexOf(activity))
                : null;

            const groupTitle = event.target.closest?.('.group-title');
            const group = groupTitle && this.groups.find(item => item.id === groupTitle.dataset.groupId);

            this.canvasGesture = {
                pointerId: event.pointerId,
                mode: group ? 'group-move' : mode,
                activityId,
                activityButton,
                resizeHandle,
                groupId: group?.id || null,
                group,
                groupTitle: group ? groupTitle : null,
                groupStartX: group?.x,
                groupStartY: group?.y,
                startX: event.clientX,
                startY: event.clientY,
                lastX: event.clientX,
                lastY: event.clientY,
                layout,
                pan: { ...this.canvasPan },
                started: false,
                longPressTimer: null,
                openedMenu: false
            };

            this.canvasGesture.captureTarget = resizeHandle || activityButton || viewport;
            try { this.canvasGesture.captureTarget.setPointerCapture(event.pointerId); } catch {}

            if (mode === 'move' && activity) {
                this.canvasGesture.longPressTimer = setTimeout(() => {
                    const gesture = this.canvasGesture;
                    if (gesture?.pointerId !== event.pointerId || gesture.started) return;
                    gesture.openedMenu = true;
                    this.suppressActivityClick = { activityId, until: Date.now() + 150 };
                    this.showActivityMenu(activityId);
                }, 550);
            } else if (mode === 'pan') {
                this.canvasGesture.longPressTimer = setTimeout(() => {
                    const gesture = this.canvasGesture;
                    if (gesture?.pointerId !== event.pointerId || gesture.started) return;
                    this.beginCanvasSelection(gesture, viewport);
                }, CANVAS_SELECT_LONG_PRESS_MS);
            }
        });

        viewport.addEventListener('pointermove', event => {
            if (this.canvasPointers.has(event.pointerId)) {
                this.canvasPointers.set(event.pointerId, {
                    clientX: event.clientX,
                    clientY: event.clientY
                });
            }

            if (this.canvasPointers.size >= 2) {
                updatePinch();
                event.preventDefault();
                return;
            }

            const gesture = this.canvasGesture;
            if (!gesture || gesture.pointerId !== event.pointerId) return;

            const dx = event.clientX - gesture.startX;
            const dy = event.clientY - gesture.startY;
            const distance = Math.hypot(dx, dy);
            gesture.lastX = event.clientX;
            gesture.lastY = event.clientY;

            if (!gesture.started) {
                if (gesture.mode === 'pan' && distance < CANVAS_SELECT_MOVE_TOLERANCE) return;
                if (distance < 6) return;
            }

            if (!gesture.started) {
                gesture.started = true;
                clearTimeout(gesture.longPressTimer);
                gesture.activityButton?.classList.add('dragging');

                if (gesture.mode === 'move') {
                    gesture.activityButton.style.zIndex = String(this.canvasZIndex++);
                    this.positionActivityResizeHandle(
                        gesture.activityId,
                        gesture.layout,
                        this.canvasZIndex - 1
                    );
                }
            }

            event.preventDefault();

            if (gesture.mode === 'select') {
                this.updateCanvasSelection(gesture, event.clientX, event.clientY);
                return;
            }

            if (gesture.mode === 'group-move') {
                const worldDx = dx / this.canvasZoom;
                const worldDy = dy / this.canvasZoom;
                gesture.group.x = this.snapToCanvasGrid(gesture.groupStartX + worldDx);
                gesture.group.y = this.snapToCanvasGrid(gesture.groupStartY + worldDy);
                this.positionGroupVisuals(gesture.group);
                return;
            }

            if (gesture.mode === 'move') {
                const worldDx = dx / this.canvasZoom;
                const worldDy = dy / this.canvasZoom;

                const gridX = this.snapToCanvasGrid(
                    this.clampCanvasCoordinate(gesture.layout.x + worldDx, 0, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY)
                );
                const gridY = this.snapToCanvasGrid(
                    this.clampCanvasCoordinate(gesture.layout.y + worldDy, 0, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY)
                );
                const magnet = this.magneticActivityAdjustment(
                    { x: gridX, y: gridY, width: gesture.layout.width, height: gesture.layout.height },
                    this.magneticActivityOthers(gesture.activityId)
                );
                const nextX = gridX + magnet.x;
                const nextY = gridY + magnet.y;

                gesture.activityButton.style.left = `${nextX}px`;
                gesture.activityButton.style.top = `${nextY}px`;

                this.positionActivityResizeHandle(gesture.activityId, {
                    ...gesture.layout,
                    x: nextX,
                    y: nextY
                });
            } else if (gesture.mode === 'resize') {
                const worldDx = dx / this.canvasZoom;
                const worldDy = dy / this.canvasZoom;

                const width = this.clampCanvasCoordinate(
                    gesture.layout.width + worldDx, 160, 160, 640
                );
                const height = this.clampCanvasCoordinate(
                    gesture.layout.height + worldDy, 110, 110, 520
                );

                gesture.resizeHandle.style.left =
                    `${gesture.layout.x + width}px`;
                gesture.resizeHandle.style.top =
                    `${gesture.layout.y + height}px`;

                gesture.activityButton =
                    stage.querySelector(`.activity-btn[data-activity-id="${CSS.escape(gesture.activityId)}"]`);

                if (gesture.activityButton) {
                    gesture.activityButton.style.width = `${width}px`;
                    gesture.activityButton.style.height = `${height}px`;

                    this.positionActivityResizeHandle(gesture.activityId, {
                        ...gesture.layout,
                        width,
                        height
                    });
                }
            } else {
                this.canvasPan = {
                    x: this.clampCanvasCoordinate(gesture.pan.x + dx, 0, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY),
                    y: this.clampCanvasCoordinate(gesture.pan.y + dy, 0, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY)
                };

                this.applyCanvasTransform(stage);
            }
        });

        const finishGesture = event => {
            this.canvasPointers.delete(event.pointerId);

            if (this.canvasPointers.size < 2 && this.canvasPinch) {
                this.canvasPinch = null;
                this.saveCanvasView();
            }

            const gesture = this.canvasGesture;
            if (!gesture || gesture.pointerId !== event.pointerId) return;

            clearTimeout(gesture.longPressTimer);
            this.canvasGesture = null;
            gesture.activityButton?.classList.remove('dragging');
            gesture.groupTitle?.classList.remove('dragging');

            if (gesture.mode === 'group-move') {
                if (gesture.started) {
                    Promise.resolve(this.storage.saveGroup?.(gesture.group)).catch(() => {
                        this.showToast(this.t('groupCreateFailed'));
                    });
                }
                return;
            }

            if (gesture.mode === 'select') {
                if (event.type === 'pointercancel') {
                    this.hideCanvasSelectionRect();
                } else {
                    this.finishCanvasSelection(gesture);
                }
                return;
            }

            if (gesture.started && gesture.mode === 'pan') {
                this.saveCanvasView();
            }

            if (gesture.openedMenu) {
                this.suppressActivityClick = {
                    activityId: gesture.activityId,
                    until: Date.now() + 400
                };
            }

            if (gesture.started && gesture.mode !== 'pan' && gesture.activityId) {
                this.suppressActivityClick = {
                    activityId: gesture.activityId,
                    until: Date.now() + 500
                };

                const button = stage.querySelector(
                    `.activity-btn[data-activity-id="${CSS.escape(gesture.activityId)}"]`
                );

                if (button) {
                    const rawX = Number.parseFloat(button.style.left) || 0;
                    const rawY = Number.parseFloat(button.style.top) || 0;
                    const finalLayout = {
                        activityId: gesture.activityId,
                        x: rawX,
                        y: rawY,
                        width: Number.parseFloat(button.style.width) || gesture.layout.width,
                        height: Number.parseFloat(button.style.height) || gesture.layout.height
                    };

                    if (gesture.mode === 'move') {
                        button.style.left = `${finalLayout.x}px`;
                        button.style.top = `${finalLayout.y}px`;
                        this.positionActivityResizeHandle(gesture.activityId, finalLayout);
                    }

                    this.saveActivityCanvasLayout(finalLayout);
                }
            }
        };

        viewport.addEventListener('pointerup', finishGesture);
        viewport.addEventListener('pointercancel', finishGesture);

        viewport.addEventListener('wheel', event => {
            if (!event.ctrlKey && !event.metaKey) return;
            event.preventDefault();

            const factor = Math.exp(-event.deltaY * 0.0015);
            this.zoomCanvasAt(this.canvasZoom * factor, event.clientX, event.clientY);
        }, { passive: false });

        viewport.addEventListener('click', event => {
            if (event.target.closest?.('.activity-resize-handle')) event.stopPropagation();

            const button = event.target.closest?.('.activity-btn');
            if (
                button &&
                this.suppressActivityClick?.activityId === button.dataset.activityId &&
                Date.now() < this.suppressActivityClick.until
            ) {
                event.preventDefault();
                event.stopImmediatePropagation();
                this.suppressActivityClick = null;
            }
        }, true);

        stage.addEventListener('keydown', event => {
            const button = event.target.closest?.('.activity-btn');
            const resizeHandle = event.target.closest?.('.activity-resize-handle');
            const activityId = resizeHandle?.dataset.activityId || button?.dataset.activityId;
            if (!activityId) return;

            const delta = event.shiftKey ? 10 : 0;
            if (
                !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key) ||
                (!resizeHandle && !event.shiftKey)
            ) return;

            event.preventDefault();

            const activity = this.activities.find(item => item.id === activityId);
            if (!activity) return;

            const layout = this.getActivityCanvasLayout(
                activity,
                this.activities.indexOf(activity)
            );

            if (resizeHandle) {
                layout.width = this.clampCanvasCoordinate(
                    layout.width +
                    (event.key === 'ArrowRight' ? 10 : event.key === 'ArrowLeft' ? -10 : 0),
                    layout.width, 160, 640
                );

                layout.height = this.clampCanvasCoordinate(
                    layout.height +
                    (event.key === 'ArrowDown' ? 10 : event.key === 'ArrowUp' ? -10 : 0),
                    layout.height, 110, 520
                );
            } else if (event.shiftKey) {
                layout.x = this.clampCanvasCoordinate(
                    this.snapToCanvasGrid(
                        layout.x +
                        (event.key === 'ArrowRight' ? delta : event.key === 'ArrowLeft' ? -delta : 0)
                    ),
                    layout.x, 0, 2800
                );

                layout.y = this.clampCanvasCoordinate(
                    this.snapToCanvasGrid(
                        layout.y +
                        (event.key === 'ArrowDown' ? delta : event.key === 'ArrowUp' ? -delta : 0)
                    ),
                    layout.y, 0, 1600
                );
            } else return;

            const node = stage.querySelector(
                `.activity-btn[data-activity-id="${CSS.escape(activityId)}"]`
            );
            const handle = stage.querySelector(
                `.activity-resize-handle[data-activity-id="${CSS.escape(activityId)}"]`
            );

            if (node) {
                node.style.left = `${layout.x}px`;
                node.style.top = `${layout.y}px`;
                node.style.width = `${layout.width}px`;
                node.style.height = `${layout.height}px`;
            }

            if (handle) this.positionActivityResizeHandle(activityId, layout);

            this.saveActivityCanvasLayout({ activityId, ...layout });
        });

        viewport.tabIndex = 0;

        viewport.addEventListener('keydown', event => {
            if (
                event.target !== viewport ||
                !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)
            ) return;

            event.preventDefault();

            const amount = event.shiftKey ? 120 : 48;

            this.canvasPan.x = this.clampCanvasCoordinate(
                this.canvasPan.x +
                (event.key === 'ArrowRight' ? amount : event.key === 'ArrowLeft' ? -amount : 0),
                0, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY
            );

            this.canvasPan.y = this.clampCanvasCoordinate(
                this.canvasPan.y +
                (event.key === 'ArrowDown' ? amount : event.key === 'ArrowUp' ? -amount : 0),
                0, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY
            );

            this.applyCanvasTransform(stage);
            this.saveCanvasView();
        });

        this.updateCanvasControls();
    }

    updateCanvasControls() {
        const zoomValue = document.getElementById('canvasZoomValue');
        if (zoomValue) {
            zoomValue.textContent = `${Math.round(this.canvasZoom * 100)}%`;
        }
    }

    async saveActivityCanvasLayout(layout) {
        const stored = this.toStoredActivityLayout(layout);
        this.activityLayouts.set(layout.activityId, stored);
        try {
            await this.storage.saveLayout(stored);
        } catch {
            this.showToast(this.t('canvasLayoutSaveFailed'));
        }
    }

    toStoredActivityLayout(layout) {
        const activity = this.activities.find(item => item.id === layout.activityId);
        const group = this.activityGroup(activity);
        if (!group) return layout;
        const offset = this.groupDisplayOffset(group.id);
        return {
            ...layout,
            x: layout.x - group.x - offset.x,
            y: layout.y - group.y - offset.y
        };
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
                const previousEnd = entry.endTimestamp;
                const previousUpdatedAt = entry.updatedAt;
                entry.endTimestamp = now;
                entry.updatedAt = now;
                try {
                    await this.storage.saveTimeEntry(entry);
                } catch (error) {
                    entry.endTimestamp = previousEnd;
                    entry.updatedAt = previousUpdatedAt;
                    throw error;
                }
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
                        const previousEnd = prevEntry.endTimestamp;
                        const previousUpdatedAt = prevEntry.updatedAt;
                        prevEntry.endTimestamp = now;
                        prevEntry.updatedAt = now;
                        try {
                            await this.storage.saveTimeEntry(prevEntry);
                        } catch (error) {
                            prevEntry.endTimestamp = previousEnd;
                            prevEntry.updatedAt = previousUpdatedAt;
                            throw error;
                        }
                        this.activeActivityId = null;
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
                const entry = this.createTimeEntry({
                    id: this.generateId(),
                    activityId: activityId,
                    activityNameSnapshot: activity.name,
                    startTimestamp: now,
                    endTimestamp: null,
                    createdAt: now,
                    updatedAt: now,
                    source: 'timer',
                    notes: '',
                    project: activity.project || '',
                    service: activity.service || '',
                    customerId: activity.customerId || '',
                    serviceId: activity.serviceId || '',
                    customerName: activity.customerName || '',
                    serviceName: activity.serviceName || '',
                    syncStatus: SYNC_STATUS.UNSYNCED
                });

                this.timeEntries.push(entry);
                try {
                    await this.storage.saveTimeEntry(entry);
                } catch (error) {
                    this.timeEntries = this.timeEntries.filter(item => item.id !== entry.id);
                    this.activeActivityId = null;
                    throw error;
                }
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

        if (activityId) {
            const assignmentActivity = this.activities.find(a => a.id === activityId);
            this.populateClockodoAssignmentSelects(
                'activity',
                assignmentActivity?.customerId,
                assignmentActivity?.serviceId,
                assignmentActivity?.customerName,
                assignmentActivity?.serviceName
            );
        } else {
            this.populateClockodoAssignmentSelects('activity');
        }
        this.loadClockodoReferenceData();

        modal.classList.add('active');
        document.getElementById('activityName').focus();
        if (activityId) this.revealActivityPickerSelections();
    }

    revealActivityPickerSelections() {
        const reveal = pickerId => {
            const picker = document.getElementById(pickerId);
            const selected = picker?.querySelector?.('.selected');
            if (!picker || !selected) return;
            const itemLeft = Number(selected.offsetLeft);
            const itemWidth = Number(selected.offsetWidth) || Number(selected.clientWidth);
            const viewWidth = Number(picker.clientWidth);
            if (!Number.isFinite(itemLeft) || !Number.isFinite(itemWidth) ||
                !Number.isFinite(viewWidth) || viewWidth <= 0) return;
            picker.scrollLeft = Math.max(0, itemLeft - (viewWidth - itemWidth) / 2);
        };
        reveal('colorPicker');
        reveal('shapePicker');
    }

    closeActivityModal() {
        this.closeClockodoCombobox();
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
        const assignment = this.readClockodoAssignment('activity');

        if (this.editingActivityId) {
            // Edit
            const activity = this.activities.find(a => a.id === this.editingActivityId);
            if (activity) {
                activity.name = name;
                activity.color = color;
                activity.shape = shape;
                activity.size = size;
                activity.customerId = assignment.customerId;
                activity.serviceId = assignment.serviceId;
                activity.customerName = assignment.customerName;
                activity.serviceName = assignment.serviceName;
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
                customerId: assignment.customerId,
                serviceId: assignment.serviceId,
                customerName: assignment.customerName,
                serviceName: assignment.serviceName,
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
            if (!Array.isArray(this.archivedActivities)) this.archivedActivities = [];
            this.archivedActivities.push(activity);
        }
        this.closeActivityMenu();
        this.renderMain();
        this.pruneCanvasSelection();
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
        this.pruneCanvasSelection();
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

        this.populateEntryActivitySelect(entry.activityId);
        const startDate = new Date(entry.startTimestamp);
        document.getElementById('entryEditDate').value = this.toDateString(startDate);
        document.getElementById('entryEditStart').value = this.toTimeString(startDate);
        document.getElementById('entryEditEndDate').value = entry.endTimestamp === null
            ? this.toDateString(startDate)
            : this.toDateString(new Date(entry.endTimestamp));
        document.getElementById('entryEditEnd').value = entry.endTimestamp === null
            ? ''
            : this.toTimeString(new Date(entry.endTimestamp));
        document.getElementById('entryEditProject').value = entry.project || '';
        document.getElementById('entryEditService').value = entry.service || '';
        document.getElementById('entryEditNotes').value = entry.notes || '';
        this.populateClockodoAssignmentSelects('entry', entry.customerId, entry.serviceId, entry.customerName, entry.serviceName);
        this.loadClockodoReferenceData();
        document.getElementById('entryEditModalTitle').textContent = this.t('editEntry');
        const confirmed = [SYNC_STATUS.CONFIRMED, SYNC_STATUS.SYNCING].includes(entry.syncStatus);
        this.setEntryEditorLocked(confirmed);
        document.getElementById('entryEditDeleteBtn').style.display = confirmed ? 'none' : '';
        document.getElementById('entryConflictWarning').style.display = 'none';
        document.getElementById('entryEditModal').classList.add('active');
    }

    populateEntryActivitySelect(selectedId = '') {
        const activitySelect = document.getElementById('entryEditActivity');
        activitySelect.innerHTML = '';
        this.activities.forEach(activity => {
            const option = document.createElement('option');
            option.value = activity.id;
            option.textContent = activity.name;
            activitySelect.appendChild(option);
        });
        activitySelect.value = selectedId || this.activities[0]?.id || '';
    }

    showAddEntryModal() {
        this.editingEntryId = null;
        this.populateEntryActivitySelect(this.activities[0]?.id || '');
        const defaultActivity = this.activities.find(item => item.id === document.getElementById('entryEditActivity').value);
        this.populateClockodoAssignmentSelects('entry', defaultActivity?.customerId, defaultActivity?.serviceId, defaultActivity?.customerName, defaultActivity?.serviceName);
        this.loadClockodoReferenceData();
        document.getElementById('entryEditDate').value = this.reviewDate;
        document.getElementById('entryEditEndDate').value = this.reviewDate;
        document.getElementById('entryEditStart').value = '';
        document.getElementById('entryEditEnd').value = '';
        document.getElementById('entryEditProject').value = '';
        document.getElementById('entryEditService').value = '';
        document.getElementById('entryEditNotes').value = '';
        document.getElementById('entryEditModalTitle').textContent = this.t('addEntry');
        this.setEntryEditorLocked(false);
        document.getElementById('entryEditDeleteBtn').style.display = 'none';
        document.getElementById('entryConflictWarning').style.display = 'none';
        document.getElementById('entryEditModal').classList.add('active');
    }

    setEntryEditorLocked(locked) {
        ['entryEditActivity', 'entryEditDate', 'entryEditEndDate', 'entryEditStart', 'entryEditEnd', 'entryEditProject', 'entryEditService', 'entryEditNotes']
            .forEach(id => {
                const field = document.getElementById(id);
                if (field) field.disabled = locked;
            });
        const referenceDisabled = this.clockodoReferenceStatus !== 'ready';
        ['entryEditCustomerInput', 'entryEditServiceInput']
            .forEach(id => {
                const field = document.getElementById(id);
                if (field) field.disabled = locked || referenceDisabled;
            });
        if (locked) this.closeClockodoCombobox();
        document.getElementById('entryEditSaveBtn').disabled = locked;
        document.getElementById('entryEditLockedNotice').style.display = locked ? '' : 'none';
    }

    parseEntryDateTime(dateValue, timeValue) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(dateValue || '') || !/^\d{2}:\d{2}$/.test(timeValue || '')) return null;
        const [year, month, day] = dateValue.split('-').map(Number);
        const [hour, minute] = timeValue.split(':').map(Number);
        if (hour > 23 || minute > 59) return null;
        const date = new Date(year, month - 1, day, hour, minute, 0, 0);
        if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day ||
            date.getHours() !== hour || date.getMinutes() !== minute) return null;
        return date.getTime();
    }

    async saveTimeEntry() {
        const editingId = this.editingEntryId === null || this.editingEntryId === undefined
            ? null
            : String(this.editingEntryId);
        const editing = editingId === null
            ? undefined
            : this.timeEntries.find(entry => String(entry.id) === editingId);
        const resolveBoundary = (dateValue, timeValue, storedTimestamp) => {
            if (storedTimestamp !== null && storedTimestamp !== undefined && Number.isFinite(Number(storedTimestamp))) {
                const storedDate = new Date(Number(storedTimestamp));
                if (dateValue === this.toDateString(storedDate) && timeValue === this.toTimeString(storedDate)) {
                    return Number(storedTimestamp);
                }
            }
            return this.parseEntryDateTime(dateValue, timeValue);
        };
        const start = resolveBoundary(
            document.getElementById('entryEditDate').value,
            document.getElementById('entryEditStart').value,
            editing?.startTimestamp
        );
        const end = resolveBoundary(
            document.getElementById('entryEditEndDate').value,
            document.getElementById('entryEditEnd').value,
            editing?.endTimestamp
        );
        const activityId = document.getElementById('entryEditActivity').value;
        const warning = document.getElementById('entryConflictWarning');
        warning.style.display = 'none';

        if (start === null || end === null || !activityId) {
            this.showToast(this.t('pleaseFillAllFields'));
            return;
        }
        if (end <= start) {
            this.showToast(this.t('startBeforeEnd'));
            return;
        }
        if (end - start > 24 * 60 * 60 * 1000) {
            this.showToast(this.t('entryTooLong'));
            return;
        }

        if ([SYNC_STATUS.CONFIRMED, SYNC_STATUS.SYNCING].includes(editing?.syncStatus)) {
            this.showToast(this.t('confirmedEntryLocked'));
            return;
        }
        const hasConflict = this.timeEntries.some(entry => {
            if (editingId !== null && String(entry.id) === editingId) return false;
            const otherEnd = entry.endTimestamp === null ? Infinity : entry.endTimestamp;
            return start < otherEnd && end > entry.startTimestamp;
        });
        if (hasConflict) {
            warning.style.display = 'block';
            return;
        }

        const activity = this.activities.find(item => item.id === activityId);
        const assignment = this.readClockodoAssignment('entry');
        const updates = {
            activityId,
            activityNameSnapshot: activity?.name || editing?.activityNameSnapshot || '',
            startTimestamp: start,
            endTimestamp: end,
            project: document.getElementById('entryEditProject').value.trim(),
            service: document.getElementById('entryEditService').value.trim(),
            customerId: assignment.customerId,
            serviceId: assignment.serviceId,
            customerName: assignment.customerName,
            serviceName: assignment.serviceName,
            notes: document.getElementById('entryEditNotes').value.trim()
        };

        if (editing) {
            await this.updateEntry(editing.id, updates);
        } else {
            await this.addEntry({ ...updates, source: 'manual' });
        }
        this.closeEntryEditModal();
        this.renderLog();
        this.renderReview();
    }

    closeEntryEditModal() {
        this.closeClockodoCombobox();
        document.getElementById('entryEditModal').classList.remove('active');
        this.editingEntryId = null;
    }


    async deleteTimeEntry() {
        if (this.confirmDelete && !confirm(this.t('deleteConfirm'))) {
            return;
        }

        const entry = this.timeEntries.find(e => e.id === this.editingEntryId);
        if (entry) {
            if ([SYNC_STATUS.CONFIRMED, SYNC_STATUS.SYNCING].includes(entry.syncStatus)) {
                this.showToast(this.t('confirmedEntryLocked'));
                return;
            }
            this.deletedEntry = entry;
            this.timeEntries = this.timeEntries.filter(e => e.id !== entry.id);
            await this.storage.deleteTimeEntry(entry.id);
            this.closeEntryEditModal();
            this.renderLog();
            this.renderReview();

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
            this.renderReview();
        }
    }

    clockodoAssignmentIds(context) {
        return context === 'activity'
            ? {
                customer: 'activityCustomerSelect', customerInput: 'activityCustomerInput', customerList: 'activityCustomerList',
                service: 'activityServiceSelect', serviceInput: 'activityServiceInput', serviceList: 'activityServiceList',
                hint: 'activityClockodoHint', retry: 'activityClockodoRetryBtn'
            }
            : {
                customer: 'entryEditCustomerSelect', customerInput: 'entryEditCustomerInput', customerList: 'entryEditCustomerList',
                service: 'entryEditServiceSelect', serviceInput: 'entryEditServiceInput', serviceList: 'entryEditServiceList',
                hint: 'entryEditClockodoHint', retry: 'entryEditClockodoRetryBtn'
            };
    }

    clockodoComboboxIds(context, fieldName) {
        const ids = this.clockodoAssignmentIds(context);
        return fieldName === 'customer'
            ? { input: ids.customerInput, hidden: ids.customer, list: ids.customerList }
            : { input: ids.serviceInput, hidden: ids.service, list: ids.serviceList };
    }

    clockodoComboboxItems(context, fieldName) {
        if (fieldName === 'customer') return this.clockodoCustomers;
        return this.clockodoAllowedServices(this.clockodoSelectedCustomerId(context));
    }

    clockodoCustomerById(customerId) {
        const id = this.normalizeClockodoId(customerId);
        if (!id) return null;
        const customers = Array.isArray(this.clockodoCustomers) ? this.clockodoCustomers : [];
        return customers.find(customer => String(customer.id) === id) || null;
    }

    clockodoAllowedServices(customerId) {
        const services = Array.isArray(this.clockodoServices) ? this.clockodoServices : [];
        const customer = this.clockodoCustomerById(customerId);
        const assignments = customer?.serviceAssignments;
        if (!Array.isArray(assignments) || assignments.length === 0) return services;
        const allowed = new Set(assignments.map(String));
        return services.filter(service => allowed.has(String(service.id)));
    }

    clockodoSelectedCustomerId(context) {
        const { hidden } = this.clockodoComboboxIds(context, 'customer');
        return this.normalizeClockodoId(document.getElementById(hidden)?.value);
    }

    setClockodoAssignmentHint(context, message = null) {
        const ids = this.clockodoAssignmentIds(context);
        const hint = document.getElementById(ids.hint);
        if (hint) hint.textContent = message || this.clockodoAssignmentHint();
    }

    enforceClockodoServiceForCustomer(context) {
        if (this.clockodoReferenceStatus !== 'ready') return false;
        const { input, hidden } = this.clockodoComboboxIds(context, 'service');
        const hiddenEl = document.getElementById(hidden);
        const selected = this.normalizeClockodoId(hiddenEl?.value);
        if (!selected) return false;
        const allowed = this.clockodoAllowedServices(this.clockodoSelectedCustomerId(context));
        if (allowed.some(service => String(service.id) === selected)) return false;
        if (hiddenEl) hiddenEl.value = '';
        const inputEl = document.getElementById(input);
        if (inputEl) inputEl.value = '';
        return true;
    }

    clockodoAssignmentPlaceholder() {
        if (this.clockodoReferenceStatus === 'ready') return this.t('clockodoAssignmentNone');
        if (this.clockodoReferenceStatus === 'unconfigured') return this.t('clockodoAssignmentNotConfigured');
        if (this.clockodoReferenceStatus === 'error') return this.t('clockodoAssignmentLoadFailed');
        return this.t('clockodoAssignmentLoading');
    }

    clockodoAssignmentHint() {
        if (this.clockodoReferenceStatus === 'ready') return this.t('clockodoAssignmentHelp');
        if (this.clockodoReferenceStatus === 'unconfigured') return this.t('clockodoAssignmentNotConfigured');
        if (this.clockodoReferenceStatus === 'error') {
            return `${this.t('clockodoAssignmentLoadFailed')} ${this.clockodoErrorMessage({ code: this.clockodoReferenceError })}`;
        }
        return this.t('clockodoAssignmentLoading');
    }

    clockodoNameCounts(items) {
        const counts = new Map();
        for (const item of items) {
            const key = String(item.name || '').toLowerCase();
            counts.set(key, (counts.get(key) || 0) + 1);
        }
        return counts;
    }

    clockodoOptionLabel(item, counts) {
        return (counts.get(String(item.name || '').toLowerCase()) || 0) > 1
            ? `${item.name} (#${item.id})`
            : item.name;
    }

    findClockodoItem(items, value) {
        const list = Array.isArray(items) ? items : [];
        const query = String(value ?? '').trim();
        if (!query) return null;
        const lower = query.toLowerCase();
        const exactName = list.filter(item => String(item.name).toLowerCase() === lower);
        if (exactName.length === 1) return exactName[0];
        const counts = this.clockodoNameCounts(list);
        return list.find(item => this.clockodoOptionLabel(item, counts).toLowerCase() === lower) || null;
    }

    clockodoAssignmentOptionModels(items) {
        const counts = this.clockodoNameCounts(items);
        return items.map(item => ({
            id: String(item.id),
            label: this.clockodoOptionLabel(item, counts)
        }));
    }

    buildClockodoComboboxOptions(context, fieldName, query, selectedId, fallbackName) {
        const source = this.clockodoComboboxItems(context, fieldName);
        const items = Array.isArray(source) ? source : [];
        const models = this.clockodoAssignmentOptionModels(items);
        const normalizedQuery = String(query ?? '').trim().toLowerCase();
        const matches = models
            .filter(model => !normalizedQuery || model.label.toLowerCase().includes(normalizedQuery))
            .slice(0, 50);
        const id = this.normalizeClockodoId(selectedId);
        if (id && !normalizedQuery) {
            const index = matches.findIndex(model => model.id === id);
            if (index > 0) matches.unshift(matches.splice(index, 1)[0]);
            else if (index < 0) {
                matches.unshift(models.find(model => model.id === id) || { id, label: fallbackName || `#${id}` });
            }
        }
        return [{ id: '', label: this.t('clockodoAssignmentNone'), unassigned: true }].concat(matches);
    }

    populateClockodoAssignmentField(field, items, selectedId, fallbackName) {
        const id = this.normalizeClockodoId(selectedId);
        const hidden = document.getElementById(field.hidden);
        if (hidden) hidden.value = id || '';
        const input = document.getElementById(field.input);
        const match = id ? items.find(item => String(item.id) === id) : null;
        if (input) {
            input.value = match
                ? this.clockodoOptionLabel(match, this.clockodoNameCounts(items))
                : (id ? fallbackName || `#${id}` : '');
        }
    }

    populateClockodoAssignmentSelects(context, selectedCustomerId = null, selectedServiceId = null, customerName = '', serviceName = '') {
        const ids = this.clockodoAssignmentIds(context);
        const status = this.clockodoReferenceStatus;
        const ready = status === 'ready';
        this.populateClockodoAssignmentField(
            { hidden: ids.customer, input: ids.customerInput, list: ids.customerList },
            ready ? this.clockodoCustomers : [],
            selectedCustomerId,
            customerName
        );
        this.populateClockodoAssignmentField(
            { hidden: ids.service, input: ids.serviceInput, list: ids.serviceList },
            ready ? this.clockodoAllowedServices(this.clockodoSelectedCustomerId(context)) : [],
            selectedServiceId,
            serviceName
        );
        const serviceCleared = this.enforceClockodoServiceForCustomer(context);
        const statePlaceholder = this.clockodoAssignmentPlaceholder();
        for (const [inputId, labelKey] of [
            [ids.customerInput, 'clockodoCustomerSelectLabel'],
            [ids.serviceInput, 'clockodoServiceSelectLabel']
        ]) {
            const input = document.getElementById(inputId);
            if (input) {
                input.disabled = !ready;
                input.placeholder = ready ? this.t(labelKey) : statePlaceholder;
            }
        }
        const open = this.clockodoCombobox;
        if (open && open.context === context) {
            if (ready) this.openClockodoCombobox(context, open.field);
            else this.closeClockodoCombobox();
        }
        const hint = document.getElementById(ids.hint);
        if (hint) {
            hint.textContent = serviceCleared
                ? this.t('clockodoServiceNotAllowedForCustomer')
                : this.clockodoAssignmentHint();
        }
        const retry = document.getElementById(ids.retry);
        if (retry) retry.style.display = status === 'error' ? '' : 'none';
    }

    applyClockodoAssignmentInput(context, fieldName) {
        const { input, hidden } = this.clockodoComboboxIds(context, fieldName);
        const inputEl = document.getElementById(input);
        const hiddenEl = document.getElementById(hidden);
        const match = this.findClockodoItem(this.clockodoComboboxItems(context, fieldName), inputEl?.value);
        if (hiddenEl) hiddenEl.value = match ? String(match.id) : '';
        const serviceCleared = fieldName === 'customer' ? this.enforceClockodoServiceForCustomer(context) : false;
        this.setClockodoAssignmentHint(
            context,
            serviceCleared ? this.t('clockodoServiceNotAllowedForCustomer') : null
        );
        if (this.clockodoReferenceStatus === 'ready') this.openClockodoCombobox(context, fieldName, inputEl?.value || '');
        else this.closeClockodoCombobox();
    }

    openClockodoCombobox(context, fieldName, query = '') {
        if (this.clockodoReferenceStatus !== 'ready') return;
        const { input, hidden, list } = this.clockodoComboboxIds(context, fieldName);
        const inputEl = document.getElementById(input);
        const listEl = document.getElementById(list);
        if (!inputEl || !listEl) return;
        const selectedId = document.getElementById(hidden)?.value || '';
        const options = this.buildClockodoComboboxOptions(context, fieldName, query, selectedId, inputEl.value);
        const selectedIndex = selectedId ? options.findIndex(option => option.id === selectedId) : 0;
        this.closeClockodoCombobox();
        this.clockodoCombobox = {
            context,
            field: fieldName,
            inputId: input,
            listId: list,
            options,
            activeIndex: selectedIndex >= 0 ? selectedIndex : 0
        };
        listEl.hidden = false;
        listEl.innerHTML = '';
        inputEl.setAttribute('aria-expanded', 'true');
        this.renderClockodoComboboxList();
        this.positionClockodoComboboxList();
        this.bindClockodoComboboxViewportEvents();
    }

    closeClockodoCombobox() {
        const state = this.clockodoCombobox;
        if (!state) return;
        const inputEl = document.getElementById(state.inputId);
        const listEl = document.getElementById(state.listId);
        if (listEl) {
            listEl.hidden = true;
            listEl.innerHTML = '';
        }
        if (inputEl) {
            inputEl.setAttribute('aria-expanded', 'false');
            inputEl.removeAttribute('aria-activedescendant');
        }
        this.clockodoCombobox = null;
        this.unbindClockodoComboboxViewportEvents();
    }

    renderClockodoComboboxList() {
        const state = this.clockodoCombobox;
        if (!state) return;
        const listEl = document.getElementById(state.listId);
        const inputEl = document.getElementById(state.inputId);
        if (!listEl) return;
        listEl.innerHTML = '';
        state.options.forEach((option, index) => {
            const item = document.createElement('li');
            item.className = 'clockodo-combobox-option';
            item.id = `${state.listId}-option-${index}`;
            item.dataset.optionIndex = String(index);
            item.dataset.optionId = option.id;
            item.setAttribute('role', 'option');
            item.setAttribute('aria-selected', String(index === state.activeIndex));
            if (option.unassigned) item.className += ' is-unassigned';
            if (index === state.activeIndex) item.className += ' is-active';
            item.textContent = option.label;
            listEl.appendChild(item);
        });
        if (inputEl && state.options[state.activeIndex]) {
            inputEl.setAttribute('aria-activedescendant', `${state.listId}-option-${state.activeIndex}`);
        }
    }

    scrollClockodoComboboxActiveIntoView() {
        const state = this.clockodoCombobox;
        if (!state) return;
        const listEl = document.getElementById(state.listId);
        const active = listEl?.children?.[state.activeIndex];
        active?.scrollIntoView?.({ block: 'nearest' });
    }

    onClockodoComboboxKeydown(context, fieldName, event) {
        const state = this.clockodoCombobox;
        const isOpen = Boolean(state && state.context === context && state.field === fieldName);
        if (!event?.key) return;
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            if (!isOpen) {
                this.openClockodoCombobox(context, fieldName);
                return;
            }
            const count = state.options.length;
            if (!count) return;
            const delta = event.key === 'ArrowDown' ? 1 : -1;
            state.activeIndex = (state.activeIndex + delta + count) % count;
            this.renderClockodoComboboxList();
            this.scrollClockodoComboboxActiveIntoView();
        } else if (event.key === 'Enter') {
            if (!isOpen || !state.options[state.activeIndex]) return;
            event.preventDefault();
            this.selectClockodoComboboxOption(context, fieldName, state.options[state.activeIndex]);
        } else if (event.key === 'Escape') {
            if (!isOpen) return;
            event.preventDefault();
            this.closeClockodoCombobox();
        }
    }

    onClockodoComboboxListClick(context, fieldName, event) {
        const state = this.clockodoCombobox;
        const optionEl = event?.target?.closest?.('.clockodo-combobox-option');
        const index = Number(optionEl?.dataset?.optionIndex);
        if (!optionEl || !state || state.context !== context || state.field !== fieldName || !Number.isInteger(index)) return;
        this.selectClockodoComboboxOption(context, fieldName, state.options[index]);
    }

    selectClockodoComboboxOption(context, fieldName, option) {
        if (!option) return;
        const { input, hidden } = this.clockodoComboboxIds(context, fieldName);
        const inputEl = document.getElementById(input);
        const hiddenEl = document.getElementById(hidden);
        if (hiddenEl) hiddenEl.value = option.unassigned ? '' : option.id;
        if (inputEl) inputEl.value = option.unassigned ? '' : option.label;
        this.closeClockodoCombobox();
        const serviceCleared = fieldName === 'customer' ? this.enforceClockodoServiceForCustomer(context) : false;
        this.setClockodoAssignmentHint(
            context,
            serviceCleared ? this.t('clockodoServiceNotAllowedForCustomer') : null
        );
    }

    scheduleClockodoComboboxClose(context, fieldName) {
        this.cancelClockodoComboboxClose();
        this.clockodoComboboxBlurTimer = setTimeout(() => {
            this.clockodoComboboxBlurTimer = null;
            const state = this.clockodoCombobox;
            if (state && state.context === context && state.field === fieldName) {
                this.normalizeClockodoComboboxText(context, fieldName);
                this.closeClockodoCombobox();
            }
        }, 150);
    }

    cancelClockodoComboboxClose() {
        if (this.clockodoComboboxBlurTimer) {
            clearTimeout(this.clockodoComboboxBlurTimer);
            this.clockodoComboboxBlurTimer = null;
        }
    }

    normalizeClockodoComboboxText(context, fieldName) {
        const { input } = this.clockodoComboboxIds(context, fieldName);
        const inputEl = document.getElementById(input);
        if (!inputEl) return;
        const items = this.clockodoComboboxItems(context, fieldName);
        const match = this.findClockodoItem(items, inputEl.value);
        if (match) {
            inputEl.value = this.clockodoOptionLabel(match, this.clockodoNameCounts(items));
        } else if (String(inputEl.value || '').trim()) {
            inputEl.value = '';
        }
    }

    positionClockodoComboboxList() {
        const state = this.clockodoCombobox;
        if (!state) return;
        const inputEl = document.getElementById(state.inputId);
        const listEl = document.getElementById(state.listId);
        if (!inputEl || !listEl || typeof inputEl.getBoundingClientRect !== 'function') return;
        const rect = inputEl.getBoundingClientRect();
        if (!rect) return;
        const viewportHeight = Number(window?.innerHeight) || 800;
        listEl.style.position = 'fixed';
        listEl.style.left = `${Math.round(rect.left)}px`;
        listEl.style.width = `${Math.round(rect.width)}px`;
        const spaceBelow = viewportHeight - rect.bottom;
        const openUp = spaceBelow < 180 && rect.top > spaceBelow;
        const available = Math.max(120, Math.min(280, (openUp ? rect.top : spaceBelow) - 12));
        listEl.style.maxHeight = `${Math.round(available)}px`;
        if (openUp) {
            listEl.style.top = 'auto';
            listEl.style.bottom = `${Math.round(viewportHeight - rect.top + 4)}px`;
        } else {
            listEl.style.top = `${Math.round(rect.bottom + 4)}px`;
            listEl.style.bottom = 'auto';
        }
    }

    bindClockodoComboboxViewportEvents() {
        this.unbindClockodoComboboxViewportEvents();
        if (typeof document?.addEventListener === 'function') {
            this.clockodoComboboxDocumentHandler = event => {
                const state = this.clockodoCombobox;
                if (!state) return;
                const target = event?.target;
                const inputEl = document.getElementById(state.inputId);
                const listEl = document.getElementById(state.listId);
                const insideInput = inputEl && (target === inputEl || inputEl.contains?.(target));
                const insideList = listEl && (target === listEl || listEl.contains?.(target));
                if (!insideInput && !insideList) this.closeClockodoCombobox();
            };
            document.addEventListener('pointerdown', this.clockodoComboboxDocumentHandler, true);
        }
        if (typeof window?.addEventListener === 'function') {
            this.clockodoComboboxViewportHandler = () => {
                if (this.clockodoCombobox) this.positionClockodoComboboxList();
            };
            window.addEventListener('scroll', this.clockodoComboboxViewportHandler, true);
            window.addEventListener('resize', this.clockodoComboboxViewportHandler);
        }
    }

    unbindClockodoComboboxViewportEvents() {
        if (this.clockodoComboboxDocumentHandler && typeof document?.removeEventListener === 'function') {
            document.removeEventListener('pointerdown', this.clockodoComboboxDocumentHandler, true);
        }
        if (this.clockodoComboboxViewportHandler) {
            window?.removeEventListener?.('scroll', this.clockodoComboboxViewportHandler, true);
            window?.removeEventListener?.('resize', this.clockodoComboboxViewportHandler);
        }
        this.clockodoComboboxDocumentHandler = null;
        this.clockodoComboboxViewportHandler = null;
    }

    readClockodoAssignment(context) {
        const ids = this.clockodoAssignmentIds(context);
        const customerId = this.normalizeClockodoId(document.getElementById(ids.customer)?.value);
        const serviceId = this.normalizeClockodoId(document.getElementById(ids.service)?.value);
        const nameById = (items, id) => (Array.isArray(items) ? items : []).find(item => String(item.id) === String(id))?.name || '';
        const inputName = inputId => (inputId ? String(document.getElementById(inputId)?.value || '').trim() : '');
        return {
            customerId: customerId || '',
            serviceId: serviceId || '',
            customerName: nameById(this.clockodoCustomers, customerId) || inputName(ids.customerInput),
            serviceName: nameById(this.clockodoServices, serviceId) || inputName(ids.serviceInput)
        };
    }

    refreshClockodoAssignmentViews() {
        const activityModal = document.getElementById('activityModal');
        if (activityModal?.classList?.contains?.('active')) {
            this.populateClockodoAssignmentSelects(
                'activity',
                document.getElementById('activityCustomerSelect')?.value,
                document.getElementById('activityServiceSelect')?.value,
                document.getElementById('activityCustomerInput')?.value,
                document.getElementById('activityServiceInput')?.value
            );
        }
        const entryModal = document.getElementById('entryEditModal');
        if (entryModal?.classList?.contains?.('active')) {
            this.populateClockodoAssignmentSelects(
                'entry',
                document.getElementById('entryEditCustomerSelect')?.value,
                document.getElementById('entryEditServiceSelect')?.value,
                document.getElementById('entryEditCustomerInput')?.value,
                document.getElementById('entryEditServiceInput')?.value
            );
        }
    }

    async loadClockodoReferenceData({ force = false } = {}) {
        if (!this.clockodoConfigured ||
            !this.clockodoClient ||
            typeof this.clockodoClient.getCustomers !== 'function' ||
            typeof this.clockodoClient.getServices !== 'function') {
            if (!this.clockodoConfigured) {
                this.clockodoCustomers = [];
                this.clockodoServices = [];
                this.clockodoReferenceStatus = 'unconfigured';
            }
            return false;
        }
        if (!force && this.clockodoReferenceStatus === 'ready') return true;
        if (this.clockodoReferencePromise) return this.clockodoReferencePromise;
        const configVersion = this.clockodoConfigVersion;
        this.clockodoReferenceStatus = 'loading';
        this.clockodoReferenceError = null;
        this.refreshClockodoAssignmentViews();
        const operation = (async () => {
            try {
                const [customerResult, serviceResult] = await Promise.all([
                    this.clockodoClient.getCustomers(this.getPushClientId(), this.getClockodoAccessToken()),
                    this.clockodoClient.getServices(this.getPushClientId(), this.getClockodoAccessToken())
                ]);
                if (configVersion !== this.clockodoConfigVersion) return false;
                this.clockodoCustomers = Array.isArray(customerResult?.customers) ? customerResult.customers : [];
                this.clockodoServices = Array.isArray(serviceResult?.services) ? serviceResult.services : [];
                this.clockodoReferenceStatus = 'ready';
                return true;
            } catch (error) {
                if (configVersion !== this.clockodoConfigVersion) return false;
                this.clockodoReferenceStatus = 'error';
                this.clockodoReferenceError = error?.code || 'request_rejected';
                return false;
            } finally {
                if (this.clockodoReferencePromise === operation) this.clockodoReferencePromise = null;
                if (configVersion === this.clockodoConfigVersion) this.refreshClockodoAssignmentViews();
            }
        })();
        this.clockodoReferencePromise = operation;
        return operation;
    }

    reloadClockodoReferenceData() {
        return this.loadClockodoReferenceData({ force: true });
    }

    getClockodoAccessToken() {
        const storageKey = 'timerhubClockodoAccessToken';
        let token = localStorage.getItem(storageKey) || '';
        if (/^[A-Za-z0-9_-]{32,128}$/.test(token)) return token;
        if (!crypto?.getRandomValues) throw new Error('secure_random_unavailable');
        const bytes = crypto.getRandomValues(new Uint8Array(32));
        token = btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
        localStorage.setItem(storageKey, token);
        return token;
    }

    clockodoSendTimestamp(timestamp) {
        if (!this.clockodoConfigured || !this.clockodoClient ||
            typeof this.clockodoClient.roundUpToFiveMinutes !== 'function') return timestamp;
        return this.clockodoClient.roundUpToFiveMinutes(timestamp);
    }

    clockodoErrorMessage(error) {
        const uncertainCodes = new Set([
            'clockodo_outcome_unknown', 'operation_outcome_unknown', 'network_outcome_unknown',
            'timeout_outcome_unknown', 'network_error', 'timeout'
        ]);
        const details = this.normalizeClockodoErrorDetails(error?.details);
        if (details && !uncertainCodes.has(error?.code)) {
            const status = details.status;
            const message = details.message
                || (Array.isArray(details.fields) && details.fields.length ? details.fields.join(', ') : '')
                || details.path
                || details.code
                || '';
            if (message && status) return this.t('clockodoRejectionDetail', { status, message });
            if (message) return this.t('clockodoRejectionMessage', { message });
            if (status) return this.t('clockodoRejectionStatus', { status });
        }
        const messagesByCode = {
            network_error: this.t('clockodoNetworkError'), timeout: this.t('clockodoTimeout'),
            timeout_outcome_unknown: this.t('clockodoTimeout'), invalid_credentials: this.t('clockodoInvalidCredentials'),
            unauthorized: this.t('clockodoInvalidCredentials'), rate_limited: this.t('clockodoRateLimited'),
            service_error: this.t('clockodoServiceError'), clockodo_rejected: this.t('clockodoRequestRejected'),
            missing_clockodo_assignment: this.t('clockodoAssignmentMissing'),
            request_rejected: this.t('clockodoRequestRejected'), configuration_missing: this.t('clockodoConfigMissing'),
            malformed_response: this.t('clockodoResponseInvalid'),
            clockodo_outcome_unknown: this.t('syncOutcomeUnknown'), operation_outcome_unknown: this.t('syncOutcomeUnknown'),
            network_outcome_unknown: this.t('syncOutcomeUnknown')
        };
        return messagesByCode[error?.code] || this.t('clockodoRequestRejected');
    }

    setClockodoStatus(message) {
        const status = document.getElementById('clockodoStatusValue');
        if (status) {
            status.textContent = message;
            status.dataset.state = this.clockodoStatus || 'unconfigured';
        }
    }

    async refreshClockodoConfigurationStatus() {
        if (!this.clockodoClient || this.clockodoSaveInProgress) return;
        const version = ++this.clockodoConfigVersion;
        this.clockodoStatus = 'checking';
        this.setClockodoStatus(this.t('clockodoStatusChecking'));
        try {
            const config = await this.clockodoClient.getConfig(this.getPushClientId(), this.getClockodoAccessToken());
            if (version !== this.clockodoConfigVersion) return;
            this.clockodoConfigured = config.configured === true &&
                typeof config.apiUser === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.apiUser);
            if (this.clockodoConfigured) {
                this.clockodoEmail = config.apiUser;
                await this.storage.setSetting('clockodoEmail', this.clockodoEmail);
                document.getElementById('clockodoEmailInput').value = this.clockodoEmail;
            }
            this.clockodoStatus = this.clockodoConfigured ? 'configured' : 'unconfigured';
            this.setClockodoStatus(this.t(this.clockodoConfigured ? 'clockodoStatusConfigured' : 'clockodoStatusNotConfigured'));
            if (this.clockodoConfigured) {
                this.loadClockodoReferenceData();
            } else {
                this.clockodoCustomers = [];
                this.clockodoServices = [];
                this.clockodoReferenceStatus = 'unconfigured';
            }
        } catch (error) {
            if (version !== this.clockodoConfigVersion) return;
            this.clockodoStatus = 'failed';
            this.setClockodoStatus(`${this.t('clockodoStatusFailed')}: ${this.clockodoErrorMessage(error)}`);
        }
    }

    async saveClockodoSettings() {
        const email = document.getElementById('clockodoEmailInput').value.trim();
        const apiKeyInput = document.getElementById('clockodoApiKeyInput');
        const apiKey = apiKeyInput.value.trim();
        const customerId = document.getElementById('clockodoCustomerIdInput').value.trim();
        const projectId = document.getElementById('clockodoProjectIdInput').value.trim();
        const serviceId = document.getElementById('clockodoServiceIdInput').value.trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !apiKey) {
            this.setClockodoStatus(this.t('clockodoRequiredFields'));
            apiKeyInput.value = '';
            return false;
        }
        if (!this.clockodoClient) {
            this.setClockodoStatus(this.t('clockodoNetworkError'));
            apiKeyInput.value = '';
            return false;
        }
        const button = document.getElementById('clockodoSaveBtn');
        this.clockodoConfigVersion += 1;
        this.clockodoSaveInProgress = true;
        button.disabled = true;
        try {
            const result = await this.clockodoClient.saveConfig(this.getPushClientId(), this.getClockodoAccessToken(), { apiUser: email, apiKey });
            if (result?.configured !== true || Object.hasOwn(result, 'apiKey')) throw new Error('invalid_configuration_response');
            this.clockodoEmail = email;
            this.clockodoCustomerId = customerId;
            this.clockodoProjectId = projectId;
            this.clockodoServiceId = serviceId;
            this.clockodoBillable = document.getElementById('clockodoBillableSelect').value === 'true';
            await Promise.all([
                this.storage.setSetting('clockodoEmail', email),
                this.storage.setSetting('clockodoCustomerId', customerId),
                this.storage.setSetting('clockodoProjectId', projectId),
                this.storage.setSetting('clockodoServiceId', serviceId),
                this.storage.setSetting('clockodoBillable', this.clockodoBillable)
            ]);
            this.clockodoConfigured = true;
            this.clockodoStatus = 'configured';
            this.setClockodoStatus(this.t('clockodoStatusConfigured'));
            this.showToast(this.t('clockodoConfigSaved'));
            this.clockodoCustomers = [];
            this.clockodoServices = [];
            this.clockodoReferenceStatus = 'idle';
            this.clockodoReferencePromise = null;
            this.loadClockodoReferenceData();
            return true;
        } catch (error) {
            this.clockodoStatus = 'failed';
            this.setClockodoStatus(`${this.t('clockodoStatusFailed')}: ${this.clockodoErrorMessage(error)}`);
            return false;
        } finally {
            apiKeyInput.value = '';
            button.disabled = false;
            this.clockodoSaveInProgress = false;
        }
    }

    async testClockodoConnection() {
        if (!this.clockodoConfigured || !this.clockodoClient || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.clockodoEmail)) {
            this.clockodoStatus = 'unconfigured';
            this.setClockodoStatus(this.t('clockodoStatusNotConfigured'));
            return false;
        }
        const button = document.getElementById('clockodoTestBtn');
        this.clockodoStatus = 'checking';
        this.setClockodoStatus(this.t('clockodoStatusChecking'));
        button.disabled = true;
        try {
            await this.clockodoClient.testConnection(this.getPushClientId(), this.getClockodoAccessToken());
            this.clockodoStatus = 'connected';
            this.setClockodoStatus(this.t('clockodoStatusConnected'));
            this.showToast(this.t('clockodoTestSuccess'));
            return true;
        } catch (error) {
            this.clockodoStatus = 'failed';
            this.setClockodoStatus(`${this.t('clockodoStatusFailed')}: ${this.clockodoErrorMessage(error)}`);
            return false;
        } finally {
            button.disabled = false;
        }
    }

    async removeClockodoSettings() {
        if (this.clockodoConfigured && this.clockodoClient) {
            try {
                await this.clockodoClient.removeConfig(this.getPushClientId(), this.getClockodoAccessToken());
            } catch (error) {
                this.setClockodoStatus(this.clockodoErrorMessage(error));
                return false;
            }
        }
        for (const key of ['clockodoEmail', 'clockodoCustomerId', 'clockodoProjectId', 'clockodoServiceId']) {
            await this.storage.setSetting(key, '');
        }
        await this.storage.setSetting('clockodoBillable', true);
        localStorage.removeItem('timerhubClockodoAccessToken');
        this.clockodoEmail = '';
        this.clockodoCustomerId = '';
        this.clockodoProjectId = '';
        this.clockodoServiceId = '';
        this.clockodoBillable = true;
        this.clockodoConfigured = false;
        this.clockodoStatus = 'unconfigured';
        this.clockodoConfigVersion += 1;
        this.clockodoCustomers = [];
        this.clockodoServices = [];
        this.clockodoReferenceStatus = 'unconfigured';
        this.clockodoReferencePromise = null;
        document.getElementById('clockodoEmailInput').value = '';
        document.getElementById('clockodoApiKeyInput').value = '';
        document.getElementById('clockodoCustomerIdInput').value = '';
        document.getElementById('clockodoProjectIdInput').value = '';
        document.getElementById('clockodoServiceIdInput').value = '';
        document.getElementById('clockodoBillableSelect').value = 'true';
        this.setClockodoStatus(this.t('clockodoStatusNotConfigured'));
        this.showToast(this.t('clockodoConfigRemoved'));
        return true;
    }

    toggleClockodoKeyVisibility() {
        const input = document.getElementById('clockodoApiKeyInput');
        const button = document.getElementById('clockodoToggleKeyBtn');
        input.type = input.type === 'password' ? 'text' : 'password';
        button.textContent = input.type === 'password' ? this.t('showSecret') : this.t('hideSecret');
        button.setAttribute('aria-pressed', String(input.type === 'text'));
    }

    renderSettings() {
        document.getElementById('themeSelect').value = this.currentTheme;
        document.getElementById('languageSelect').value = this.currentLanguage;
        document.getElementById('timeFormatSelect').value = this.timeFormat;
        document.getElementById('firstDaySelect').value = this.firstDayOfWeek;
        document.getElementById('confirmDeleteCheckbox').checked = this.confirmDelete;
        document.getElementById('clockodoEmailInput').value = this.clockodoEmail;
        document.getElementById('clockodoApiKeyInput').value = '';
        document.getElementById('clockodoCustomerIdInput').value = this.clockodoCustomerId;
        document.getElementById('clockodoProjectIdInput').value = this.clockodoProjectId;
        document.getElementById('clockodoServiceIdInput').value = this.clockodoServiceId;
        document.getElementById('clockodoBillableSelect').value = String(this.clockodoBillable);
        this.refreshClockodoConfigurationStatus();
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
            const now = new Date();
            const parts = new Intl.DateTimeFormat('en-CA', {
                timeZone: 'UTC', year: 'numeric', month: '2-digit', day: '2-digit',
                hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
            }).formatToParts(now).reduce((values, part) => ({ ...values, [part.type]: part.value }), {});
            const filename = `${this.t('backupFilename')}_${parts.year}${parts.month}${parts.day}_${parts.hour}${parts.minute}${parts.second}.json`;
            a.href = url;
            a.download = filename;
            a.rel = 'noopener';
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            // Mobile browsers may consume the Blob URL asynchronously after click.
            setTimeout(() => URL.revokeObjectURL(url), 60_000);
            this.showToast(this.t('backupSuccess'));
        } catch (error) {
            this.showToast(this.t('backupFailed'));
        }
    }

    formatSnapshotDate(timestamp) {
        return new Intl.DateTimeFormat(this.currentLanguage, {
            dateStyle: 'medium', timeStyle: 'short'
        }).format(new Date(timestamp));
    }

    async refreshAutomaticBackupStatus() {
        const status = document.getElementById('automaticBackupStatus');
        const select = document.getElementById('automaticSnapshotSelect');
        if (!status || !select) return;
        try {
            this.backupSnapshots = await this.storage.getAutomaticSnapshots();
            const selectedId = select.value;
            select.replaceChildren();
            const placeholder = document.createElement('option');
            placeholder.value = '';
            placeholder.textContent = this.t('selectSnapshot');
            select.appendChild(placeholder);
            for (const snapshot of this.backupSnapshots) {
                const option = document.createElement('option');
                option.value = snapshot.id;
                option.textContent = this.t('snapshotDateFormat', { date: this.formatSnapshotDate(snapshot.createdAt) });
                select.appendChild(option);
            }
            if (this.backupSnapshots.some(snapshot => snapshot.id === selectedId)) select.value = selectedId;
            const latest = this.backupSnapshots[0];
            status.textContent = this.storage.snapshotStatus === 'failed'
                ? this.t('automaticSnapshotsFailed')
                : latest
                    ? this.t('automaticSnapshotsLatest', { date: this.formatSnapshotDate(latest.createdAt) })
                    : this.t('automaticSnapshotsNone');
            const restoreButton = document.getElementById('restoreSnapshotBtn');
            if (restoreButton) restoreButton.disabled = !select.value;
        } catch {
            status.textContent = this.t('automaticSnapshotsFailed');
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
                    this.storage.validateBackupData(data);
                    this.openRestoreConfirmation(data);
                } catch (error) {
                    this.showToast(error?.message === 'invalid_backup' ? this.t('invalidBackup') : this.t('restoreFailed'));
                }
            };
            reader.onerror = () => this.showToast(this.t('restoreFailed'));
            reader.readAsText(file);
        });
        input.click();
    }

    restoreSelectedSnapshot() {
        const snapshotId = document.getElementById('automaticSnapshotSelect')?.value;
        const snapshot = this.backupSnapshots.find(item => item.id === snapshotId);
        if (!snapshot || snapshot.format !== 'timerhub-snapshot' || snapshot.version !== 1) {
            this.showToast(this.t('restoreFailed'));
            return false;
        }
        try {
            this.storage.validateBackupData(snapshot.data);
            this.openRestoreConfirmation(snapshot.data);
            return true;
        } catch {
            this.showToast(this.t('invalidBackup'));
            return false;
        }
    }

    openRestoreConfirmation(data) {
        this.pendingRestoreData = data;
        document.getElementById('backupRestoreModal')?.classList.add('active');
    }

    cancelPendingRestore() {
        this.pendingRestoreData = null;
        document.getElementById('backupRestoreModal')?.classList.remove('active');
    }

    async restorePendingData(merge) {
        if (!this.pendingRestoreData) return false;
        const buttons = ['backupRestoreMergeBtn', 'backupRestoreReplaceBtn'];
        buttons.forEach(id => { const button = document.getElementById(id); if (button) button.disabled = true; });
        try {
            await this.storage.importAll(this.pendingRestoreData, merge);
            this.cancelPendingRestore();
            await this.loadActivities();
            await this.loadGroups();
            await this.loadTimeEntries();
            this.renderAll();
            await this.refreshAutomaticBackupStatus();
            this.showToast(this.t('restoreSuccess'));
            return true;
        } catch {
            this.showToast(this.t('restoreFailed'));
            return false;
        } finally {
            buttons.forEach(id => { const button = document.getElementById(id); if (button) button.disabled = false; });
        }
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

        const activities = demoActivities.map((act, index) => ({
                id: this.generateId(),
                name: act.name,
                color: act.color,
                shape: act.shape || 'circle',
                size: 'medium',
                position: index,
                archived: false,
                createdAt: now,
                updatedAt: now
        }));

        const timeEntries = [];
        let time = today.getTime() + (8 * 60 * 60 * 1000); // 08:00
        const durations = [77, 80, 65, 45, 90, 30]; // minutes

        for (let i = 0; i < 6; i++) {
            const entry = this.createTimeEntry({
                id: this.generateId(),
                activityId: activities[i % activities.length].id,
                activityNameSnapshot: activities[i % activities.length].name,
                startTimestamp: time,
                endTimestamp: time + (durations[i] * 60 * 1000),
                createdAt: now,
                updatedAt: now,
                source: 'manual',
                notes: '',
                syncStatus: SYNC_STATUS.UNSYNCED
            });
            timeEntries.push(entry);
            time = entry.endTimestamp;
        }

        await this.storage.replaceWorkData(activities, timeEntries);
        this.activities = activities;
        this.timeEntries = timeEntries;
        this.activeActivityId = null;

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
