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
        activityStopHint: 'Tap to stop',
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
        save: 'Save',
        add: 'Add',
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
        activityOptional: 'Activity (optional)',
        noActivity: 'No activity',
        duration: 'Duration',
        overlappingEntry: 'This time overlaps with another entry',
        undo: 'Undo',
        deleted: 'Deleted',
        restoreSuccess: 'Data restored successfully',
        backupSuccess: 'Backup file prepared. Check that it was saved outside TimerHub, usually in Downloads.',
    },
    de: {
        timerRunning: 'Timer läuft',
        timerStatusRunning: 'Timer läuft: {activity} · {duration}',
        timerSaving: 'Timer wird gespeichert…', timerSaveFailed: 'Timer konnte nicht gespeichert werden. Prüfe den Gerätespeicher und versuche es erneut.',
        activityStopHint: 'Tippen zum Stoppen',
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
        save: 'Speichern',
        add: 'Hinzufügen',
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
        activityOptional: 'Aktivität (optional)',
        noActivity: 'Keine Aktivität',
        duration: 'Dauer',
        overlappingEntry: 'Diese Zeit überlappt mit einem anderen Eintrag',
        undo: 'Rückgängig',
        deleted: 'Gelöscht',
        restoreSuccess: 'Daten erfolgreich wiederhergestellt',
        backupSuccess: 'Sicherungsdatei vorbereitet. Prüfen Sie, ob sie außerhalb von TimerHub gespeichert wurde (normalerweise in Downloads).',
    },
    ru: {
        timerRunning: 'Таймер запущен',
        timerStatusRunning: 'Таймер работает: {activity} · {duration}',
        timerSaving: 'Сохранение таймера…', timerSaveFailed: 'Не удалось сохранить таймер. Проверьте память устройства и попробуйте снова.',
        activityStopHint: 'Нажмите, чтобы остановить',
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
        save: 'Сохранить',
        add: 'Добавить',
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
        activityOptional: 'Занятие (необязательно)',
        noActivity: 'Без занятия',
        duration: 'Длительность',
        overlappingEntry: 'Это время пересекается с другой записью',
        undo: 'Отменить',
        deleted: 'Удалено',
        restoreSuccess: 'Данные успешно восстановлены',
        backupSuccess: 'Файл резервной копии подготовлен. Проверьте, что он сохранён вне TimerHub (обычно в папке «Загрузки»).',
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
        backupEmptyWarning: 'This backup contains no activities, time entries, or groups. Replacing will clear the data currently stored on this device.',
        backupEmptyConfirmLabel: 'I understand that replacing will clear the current data.',
        backupEmptyNeedsConfirmation: 'Confirm that you want to replace current data with an empty backup.',
        snapshotsSameDatabaseNote: 'Snapshots are stored in the same browser database as your data. If that database is deleted, snapshots are deleted with it. Export a backup file for protection outside the browser.',
        persistentStorageTitle: 'Storage durability',
        persistentStorageDescription: 'Persistent storage asks Chrome to protect TimerHub data from automatic cleanup. It cannot prevent manual clearing of browsing data or app storage.',
        persistentStorageGranted: 'Persistent storage: granted by the browser.',
        persistentStorageDenied: 'Persistent storage: not granted. The browser may clear TimerHub data when storage is low.',
        persistentStorageUnsupported: 'Persistent storage: not supported by this browser.',
        persistentStorageUnknown: 'Persistent storage: status unknown.',
        lastBackupNever: 'No backup file exported yet. Browser-stored data and snapshots can be lost together.',
        lastBackupAt: 'Last backup file export: {date}',
        lastBackupOverdue: 'Export a new backup file to keep a copy outside browser storage.',
        missingDataWarningTitle: 'No TimerHub data found on this device',
        missingDataWarningBody: 'Data was stored on this device before, but nothing was found now. Browser storage may have been cleared. Restore a backup file if you have one.',
        missingDataRestore: 'Restore from backup file',
        missingDataRestoreExternal: 'Restore latest external backup',
        missingDataDismiss: 'Dismiss',
        diagnosticsTitle: 'Local diagnostics',
        diagnosticsSummary: 'Database {name} v{version} · {activities} activities · {entries} time entries · {groups} groups',
        diagnosticsDescription: 'Recent errors and warnings. Credentials and sensitive payloads are redacted.',
        diagnosticsEmpty: 'No recent warnings or errors.',
        diagnosticsExport: 'Export diagnostics', diagnosticsClear: 'Clear diagnostics',
        diagnosticsExportFailed: 'Could not export the diagnostics file.',
        diagnosticsCleared: 'Diagnostics cleared.',
        backupSetupTitle: 'Choose a backup folder',
        backupSetupIntro: 'TimerHub needs a folder outside browser storage to protect your data.',
        backupSetupExplanation: 'Automatic backups are written to a folder you control, so they survive browser storage clean-up, app restarts, and database problems.',
        backupSetupBrowserNote: 'Your browser may ask you to allow access to this folder again when TimerHub starts. Keep the folder available on this device.',
        backupSetupChoose: 'Choose backup folder', backupSetupReauthorize: 'Restore folder access',
        backupSetupRetry: 'Retry verification', backupSetupExport: 'Export current data',
        backupSetupExportHelp: 'If the folder is unavailable, export your current data now so it can be recovered later.',
        backupSetupDirectoryLabel: 'Backup folder: {name}',
        backupSetupVerifying: 'Verifying folder access and test backup…',
        backupSetupVerified: 'Backup folder verified. Starting TimerHub…',
        backupSetupBlocked: 'The main application stays locked until a usable backup folder is verified.',
        backupSetupUnsupportedTitle: 'Persistent backup folder is not supported',
        backupSetupUnsupportedBody: 'This browser does not expose persistent folder access. On Android, use Chrome 132 or newer (or the installed Chrome PWA) and open TimerHub over HTTPS. In browsers without this API, automatic external backups cannot be enabled; export your data now. A native wrapper would be required for older browsers.',
        backupSetupPermissionTitle: 'Backup folder access is required',
        backupSetupPermissionRequiredTitle: 'Restore access to your backup folder',
        backupSetupPermissionRequiredBody: 'TimerHub found your saved backup folder. The browser needs you to confirm access again before automatic backups can continue. You do not need to select a new folder.',
        backupSetupRestoreErrorTitle: 'Saved backup folder could not be loaded',
        backupSetupRestoreErrorBody: 'TimerHub could not read the saved folder handle from browser storage. Retry loading it. If the handle is really gone, choose the folder again; existing backups are not deleted.',
        backupSetupChangeDir: 'Choose a different folder',
        backupSetupPermissionBody: 'Access to the selected folder was revoked or has expired. Reauthorize it, choose another folder, or export your data.',
        backupSetupErrorTitle: 'Backup folder verification failed',
        backupSetupNoData: 'No local data is available to export.',
        backupSetupCurrentData: 'Current data: {activities} activities · {entries} entries.',
        backupSetupSelectFailed: 'The backup folder could not be selected or verified. Nothing was deleted.',
        backupSetupExportDone: 'Data exported. Keep the file outside browser storage.',
        backupSetupExportFailed: 'Could not export the current data.',
        backupRetentionLabel: 'Automatic external backups to keep',
        externalBackupTitle: 'External automatic backups',
        externalBackupDescription: 'Verified backups are written to the folder you selected. Manual backups are never removed by retention.',
        externalBackupStatusNone: 'No verified external backup yet.',
        externalBackupStatusOk: 'Last verified external backup: {date}',
        externalBackupStatusFolder: 'Backup folder: {name}',
        externalBackupNow: 'Back up now', externalBackupChooseFolder: 'Choose or change folder',
        externalBackupVerify: 'Verify folder', externalBackupRefresh: 'Refresh backup list',
        externalBackupSelect: 'Choose an external backup',
        externalBackupRestore: 'Restore selected external backup',
        externalBackupNone: 'No verified external backups found.',
        externalBackupSucceeded: 'External backup verified: {name}',
        externalBackupFailed: 'External backup failed. Previous backups were kept.',
        backupAccessRestore: 'Restore access',
        backupAccessRetry: 'Retry backup storage',
        externalBackupSafetyCopyFailed: 'Could not create a safety backup before restoring. Restore was cancelled.',
        externalBackupNotConfigured: 'No usable backup folder is configured.',
        externalBackupFolderMissing: 'Backup folder was not found. Choose the folder again in Backup settings.',
        externalBackupUnsupported: 'External folder backups are not supported in this browser.',
        shareLinkBtn: 'Share link',
        shareLinkTitle: 'Share day as a link',
        shareLinkDesc: 'Selected entries are encrypted on this device before upload. Only encrypted data is stored temporarily, and the link expires automatically.',
        shareLinkExpiryLabel: 'Link expires after',
        shareLinkExpiryHour: '1 hour',
        shareLinkExpiryDay: '24 hours',
        shareLinkExpiryWeek: '7 days',
        shareLinkExpiryMonth: '30 days',
        shareLinkCreate: 'Create share link',
        shareLinkSelected: '{count} entries selected · {total}',
        shareLinkNoEntries: 'Select at least one entry to share.',
        shareLinkCreated: 'Share link ready for {count} entries.',
        shareLinkResultLabel: 'Share link',
        shareLinkCopy: 'Copy link',
        shareLinkSend: 'Send link',
        shareLinkCopied: 'Share link copied',
        shareLinkLoading: 'Fetching the shared day…',
        shareLinkNotFound: 'This share link does not exist or was already used.',
        shareLinkExpired: 'This share link has expired.',
        shareLinkExists: 'This share link already exists. Create a new one.',
        shareLinkInvalid: 'This share link or its data is not valid.',
        shareLinkUnavailable: 'The share link service is currently unavailable. Try again later.',
        sharedDayTitle: 'Shared day',
        sharedDayPreviewNote: 'Preview the entries below. Nothing is sent until you start the import.',
        sharedDayImport: 'Import to Clockodo',
        sharedDayRetry: 'Retry failed entries',
        sharedDayConfigure: 'Configure Clockodo',
        sharedDayExpires: 'Link expires: {date}',
        sharedDayConfigRequired: 'Clockodo is not configured on this device. Configure it to import.',
        sharedDayMissingCustomer: 'Some entries use customers that are missing in your Clockodo.',
        sharedDayMissingService: 'Some entries use services that are missing in your Clockodo.',
        sharedImportConfigRequired: 'Configure Clockodo to continue the shared import.',
        sharedImportConfigReady: 'Clockodo configuration saved. You can start the import now.',
        sharedImportFailed: 'The import could not start.',
        sharedImportReferenceFailed: 'Customers and services could not be loaded from Clockodo. Check the connection and try again.',
        sharedImportMissingMapping: 'Import stopped: missing customers: {customers}, missing services: {services}. Add them in Clockodo or correct the assignments, then retry.',
        sharedImportSuccess: '{count} entries were created in your Clockodo. The share link is now closed.',
        sharedImportSuccessLinkOpen: '{count} entries were created in your Clockodo. The link could not be closed and will expire automatically.',
        sharedImportPartial: 'Import incomplete: {failed} failed, {unknown} with unknown outcome. Retry the failed entries; successfully created entries are never duplicated.',
        sharedImportBadgePending: 'Ready',
        sharedImportBadgeSending: 'Sending…',
        sharedImportBadgeSynced: 'Imported',
        sharedImportBadgeFailed: 'Failed',
        sharedImportBadgeUnknown: 'Outcome unknown',
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
        icon: 'Icon',
        iconPickerLabel: 'Choose a template icon',
        displayMode: 'Display',
        displayModePickerLabel: 'Choose how the activity is displayed',
        displayModeIconAndText: 'Icon + text',
        displayModeIconOnly: 'Icon only',
        iconNone: 'No icon',
        iconVacuumAttic: 'Roof',
        iconVacuumBasement: 'Basement',
        iconMop: 'Mop',
        iconSqueegee: 'Window',
        iconDuster: 'Dust',
        iconCar: 'Car',
        demoMasking: 'Masking', demoPainting: 'Painting', demoWallpapering: 'Wallpapering',
        demoUnloading: 'Unloading', demoTravel: 'Travel', demoBreak: 'Break',
        logFilename: 'timelog', backupFilename: 'timerhub_backup',
        dayReview: 'Day Review',
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
        issueInvalidTime: 'Invalid or missing time data',
        issueUnusuallyLong: 'Unusually long (>16h)',
        notes: 'Notes', project: 'Project', service: 'Service', customer: 'Customer', endDate: 'End Date',
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
        clockodoProjectSelectLabel: 'Clockodo project',
        clockodoServiceSelectLabel: 'Clockodo service',
        clockodoAssignmentNone: 'No Clockodo assignment',
        clockodoAssignmentLoading: 'Loading Clockodo data…',
        clockodoAssignmentNotConfigured: 'Clockodo is not configured. Add credentials in Settings to choose a customer and service.',
        clockodoAssignmentLoadFailed: 'Could not load Clockodo customers and services.',
        clockodoAssignmentReload: 'Reload',
        clockodoAssignmentHelp: 'Type to search. Leave empty for no Clockodo assignment.',
        clockodoProjectNotAllowedForCustomer: 'The selected project does not belong to this customer. Choose a project of the selected customer.',
        clockodoProjectLoadFailed: 'Customers and services loaded, but projects could not be loaded. Retry or check project access in Clockodo. ({detail})',
        clockodoProjectCustomerSelected: 'Customer "{name}" selected from the project.',
        clockodoProjectMultipleCustomers: 'Several customers use this project name: {customers}. Choose the matching customer.',
        clockodoProjectNoCustomer: 'No customer found for "{project}". The text was kept; choose a customer manually if needed.',
        clockodoProjectCustomerKept: 'This project belongs to "{name}". The selected customer was kept.',
        iconServiceUnavailable: 'The service "{service}" for this icon is not available. The current service was kept.',
        clockodoWorkerOutdated: 'The TimerHub server (Cloudflare Worker) is outdated. Redeploy the Worker from Cloudflare, then press Reload.',
        clockodoProjectsUnavailable: 'Clockodo does not provide projects for this account or API user ({detail}). Check the Clockodo plan and the user\'s project rights, then press Reload.',
        clockodoProjectChooseCustomer: 'Choose a customer first, then pick one of their projects.',
        clockodoNoProjects: 'Clockodo returned no projects for this account. Check project access and whether projects are enabled in Clockodo.',
        clockodoNoProjectsForCustomer: 'The selected customer has no projects in Clockodo.',
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
        unknownResendNotice: 'The previous Clockodo result for this entry is uncertain. Clockodo may already contain it. Check Clockodo first — continuing can create a duplicate entry.',
        importDay: 'Import',
        exchangeActions: 'Day exchange',
        exchangeNothingToShare: 'Export the day first.',
        exchangeShareUnsupported: 'File sharing is not supported here. The file was downloaded instead.',
        exportDayTitle: 'Export day',
        exportDayDesc: 'The encrypted exchange file is ready. Share it with the other worker and pass on the transfer code separately.',
        importDayTitle: 'Import day',
        importDayDesc: 'Choose a .timerhub file and enter the transfer code. The file is decrypted locally on this device.',
        exchangeClockodoNote: 'Imported entries are not sent to Clockodo automatically. Review them and confirm with Review & Sync.',
        transferCode: 'Transfer code',
        transferCodePlaceholder: 'Enter the transfer code',
        showQr: 'Show QR',
        scanQr: 'Scan QR',
        chooseFile: 'Choose file',
        decrypt: 'Decrypt',
        importBtn: 'Import',
        importAgainBtn: 'Import again',
        exchangeQrTitle: 'Transfer code QR',
        exchangeScanTitle: 'Scan transfer QR',
        exchangeScanning: 'Point the camera at the transfer code QR.',
        exchangeScanUnsupported: 'QR scanning is not supported here. Enter the transfer code manually.',
        exchangeScanPermission: 'Camera access was denied. Enter the transfer code manually.',
        exchangeSecurityNote: 'The transfer code unlocks the file.',
        exchangeNoEntries: 'There are no completed entries to export for this day.',
        exchangeExportFailed: 'The day could not be exported. Try again.',
        exchangeImportFailed: 'The day could not be imported. Try again.',
        exchangeInvalidFile: 'This is not a valid TimerHub exchange file.',
        exchangeUnsupportedFormat: 'This exchange file uses an unsupported version.',
        exchangeInvalidTransferCode: 'This transfer code is not valid.',
        exchangeDecryptFailed: 'Wrong transfer code or the file was modified or corrupted.',
        exchangeInvalidPayload: 'The decrypted data is incomplete or invalid.',
        exchangeInvalidQr: 'This QR code does not contain a valid transfer code.',
        exchangeCryptoUnavailable: 'Secure encryption is not available in this browser context. Use HTTPS or localhost.',
        exchangeChooseFileFirst: 'Choose a .timerhub file first.',
        exchangeSourceDate: 'Source date',
        exchangeWarningNewActivity: 'New activities will be created for names that do not exist yet.',
        exchangeWarningDuplicate: 'Some entries already exist on this day and may be duplicated.',
        exchangeWarningUnknownCustomer: 'Some customer IDs are not available in your Clockodo list.',
        exchangeWarningUnknownService: 'Some service IDs are not available in your Clockodo list.',
        exchangeWarningMissingAssignment: 'Some entries have no customer or service assignment.',
        exchangeWarningRepeat: 'This export was already imported before.',
        exchangeImportedCount: '{count} entries imported. Review them before syncing.',
        assignmentSectionTitle: 'Work assignments',
        assignmentSectionDesc: 'Create groups and activities from a JSON assignment generated by an AI assistant. Everything is validated on this device; nothing is uploaded.',
        assignmentImportTitle: 'Import assignment from JSON',
        assignmentImportDesc: 'Paste the JSON assignment and validate it. Nothing is created until you confirm the preview.',
        assignmentJsonPlaceholder: 'Paste assignment JSON here',
        assignmentChooseFile: 'Choose JSON file',
        assignmentCopyPrompt: 'Copy AI prompt',
        assignmentValidate: 'Validate & preview',
        assignmentImportBtn: 'Import',
        assignmentImportAgainBtn: 'Import again',
        assignmentImportDefaultName: 'Imported assignment',
        assignmentImported: '{groups} groups and {activities} activities imported.',
        assignmentImportFailed: 'The assignment could not be imported. Nothing was changed.',
        assignmentInvalidJson: 'This is not valid JSON.',
        assignmentInvalidFormat: 'This file is not a TimerHub assignment.',
        assignmentUnsupportedVersion: 'This assignment version is not supported.',
        assignmentUnexpectedProperty: 'Unexpected field',
        assignmentInvalidType: 'Invalid value type',
        assignmentInvalidName: 'Names must be non-empty text',
        assignmentInvalidValue: 'Invalid value',
        assignmentTooLarge: 'The assignment is too large.',
        assignmentTooDeep: 'The group nesting is too deep.',
        assignmentTooManyGroups: 'Too many groups.',
        assignmentTooManyActivities: 'Too many activities.',
        assignmentDuplicateName: 'Duplicate names in the same group are not allowed.',
        assignmentEmpty: 'The assignment contains no groups or activities.',
        assignmentErrorAt: 'at {path}',
        assignmentPreviewTitle: 'Preview',
        assignmentPreviewSummary: '{groups} groups · {activities} activities · mode: {mode}',
        assignmentPreviewGroup: 'Group',
        assignmentModeAdd: 'add',
        assignmentModeReplace: 'replace',
        assignmentReplaceNotice: 'Replaces {groups} groups and {activities} activities from a previous "{name}" import.',
        assignmentRepeatWarning: 'This exact assignment was already imported.',
        assignmentExcludedCount: '{count} items are explicitly excluded.',
        assignmentExcludedShort: 'excluded',
        assignmentPromptCopied: 'AI prompt copied',
        assignmentPromptCopyFailed: 'The AI prompt could not be copied.',
        createGroup: 'Create Group', createGroupFromSelection: 'Group selection ({count})',
        groupName: 'Group name', groupNamePlaceholder: 'e.g., Site A',
        groupDefaultName: 'Group {number}', groupCreated: 'Group "{name}" created',
        groupCreateFailed: 'Could not create the group. Try again.',
        selectActivitiesFirst: 'Select at least one activity first',
        collapseGroup: 'Collapse group', expandGroup: 'Expand group',
        collapseAllGroups: 'Collapse all', expandAllGroups: 'Expand all',
        showAssignments: 'Show assignments', hideAssignments: 'Hide assignments',
        duplicateGroup: 'Duplicate group', groupCopyName: '{name} (copy)',
        duplicateActivity: 'Duplicate',
        activityCopyName: '{name} (copy)',
        activityDuplicated: 'Activity "{name}" duplicated',
        activityDuplicateFailed: 'Could not duplicate the activity. The original was not changed.',
        addActivityFromReview: 'Add Activity',
        activityAddedFromReview: 'Activity "{name}" added to the canvas.',
        activityAddFromReviewFailed: 'Could not add the activity. Nothing was changed.',
        groupDuplicated: 'Group "{name}" duplicated',
        editGroup: 'Edit group', resizeGroup: 'Resize collapsed group',
        groupSelectedGroups: 'Group selected groups',
        groupSelectedGroupsCount: 'Group {count} groups',
        deleteSelectedGroups: 'Delete selected groups',
        deleteGroupsTitle: 'Delete groups',
        deleteGroupsSummary: 'Selected hierarchy: {groups} group(s), {activities} activity(ies), {children} nested group(s).',
        deleteChoiceActivitiesLegend: 'Activities in this hierarchy',
        deleteChoiceNestedLegend: 'Nested groups',
        deleteChoiceKeepActivities: 'Keep: move them to the canvas',
        deleteChoiceDeleteActivities: 'Delete permanently',
        deleteChoiceKeepNested: 'Keep: move them up one level',
        deleteChoiceDeleteNested: 'Delete with all contents',
        deleteChoiceRequired: 'Choose what happens to activities and nested groups before confirming.',
        deleteOutcomeSummary: 'Keeps {keptActivities} activity(ies), deletes {deletedActivities}; keeps {keptGroups} group(s), deletes {deletedGroups}.',
        deleteLockedWarning: 'Locked groups cannot be deleted: {names}. Unlock them in the group editor first.',
        undoAction: 'Undo',
        redoAction: 'Redo',
        groupDeleteFailed: 'Could not delete the groups. Try again.',
        groupDeleted: 'Groups deleted',
        groupEditTitle: 'Edit group',
        groupLockedLabel: 'Lock this group (deletion is blocked until unlocked)',
        groupLocked: 'Locked group',
        groupColorLabel: 'Group color', groupColorDefault: 'Default',
        groupNameRequired: 'Enter a group name.',
        groupEditSaveFailed: 'Could not save the group. Try again.',
        groupDefaultCustomer: 'Default customer',
        groupDefaultCustomerHelp: 'New activities in this group use this customer unless they have their own customer.',
        groupDefaultCustomerMissing: 'The saved default customer is no longer available in Clockodo. Choose another customer or clear the field.',
        groupDefaultCustomerInherited: 'Inherited from a parent group: {name}',
        clearDefaultCustomer: 'Clear customer',
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
        backupEmptyWarning: 'Diese Sicherung enthält keine Aktivitäten, Zeiteinträge oder Gruppen. Beim Ersetzen werden die aktuell auf diesem Gerät gespeicherten Daten gelöscht.',
        backupEmptyConfirmLabel: 'Ich verstehe, dass beim Ersetzen die aktuellen Daten gelöscht werden.',
        backupEmptyNeedsConfirmation: 'Bitte bestätigen Sie, dass die aktuellen Daten durch eine leere Sicherung ersetzt werden sollen.',
        snapshotsSameDatabaseNote: 'Sicherungen liegen in derselben Browser-Datenbank wie Ihre Daten. Wird diese Datenbank gelöscht, werden die Sicherungen mitgelöscht. Exportieren Sie eine Sicherungsdatei, um sie außerhalb des Browsers zu schützen.',
        persistentStorageTitle: 'Speicherbeständigkeit',
        persistentStorageDescription: 'Persistenter Speicher bittet Chrome, TimerHub-Daten vor automatischer Bereinigung zu schützen. Manuelles Löschen von Browser- oder App-Daten verhindert das nicht.',
        persistentStorageGranted: 'Persistenter Speicher: vom Browser gewährt.',
        persistentStorageDenied: 'Persistenter Speicher: nicht gewährt. Der Browser kann TimerHub-Daten bei Speicherknappheit löschen.',
        persistentStorageUnsupported: 'Persistenter Speicher: von diesem Browser nicht unterstützt.',
        persistentStorageUnknown: 'Persistenter Speicher: Status unbekannt.',
        lastBackupNever: 'Noch keine Sicherungsdatei exportiert. Im Browser gespeicherte Daten und Sicherungen können gemeinsam verloren gehen.',
        lastBackupAt: 'Letzter Sicherungsdatei-Export: {date}',
        lastBackupOverdue: 'Exportieren Sie eine neue Sicherungsdatei, um eine Kopie außerhalb des Browsers zu behalten.',
        missingDataWarningTitle: 'Keine TimerHub-Daten auf diesem Gerät gefunden',
        missingDataWarningBody: 'Auf diesem Gerät waren zuvor Daten gespeichert, jetzt wurde nichts gefunden. Möglicherweise wurde der Browserspeicher gelöscht. Stellen Sie eine Sicherungsdatei wieder her, falls vorhanden.',
        missingDataRestore: 'Aus Sicherungsdatei wiederherstellen',
        missingDataRestoreExternal: 'Neueste externe Sicherung wiederherstellen',
        missingDataDismiss: 'Ausblenden',
        diagnosticsTitle: 'Lokale Diagnose',
        diagnosticsSummary: 'Datenbank {name} v{version} · {activities} Aktivitäten · {entries} Zeiteinträge · {groups} Gruppen',
        diagnosticsDescription: 'Letzte Fehler und Warnungen. Zugangsdaten und sensible Inhalte werden ausgeblendet.',
        diagnosticsEmpty: 'Keine aktuellen Warnungen oder Fehler.',
        diagnosticsExport: 'Diagnose exportieren', diagnosticsClear: 'Diagnose löschen',
        diagnosticsExportFailed: 'Die Diagnosedatei konnte nicht exportiert werden.',
        diagnosticsCleared: 'Diagnose gelöscht.',
        backupSetupTitle: 'Sicherungsordner auswählen',
        backupSetupIntro: 'TimerHub benötigt einen Ordner außerhalb des Browser-Speichers, um deine Daten zu schützen.',
        backupSetupExplanation: 'Automatische Sicherungen werden in einem Ordner deiner Wahl gespeichert. So überstehen sie das Löschen des Browser-Speichers, App-Neustarts und Datenbankprobleme.',
        backupSetupBrowserNote: 'Der Browser kann beim Start erneut nach dem Zugriff auf diesen Ordner fragen. Halte den Ordner auf diesem Gerät verfügbar.',
        backupSetupChoose: 'Sicherungsordner auswählen', backupSetupReauthorize: 'Ordnerzugriff wiederherstellen',
        backupSetupRetry: 'Prüfung wiederholen', backupSetupExport: 'Aktuelle Daten exportieren',
        backupSetupExportHelp: 'Wenn der Ordner nicht verfügbar ist, exportiere deine aktuellen Daten jetzt, damit du sie später wiederherstellen kannst.',
        backupSetupDirectoryLabel: 'Sicherungsordner: {name}',
        backupSetupVerifying: 'Ordnerzugriff und Testsicherung werden geprüft…',
        backupSetupVerified: 'Sicherungsordner geprüft. TimerHub wird gestartet…',
        backupSetupBlocked: 'Die Hauptanwendung bleibt gesperrt, bis ein nutzbarer Sicherungsordner geprüft wurde.',
        backupSetupUnsupportedTitle: 'Dauerhafter Sicherungsordner wird nicht unterstützt',
        backupSetupUnsupportedBody: 'Dieser Browser bietet keinen dauerhaften Ordnerzugriff. Unter Android benötigst du Chrome 132 oder neuer (oder die installierte Chrome-PWA) und TimerHub über HTTPS. In Browsern ohne diese API sind automatische externe Sicherungen nicht möglich; exportiere jetzt deine Daten. Für ältere Browser wäre eine native Hülle erforderlich.',
        backupSetupPermissionTitle: 'Zugriff auf den Sicherungsordner erforderlich',
        backupSetupPermissionRequiredTitle: 'Zugriff auf den Sicherungsordner wiederherstellen',
        backupSetupPermissionRequiredBody: 'TimerHub hat den gespeicherten Sicherungsordner gefunden. Der Browser benötigt eine erneute Bestätigung, bevor automatische Sicherungen fortgesetzt werden können. Du musst keinen neuen Ordner auswählen.',
        backupSetupRestoreErrorTitle: 'Gespeicherter Sicherungsordner konnte nicht geladen werden',
        backupSetupRestoreErrorBody: 'TimerHub konnte den gespeicherten Ordnerzugriff nicht aus dem Browserspeicher lesen. Versuche es erneut. Wenn der Zugriff wirklich verloren ist, wähle den Ordner erneut; vorhandene Sicherungen werden nicht gelöscht.',
        backupSetupChangeDir: 'Anderen Ordner auswählen',
        backupSetupPermissionBody: 'Der Zugriff auf den ausgewählten Ordner wurde entzogen oder ist abgelaufen. Autorisiere ihn erneut, wähle einen anderen Ordner oder exportiere deine Daten.',
        backupSetupErrorTitle: 'Prüfung des Sicherungsordners fehlgeschlagen',
        backupSetupNoData: 'Keine lokalen Daten zum Exportieren vorhanden.',
        backupSetupCurrentData: 'Aktuelle Daten: {activities} Aktivitäten · {entries} Einträge.',
        backupSetupSelectFailed: 'Der Sicherungsordner konnte nicht ausgewählt oder geprüft werden. Es wurde nichts gelöscht.',
        backupSetupExportDone: 'Daten exportiert. Bewahre die Datei außerhalb des Browser-Speichers auf.',
        backupSetupExportFailed: 'Die aktuellen Daten konnten nicht exportiert werden.',
        backupRetentionLabel: 'Automatische externe Sicherungen aufbewahren',
        externalBackupTitle: 'Externe automatische Sicherungen',
        externalBackupDescription: 'Geprüfte Sicherungen werden im ausgewählten Ordner gespeichert. Manuelle Sicherungen werden nie automatisch gelöscht.',
        externalBackupStatusNone: 'Noch keine geprüfte externe Sicherung.',
        externalBackupStatusOk: 'Letzte geprüfte externe Sicherung: {date}',
        externalBackupStatusFolder: 'Sicherungsordner: {name}',
        externalBackupNow: 'Jetzt sichern', externalBackupChooseFolder: 'Ordner auswählen oder ändern',
        externalBackupVerify: 'Ordner prüfen', externalBackupRefresh: 'Sicherungsliste aktualisieren',
        externalBackupSelect: 'Externe Sicherung auswählen',
        externalBackupRestore: 'Ausgewählte externe Sicherung wiederherstellen',
        externalBackupNone: 'Keine geprüften externen Sicherungen gefunden.',
        externalBackupSucceeded: 'Externe Sicherung geprüft: {name}',
        externalBackupFailed: 'Externe Sicherung fehlgeschlagen. Vorhandene Sicherungen blieben erhalten.',
        backupAccessRestore: 'Zugriff wiederherstellen',
        backupAccessRetry: 'Sicherungsspeicher erneut prüfen',
        externalBackupSafetyCopyFailed: 'Vor der Wiederherstellung konnte keine Schutzsicherung erstellt werden. Die Wiederherstellung wurde abgebrochen.',
        externalBackupNotConfigured: 'Kein nutzbarer Sicherungsordner konfiguriert.',
        externalBackupFolderMissing: 'Sicherungsordner nicht gefunden. Wähle den Ordner in den Sicherungseinstellungen erneut aus.',
        externalBackupUnsupported: 'Externe Ordnersicherungen werden von diesem Browser nicht unterstützt.',
        shareLinkBtn: 'Link teilen',
        shareLinkTitle: 'Tag als Link teilen',
        shareLinkDesc: 'Ausgewählte Einträge werden vor dem Hochladen auf diesem Gerät verschlüsselt. Es werden nur verschlüsselte Daten vorübergehend gespeichert, und der Link läuft automatisch ab.',
        shareLinkExpiryLabel: 'Link läuft ab nach',
        shareLinkExpiryHour: '1 Stunde',
        shareLinkExpiryDay: '24 Stunden',
        shareLinkExpiryWeek: '7 Tagen',
        shareLinkExpiryMonth: '30 Tagen',
        shareLinkCreate: 'Link erstellen',
        shareLinkSelected: '{count} Einträge ausgewählt · {total}',
        shareLinkNoEntries: 'Wähle mindestens einen Eintrag zum Teilen aus.',
        shareLinkCreated: 'Link für {count} Einträge ist bereit.',
        shareLinkResultLabel: 'Freigabelink',
        shareLinkCopy: 'Link kopieren',
        shareLinkSend: 'Link senden',
        shareLinkCopied: 'Link kopiert',
        shareLinkLoading: 'Geteilter Tag wird geladen…',
        shareLinkNotFound: 'Dieser Link existiert nicht oder wurde bereits verwendet.',
        shareLinkExpired: 'Dieser Link ist abgelaufen.',
        shareLinkExists: 'Dieser Link existiert bereits. Erstelle einen neuen.',
        shareLinkInvalid: 'Dieser Link oder seine Daten ist nicht gültig.',
        shareLinkUnavailable: 'Der Linkdienst ist derzeit nicht verfügbar. Versuche es später erneut.',
        sharedDayTitle: 'Geteilter Tag',
        sharedDayPreviewNote: 'Prüfe die Einträge unten. Es wird nichts gesendet, bis du den Import startest.',
        sharedDayImport: 'In Clockodo importieren',
        sharedDayRetry: 'Fehlgeschlagene Einträge erneut versuchen',
        sharedDayConfigure: 'Clockodo einrichten',
        sharedDayExpires: 'Link läuft ab: {date}',
        sharedDayConfigRequired: 'Clockodo ist auf diesem Gerät nicht eingerichtet. Richte es ein, um zu importieren.',
        sharedDayMissingCustomer: 'Einige Einträge verwenden Kunden, die in deinem Clockodo fehlen.',
        sharedDayMissingService: 'Einige Einträge verwenden Leistungen, die in deinem Clockodo fehlen.',
        sharedImportConfigRequired: 'Richte Clockodo ein, um den geteilten Import fortzusetzen.',
        sharedImportConfigReady: 'Clockodo-Konfiguration gespeichert. Du kannst den Import jetzt starten.',
        sharedImportFailed: 'Der Import konnte nicht gestartet werden.',
        sharedImportReferenceFailed: 'Kunden und Leistungen konnten nicht aus Clockodo geladen werden. Prüfe die Verbindung und versuche es erneut.',
        sharedImportMissingMapping: 'Import gestoppt: fehlende Kunden: {customers}, fehlende Leistungen: {services}. Ergänze sie in Clockodo oder korrigiere die Zuordnungen und versuche es erneut.',
        sharedImportSuccess: '{count} Einträge wurden in deinem Clockodo erstellt. Der Link ist jetzt geschlossen.',
        sharedImportSuccessLinkOpen: '{count} Einträge wurden in deinem Clockodo erstellt. Der Link konnte nicht geschlossen werden und läuft automatisch ab.',
        sharedImportPartial: 'Import unvollständig: {failed} fehlgeschlagen, {unknown} mit unbekanntem Ergebnis. Versuche die fehlgeschlagenen Einträge erneut; erfolgreich erstellte Einträge werden nie dupliziert.',
        sharedImportBadgePending: 'Bereit',
        sharedImportBadgeSending: 'Sendet…',
        sharedImportBadgeSynced: 'Importiert',
        sharedImportBadgeFailed: 'Fehlgeschlagen',
        sharedImportBadgeUnknown: 'Ergebnis unbekannt',
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
        icon: 'Symbol',
        iconPickerLabel: 'Vorlagen-Symbol auswählen',
        displayMode: 'Anzeige',
        displayModePickerLabel: 'Darstellung der Aktivität wählen',
        displayModeIconAndText: 'Symbol + Text',
        displayModeIconOnly: 'Nur Symbol',
        iconNone: 'Kein Symbol',
        iconVacuumAttic: 'Dach',
        iconVacuumBasement: 'Keller',
        iconMop: 'Wischmopp',
        iconSqueegee: 'Fenster',
        iconDuster: 'Staub',
        iconCar: 'Auto',
        demoMasking: 'Abkleben', demoPainting: 'Streichen', demoWallpapering: 'Tapezieren',
        demoUnloading: 'Entladen', demoTravel: 'Anfahrt', demoBreak: 'Pause',
        logFilename: 'zeitprotokoll', backupFilename: 'timerhub_sicherung',
        dayReview: 'Tagesübersicht',
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
        issueInvalidTime: 'Ungültige oder fehlende Zeitangaben',
        issueUnusuallyLong: 'Ungewöhnlich lang (>16h)',
        notes: 'Notizen', project: 'Projekt', service: 'Leistung', customer: 'Kunde', endDate: 'Enddatum',
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
        clockodoProjectSelectLabel: 'Clockodo-Projekt',
        clockodoServiceSelectLabel: 'Clockodo-Leistung',
        clockodoAssignmentNone: 'Keine Clockodo-Zuordnung',
        clockodoAssignmentLoading: 'Clockodo-Daten werden geladen …',
        clockodoAssignmentNotConfigured: 'Clockodo ist nicht konfiguriert. Hinterlege die Zugangsdaten in den Einstellungen, um Kunde und Leistung auszuwählen.',
        clockodoAssignmentLoadFailed: 'Clockodo-Kunden und -Leistungen konnten nicht geladen werden.',
        clockodoAssignmentReload: 'Neu laden',
        clockodoAssignmentHelp: 'Tippen zum Suchen. Leer lassen für keine Clockodo-Zuordnung.',
        clockodoProjectNotAllowedForCustomer: 'Das gewählte Projekt gehört nicht zu diesem Kunden. Wähle ein Projekt des ausgewählten Kunden.',
        clockodoProjectLoadFailed: 'Kunden und Leistungen wurden geladen, aber Projekte konnten nicht geladen werden. Erneut versuchen oder Projektzugriff in Clockodo prüfen. ({detail})',
        clockodoProjectCustomerSelected: 'Kunde „{name}“ aus dem Projekt ausgewählt.',
        clockodoProjectMultipleCustomers: 'Mehrere Kunden verwenden diesen Projektnamen: {customers}. Wähle den passenden Kunden.',
        clockodoProjectNoCustomer: 'Kein Kunde für „{project}“ gefunden. Der Text wurde beibehalten; wähle bei Bedarf manuell einen Kunden.',
        clockodoProjectCustomerKept: 'Dieses Projekt gehört zu „{name}“. Der ausgewählte Kunde wurde beibehalten.',
        iconServiceUnavailable: 'Die Leistung „{service}“ für dieses Symbol ist nicht verfügbar. Die aktuelle Leistung wurde beibehalten.',
        clockodoWorkerOutdated: 'Die TimerHub-Serverseite (Cloudflare Worker) ist veraltet. Stelle den Worker in Cloudflare neu bereit und drücke dann „Neu laden“.',
        clockodoProjectsUnavailable: 'Clockodo stellt für dieses Konto oder diesen API-Benutzer keine Projekte bereit ({detail}). Prüfe den Clockodo-Tarif und die Projekt-Rechte des Benutzers und drücke dann „Neu laden“.',
        clockodoProjectChooseCustomer: 'Wähle zuerst einen Kunden und dann eines seiner Projekte.',
        clockodoNoProjects: 'Clockodo hat für dieses Konto keine Projekte geliefert. Prüfe den Projektzugriff und ob Projekte in Clockodo aktiviert sind.',
        clockodoNoProjectsForCustomer: 'Der ausgewählte Kunde hat keine Projekte in Clockodo.',
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
        unknownResendNotice: 'Das vorherige Clockodo-Ergebnis für diesen Eintrag ist unklar. Clockodo enthält ihn möglicherweise bereits. Prüfe zuerst Clockodo – beim Fortfahren kann ein doppelter Eintrag entstehen.',
        importDay: 'Import',
        exchangeActions: 'Tagesaustausch',
        exchangeNothingToShare: 'Exportiere zuerst den Tag.',
        exchangeShareUnsupported: 'Teilen von Dateien wird hier nicht unterstützt. Die Datei wurde stattdessen heruntergeladen.',
        exportDayTitle: 'Tag exportieren',
        exportDayDesc: 'Die verschlüsselte Austauschdatei ist bereit. Teile sie mit der anderen Arbeitskraft und gib den Übertragungscode getrennt weiter.',
        importDayTitle: 'Tag importieren',
        importDayDesc: 'Wähle eine .timerhub-Datei und gib den Übertragungscode ein. Die Datei wird lokal auf diesem Gerät entschlüsselt.',
        exchangeClockodoNote: 'Importierte Einträge werden nicht automatisch an Clockodo gesendet. Prüfe sie und bestätige mit „Prüfen & Synchronisieren“.',
        transferCode: 'Übertragungscode',
        transferCodePlaceholder: 'Übertragungscode eingeben',
        showQr: 'QR anzeigen',
        scanQr: 'QR scannen',
        chooseFile: 'Datei wählen',
        decrypt: 'Entschlüsseln',
        importBtn: 'Importieren',
        importAgainBtn: 'Erneut importieren',
        exchangeQrTitle: 'QR für den Übertragungscode',
        exchangeScanTitle: 'Übertragungs-QR scannen',
        exchangeScanning: 'Richte die Kamera auf den QR-Code des Übertragungscodes.',
        exchangeScanUnsupported: 'QR-Scannen wird hier nicht unterstützt. Gib den Übertragungscode manuell ein.',
        exchangeScanPermission: 'Kamerazugriff wurde verweigert. Gib den Übertragungscode manuell ein.',
        exchangeSecurityNote: 'Der Übertragungscode öffnet die Datei.',
        exchangeNoEntries: 'Für diesen Tag gibt es keine abgeschlossenen Einträge zum Exportieren.',
        exchangeExportFailed: 'Der Tag konnte nicht exportiert werden. Versuche es erneut.',
        exchangeImportFailed: 'Der Tag konnte nicht importiert werden. Versuche es erneut.',
        exchangeInvalidFile: 'Dies ist keine gültige TimerHub-Austauschdatei.',
        exchangeUnsupportedFormat: 'Diese Austauschdatei verwendet eine nicht unterstützte Version.',
        exchangeInvalidTransferCode: 'Dieser Übertragungscode ist ungültig.',
        exchangeDecryptFailed: 'Falscher Übertragungscode oder die Datei wurde verändert bzw. beschädigt.',
        exchangeInvalidPayload: 'Die entschlüsselten Daten sind unvollständig oder ungültig.',
        exchangeInvalidQr: 'Dieser QR-Code enthält keinen gültigen Übertragungscode.',
        exchangeCryptoUnavailable: 'Sichere Verschlüsselung ist in diesem Browserkontext nicht verfügbar. Nutze HTTPS oder localhost.',
        exchangeChooseFileFirst: 'Wähle zuerst eine .timerhub-Datei.',
        exchangeSourceDate: 'Quelldatum',
        exchangeWarningNewActivity: 'Für unbekannte Namen werden neue Aktivitäten angelegt.',
        exchangeWarningDuplicate: 'Einige Einträge existieren an diesem Tag bereits und können doppelt angelegt werden.',
        exchangeWarningUnknownCustomer: 'Einige Kunden-IDs sind in deiner Clockodo-Liste nicht vorhanden.',
        exchangeWarningUnknownService: 'Einige Leistungs-IDs sind in deiner Clockodo-Liste nicht vorhanden.',
        exchangeWarningMissingAssignment: 'Einige Einträge haben keine Kunden- oder Leistungszuordnung.',
        exchangeWarningRepeat: 'Dieser Export wurde bereits importiert.',
        exchangeImportedCount: '{count} Einträge importiert. Prüfe sie vor dem Synchronisieren.',
        assignmentSectionTitle: 'Arbeitsaufträge',
        assignmentSectionDesc: 'Erstelle Gruppen und Aktivitäten aus einem JSON-Arbeitsauftrag, den eine KI erzeugt hat. Alles wird auf diesem Gerät geprüft; nichts wird hochgeladen.',
        assignmentImportTitle: 'Arbeitsauftrag aus JSON importieren',
        assignmentImportDesc: 'Füge den JSON-Arbeitsauftrag ein und prüfe ihn. Erst nach der Bestätigung der Vorschau wird etwas erstellt.',
        assignmentJsonPlaceholder: 'JSON-Arbeitsauftrag hier einfügen',
        assignmentChooseFile: 'JSON-Datei wählen',
        assignmentCopyPrompt: 'KI-Prompt kopieren',
        assignmentValidate: 'Prüfen & Vorschau',
        assignmentImportBtn: 'Importieren',
        assignmentImportAgainBtn: 'Erneut importieren',
        assignmentImportDefaultName: 'Importierter Arbeitsauftrag',
        assignmentImported: '{groups} Gruppen und {activities} Aktivitäten importiert.',
        assignmentImportFailed: 'Der Arbeitsauftrag konnte nicht importiert werden. Es wurde nichts geändert.',
        assignmentInvalidJson: 'Das ist kein gültiges JSON.',
        assignmentInvalidFormat: 'Diese Datei ist kein TimerHub-Arbeitsauftrag.',
        assignmentUnsupportedVersion: 'Diese Version des Arbeitsauftrags wird nicht unterstützt.',
        assignmentUnexpectedProperty: 'Unerwartetes Feld',
        assignmentInvalidType: 'Ungültiger Werttyp',
        assignmentInvalidName: 'Namen müssen nicht leerer Text sein',
        assignmentInvalidValue: 'Ungültiger Wert',
        assignmentTooLarge: 'Der Arbeitsauftrag ist zu groß.',
        assignmentTooDeep: 'Die Gruppenschachtelung ist zu tief.',
        assignmentTooManyGroups: 'Zu viele Gruppen.',
        assignmentTooManyActivities: 'Zu viele Aktivitäten.',
        assignmentDuplicateName: 'Doppelte Namen in derselben Gruppe sind nicht erlaubt.',
        assignmentEmpty: 'Der Arbeitsauftrag enthält keine Gruppen oder Aktivitäten.',
        assignmentErrorAt: 'bei {path}',
        assignmentPreviewTitle: 'Vorschau',
        assignmentPreviewSummary: '{groups} Gruppen · {activities} Aktivitäten · Modus: {mode}',
        assignmentPreviewGroup: 'Gruppe',
        assignmentModeAdd: 'hinzufügen',
        assignmentModeReplace: 'ersetzen',
        assignmentReplaceNotice: 'Ersetzt {groups} Gruppen und {activities} Aktivitäten aus einem früheren Import "{name}".',
        assignmentRepeatWarning: 'Genau dieser Arbeitsauftrag wurde bereits importiert.',
        assignmentExcludedCount: '{count} Einträge sind ausdrücklich ausgeschlossen.',
        assignmentExcludedShort: 'ausgeschlossen',
        assignmentPromptCopied: 'KI-Prompt kopiert',
        assignmentPromptCopyFailed: 'Der KI-Prompt konnte nicht kopiert werden.',
        createGroup: 'Gruppe erstellen', createGroupFromSelection: 'Auswahl gruppieren ({count})',
        groupName: 'Gruppenname', groupNamePlaceholder: 'z. B. Baustelle A',
        groupDefaultName: 'Gruppe {number}', groupCreated: 'Gruppe "{name}" erstellt',
        groupCreateFailed: 'Gruppe konnte nicht erstellt werden. Bitte erneut versuchen.',
        selectActivitiesFirst: 'Wähle zuerst mindestens eine Aktivität aus',
        collapseGroup: 'Gruppe einklappen', expandGroup: 'Gruppe ausklappen',
        collapseAllGroups: 'Alle einklappen', expandAllGroups: 'Alle ausklappen',
        showAssignments: 'Zuordnungen anzeigen', hideAssignments: 'Zuordnungen ausblenden',
        duplicateGroup: 'Gruppe duplizieren', groupCopyName: '{name} (Kopie)',
        duplicateActivity: 'Duplizieren',
        activityCopyName: '{name} (Kopie)',
        activityDuplicated: 'Aktivität „{name}“ dupliziert',
        activityDuplicateFailed: 'Die Aktivität konnte nicht dupliziert werden. Das Original wurde nicht verändert.',
        addActivityFromReview: 'Aktivität hinzufügen',
        activityAddedFromReview: 'Aktivität „{name}“ zur Fläche hinzugefügt.',
        activityAddFromReviewFailed: 'Die Aktivität konnte nicht hinzugefügt werden. Es wurde nichts verändert.',
        groupDuplicated: 'Gruppe "{name}" dupliziert',
        editGroup: 'Gruppe bearbeiten', resizeGroup: 'Eingeklappte Gruppe skalieren',
        groupSelectedGroups: 'Ausgewählte Gruppen gruppieren',
        groupSelectedGroupsCount: '{count} Gruppen gruppieren',
        deleteSelectedGroups: 'Ausgewählte Gruppen löschen',
        deleteGroupsTitle: 'Gruppen löschen',
        deleteGroupsSummary: 'Ausgewählte Hierarchie: {groups} Gruppe(n), {activities} Aktivität(en), {children} verschachtelte Gruppe(n).',
        deleteChoiceActivitiesLegend: 'Aktivitäten in dieser Hierarchie',
        deleteChoiceNestedLegend: 'Verschachtelte Gruppen',
        deleteChoiceKeepActivities: 'Behalten: auf den Canvas verschieben',
        deleteChoiceDeleteActivities: 'Endgültig löschen',
        deleteChoiceKeepNested: 'Behalten: eine Ebene nach oben verschieben',
        deleteChoiceDeleteNested: 'Mit allen Inhalten löschen',
        deleteChoiceRequired: 'Bitte zuerst festlegen, was mit Aktivitäten und verschachtelten Gruppen passiert.',
        deleteOutcomeSummary: '{keptActivities} Aktivität(en) bleiben, {deletedActivities} werden gelöscht; {keptGroups} Gruppe(n) bleiben, {deletedGroups} werden gelöscht.',
        deleteLockedWarning: 'Gesperrte Gruppen können nicht gelöscht werden: {names}. Bitte zuerst im Gruppen-Editor entsperren.',
        undoAction: 'Rückgängig',
        redoAction: 'Wiederholen',
        groupDeleteFailed: 'Gruppen konnten nicht gelöscht werden. Bitte erneut versuchen.',
        groupDeleted: 'Gruppen gelöscht',
        groupEditTitle: 'Gruppe bearbeiten',
        groupLockedLabel: 'Gruppe sperren (Löschen erst nach Entsperren möglich)',
        groupLocked: 'Gesperrte Gruppe',
        groupColorLabel: 'Gruppenfarbe', groupColorDefault: 'Standard',
        groupNameRequired: 'Bitte einen Gruppennamen eingeben.',
        groupEditSaveFailed: 'Gruppe konnte nicht gespeichert werden. Bitte erneut versuchen.',
        groupDefaultCustomer: 'Standardkunde',
        groupDefaultCustomerHelp: 'Neue Aktivitäten in dieser Gruppe verwenden diesen Kunden, solange sie keinen eigenen Kunden haben.',
        groupDefaultCustomerMissing: 'Der gespeicherte Standardkunde ist in Clockodo nicht mehr verfügbar. Wähle einen anderen Kunden oder leere das Feld.',
        groupDefaultCustomerInherited: 'Von einer übergeordneten Gruppe geerbt: {name}',
        clearDefaultCustomer: 'Kunde leeren',
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
        backupEmptyWarning: 'Эта резервная копия не содержит занятий, записей времени или групп. При замене данные, сохранённые на этом устройстве, будут удалены.',
        backupEmptyConfirmLabel: 'Я понимаю, что при замене текущие данные будут удалены.',
        backupEmptyNeedsConfirmation: 'Подтвердите замену текущих данных пустой резервной копией.',
        snapshotsSameDatabaseNote: 'Копии хранятся в той же базе браузера, что и ваши данные. Если база будет удалена, копии удалятся вместе с ней. Экспортируйте файл резервной копии для защиты вне браузера.',
        persistentStorageTitle: 'Долговечность хранилища',
        persistentStorageDescription: 'Постоянное хранилище просит Chrome защитить данные TimerHub от автоматической очистки. Это не предотвращает ручное удаление данных браузера или приложения.',
        persistentStorageGranted: 'Постоянное хранилище: предоставлено браузером.',
        persistentStorageDenied: 'Постоянное хранилище: не предоставлено. Браузер может удалить данные TimerHub при нехватке места.',
        persistentStorageUnsupported: 'Постоянное хранилище: не поддерживается этим браузером.',
        persistentStorageUnknown: 'Постоянное хранилище: статус неизвестен.',
        lastBackupNever: 'Файл резервной копии ещё не экспортировался. Данные в браузере и локальные копии могут быть потеряны вместе.',
        lastBackupAt: 'Последний экспорт файла копии: {date}',
        lastBackupOverdue: 'Экспортируйте новый файл резервной копии, чтобы иметь копию вне браузера.',
        missingDataWarningTitle: 'Данные TimerHub на этом устройстве не найдены',
        missingDataWarningBody: 'Ранее на этом устройстве были сохранены данные, но сейчас ничего не найдено. Возможно, хранилище браузера было очищено. Восстановите данные из файла резервной копии, если он есть.',
        missingDataRestore: 'Восстановить из файла копии',
        missingDataRestoreExternal: 'Восстановить последнюю внешнюю копию',
        missingDataDismiss: 'Скрыть',
        diagnosticsTitle: 'Локальная диагностика',
        diagnosticsSummary: 'База {name} v{version} · занятий: {activities} · записей: {entries} · групп: {groups}',
        diagnosticsDescription: 'Последние ошибки и предупреждения. Учётные данные и конфиденциальные данные скрыты.',
        diagnosticsEmpty: 'Нет недавних предупреждений или ошибок.',
        diagnosticsExport: 'Экспортировать диагностику', diagnosticsClear: 'Очистить диагностику',
        diagnosticsExportFailed: 'Не удалось экспортировать файл диагностики.',
        diagnosticsCleared: 'Диагностика очищена.',
        backupSetupTitle: 'Выберите папку для резервных копий',
        backupSetupIntro: 'TimerHub нужна папка вне хранилища браузера для защиты ваших данных.',
        backupSetupExplanation: 'Автоматические копии сохраняются в выбранной вами папке, поэтому они переживают очистку хранилища браузера, перезапуск приложения и проблемы с базой данных.',
        backupSetupBrowserNote: 'Браузер может снова запросить доступ к этой папке при запуске TimerHub. Папка должна оставаться доступной на этом устройстве.',
        backupSetupChoose: 'Выбрать папку', backupSetupReauthorize: 'Восстановить доступ к папке',
        backupSetupRetry: 'Проверить ещё раз', backupSetupExport: 'Экспортировать текущие данные',
        backupSetupExportHelp: 'Если папка недоступна, экспортируйте текущие данные сейчас, чтобы восстановить их позже.',
        backupSetupDirectoryLabel: 'Папка резервных копий: {name}',
        backupSetupVerifying: 'Проверка доступа к папке и тестовой копии…',
        backupSetupVerified: 'Папка проверена. Запуск TimerHub…',
        backupSetupBlocked: 'Основное приложение останется заблокированным, пока не будет проверена доступная папка для копий.',
        backupSetupUnsupportedTitle: 'Постоянная папка для копий не поддерживается',
        backupSetupUnsupportedBody: 'Этот браузер не предоставляет постоянный доступ к папке. На Android нужен Chrome 132 или новее (либо установленное приложение Chrome PWA) и TimerHub по HTTPS. В браузерах без этого API автоматические внешние копии недоступны; экспортируйте данные сейчас. Для старых браузеров потребуется нативная оболочка.',
        backupSetupPermissionTitle: 'Требуется доступ к папке резервных копий',
        backupSetupPermissionRequiredTitle: 'Восстановите доступ к папке резервных копий',
        backupSetupPermissionRequiredBody: 'TimerHub нашёл сохранённую папку резервных копий. Браузеру нужно повторное подтверждение, прежде чем автоматические копии смогут продолжиться. Выбирать новую папку не требуется.',
        backupSetupRestoreErrorTitle: 'Не удалось загрузить сохранённую папку резервных копий',
        backupSetupRestoreErrorBody: 'TimerHub не смог прочитать сохранённый доступ к папке из хранилища браузера. Повторите загрузку. Если доступ действительно потерян, выберите папку снова; существующие копии не удаляются.',
        backupSetupChangeDir: 'Выбрать другую папку',
        backupSetupPermissionBody: 'Доступ к выбранной папке отозван или истёк. Разрешите его снова, выберите другую папку или экспортируйте данные.',
        backupSetupErrorTitle: 'Не удалось проверить папку резервных копий',
        backupSetupNoData: 'Нет локальных данных для экспорта.',
        backupSetupCurrentData: 'Текущие данные: занятий — {activities}, записей — {entries}.',
        backupSetupSelectFailed: 'Не удалось выбрать или проверить папку. Ничего не было удалено.',
        backupSetupExportDone: 'Данные экспортированы. Храните файл вне хранилища браузера.',
        backupSetupExportFailed: 'Не удалось экспортировать текущие данные.',
        backupRetentionLabel: 'Хранить автоматических внешних копий',
        externalBackupTitle: 'Внешние автоматические копии',
        externalBackupDescription: 'Проверенные копии сохраняются в выбранной папке. Ручные копии никогда не удаляются автоматически.',
        externalBackupStatusNone: 'Проверенных внешних копий пока нет.',
        externalBackupStatusOk: 'Последняя проверенная внешняя копия: {date}',
        externalBackupStatusFolder: 'Папка резервных копий: {name}',
        externalBackupNow: 'Создать копию', externalBackupChooseFolder: 'Выбрать или изменить папку',
        externalBackupVerify: 'Проверить папку', externalBackupRefresh: 'Обновить список копий',
        externalBackupSelect: 'Выберите внешнюю копию',
        externalBackupRestore: 'Восстановить выбранную внешнюю копию',
        externalBackupNone: 'Проверенные внешние копии не найдены.',
        externalBackupSucceeded: 'Внешняя копия проверена: {name}',
        externalBackupFailed: 'Не удалось создать внешнюю копию. Предыдущие копии сохранены.',
        backupAccessRestore: 'Восстановить доступ',
        backupAccessRetry: 'Повторить проверку хранилища',
        externalBackupSafetyCopyFailed: 'Не удалось создать защитную копию перед восстановлением. Восстановление отменено.',
        externalBackupNotConfigured: 'Нет доступной папки для резервных копий.',
        externalBackupFolderMissing: 'Папка резервных копий не найдена. Выберите её снова в настройках резервных копий.',
        externalBackupUnsupported: 'Внешние резервные копии в папку не поддерживаются этим браузером.',
        shareLinkBtn: 'Поделиться ссылкой',
        shareLinkTitle: 'Поделиться днём по ссылке',
        shareLinkDesc: 'Выбранные записи шифруются на этом устройстве перед загрузкой. На сервере временно хранятся только зашифрованные данные, а ссылка автоматически истекает.',
        shareLinkExpiryLabel: 'Ссылка действует',
        shareLinkExpiryHour: '1 час',
        shareLinkExpiryDay: '24 часа',
        shareLinkExpiryWeek: '7 дней',
        shareLinkExpiryMonth: '30 дней',
        shareLinkCreate: 'Создать ссылку',
        shareLinkSelected: 'Выбрано записей: {count} · {total}',
        shareLinkNoEntries: 'Выберите хотя бы одну запись.',
        shareLinkCreated: 'Ссылка для {count} записей готова.',
        shareLinkResultLabel: 'Ссылка',
        shareLinkCopy: 'Копировать ссылку',
        shareLinkSend: 'Отправить ссылку',
        shareLinkCopied: 'Ссылка скопирована',
        shareLinkLoading: 'Загрузка общего дня…',
        shareLinkNotFound: 'Эта ссылка не существует или уже использована.',
        shareLinkExpired: 'Срок действия ссылки истёк.',
        shareLinkExists: 'Эта ссылка уже существует. Создайте новую.',
        shareLinkInvalid: 'Ссылка или её данные недействительны.',
        shareLinkUnavailable: 'Сервис ссылок сейчас недоступен. Попробуйте позже.',
        sharedDayTitle: 'Общий день',
        sharedDayPreviewNote: 'Проверьте записи ниже. Ничего не отправляется, пока вы не начнёте импорт.',
        sharedDayImport: 'Импортировать в Clockodo',
        sharedDayRetry: 'Повторить неудачные записи',
        sharedDayConfigure: 'Настроить Clockodo',
        sharedDayExpires: 'Ссылка истекает: {date}',
        sharedDayConfigRequired: 'Clockodo не настроен на этом устройстве. Настройте его для импорта.',
        sharedDayMissingCustomer: 'Некоторые записи используют заказчиков, отсутствующих в вашем Clockodo.',
        sharedDayMissingService: 'Некоторые записи используют услуги, отсутствующие в вашем Clockodo.',
        sharedImportConfigRequired: 'Настройте Clockodo, чтобы продолжить общий импорт.',
        sharedImportConfigReady: 'Настройки Clockodo сохранены. Теперь можно начать импорт.',
        sharedImportFailed: 'Не удалось начать импорт.',
        sharedImportReferenceFailed: 'Не удалось загрузить заказчиков и услуги из Clockodo. Проверьте подключение и повторите.',
        sharedImportMissingMapping: 'Импорт остановлен: нет заказчиков: {customers}, нет услуг: {services}. Добавьте их в Clockodo или исправьте назначения и повторите.',
        sharedImportSuccess: 'В вашем Clockodo создано записей: {count}. Ссылка закрыта.',
        sharedImportSuccessLinkOpen: 'В вашем Clockodo создано записей: {count}. Не удалось закрыть ссылку; она истечёт автоматически.',
        sharedImportPartial: 'Импорт не завершён: ошибок — {failed}, с неизвестным результатом — {unknown}. Повторите неудачные записи; успешно созданные не дублируются.',
        sharedImportBadgePending: 'Готово',
        sharedImportBadgeSending: 'Отправка…',
        sharedImportBadgeSynced: 'Импортировано',
        sharedImportBadgeFailed: 'Ошибка',
        sharedImportBadgeUnknown: 'Результат неизвестен',
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
        icon: 'Значок',
        iconPickerLabel: 'Выбрать значок шаблона',
        displayMode: 'Отображение',
        displayModePickerLabel: 'Как отображать занятие',
        displayModeIconAndText: 'Значок и текст',
        displayModeIconOnly: 'Только значок',
        iconNone: 'Без значка',
        iconVacuumAttic: 'Крыша',
        iconVacuumBasement: 'Подвал',
        iconMop: 'Швабра',
        iconSqueegee: 'Окно',
        iconDuster: 'Пыль',
        iconCar: 'Машина',
        demoMasking: 'Заклеивание', demoPainting: 'Покраска', demoWallpapering: 'Поклейка обоев',
        demoUnloading: 'Разгрузка', demoTravel: 'Дорога', demoBreak: 'Перерыв',
        logFilename: 'журнал-времени', backupFilename: 'timerhub-копия',
        dayReview: 'Обзор дня',
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
        issueInvalidTime: 'Недопустимое или отсутствующее время',
        issueUnusuallyLong: 'Необычно долго (>16 ч)',
        notes: 'Заметки', project: 'Проект', service: 'Услуга', customer: 'Клиент', endDate: 'Дата окончания',
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
        clockodoProjectSelectLabel: 'Проект Clockodo',
        clockodoServiceSelectLabel: 'Услуга Clockodo',
        clockodoAssignmentNone: 'Без привязки к Clockodo',
        clockodoAssignmentLoading: 'Загрузка данных Clockodo…',
        clockodoAssignmentNotConfigured: 'Clockodo не настроен. Добавьте данные доступа в настройках, чтобы выбрать клиента и услугу.',
        clockodoAssignmentLoadFailed: 'Не удалось загрузить клиентов и услуги Clockodo.',
        clockodoAssignmentReload: 'Обновить',
        clockodoAssignmentHelp: 'Введите текст для поиска. Оставьте пустым, чтобы не привязывать.',
        clockodoProjectNotAllowedForCustomer: 'Выбранный проект не принадлежит этому клиенту. Выберите проект выбранного клиента.',
        clockodoProjectLoadFailed: 'Клиенты и услуги загружены, но проекты загрузить не удалось. Повторите попытку или проверьте доступ к проектам в Clockodo. ({detail})',
        clockodoProjectCustomerSelected: 'Клиент «{name}» выбран по проекту.',
        clockodoProjectMultipleCustomers: 'Этот проект используется несколькими клиентами: {customers}. Выберите подходящего клиента.',
        clockodoProjectNoCustomer: 'Клиент для «{project}» не найден. Текст сохранён; выберите клиента вручную при необходимости.',
        clockodoProjectCustomerKept: 'Проект принадлежит «{name}». Выбранный клиент сохранён.',
        iconServiceUnavailable: 'Услуга «{service}» для этого значка недоступна. Текущая услуга сохранена.',
        clockodoWorkerOutdated: 'Серверная часть TimerHub (Cloudflare Worker) устарела. Переразверните Worker в Cloudflare и нажмите «Reload».',
        clockodoProjectsUnavailable: 'Clockodo не предоставляет проекты для этого аккаунта или API-пользователя ({detail}). Проверьте тариф Clockodo и права пользователя на проекты, затем нажмите «Reload».',
        clockodoProjectChooseCustomer: 'Сначала выберите клиента, затем его проект.',
        clockodoNoProjects: 'Clockodo не вернул проекты для этого аккаунта. Проверьте доступ к проектам и включены ли проекты в Clockodo.',
        clockodoNoProjectsForCustomer: 'У выбранного клиента нет проектов в Clockodo.',
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
        unknownResendNotice: 'Предыдущий результат Clockodo для этой записи неизвестен. Clockodo может уже содержать её. Сначала проверьте Clockodo — продолжение может создать дубликат записи.',
        importDay: 'Импорт',
        exchangeActions: 'Обмен днём',
        exchangeNothingToShare: 'Сначала экспортируйте день.',
        exchangeShareUnsupported: 'Отправка файлов здесь не поддерживается. Файл скачан вместо этого.',
        exportDayTitle: 'Экспорт дня',
        exportDayDesc: 'Зашифрованный файл обмена готов. Передайте его другому сотруднику, а код переноса — отдельно.',
        importDayTitle: 'Импорт дня',
        importDayDesc: 'Выберите файл .timerhub и введите код переноса. Файл расшифровывается локально на этом устройстве.',
        exchangeClockodoNote: 'Импортированные записи не отправляются в Clockodo автоматически. Проверьте их и подтвердите через «Проверить и синхронизировать».',
        transferCode: 'Код переноса',
        transferCodePlaceholder: 'Введите код переноса',
        showQr: 'Показать QR',
        scanQr: 'Сканировать QR',
        chooseFile: 'Выбрать файл',
        decrypt: 'Расшифровать',
        importBtn: 'Импортировать',
        importAgainBtn: 'Импортировать снова',
        exchangeQrTitle: 'QR-код кода переноса',
        exchangeScanTitle: 'Сканировать QR переноса',
        exchangeScanning: 'Наведите камеру на QR-код кода переноса.',
        exchangeScanUnsupported: 'Сканирование QR здесь не поддерживается. Введите код переноса вручную.',
        exchangeScanPermission: 'Доступ к камере запрещён. Введите код переноса вручную.',
        exchangeSecurityNote: 'Код переноса открывает файл.',
        exchangeNoEntries: 'За этот день нет завершённых записей для экспорта.',
        exchangeExportFailed: 'Не удалось экспортировать день. Попробуйте ещё раз.',
        exchangeImportFailed: 'Не удалось импортировать день. Попробуйте ещё раз.',
        exchangeInvalidFile: 'Это не действительный файл обмена TimerHub.',
        exchangeUnsupportedFormat: 'Этот файл обмена использует неподдерживаемую версию.',
        exchangeInvalidTransferCode: 'Этот код переноса недействителен.',
        exchangeDecryptFailed: 'Неверный код переноса или файл изменён либо повреждён.',
        exchangeInvalidPayload: 'Расшифрованные данные неполные или некорректные.',
        exchangeInvalidQr: 'Этот QR-код не содержит действительный код переноса.',
        exchangeCryptoUnavailable: 'Безопасное шифрование недоступно в этом контексте браузера. Используйте HTTPS или localhost.',
        exchangeChooseFileFirst: 'Сначала выберите файл .timerhub.',
        exchangeSourceDate: 'Дата источника',
        exchangeWarningNewActivity: 'Для неизвестных названий будут созданы новые занятия.',
        exchangeWarningDuplicate: 'Некоторые записи уже есть в этот день и могут дублироваться.',
        exchangeWarningUnknownCustomer: 'Некоторые ID клиентов отсутствуют в вашем списке Clockodo.',
        exchangeWarningUnknownService: 'Некоторые ID услуг отсутствуют в вашем списке Clockodo.',
        exchangeWarningMissingAssignment: 'У некоторых записей нет привязки к клиенту или услуге.',
        exchangeWarningRepeat: 'Этот экспорт уже импортировался ранее.',
        exchangeImportedCount: 'Импортировано записей: {count}. Проверьте их перед синхронизацией.',
        assignmentSectionTitle: 'Рабочие задания',
        assignmentSectionDesc: 'Создавайте группы и занятия из JSON-задания, сформированного ИИ-помощником. Всё проверяется на этом устройстве; ничего не загружается.',
        assignmentImportTitle: 'Импорт задания из JSON',
        assignmentImportDesc: 'Вставьте JSON-задание и проверьте его. Ничего не создаётся до подтверждения предпросмотра.',
        assignmentJsonPlaceholder: 'Вставьте JSON задания здесь',
        assignmentChooseFile: 'Выбрать JSON-файл',
        assignmentCopyPrompt: 'Копировать промпт для ИИ',
        assignmentValidate: 'Проверить и показать',
        assignmentImportBtn: 'Импортировать',
        assignmentImportAgainBtn: 'Импортировать снова',
        assignmentImportDefaultName: 'Импортированное задание',
        assignmentImported: 'Импортировано групп: {groups}, занятий: {activities}.',
        assignmentImportFailed: 'Не удалось импортировать задание. Ничего не изменено.',
        assignmentInvalidJson: 'Это не корректный JSON.',
        assignmentInvalidFormat: 'Этот файл не является заданием TimerHub.',
        assignmentUnsupportedVersion: 'Эта версия задания не поддерживается.',
        assignmentUnexpectedProperty: 'Неожиданное поле',
        assignmentInvalidType: 'Неверный тип значения',
        assignmentInvalidName: 'Имена должны быть непустым текстом',
        assignmentInvalidValue: 'Неверное значение',
        assignmentTooLarge: 'Задание слишком большое.',
        assignmentTooDeep: 'Слишком глубокая вложенность групп.',
        assignmentTooManyGroups: 'Слишком много групп.',
        assignmentTooManyActivities: 'Слишком много занятий.',
        assignmentDuplicateName: 'Одинаковые имена в одной группе недопустимы.',
        assignmentEmpty: 'Задание не содержит групп или занятий.',
        assignmentErrorAt: 'в {path}',
        assignmentPreviewTitle: 'Предпросмотр',
        assignmentPreviewSummary: 'Групп: {groups} · занятий: {activities} · режим: {mode}',
        assignmentPreviewGroup: 'Группа',
        assignmentModeAdd: 'добавление',
        assignmentModeReplace: 'замена',
        assignmentReplaceNotice: 'Заменяет {groups} групп и {activities} занятий из предыдущего импорта «{name}».',
        assignmentRepeatWarning: 'Это задание уже импортировалось.',
        assignmentExcludedCount: 'Явно исключено элементов: {count}.',
        assignmentExcludedShort: 'исключено',
        assignmentPromptCopied: 'Промпт для ИИ скопирован',
        assignmentPromptCopyFailed: 'Не удалось скопировать промпт для ИИ.',
        createGroup: 'Создать группу', createGroupFromSelection: 'Сгруппировать ({count})',
        groupName: 'Название группы', groupNamePlaceholder: 'например, Объект A',
        groupDefaultName: 'Группа {number}', groupCreated: 'Группа «{name}» создана',
        groupCreateFailed: 'Не удалось создать группу. Попробуйте ещё раз.',
        selectActivitiesFirst: 'Сначала выберите хотя бы одно занятие',
        collapseGroup: 'Свернуть группу', expandGroup: 'Развернуть группу',
        collapseAllGroups: 'Свернуть все', expandAllGroups: 'Развернуть все',
        showAssignments: 'Показать назначения', hideAssignments: 'Скрыть назначения',
        duplicateGroup: 'Дублировать группу', groupCopyName: '{name} (копия)',
        duplicateActivity: 'Дублировать',
        activityCopyName: '{name} (копия)',
        activityDuplicated: 'Занятие «{name}» дублировано',
        activityDuplicateFailed: 'Не удалось дублировать занятие. Оригинал не изменён.',
        addActivityFromReview: 'Добавить занятие',
        activityAddedFromReview: 'Занятие «{name}» добавлено на холст.',
        activityAddFromReviewFailed: 'Не удалось добавить занятие. Ничего не изменено.',
        groupDuplicated: 'Группа «{name}» дублирована',
        editGroup: 'Редактировать группу', resizeGroup: 'Изменить размер свёрнутой группы',
        groupSelectedGroups: 'Сгруппировать выбранные группы',
        groupSelectedGroupsCount: 'Сгруппировать группы ({count})',
        deleteSelectedGroups: 'Удалить выбранные группы',
        deleteGroupsTitle: 'Удалить группы',
        deleteGroupsSummary: 'Выбранная иерархия: групп — {groups}, занятий — {activities}, вложенных групп — {children}.',
        deleteChoiceActivitiesLegend: 'Занятия в этой иерархии',
        deleteChoiceNestedLegend: 'Вложенные группы',
        deleteChoiceKeepActivities: 'Оставить: перенести на холст',
        deleteChoiceDeleteActivities: 'Удалить навсегда',
        deleteChoiceKeepNested: 'Оставить: поднять на уровень выше',
        deleteChoiceDeleteNested: 'Удалить со всем содержимым',
        deleteChoiceRequired: 'Сначала выберите, что делать с занятиями и вложенными группами.',
        deleteOutcomeSummary: 'Останется занятий: {keptActivities}, будет удалено: {deletedActivities}; останется групп: {keptGroups}, будет удалено: {deletedGroups}.',
        deleteLockedWarning: 'Заблокированные группы нельзя удалить: {names}. Сначала снимите блокировку в редакторе группы.',
        undoAction: 'Отменить',
        redoAction: 'Повторить',
        groupDeleteFailed: 'Не удалось удалить группы. Попробуйте ещё раз.',
        groupDeleted: 'Группы удалены',
        groupEditTitle: 'Редактировать группу',
        groupLockedLabel: 'Заблокировать группу (удаление запрещено до разблокировки)',
        groupLocked: 'Заблокированная группа',
        groupColorLabel: 'Цвет группы', groupColorDefault: 'По умолчанию',
        groupNameRequired: 'Введите название группы.',
        groupEditSaveFailed: 'Не удалось сохранить группу. Попробуйте ещё раз.',
        groupDefaultCustomer: 'Клиент по умолчанию',
        groupDefaultCustomerHelp: 'Новые занятия в этой группе используют этого клиента, если у них нет собственного клиента.',
        groupDefaultCustomerMissing: 'Сохранённый клиент по умолчанию больше не доступен в Clockodo. Выберите другого клиента или очистите поле.',
        groupDefaultCustomerInherited: 'Унаследовано от родительской группы: {name}',
        clearDefaultCustomer: 'Очистить клиента',
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
const CANVAS_GROUP_COLLAPSED_MIN_WIDTH = 160;
const CANVAS_GROUP_COLLAPSED_MIN_HEIGHT = 46;
const CANVAS_GROUP_COLLAPSED_MAX_WIDTH = 640;
const CANVAS_GROUP_COLLAPSED_MAX_HEIGHT = 400;
const CANVAS_GROUP_DUPLICATE_OFFSET = 48;
// Deterministic, size-aware packing for imported groups: a shelf layout that
// starts at the canvas origin, wraps at a fixed row width and leaves a full
// grid-cell-plus gap between the measured group boxes.
const CANVAS_IMPORT_ORIGIN = 24;
const CANVAS_IMPORT_GAP = 48;
const CANVAS_IMPORT_ROW_WIDTH = 4096;

const CANVAS_ACTIVITY_MIN_WIDTH = 160;
const CANVAS_ACTIVITY_MIN_HEIGHT = 112;
const CANVAS_ACTIVITY_MAX_WIDTH = 640;
const CANVAS_ACTIVITY_MAX_HEIGHT = 520;
const CANVAS_ACTIVITY_SIZE_DEFAULTS = Object.freeze({
    small: Object.freeze({ width: 224, height: 128 }),
    medium: Object.freeze({ width: 272, height: 160 }),
    large: Object.freeze({ width: 320, height: 192 })
});
const CanvasGeometry = Object.freeze({
    grid: CANVAS_GRID_SIZE,
    snap(value) {
        const number = Number(value);
        return Number.isFinite(number) ? Math.round(number / CANVAS_GRID_SIZE) * CANVAS_GRID_SIZE : 0;
    },
    floor(value) {
        const number = Number(value);
        return Number.isFinite(number) ? Math.floor(number / CANVAS_GRID_SIZE) * CANVAS_GRID_SIZE : 0;
    },
    ceil(value) {
        const number = Number(value);
        return Number.isFinite(number) ? Math.ceil(number / CANVAS_GRID_SIZE) * CANVAS_GRID_SIZE : 0;
    },
    isEquilateralShape(shape) {
        return shape === 'circle' || shape === 'square';
    },
    groupOuterBounds(boxes, padding = CANVAS_GROUP_PADDING, header = CANVAS_GROUP_HEADER) {
        if (!boxes.length) return null;
        const left = this.floor(Math.min(...boxes.map(box => box.x)) - padding);
        const top = this.floor(Math.min(...boxes.map(box => box.y)) - header);
        const right = this.ceil(Math.max(...boxes.map(box => box.x + box.width)) + padding);
        const bottom = this.ceil(Math.max(...boxes.map(box => box.y + box.height)) + padding);
        return { left, top, right, bottom, width: right - left, height: bottom - top };
    },
    worldToScreen(x, y, pan, zoom) {
        return { x: pan.x + x * zoom, y: pan.y + y * zoom };
    },
    screenToWorld(x, y, pan, zoom) {
        return { x: (x - pan.x) / zoom, y: (y - pan.y) / zoom };
    },
    screenDeltaToWorld(dx, dy, zoom) {
        return { x: dx / zoom, y: dy / zoom };
    },
    normalizeActivityDimensions(activity, width, height) {
        const shape = activity?.shape || 'rounded';
        const defaults = CANVAS_ACTIVITY_SIZE_DEFAULTS[activity?.size] || CANVAS_ACTIVITY_SIZE_DEFAULTS.medium;
        const requestedWidth = Number.isFinite(Number(width)) ? Number(width) : defaults.width;
        const requestedHeight = Number.isFinite(Number(height)) ? Number(height) : defaults.height;
        let outerWidth = this.ceil(Math.max(
            CANVAS_ACTIVITY_MIN_WIDTH,
            Math.min(CANVAS_ACTIVITY_MAX_WIDTH, requestedWidth)
        ));
        let outerHeight = this.ceil(Math.max(
            CANVAS_ACTIVITY_MIN_HEIGHT,
            Math.min(CANVAS_ACTIVITY_MAX_HEIGHT, requestedHeight)
        ));
        if (this.isEquilateralShape(shape)) {
            const side = Math.max(outerWidth, outerHeight);
            outerWidth = side;
            outerHeight = side;
        }
        return { width: this.ceil(outerWidth), height: this.ceil(outerHeight) };
    }
});
const REQUIRED_WORKER_VERSION = '2026-10-18-projects-v4';
const DAY_REVIEW_PROJECT_MIGRATION_VERSION = 1;

// ============================================================================
// STORAGE REPOSITORY
// ============================================================================

class StorageRepository {
    constructor() {
        this.dbName = 'TimerHubDB';
        this.version = 5;
        this.db = null;
        this.mutationQueue = Promise.resolve();
        this.canvasHistoryQueue = Promise.resolve();
        this.snapshotSequence = 0;
        this.snapshotStatus = 'idle';
        this.lastSnapshotAt = null;
        this.lastSnapshotRevision = -1;
        this.dataRevision = 0;
        this.snapshotTimer = null;
        this.snapshotPending = false;
        this.onSnapshotStatus = null;
        this.onDiagnostic = null;
        this.onMutationCommitted = null;
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);
            this.blockedDuringInit = false;

            request.onerror = () => reject(request.error);
            // Another TimerHub window can hold an older schema connection and
            // block a required upgrade. Fail loudly instead of silently waiting
            // or continuing against a database that was never upgraded.
            request.onblocked = () => {
                this.blockedDuringInit = true;
                reject(new Error('storage_blocked'));
            };
            request.onsuccess = () => {
                if (this.blockedDuringInit) {
                    try { request.result.close(); } catch { /* ignore */ }
                    return;
                }
                this.db = request.result;
                // Release this connection when a newer app version needs to
                // upgrade the schema, so future upgrades cannot be blocked.
                try {
                    this.db.onversionchange = () => {
                        try { this.db.close(); } catch { /* ignore */ }
                    };
                } catch { /* ignore engines without writable handlers */ }
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

                // Persistent canvas undo/redo history. Kept separate from user
                // data and excluded from backups.
                if (!db.objectStoreNames.contains('canvasHistory')) {
                    db.createObjectStore('canvasHistory', { keyPath: 'id' });
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
            tx.oncomplete = () => {
                this.dataRevision += 1;
                this.scheduleAutomaticSnapshot();
                resolve(result);
                Promise.resolve()
                    .then(() => this.onMutationCommitted?.(this.dataRevision))
                    .catch(error => this.reportStorageWarning('mutation-listener', error));
            };
            tx.onerror = () => reject(tx.error || new Error('storage_write_failed'));
            tx.onabort = () => reject(tx.error || new Error('storage_write_aborted'));
        }));
        this.mutationQueue = operation.catch(() => undefined);
        return operation;
    }

    reportStorageWarning(operation, error, status = 'failed') {
        try {
            this.onDiagnostic?.('warn', operation, error, { status });
        } catch {
            // Diagnostics must never affect storage.
        }
    }

    scheduleAutomaticSnapshot(delay = 1500) {
        if (this.snapshotTimer !== null) {
            this.snapshotPending = true;
            return;
        }
        this.snapshotTimer = setTimeout(() => {
            this.snapshotTimer = null;
            this.writeAutomaticSnapshotSafely().finally(() => {
                if (!this.snapshotPending) return;
                this.snapshotPending = false;
                this.scheduleAutomaticSnapshot(0);
            });
        }, Math.max(0, Number(delay) || 0));
    }

    async flushAutomaticSnapshot() {
        if (this.snapshotTimer !== null) {
            clearTimeout(this.snapshotTimer);
            this.snapshotTimer = null;
        }
        this.snapshotPending = false;
        return this.writeAutomaticSnapshotSafely();
    }

    async writeAutomaticSnapshotSafely() {
        const revision = this.dataRevision;
        if (revision === this.lastSnapshotRevision) return true;
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
                // Count and delete through a cursor so pruning never loads all
                // previous snapshot payloads into memory at once.
                if (typeof store.count === 'function' && typeof store.index === 'function') {
                    const countRequest = store.count();
                    countRequest.onsuccess = () => {
                        let excess = Math.max(0, Number(countRequest.result) - 20);
                        if (!excess) return;
                        const cursorRequest = store.index('createdAt').openCursor();
                        cursorRequest.onsuccess = () => {
                            const cursor = cursorRequest.result;
                            if (!cursor || excess <= 0) return;
                            store.delete(cursor.primaryKey);
                            excess -= 1;
                            cursor.continue();
                        };
                    };
                } else {
                    const listRequest = store.getAll();
                    listRequest.onsuccess = () => {
                        const ordered = listRequest.result
                            .sort((a, b) => a.createdAt - b.createdAt || String(a.id).localeCompare(String(b.id)));
                        ordered.slice(0, Math.max(0, ordered.length - 20))
                            .forEach(item => store.delete(item.id));
                    };
                }
                tx.oncomplete = resolve;
                tx.onerror = () => reject(tx.error || new Error('snapshot_write_failed'));
                tx.onabort = () => reject(tx.error || new Error('snapshot_write_aborted'));
            });
            this.lastSnapshotRevision = revision;
            this.snapshotStatus = 'saved';
            this.lastSnapshotAt = snapshot.createdAt;
            Promise.resolve().then(() => this.onSnapshotStatus?.()).catch(error => {
                this.reportStorageWarning('snapshot-status-refresh', error);
            });
            return true;
        } catch (error) {
            this.snapshotStatus = 'failed';
            try {
                this.onDiagnostic?.('error', 'automatic-snapshot', error, { status: 'failed' });
            } catch {
                // ignore
            }
            Promise.resolve().then(() => this.onSnapshotStatus?.()).catch(() => {});
            return false;
        }
    }

    canvasHistoryTransaction(storeMode, operation) {
        const run = this.canvasHistoryQueue.then(() => new Promise((resolve, reject) => {
            const tx = this.db.transaction(['canvasHistory'], storeMode);
            const store = tx.objectStore('canvasHistory');
            let result;
            try {
                result = operation(store, tx);
            } catch (error) {
                reject(error);
                return;
            }
            tx.oncomplete = () => resolve(result);
            tx.onerror = () => reject(tx.error || new Error('canvas_history_write_failed'));
            tx.onabort = () => reject(tx.error || new Error('canvas_history_write_aborted'));
        }));
        this.canvasHistoryQueue = run.catch(() => undefined);
        return run;
    }

    async getCanvasHistory() {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(['canvasHistory'], 'readonly');
            const request = tx.objectStore('canvasHistory').getAll();
            request.onsuccess = () => resolve(request.result
                .sort((a, b) => (Number(a.sequence) || 0) - (Number(b.sequence) || 0)));
            request.onerror = () => reject(request.error || new Error('canvas_history_read_failed'));
        });
    }

    async saveCanvasHistoryEntry(entry, limit = 50) {
        return this.canvasHistoryTransaction('readwrite', store => {
            store.put(entry);
            const all = store.getAll();
            all.onsuccess = () => {
                const ordered = all.result
                    .sort((a, b) => (Number(a.sequence) || 0) - (Number(b.sequence) || 0));
                const excess = Math.max(0, ordered.length - limit);
                ordered.slice(0, excess).forEach(item => store.delete(item.id));
            };
            return true;
        });
    }

    async updateCanvasHistoryEntry(entry) {
        return this.canvasHistoryTransaction('readwrite', store => {
            store.put(entry);
            return true;
        });
    }

    async deleteCanvasHistoryEntries(ids) {
        const list = Array.isArray(ids) ? ids : [ids];
        if (!list.length) return true;
        return this.canvasHistoryTransaction('readwrite', store => {
            list.forEach(id => store.delete(id));
            return true;
        });
    }

    async clearCanvasHistory() {
        return this.canvasHistoryTransaction('readwrite', store => {
            store.clear();
            return true;
        });
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

    async saveLayouts(layouts) {
        const list = Array.isArray(layouts) ? layouts : [];
        if (!list.length) return list;
        return this.persistMutation(['layout'], tx => {
            const store = tx.objectStore('layout');
            list.forEach(layout => store.put(layout));
            return list;
        });
    }

    async deleteLayout(id) {
        return this.persistMutation(['layout'], tx => { tx.objectStore('layout').delete(id); });
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

    async saveGroups(groups) {
        const list = Array.isArray(groups) ? groups : [];
        if (!list.length) return list;
        return this.persistMutation(['groups'], tx => {
            const store = tx.objectStore('groups');
            list.forEach(group => store.put(group));
            return list;
        });
    }

    async deleteGroup(id) {
        return this.persistMutation(['groups'], tx => { tx.objectStore('groups').delete(id); });
    }

    // Atomic work-assignment import: groups, activities, layouts and the import
    // ledger are written in one IndexedDB transaction so a failure cannot leave
    // a partially created hierarchy.
    async applyAssignmentImport({ putGroups = [], putActivities = [], putLayouts = [], deleteGroupIds = [], deleteActivityIds = [], deleteLayoutIds = [], settings = {} } = {}) {
        return this.persistMutation(['groups', 'activities', 'layout', 'settings'], tx => {
            const groupStore = tx.objectStore('groups');
            const activityStore = tx.objectStore('activities');
            const layoutStore = tx.objectStore('layout');
            const settingsStore = tx.objectStore('settings');
            deleteLayoutIds.forEach(id => layoutStore.delete(id));
            deleteGroupIds.forEach(id => groupStore.delete(id));
            deleteActivityIds.forEach(id => activityStore.delete(id));
            putGroups.forEach(group => groupStore.put(group));
            putActivities.forEach(activity => activityStore.put(activity));
            putLayouts.forEach(layout => layoutStore.put(layout));
            if (settings && typeof settings === 'object') {
                for (const [key, value] of Object.entries(settings)) settingsStore.put({ key, value });
            }
            return true;
        });
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
        // A single readonly transaction gives the backup a consistent view and
        // avoids six separate database snapshots for the same export.
        const [activities, timeEntries, settings, syncBatches, layout, groups] = await new Promise((resolve, reject) => {
            const tx = this.db.transaction(['activities', 'timeEntries', 'settings', 'syncBatches', 'layout', 'groups'], 'readonly');
            const values = {};
            let remaining = 6;
            let settled = false;
            const finish = () => {
                if (settled) return;
                settled = true;
                resolve([
                    values.activities, values.timeEntries, values.settings,
                    values.syncBatches, values.layout, values.groups
                ]);
            };
            const fail = error => {
                if (settled) return;
                settled = true;
                reject(error || new Error('storage_export_failed'));
            };
            const requests = [
                ['activities', tx.objectStore('activities').getAll()],
                ['timeEntries', tx.objectStore('timeEntries').getAll()],
                ['settings', tx.objectStore('settings').getAll()],
                ['syncBatches', tx.objectStore('syncBatches').getAll()],
                ['layout', tx.objectStore('layout').getAll()],
                ['groups', tx.objectStore('groups').getAll()]
            ];
            requests.forEach(([key, request]) => {
                request.onsuccess = () => {
                    values[key] = request.result;
                    remaining -= 1;
                    if (remaining === 0) finish();
                };
                request.onerror = () => fail(request.error);
            });
            tx.oncomplete = finish;
            tx.onerror = () => fail(tx.error);
            tx.onabort = () => fail(tx.error || new Error('storage_export_aborted'));
        });

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
        // Every record is checked before any database write so a malformed
        // backup can never clear or partially replace existing data.
        const invalid = () => { throw new Error('invalid_backup'); };
        const requireKey = (record, field) => {
            if (!isRecord(record) || typeof record[field] !== 'string' || !record[field]) invalid();
        };
        const optionalString = (record, field) => {
            if (record[field] !== undefined && typeof record[field] !== 'string') invalid();
        };
        const optionalNullableString = (record, field) => {
            if (record[field] !== undefined && record[field] !== null && typeof record[field] !== 'string') invalid();
        };
        const optionalNumber = (record, field) => {
            if (record[field] !== undefined && record[field] !== null && !Number.isFinite(record[field])) invalid();
        };
        const optionalBoolean = (record, field) => {
            if (record[field] !== undefined && record[field] !== null && typeof record[field] !== 'boolean') invalid();
        };
        const requireUnique = (records, field) => {
            const seen = new Set();
            for (const record of records) {
                if (seen.has(record?.[field])) invalid();
                seen.add(record?.[field]);
            }
        };

        requireUnique(data.activities, 'id');
        requireUnique(data.timeEntries, 'id');
        requireUnique(data.syncBatches || [], 'id');
        requireUnique(data.layout || [], 'activityId');
        requireUnique(data.groups || [], 'id');

        for (const activity of data.activities) {
            requireKey(activity, 'id');
            optionalString(activity, 'name');
            optionalNumber(activity, 'position');
            optionalBoolean(activity, 'archived');
            optionalNullableString(activity, 'groupId');
        }
        for (const entry of data.timeEntries) {
            requireKey(entry, 'id');
            if (entry.activityId !== undefined && typeof entry.activityId !== 'string') invalid();
            if (!Number.isFinite(entry.startTimestamp)) invalid();
            if (entry.endTimestamp !== null && !Number.isFinite(entry.endTimestamp)) invalid();
            optionalNumber(entry, 'createdAt');
            optionalNumber(entry, 'updatedAt');
        }
        for (const batch of data.syncBatches || []) {
            requireKey(batch, 'id');
            optionalString(batch, 'date');
        }
        for (const item of data.layout || []) {
            requireKey(item, 'activityId');
            optionalNumber(item, 'x');
            optionalNumber(item, 'y');
            optionalNumber(item, 'width');
            optionalNumber(item, 'height');
        }
        for (const group of data.groups || []) {
            requireKey(group, 'id');
            optionalString(group, 'name');
            optionalNumber(group, 'x');
            optionalNumber(group, 'y');
            optionalBoolean(group, 'collapsed');
            optionalNullableString(group, 'parentId');
            optionalNullableString(group, 'defaultCustomerId');
            optionalNullableString(group, 'defaultCustomerName');
            optionalNumber(group, 'collapsedWidth');
            optionalNumber(group, 'collapsedHeight');
        }
        return data;
    }

    async importAll(data, merge = false) {
        this.validateBackupData(data);
        const stores = ['activities', 'timeEntries', 'settings', 'syncBatches', 'layout', 'groups'];
        const result = await this.persistMutation(stores, tx => {
            try {
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
                return true;
            } catch (error) {
                // Abort explicitly so queued clears and puts roll back instead
                // of committing a partially imported database.
                try { tx.abort(); } catch { /* ignore already-aborted transactions */ }
                throw error;
            }
        });
        await this.verifyImportedData(data, merge);
        return result;
    }

    async verifyImportedData(data, merge) {
        const settings = await new Promise((resolve, reject) => {
            const request = this.db.transaction(['settings'], 'readonly')
                .objectStore('settings').getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
        const [activities, timeEntries, syncBatches, layout, groups] = await Promise.all([
            this.getActivities(),
            this.getTimeEntries(),
            this.getSyncBatches(),
            this.getLayout(),
            this.getGroups()
        ]);
        const missingKeys = (records, field, expected) => {
            const keys = new Set(records.map(record => record?.[field]));
            return expected.filter(key => !keys.has(key));
        };
        const problems = [];
        if (missingKeys(activities, 'id', data.activities.map(item => item.id)).length) problems.push('activities');
        if (missingKeys(timeEntries, 'id', data.timeEntries.map(item => item.id)).length) problems.push('timeEntries');
        if (missingKeys(settings, 'key', Object.keys(data.settings || {})).length) problems.push('settings');
        if (missingKeys(syncBatches, 'id', (data.syncBatches || []).map(item => item.id)).length) problems.push('syncBatches');
        if (missingKeys(layout, 'activityId', (data.layout || []).map(item => item.activityId)).length) problems.push('layout');
        if (missingKeys(groups, 'id', (data.groups || []).map(item => item.id)).length) problems.push('groups');
        if (!merge) {
            if (activities.length !== data.activities.length) problems.push('activities_count');
            if (timeEntries.length !== data.timeEntries.length) problems.push('timeEntries_count');
            if (syncBatches.length !== (data.syncBatches || []).length) problems.push('syncBatches_count');
            if (layout.length !== (data.layout || []).length) problems.push('layout_count');
            if (groups.length !== (data.groups || []).length) problems.push('groups_count');
        }
        if (problems.length) throw new Error('restore_verification_failed');
        return true;
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
        const diagnosticsStorage = typeof localStorage !== 'undefined' ? localStorage : null;
        this.diagnostics = typeof TimerHubDiagnostics !== 'undefined'
            ? new TimerHubDiagnostics({ storage: diagnosticsStorage })
            : {
                error() {}, warn() {}, info() {}, record() { return null; }, list() { return []; },
                clear() {}, exportPayload() { return { format: 'timerhub-diagnostics', version: 1, entries: [] }; },
                installGlobalHandlers() { return false; }
            };
        try { this.diagnostics.installGlobalHandlers(window); } catch { /* ignore */ }
        this.storage.onDiagnostic = (level, operation, error, options) => {
            try { this.diagnostics[level === 'info' ? 'info' : level === 'warn' ? 'warn' : 'error']('storage', operation, error, options); } catch { /* ignore */ }
        };
        this.backupService = typeof TimerHubBackupService !== 'undefined'
            ? new TimerHubBackupService({
                diagnostics: this.diagnostics,
                getSnapshot: () => this.storage.exportAll(),
                validateSnapshot: data => this.storage.validateBackupData?.(data),
                retention: 20
            })
            : null;
        this.storage.onMutationCommitted = revision => this.handleMutationCommitted(revision);
        this.backupSetupMode = 'unknown';
        this.externalBackups = [];
        this.latestExternalBackup = null;
        this.autoBackupTimer = null;
        this.autoBackupInFlight = null;
        this.pendingAutoBackupRevision = null;
        this.startupFinalized = false;
        this.lastExternalBackupAttempt = 0;
        this.backupRestoreRetryTimer = null;
        this.backupRestoreRetryDelay = 5000;
        this.backupPermissionGestureArmed = false;
        this.backupPermissionGestureHandler = null;
        this.pendingRestoreData = null;
        this.pendingRestoreIsEmpty = false;
        this.pendingRestoreEmptyConfirmed = false;
        this.missingDataSuspected = false;
        this.storagePersistenceStatus = 'unknown';
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
        this.showActivityAssignments = false;
        this.activityLayouts = new Map();
        this.canvasPan = this.readCanvasPan();
        this.canvasZoom = this.readCanvasZoom();
        this.canvasViewportSize = null;
        this.canvasPointers = new Map();
        this.canvasPinch = null;
        this.canvasZIndex = 1;
        this.canvasGesture = null;
        this.canvasSelectionElement = null;
        this.selectedActivityIds = new Set();
        this.selectedGroupIds = new Set();
        this.pendingGroupDeletion = null;
        this.canvasUndoStack = [];
        this.canvasRedoStack = [];
        this.canvasHistorySequence = 0;
        this.maxCanvasHistory = 50;
        this.groupDisplayOffsets = new Map();
        // Final world-space bounds of every rendered group, refreshed whenever
        // the display offsets are recomputed. Used by hit testing so pointer
        // handlers never need repeated DOM measurements.
        this.groupDisplayBounds = new Map();
        // Transient expansion anchors: newest expanded group wins; older groups
        // may be displaced right/down until the conflicting expansion collapses.
        this.groupExpansionOrder = [];
        this.groupExpansionDesiredOffsets = new Map();
        this.activityDisplayOffsets = new Map();
        this.suppressActivityClick = null;
        this.editingActivityId = null;
        this.editingEntryId = null;
        this.editingGroupId = null;
        this.editingGroupColor = '';
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
        this.syncUnknownEntryId = null;
        this.lastExchange = null;
        this.renderedExchangeQr = null;
        this.pendingExchange = null;
        this.pendingAssignment = null;
        this.pendingShareLink = null;
        this.pendingSharedDay = null;
        this.sharedImport = null;
        this.sharedImportNeedsConfig = false;
        this.sharedImportStatus = 'idle';
        this.shareLinkEntries = [];
        this.shareLinkSelection = new Set();
        this.shareLinkInProgress = false;
        this.shareLinkStatus = '';
        this.shareLinkErrorCode = '';
        this.shareLinkResultUrl = '';
        this.sharedDayStatusMessage = '';
        this.exchangeFile = null;
        this.exchangeScanOperation = null;
        this.syncBatches = [];
        this.syncOperations = new Map();
        this.clockodoClient = window.ClockodoClient ? new window.ClockodoClient() : null;
        this.clockodoCustomers = [];
        this.clockodoServices = [];
        this.clockodoProjects = [];
        this.clockodoProjectError = null;
        this.clockodoProjectErrorStatus = 0;
        this.clockodoProjectErrorDetails = null;
        this.clockodoWorkerOutdated = false;
        this.clockodoReferenceStatus = 'idle';
        this.clockodoReferenceError = null;
        this.clockodoReferencePromise = null;
        this.clockodoCombobox = null;
        this.clockodoCustomerFilters = new Map();
        this.clockodoCustomerAutoSelected = new Set();
        this.groupEditInheritedCustomer = null;
        this.activityServiceManuallySelected = false;
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
        this.shapeOrder = this.SHAPES.map(shape => shape.id);
        this.shapeSelectionTouched = false;
        this.shapeDragSuppressClickUntil = 0;

        // Activity templates: a stable id plus a recognizable illustration on
        // a 24x24 grid. Filled parts use currentColor with even-odd cut-outs;
        // stroked parts inherit the contrast-aware activity text color, so the
        // artwork stays legible on every node color and theme.
        this.ACTIVITY_ICONS = [
            {
                id: 'vacuum-attic',
                key: 'iconVacuumAttic',
                elements: [
                    { tag: 'path', attrs: { d: 'M2.4 12.2 L12 3.2 L21.6 12.2 L18.4 12.2 L12 6.2 L5.6 12.2 Z', fill: 'currentColor', stroke: 'none' } },
                    { tag: 'path', attrs: { d: 'M5 13.6 H19', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5' } }
                ]
            },
            {
                id: 'vacuum-basement',
                key: 'iconVacuumBasement',
                elements: [
                    { tag: 'path', attrs: { d: 'M2.4 7.6 H21.6', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.7' } },
                    { tag: 'path', attrs: { d: 'M5 7.6 V20.6 H19 V7.6', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.7' } },
                    { tag: 'path', attrs: { d: 'M5 10.4 H8.4 V13.2 H11.8 V16 H15.2', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5' } },
                    { tag: 'path', attrs: { d: 'M15.4 20.6 V14.6 Q15.4 13.2 16.9 13.2 Q18.4 13.2 18.4 14.6 V20.6', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.6' } },
                    { tag: 'circle', attrs: { cx: '17.7', cy: '17.2', r: '0.5', fill: 'currentColor', stroke: 'none' } }
                ]
            },
            {
                id: 'mop',
                key: 'iconMop',
                elements: [
                    { tag: 'path', attrs: { d: 'M3.6 16.2 H20.4 V18.2 Q20.4 18.9 19.7 18.9 H4.3 Q3.6 18.9 3.6 18.2 Z', fill: 'currentColor', stroke: 'none' } },
                    { tag: 'path', attrs: { d: 'M11.2 16.2 V14.6 H12.8 V16.2 Z', fill: 'currentColor', stroke: 'none' } },
                    { tag: 'path', attrs: { d: 'M12 14.6 V4.4', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.8' } },
                    { tag: 'path', attrs: { d: 'M10.5 3.5 H13.5', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.8' } }
                ]
            },
            {
                id: 'squeegee',
                key: 'iconSqueegee',
                elements: [
                    { tag: 'path', attrs: { d: 'M4.2 4.6 H19.8 V18.6 H4.2 Z', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.8' } },
                    { tag: 'path', attrs: { d: 'M12 4.6 V18.6 M4.2 11.6 H19.8', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.4' } },
                    { tag: 'path', attrs: { d: 'M3 18.6 H21', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.8' } }
                ]
            },
            {
                id: 'duster',
                key: 'iconDuster',
                elements: [
                    { tag: 'path', attrs: { d: 'M3.8 18.8 H20.2', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5' } },
                    { tag: 'path', attrs: { d: 'M5.6 18.8 C5.4 17.6 6 16.6 7 16 C7.6 15.6 8 15 8.8 14.8 C9.6 14.6 10.2 15 10.8 14.6 C11.6 14 12.6 14.2 13.2 14.8 C13.8 15.4 13.8 16 14.6 16.2 C15.8 16.6 16.8 17.4 17 18.6 Z', fill: 'currentColor', stroke: 'none' } },
                    { tag: 'circle', attrs: { cx: '17.6', cy: '12.2', r: '0.6', fill: 'currentColor', stroke: 'none' } },
                    { tag: 'circle', attrs: { cx: '19.4', cy: '15.2', r: '0.5', fill: 'currentColor', stroke: 'none' } },
                    { tag: 'circle', attrs: { cx: '6.6', cy: '12.4', r: '0.5', fill: 'currentColor', stroke: 'none' } }
                ]
            },
            {
                id: 'car',
                key: 'iconCar',
                elements: [
                    { tag: 'path', attrs: { d: 'M3.4 16.4 V15.2 C3.4 14.4 4 13.8 4.9 13.7 L6.5 13.5 L8.4 9.7 C8.8 9 9.5 8.6 10.3 8.6 H13.7 C14.5 8.6 15.2 9 15.6 9.7 L17.5 13.5 L19.1 13.7 C20 13.8 20.6 14.4 20.6 15.2 V16.4', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.7' } },
                    { tag: 'path', attrs: { d: 'M9.6 9.6 L8.8 13.4 M14.4 9.6 L15.2 13.4', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.4' } },
                    { tag: 'path', attrs: { d: 'M4.6 16.4 H19.4', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.7' } },
                    { tag: 'circle', attrs: { cx: '8', cy: '16.6', r: '1.9', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.7' } },
                    { tag: 'circle', attrs: { cx: '16', cy: '16.6', r: '1.9', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.7' } },
                    { tag: 'circle', attrs: { cx: '8', cy: '16.6', r: '0.6', fill: 'currentColor', stroke: 'none' } },
                    { tag: 'circle', attrs: { cx: '16', cy: '16.6', r: '0.6', fill: 'currentColor', stroke: 'none' } }
                ]
            }
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

        this.updateActivityAssignmentsToggle();
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
            await this.loadBackupRetention();
            this.applyTranslations();
            await this.loadActivities();
            await this.loadGroups();
            await this.loadTimeEntries({ runMigration: false });
            this.evaluateSuspiciousEmptyState();
            this.updateDataPresenceMarker();

            // Restore the handle before deciding which screen to display.
            // A prompt/denied permission is a degraded backup state, not a
            // missing folder and not a reason to hide the canvas.
            const restoredStatus = await this.restoreBackupAccessBeforeScreen();
            const decision = this.decideBackupStartup(restoredStatus);
            if (decision.mode === 'setup') {
                this.showBackupSetup({ ready: false, reason: decision.reason, status: restoredStatus });
                const loading = document.getElementById('appLoading');
                if (loading) loading.hidden = true;
                return;
            }
            await this.finishStartup({
                backupWarning: decision.warning || null,
                backupStatus: restoredStatus
            });
        } catch (error) {
            this.diagnostics?.error('init', 'application-init', error, { status: 'failed' });
            const loading = document.getElementById('appLoading');
            if (loading) loading.hidden = true;
            const panel = document.getElementById('initErrorPanel');
            if (panel) panel.hidden = false;
            this.applyTranslations();
            document.getElementById('initReloadBtn')?.addEventListener('click', () => window.location.reload());
        }
    }

    async finishStartup({ backupWarning = null, backupStatus = null } = {}) {
        if (this.startupFinalized) return true;
        try {
            await this.migrateMissingGroupLayouts();
            await this.migrateActivityCanvasGeometry();
            await this.migrateDayReviewProjectAssignments(this._rawTimeEntries || []);
            await this.loadCanvasHistory();
            this.applyTranslations();
            this.setupUI();
            this.applyTheme();
            this.syncServiceWorkerLocale();
            this.startUIUpdateLoop();
            this.renderMain();
            const sharedLink = this.captureSharedLinkFromLocation();
            if (sharedLink) this.openSharedDay(sharedLink).catch(error => {
                this.diagnostics?.warn('import', 'shared-day-open', error, { status: 'failed' });
            });
            this.refreshStoragePersistenceStatus().catch(() => {});
            const loading = document.getElementById('appLoading');
            if (loading) loading.hidden = true;
            this.startupFinalized = true;
            this.unlockMainApplication();
            if (backupWarning) {
                // Backups are paused but the canvas stays available. Report the
                // state in Backup settings, not with a startup banner.
                this.updateExternalBackupStatus().catch(() => {});
                if (backupWarning === 'restore-error') this.scheduleBackupRestoreRetry();
            } else {
                this.ensureStartupExternalBackup().then(() => this.refreshMissingDataWarning()).catch(error => {
                    this.diagnostics?.error('backup', 'startup-backup', error, { status: 'failed' });
                    this.updateExternalBackupStatus().catch(() => {});
                });
            }
            this.storage.flushAutomaticSnapshot().catch(error => {
                this.diagnostics?.warn('storage', 'initial-snapshot', error, { status: 'failed' });
            });

            if (this.activeActivityId) {
                this.reconcileBackgroundAlarm().catch(error => {
                    this.diagnostics?.error('notifications', 'alarm-restore', error, { status: 'failed' });
                    this.showPushStatus(this.notificationError('notificationNeedsAttention', error));
                });
            }

            if (backupWarning === 'permission-required' || backupWarning === 'permission-unknown') {
                this.armBackupPermissionRequestOnFirstGesture();
            }
            if (this.activities.length === 0) {
                this.showOnboarding();
            }
            this.refreshMissingDataWarning();
            this.refreshClockodoConnectionOnStartup({ silent: true }).catch(error => {
                this.diagnostics?.warn('clockodo', 'startup-connection-check', error, { status: 'failed' });
            });
            return true;
        } catch (error) {
            this.diagnostics?.error('init', 'startup-finalize', error, { status: 'failed' });
            const loading = document.getElementById('appLoading');
            if (loading) loading.hidden = true;
            const panel = document.getElementById('initErrorPanel');
            if (panel) panel.hidden = false;
            this.applyTranslations();
            return false;
        }
    }


    armBackupPermissionRequestOnFirstGesture() {
        if (this.backupPermissionGestureArmed || !this.backupService) return;
        const status = this.backupService.getStatus?.() || {};
        if (status.state !== 'permission-required' && status.state !== 'permission-unknown') return;
        this.backupPermissionGestureArmed = true;
        const handler = async () => {
            if (this.backupPermissionGestureHandler !== handler) return;
            this.backupPermissionGestureHandler = null;
            this.backupPermissionGestureArmed = false;
            try {
                await this.backupService.requestAccess();
                await this.ensureStartupExternalBackup({ force: true });
                await this.updateExternalBackupStatus();
            } catch (error) {
                this.diagnostics?.warn('backup', 'auto-restore-access', error, { status: 'failed' });
                await this.updateExternalBackupStatus().catch(() => {});
            }
        };
        this.backupPermissionGestureHandler = handler;
        const options = { capture: true, once: true };
        document.addEventListener?.('click', handler, options);
        document.addEventListener?.('keydown', handler, options);
    }

    clearBackupPermissionGesture() {
        if (this.backupPermissionGestureHandler) {
            document.removeEventListener?.('click', this.backupPermissionGestureHandler, true);
            document.removeEventListener?.('keydown', this.backupPermissionGestureHandler, true);
            this.backupPermissionGestureHandler = null;
        }
        this.backupPermissionGestureArmed = false;
    }

    async refreshClockodoConnectionOnStartup({ silent = true } = {}) {
        if (!this.clockodoClient) return false;
        await this.refreshClockodoConfigurationStatus();
        if (!this.clockodoConfigured) return false;
        if (typeof navigator !== 'undefined' && navigator.onLine === false) return false;
        return this.testClockodoConnection({ silent });
    }

    clearBackupRestoreRetry() {
        if (this.backupRestoreRetryTimer) {
            clearTimeout(this.backupRestoreRetryTimer);
            this.backupRestoreRetryTimer = null;
        }
        this.backupRestoreRetryDelay = 5000;
    }

    scheduleBackupRestoreRetry(delay = null) {
        if (!this.backupService || !this.startupFinalized) return;
        if (this.backupRestoreRetryTimer) return;
        const wait = Math.max(1000, Number(delay) || this.backupRestoreRetryDelay);
        this.backupRestoreRetryTimer = setTimeout(async () => {
            this.backupRestoreRetryTimer = null;
            try {
                const status = await this.backupService.init();
                const decision = this.decideBackupStartup(status);
                if (decision.mode === 'ready') {
                    this.clearBackupRestoreRetry();
                    await this.ensureStartupExternalBackup({ force: true });
                    await this.updateExternalBackupStatus().catch(() => {});
                    return;
                }
                if (decision.mode === 'degraded' && decision.warning === 'restore-error') {
                    this.backupRestoreRetryDelay = Math.min(60_000, wait * 2);
                    this.scheduleBackupRestoreRetry();
                }
                // Permission and genuinely missing folders are reported in
                // Backup settings. Startup does not interrupt the canvas.
                await this.updateExternalBackupStatus().catch(() => {});
            } catch (error) {
                this.diagnostics?.warn('backup', 'restore-retry', error, { status: 'failed' });
                this.backupRestoreRetryDelay = Math.min(60_000, wait * 2);
                this.scheduleBackupRestoreRetry();
            }
        }, wait);
    }

    decideBackupStartup(status = null) {
        if (!status) return { mode: 'setup', reason: 'unsupported', status };
        if (status.state === 'ready') return { mode: 'ready', reason: 'ready', warning: null, status };
        if (status.state === 'permission-required') return { mode: 'degraded', reason: status.state, warning: status.state, status };
        if (status.state === 'permission-denied') return { mode: 'degraded', reason: status.state, warning: status.state, status };
        if (status.state === 'permission-unknown') return { mode: 'degraded', reason: status.state, warning: status.state, status };
        if (status.state === 'restore-error') return { mode: 'degraded', reason: status.state, warning: status.state, status };
        if (status.state === 'unsupported') return { mode: 'setup', reason: 'unsupported', status };
        if (status.state === 'handle-invalid') return { mode: 'setup', reason: 'handle-invalid', status };
        return { mode: 'setup', reason: 'needs-selection', status };
    }

    async restoreBackupAccessBeforeScreen({ retryDelays = [0, 250, 750] } = {}) {
        if (!this.backupService) return { state: 'unsupported' };
        let status = await this.backupService.init();
        for (const delay of retryDelays) {
            if (status.state !== 'restore-error') break;
            if (delay > 0) await new Promise(resolve => setTimeout(resolve, delay));
            status = await this.backupService.init();
        }
        try {
            this.diagnostics?.info('backup', 'environment', 'environment_detected', {
                status: 'succeeded',
                details: {
                    standalone: window.matchMedia?.('(display-mode: standalone)')?.matches === true,
                    directoryPickerAvailable: typeof window.showDirectoryPicker === 'function',
                    secureContext: window.isSecureContext === true
                }
            });
        } catch { /* diagnostics must not block startup */ }
        return status;
    }

    async loadBackupRetention() {
        let retention = 20;
        try {
            retention = Number(await this.storage.getSetting('externalBackupRetention', 20));
        } catch {
            retention = 20;
        }
        if (!Number.isFinite(retention)) retention = 20;
        retention = Math.max(1, Math.min(100, Math.floor(retention)));
        if (this.backupService) this.backupService.retention = retention;
        return retention;
    }

    async evaluateBackupGate() {
        if (!this.backupService) {
            return { ready: false, reason: 'unsupported' };
        }
        const status = this.backupService.getStatus();
        const decision = this.decideBackupStartup(status);
        if (decision.mode === 'setup') {
            return { ready: false, reason: decision.reason, status };
        }
        if (decision.mode === 'degraded') {
            return { ready: true, warning: decision.warning, reason: decision.reason, status };
        }
        try {
            await this.backupService.verifyWritable();
            await this.backupService.cleanupOwnTemporaryFiles();
            this.backupSetupMode = 'ready';
            return { ready: true, warning: null, reason: 'ready', status: this.backupService.getStatus() };
        } catch (error) {
            const code = error?.code || error?.name || 'backup_verification_failed';
            this.diagnostics?.error('backup', 'verify-directory', error, { status: 'failed' });
            if (code === 'backup_permission_required' || code === 'backup_permission_denied') {
                return {
                    ready: true,
                    warning: code === 'backup_permission_required' ? 'permission-required' : 'permission-denied',
                    reason: code,
                    status: this.backupService.getStatus()
                };
            }
            // A writable probe can fail because the folder is temporarily
            // unavailable. Keep the canvas usable and retry; do not ask for a
            // new folder unless restoration later proves it invalid.
            return { ready: true, warning: 'restore-error', reason: 'restore-error', status: this.backupService.getStatus() };
        }
    }

    unlockMainApplication() {
        document.body?.classList?.remove('backup-locked');
        const setup = document.getElementById('backupSetupScreen');
        if (setup) setup.hidden = true;
    }

    lockMainApplication() {
        document.body?.classList?.add('backup-locked');
        const setup = document.getElementById('backupSetupScreen');
        if (setup) setup.hidden = false;
        if (this.uiUpdateInterval) {
            clearInterval(this.uiUpdateInterval);
            this.uiUpdateInterval = null;
        }
    }

    backupSetupElements() {
        return {
            screen: document.getElementById('backupSetupScreen'),
            title: document.getElementById('backupSetupTitle'),
            status: document.getElementById('backupSetupStatus'),
            directory: document.getElementById('backupSetupDirectory'),
            data: document.getElementById('backupSetupData'),
            error: document.getElementById('backupSetupError'),
            compatibility: document.getElementById('backupSetupCompatibility'),
            choose: document.getElementById('backupSetupChooseBtn'),
            reauthorize: document.getElementById('backupSetupReauthorizeBtn'),
            retry: document.getElementById('backupSetupRetryBtn'),
            change: document.getElementById('backupSetupChangeDirBtn'),
            export: document.getElementById('backupSetupExportBtn')
        };
    }

    setupBackupSetupUI() {
        if (this.backupSetupUIReady) return;
        this.backupSetupUIReady = true;
        const elements = this.backupSetupElements();
        elements.choose?.addEventListener('click', () => this.handleBackupSetupChoice('choose'));
        elements.change?.addEventListener('click', () => this.handleBackupSetupChoice('change'));
        elements.reauthorize?.addEventListener('click', () => this.handleBackupSetupChoice('reauthorize'));
        elements.retry?.addEventListener('click', () => this.handleBackupSetupChoice('retry'));
        elements.export?.addEventListener('click', () => this.handleBackupSetupExport());
    }

    showBackupSetup(gate = {}) {
        this.lockMainApplication();
        this.setupBackupSetupUI();
        const elements = this.backupSetupElements();
        const status = gate.status || this.backupService?.getStatus?.() || {};
        const reason = gate.reason || status.state || 'needs-selection';
        const unsupported = reason === 'unsupported';
        const permissionUnknown = reason === 'permission-unknown';
        const permissionRequired = reason === 'permission-required' || permissionUnknown;
        const permissionDenied = reason === 'permission-denied';
        const restoreError = reason === 'restore-error';
        const handleInvalid = reason === 'handle-invalid';
        const hasSavedHandle = Boolean(status.savedHandleAvailable);
        const canPick = status.capabilities?.directoryPicker !== false;
        if (elements.title) {
            elements.title.textContent = unsupported ? this.t('backupSetupUnsupportedTitle')
                : permissionRequired ? this.t('backupSetupPermissionRequiredTitle')
                : permissionDenied ? this.t('backupSetupPermissionTitle')
                : restoreError ? this.t('backupSetupRestoreErrorTitle')
                : handleInvalid ? this.t('backupSetupErrorTitle')
                : this.t('backupSetupTitle');
        }
        if (elements.compatibility) {
            elements.compatibility.textContent = unsupported
                ? this.t('backupSetupUnsupportedBody')
                : permissionRequired ? this.t('backupSetupPermissionRequiredBody')
                : permissionDenied ? this.t('backupSetupPermissionBody')
                : restoreError ? this.t('backupSetupRestoreErrorBody')
                : handleInvalid ? this.t('backupSetupRestoreErrorBody')
                : this.t('backupSetupBrowserNote');
        }
        if (elements.status) {
            elements.status.textContent = this.t('backupSetupBlocked');
        }
        if (elements.directory) {
            elements.directory.hidden = !status.directoryName;
            elements.directory.textContent = status.directoryName
                ? this.t('backupSetupDirectoryLabel', { name: status.directoryName })
                : '';
        }
        if (elements.data) {
            const activities = this.activities.length + this.archivedActivities.length;
            elements.data.textContent = activities || this.timeEntries.length || this.groups.length
                ? this.t('backupSetupCurrentData', { activities, entries: this.timeEntries.length })
                : this.t('backupSetupNoData');
        }
        if (elements.error) {
            elements.error.textContent = gate.error ? this.t('backupSetupSelectFailed') : '';
        }
        // Reusing a saved handle must never look like first-time setup. The
        // primary action renews access to the stored handle; choosing another
        // folder is an explicit secondary action.
        if (elements.choose) {
            elements.choose.hidden = unsupported || !canPick || permissionRequired || hasSavedHandle;
            elements.choose.classList.toggle('btn-primary-green', !restoreError);
        }
        if (elements.change) elements.change.hidden = unsupported || !hasSavedHandle || !canPick;
        if (elements.reauthorize) elements.reauthorize.hidden = unsupported || (!permissionRequired && !permissionDenied) || !status.savedHandleAvailable;
        if (elements.retry) elements.retry.hidden = unsupported || (!restoreError && !permissionUnknown);
        if (elements.export) elements.export.hidden = false;
    }

    async handleBackupSetupExport() {
        const elements = this.backupSetupElements();
        if (elements.status) elements.status.textContent = this.t('backupSetupVerifying');
        if (elements.error) elements.error.textContent = '';
        try {
            await this.exportCurrentDataFile({ setLastBackup: true });
            if (elements.status) elements.status.textContent = this.t('backupSetupExportDone');
        } catch (error) {
            this.diagnostics?.error('backup', 'setup-export', error, { status: 'failed' });
            if (elements.error) elements.error.textContent = this.t('backupSetupExportFailed');
        }
    }

    async handleBackupSetupChoice(action) {
        const elements = this.backupSetupElements();
        const buttons = [elements.choose, elements.change, elements.reauthorize, elements.retry, elements.export];
        const setBusy = busy => {
            buttons.forEach(button => { if (button) button.disabled = busy; });
            if (elements.status && busy) elements.status.textContent = this.t('backupSetupVerifying');
            if (elements.error) elements.error.textContent = '';
        };
        if (!this.backupService) return false;
        setBusy(true);
        try {
            if (action === 'choose' || action === 'change') {
                await this.backupService.selectDirectory();
            } else if (action === 'reauthorize') {
                await this.backupService.requestAccess();
            } else {
                // Retry must re-read the saved handle, not open the picker.
                const status = await this.restoreBackupAccessBeforeScreen({ retryDelays: [0] });
                const decision = this.decideBackupStartup(status);
                if (decision.mode === 'setup') {
                    this.showBackupSetup({ ready: false, reason: decision.reason, status });
                    return false;
                }
                if (decision.mode === 'degraded') {
                    if (!this.startupFinalized) {
                        await this.finishStartup({ backupWarning: decision.warning, backupStatus: status });
                    } else {
                        this.unlockMainApplication();
                        await this.updateExternalBackupStatus().catch(() => {});
                    }
                    return true;
                }
            }
            await this.ensureStartupExternalBackup({ force: true });
            if (elements.status) elements.status.textContent = this.t('backupSetupVerified');
            this.unlockMainApplication();
            if (this.startupFinalized) {
                if (!this.uiUpdateInterval) this.startUIUpdateLoop();
                this.renderMain();
                this.updateExternalBackupStatus().catch(() => {});
                return true;
            }
            await this.finishStartup();
            return true;
        } catch (error) {
            this.diagnostics?.error('backup', `setup-${action}`, error, { status: 'failed' });
            const status = this.backupService.getStatus();
            const permissionProblem = error?.code === 'backup_permission_required' || error?.code === 'backup_permission_denied';
            if (permissionProblem && status.savedHandleAvailable) {
                // Never trap the user on the setup screen when the saved
                // folder still exists and only permission renewal failed.
                this.unlockMainApplication();
                await this.updateExternalBackupStatus().catch(() => {});
                return true;
            }
            const gate = await this.evaluateBackupGate();
            if (gate.ready) {
                // A transient folder failure must not put a saved handle back
                // behind the first-run setup screen.
                const warning = gate.warning || 'restore-error';
                if (!this.startupFinalized) {
                    await this.finishStartup({ backupWarning: warning, backupStatus: gate.status });
                } else {
                    this.unlockMainApplication();
                    await this.updateExternalBackupStatus().catch(() => {});
                }
                return true;
            }
            this.showBackupSetup({
                ...gate,
                reason: gate.reason,
                error: error?.code || error?.name || 'backup_setup_failed'
            });
            if (elements.error) elements.error.textContent = this.t('backupSetupSelectFailed');
            return false;
        } finally {
            setBusy(false);
            buttons.forEach(button => { if (button) button.disabled = false; });
        }
    }

    async ensureStartupExternalBackup({ force = false } = {}) {
        if (!this.backupService || !this.startupFinalized) {
            if (!force) return null;
        }
        if (!this.backupService.directoryHandle) return null;
        const status = this.backupService.getStatus();
        if (status.state === 'permission-required' || status.state === 'permission-denied' ||
            status.state === 'permission-unknown' || status.state === 'restore-error') {
            if (status.state === 'permission-required' || status.state === 'permission-unknown') {
                this.armBackupPermissionRequestOnFirstGesture();
            }
            this.updateExternalBackupStatus().catch(() => {});
            return null;
        }
        const permission = typeof this.backupService.queryPermission === 'function'
            ? await this.backupService.queryPermission()
            : 'granted';
        if (permission !== 'granted') {
            this.updateExternalBackupStatus().catch(() => {});
            return null;
        }
        let latest = null;
        try {
            latest = await this.backupService.findLatestVerified();
        } catch (error) {
            this.diagnostics?.warn('backup', 'find-latest', error, { status: 'failed' });
        }
        const hasLocalData = this.hasLocalWorkData();
        const staleAfter = 24 * 60 * 60 * 1000;
        const needsBackup = force || !latest || (hasLocalData && Date.now() - Number(latest.createdAt || 0) > staleAfter);
        if (!needsBackup) {
            this.clearBackupPermissionGesture();
            await this.updateExternalBackupStatus();
            return latest;
        }
        const result = await this.backupService.createBackup({
            kind: 'automatic',
            reason: force ? 'startup' : 'scheduled',
            force: true,
            revision: this.storage.dataRevision
        });
        this.clearBackupPermissionGesture();
        await this.updateExternalBackupStatus();
        return result;
    }

    handleMutationCommitted(revision) {
        if (!this.startupFinalized || !this.backupService) return;
        this.scheduleExternalBackup(revision);
    }

    backupAccessPaused(status = null) {
        const current = status || this.backupService?.getStatus?.() || {};
        return current.state === 'permission-required' || current.state === 'permission-denied' ||
            current.state === 'permission-unknown' || current.state === 'restore-error';
    }

    scheduleExternalBackup(revision = null) {
        if (!this.startupFinalized || !this.backupService) return;
        // Automatic backups cannot request permission. Wait for the user to
        // restore access from Backup settings instead of retrying a prompt
        // that cannot be answered in the background.
        if (this.backupAccessPaused()) return;
        this.pendingAutoBackupRevision = revision ?? this.storage.dataRevision;
        if (this.autoBackupTimer !== null || this.autoBackupInFlight) return;
        this.autoBackupTimer = setTimeout(() => {
            this.autoBackupTimer = null;
            this.flushExternalBackup().catch(error => {
                this.diagnostics?.warn('backup', 'scheduled-backup', error, { status: 'failed' });
            });
        }, 30_000);
    }

    async flushExternalBackup({ force = false } = {}) {
        if (!this.startupFinalized || !this.backupService) return null;
        if (this.backupAccessPaused()) return null;
        if (this.autoBackupInFlight) return this.autoBackupInFlight;
        const revision = this.pendingAutoBackupRevision ?? this.storage.dataRevision;
        this.pendingAutoBackupRevision = null;
        this.autoBackupInFlight = (async () => {
            try {
                const result = await this.backupService.createBackup({
                    kind: 'automatic',
                    reason: 'scheduled',
                    force,
                    revision
                });
                await this.updateExternalBackupStatus();
                return result;
            } catch (error) {
                this.diagnostics?.error('backup', 'external-backup', error, { status: 'failed' });
                await this.updateExternalBackupStatus();
                if (error?.code === 'backup_permission_required' || error?.code === 'backup_permission_denied') {
                    this.pendingAutoBackupRevision = null;
                } else if (this.pendingAutoBackupRevision === null) {
                    this.showToast(this.t('externalBackupFailed'));
                    this.pendingAutoBackupRevision = this.storage.dataRevision;
                    this.autoBackupTimer = setTimeout(() => {
                        this.autoBackupTimer = null;
                        this.flushExternalBackup().catch(() => {});
                    }, 120_000);
                }
                throw error;
            } finally {
                this.autoBackupInFlight = null;
            }
        })();
        return this.autoBackupInFlight;
    }

    lockForBackupProblem(reason) {
        this.diagnostics?.warn('backup', 'backup-problem', reason, { status: 'failed' });
        const status = this.backupService?.getStatus?.() || {};
        if (reason === 'unsupported' || reason === 'needs-selection' || reason === 'handle-invalid') {
            this.showBackupSetup({ ready: false, reason, status });
            return;
        }
        this.updateExternalBackupStatus().catch(() => {});
    }

    async manualExternalBackup() {
        if (!this.startupFinalized) {
            this.showToast(this.t('externalBackupNotConfigured'));
            return false;
        }
        try {
            let status = this.backupService.getStatus();
            if (status.state === 'restore-error') {
                status = await this.backupService.init();
            }
            if (status.state === 'permission-required' || status.state === 'permission-denied' || status.state === 'permission-unknown') {
                // This click is the required user gesture; renew access to the
                // saved folder instead of failing the manual backup.
                await this.backupService.requestAccess();
            } else if (status.state === 'needs-selection' || status.state === 'handle-invalid' || status.state === 'restore-error') {
                await this.updateExternalBackupStatus().catch(() => {});
                return false;
            }
            const result = await this.backupService?.createBackup({
                kind: 'manual', reason: 'manual', force: true, revision: this.storage.dataRevision
            });
            if (result?.skipped) return false;
            this.clearBackupRestoreRetry();
            this.clearBackupPermissionGesture();
            await this.updateExternalBackupStatus();
            this.showToast(this.t('externalBackupSucceeded', { name: result?.name || '' }));
            return true;
        } catch (error) {
            this.diagnostics?.error('backup', 'manual-external-backup', error, { status: 'failed' });
            this.showToast(this.t('externalBackupFailed'));
            await this.updateExternalBackupStatus().catch(() => {});
            return false;
        }
    }

    async updateExternalBackupStatus() {
        const statusElement = document.getElementById('externalBackupStatus');
        const folderElement = document.getElementById('externalBackupFolder');
        const select = document.getElementById('externalBackupSelect');
        const restoreButton = document.getElementById('externalBackupRestoreBtn');
        const diagnosticsLast = document.getElementById('diagnosticsLastVerified');
        const diagnosticsFolder = document.getElementById('diagnosticsBackupFolder');
        if (!this.backupService) {
            if (statusElement) statusElement.textContent = this.t('externalBackupNotConfigured');
            return;
        }
        const status = this.backupService.getStatus();
        const folderText = status.directoryName
            ? this.t('externalBackupStatusFolder', { name: status.directoryName })
            : this.t('externalBackupNotConfigured');
        if (folderElement) folderElement.textContent = folderText;
        if (diagnosticsFolder) diagnosticsFolder.textContent = folderText;
        const missing = status.state === 'needs-selection' || status.state === 'handle-invalid';
        const unsupported = status.state === 'unsupported';
        const permissionPaused = status.state === 'permission-required' ||
            status.state === 'permission-denied' || status.state === 'permission-unknown';
        const restorePaused = status.state === 'restore-error';
        let latest = null;
        let backups = [];
        if (!permissionPaused && !restorePaused) {
            try {
                latest = await this.backupService.findLatestVerified();
                backups = await this.backupService.listBackups({ verify: false });
            } catch (error) {
                this.diagnostics?.warn('backup', 'list-backups', error, { status: 'failed' });
            }
        } else {
            // Do not touch the directory while the browser is waiting for a
            // permission gesture. Use the last known verified metadata.
            latest = this.latestExternalBackup || (status.lastVerifiedAt
                ? { createdAt: status.lastVerifiedAt, name: status.lastVerifiedName, verified: true }
                : null);
            backups = this.externalBackups || [];
        }
        this.externalBackups = backups;
        if (latest) this.latestExternalBackup = latest;
        const latestText = latest
            ? this.t('externalBackupStatusOk', { date: this.formatSnapshotDate(latest.createdAt) })
            : this.t('externalBackupStatusNone');
        if (statusElement) {
            statusElement.textContent = missing
                ? this.t('externalBackupFolderMissing')
                : unsupported
                    ? this.t('externalBackupUnsupported')
                    : latestText;
        }
        if (diagnosticsLast) {
            diagnosticsLast.textContent = missing ? this.t('externalBackupFolderMissing') : latestText;
        }
        const verifyButton = document.getElementById('externalBackupVerifyBtn');
        if (verifyButton) {
            verifyButton.textContent = permissionPaused
                ? this.t('backupAccessRestore')
                : restorePaused ? this.t('backupAccessRetry') : this.t('externalBackupVerify');
        }
        if (select) {
            const selected = select.value;
            select.replaceChildren();
            const placeholder = document.createElement('option');
            placeholder.value = '';
            placeholder.textContent = backups.length ? this.t('externalBackupSelect') : this.t('externalBackupNone');
            select.appendChild(placeholder);
            backups.forEach(backup => {
                const option = document.createElement('option');
                option.value = backup.name;
                option.textContent = `${this.formatSnapshotDate(backup.createdAt)} · ${backup.kind === 'automatic' ? this.t('externalBackupTitle') : this.t('backupData')}`;
                select.appendChild(option);
            });
            if (backups.some(backup => backup.name === selected)) select.value = selected;
        }
        if (restoreButton) restoreButton.disabled = permissionPaused || restorePaused || !select?.value;
        this.renderDiagnostics();
        if (this.startupFinalized) this.refreshMissingDataWarning();
        return { latest, backups, status };
    }

    async chooseExternalBackupDirectory() {
        if (!this.backupService) return false;
        try {
            const status = await this.backupService.selectDirectory();
            await this.ensureStartupExternalBackup({ force: true });
            await this.updateExternalBackupStatus();
            this.showToast(this.t('backupSetupVerified'));
            return Boolean(status);
        } catch (error) {
            this.diagnostics?.error('backup', 'choose-directory', error, { status: 'failed' });
            this.showToast(this.t('backupSetupSelectFailed'));
            if (error?.code === 'directory_picker_unsupported') this.lockForBackupProblem('unsupported');
            return false;
        }
    }

    async verifyExternalBackupDirectory() {
        if (!this.backupService) return false;
        try {
            const before = this.backupService.getStatus();
            if (before.state === 'permission-required' || before.state === 'permission-denied' || before.state === 'permission-unknown') {
                await this.backupService.requestAccess();
            } else if (before.state === 'restore-error') {
                const status = await this.backupService.init();
                if (status.state === 'permission-required' || status.state === 'permission-denied' || status.state === 'permission-unknown') {
                    await this.backupService.requestAccess();
                } else if (status.state !== 'ready') {
                    await this.updateExternalBackupStatus();
                    return false;
                }
            }
            await this.backupService.verifyWritable();
            await this.ensureStartupExternalBackup({ force: true });
            this.clearBackupRestoreRetry();
            this.clearBackupPermissionGesture();
            await this.updateExternalBackupStatus();
            this.showToast(this.t('backupSetupVerified'));
            return true;
        } catch (error) {
            this.diagnostics?.error('backup', 'verify-folder', error, { status: 'failed' });
            await this.updateExternalBackupStatus().catch(() => {});
            return false;
        }
    }

    async restoreSelectedExternalBackup() {
        const select = document.getElementById('externalBackupSelect');
        const name = select?.value;
        if (!name || !this.backupService) return false;
        try {
            const parsed = await this.backupService.readBackup(name);
            this.openRestoreConfirmation(parsed.data);
            return true;
        } catch (error) {
            this.diagnostics?.error('restore', 'read-external-backup', error, { status: 'failed' });
            this.showToast(this.t('invalidBackup'));
            return false;
        }
    }

    async restoreLatestExternalBackup() {
        if (!this.backupService) return false;
        try {
            const latest = await this.backupService.findLatestVerified();
            if (!latest) {
                this.showToast(this.t('externalBackupNone'));
                return false;
            }
            const parsed = await this.backupService.readBackup(latest.name);
            this.openRestoreConfirmation(parsed.data);
            return true;
        } catch (error) {
            this.diagnostics?.error('restore', 'read-latest-external-backup', error, { status: 'failed' });
            this.showToast(this.t('invalidBackup'));
            return false;
        }
    }

    async exportCurrentDataFile({ setLastBackup = true } = {}) {
        try {
            const data = await this.storage.exportAll();
            this.storage.validateBackupData?.(data);
            const json = JSON.stringify(data, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            const now = new Date();
            const parts = new Intl.DateTimeFormat('en-CA', {
                timeZone: 'UTC', year: 'numeric', month: '2-digit', day: '2-digit',
                hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
            }).formatToParts(now).reduce((values, part) => ({ ...values, [part.type]: part.value }), {});
            a.href = url;
            a.download = `${this.t('backupFilename')}_${parts.year}${parts.month}${parts.day}_${parts.hour}${parts.minute}${parts.second}.json`;
            a.rel = 'noopener';
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(url), 60_000);
            if (setLastBackup) {
                try { localStorage.setItem('timerhubLastBackupAt', String(Date.now())); } catch { /* ignore */ }
                this.updateBackupStatusTexts();
            }
            return true;
        } catch (error) {
            this.diagnostics?.error('backup', 'export-data', error, { status: 'failed' });
            throw error;
        }
    }

    renderDiagnostics() {
        if (!this.diagnostics) return;
        const list = document.getElementById('diagnosticsList');
        if (!list) return;
        const entries = this.diagnostics.list({ limit: 30 });
        list.replaceChildren();
        if (!entries.length) {
            const empty = document.createElement('p');
            empty.className = 'settings-help';
            empty.textContent = this.t('diagnosticsEmpty');
            list.appendChild(empty);
            return;
        }
        entries.forEach(entry => {
            const item = document.createElement('div');
            item.className = `diagnostic-entry level-${entry.level}`;
            item.setAttribute('role', 'listitem');
            const meta = document.createElement('div');
            meta.className = 'diagnostic-meta';
            const category = document.createElement('span');
            category.className = 'diagnostic-category';
            category.textContent = `${entry.category} · ${entry.operation}`;
            const time = document.createElement('time');
            time.dateTime = new Date(entry.timestamp).toISOString();
            time.textContent = this.formatSnapshotDate(entry.timestamp);
            meta.append(category, time);
            const message = document.createElement('p');
            message.className = 'diagnostic-message';
            message.textContent = entry.message || entry.level;
            const status = document.createElement('p');
            status.className = 'diagnostic-status';
            status.textContent = entry.status;
            item.append(meta, message, status);
            list.appendChild(item);
        });
    }

    async exportDiagnosticsFile() {
        try {
            const payload = this.diagnostics?.exportPayload?.() || { entries: [] };
            const json = JSON.stringify(payload, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `timerhub_diagnostics_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
            a.rel = 'noopener';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(url), 60_000);
            return true;
        } catch (error) {
            this.showToast(this.t('diagnosticsExportFailed'));
            return false;
        }
    }

    refreshMissingDataWarning() {
        const warning = document.getElementById('missingDataWarning');
        const localHasData = this.hasLocalWorkData();
        const latest = this.latestExternalBackup || this.externalBackups?.[0] || null;
        const counts = latest?.meta?.counts || {};
        const externalHasData = Number(counts.activities || 0) + Number(counts.timeEntries || 0) + Number(counts.groups || 0) > 0;
        let dismissedAt = 0;
        try { dismissedAt = Number(localStorage.getItem('timerhubExternalEmptyWarningDismissedAt') || 0); } catch { dismissedAt = 0; }
        const externalSuspicious = !localHasData && externalHasData && Number(latest?.createdAt || 0) > dismissedAt;
        const shouldShow = this.missingDataSuspected || externalSuspicious;
        if (warning) warning.style.display = shouldShow ? 'block' : 'none';
        const externalButton = document.getElementById('missingDataRestoreExternalBtn');
        if (externalButton) {
            externalButton.hidden = !latest;
            if (latest) externalButton.textContent = this.t('missingDataRestoreExternal');
        }
        if (this.missingDataSuspected) this.updateDataPresenceMarker();
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
        this.shapeOrder = this.normalizeShapeOrder(await this.storage.getSetting('activityShapeOrder', null));
        this.showActivityAssignments =
            await this.storage.getSetting('showActivityAssignments', false) === true;
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
                .map(group => {
                    const normalized = {
                        id: String(group.id || this.generateId()),
                        name: String(group.name || ''),
                        // Group creation and dragging both snap anchors to the
                        // shared canvas grid. Normalize legacy records and write
                        // the corrected coordinates back below.
                        x: this.snapToCanvasGrid(this.clampCanvasCoordinate(group.x, 0, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY)),
                        y: this.snapToCanvasGrid(this.clampCanvasCoordinate(group.y, 0, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY)),
                        collapsed: group.collapsed === true
                    };
                    // Persistent collapsed dimensions are independent of the
                    // expanded content; older records fall back to the defaults.
                    if (group.collapsedWidth !== undefined && group.collapsedWidth !== null) {
                        normalized.collapsedWidth = this.ceilToCanvasGrid(this.clampCanvasCoordinate(
                            group.collapsedWidth,
                            CANVAS_GROUP_COLLAPSED_WIDTH,
                            CANVAS_GROUP_COLLAPSED_MIN_WIDTH,
                            CANVAS_GROUP_COLLAPSED_MAX_WIDTH
                        ));
                    }
                    if (group.collapsedHeight !== undefined && group.collapsedHeight !== null) {
                        normalized.collapsedHeight = this.ceilToCanvasGrid(this.clampCanvasCoordinate(
                            group.collapsedHeight,
                            CANVAS_GROUP_COLLAPSED_HEIGHT,
                            CANVAS_GROUP_COLLAPSED_MIN_HEIGHT,
                            CANVAS_GROUP_COLLAPSED_MAX_HEIGHT
                        ));
                    }
                    if (typeof group.color === 'string' && /^#[0-9a-f]{6}$/i.test(group.color)) {
                        normalized.color = group.color.toLowerCase();
                    }
                    if (typeof group.parentId === 'string' && group.parentId) {
                        normalized.parentId = group.parentId;
                    }
                    // Optional default customer for newly created activities.
                    // Absent on legacy groups, which keep behaving as before.
                    const defaultCustomerId = this.normalizeClockodoId(group.defaultCustomerId);
                    if (defaultCustomerId) {
                        normalized.defaultCustomerId = defaultCustomerId;
                        if (typeof group.defaultCustomerName === 'string' && group.defaultCustomerName.trim()) {
                            normalized.defaultCustomerName = group.defaultCustomerName.trim();
                        }
                    }
                    // Assignment provenance must survive a reload: replace-mode
                    // imports and later saves need it to stay intact.
                    if (typeof group.assignment === 'string' && group.assignment) {
                        normalized.assignment = group.assignment;
                    }
                    if (Number.isFinite(Number(group.importedAt))) {
                        normalized.importedAt = Number(group.importedAt);
                    }
                    return normalized;
                })
            : [];
        this.sanitizeGroupParents();
        this.resetGroupExpansionState();
        await this.migrateActivityCanvasGeometry();

        if (Array.isArray(groups)) {
            const normalizedById = new Map(this.groups.map(group => [group.id, group]));
            const migrated = [];
            for (const original of groups) {
                if (!original || typeof original !== 'object' || original.id === undefined || original.id === null) continue;
                const normalized = normalizedById.get(String(original.id));
                if (!normalized) continue;
                const xChanged = typeof original.x !== 'number' || !Number.isFinite(original.x)
                    || original.x !== normalized.x;
                const yChanged = typeof original.y !== 'number' || !Number.isFinite(original.y)
                    || original.y !== normalized.y;
                const widthChanged = normalized.collapsedWidth !== undefined
                    && (typeof original.collapsedWidth !== 'number'
                        || !Number.isFinite(original.collapsedWidth)
                        || original.collapsedWidth !== normalized.collapsedWidth);
                const heightChanged = normalized.collapsedHeight !== undefined
                    && (typeof original.collapsedHeight !== 'number'
                        || !Number.isFinite(original.collapsedHeight)
                        || original.collapsedHeight !== normalized.collapsedHeight);
                if (!xChanged && !yChanged && !widthChanged && !heightChanged) continue;
                // Preserve every unrelated persisted field by updating a copy of
                // the original record instead of writing the normalized view.
                const migratedGroup = { ...original, x: normalized.x, y: normalized.y };
                if (widthChanged) migratedGroup.collapsedWidth = normalized.collapsedWidth;
                if (heightChanged) migratedGroup.collapsedHeight = normalized.collapsedHeight;
                migrated.push(migratedGroup);
            }
            if (migrated.length) {
                try {
                    if (typeof this.storage.saveGroups === 'function') {
                        await this.storage.saveGroups(migrated);
                    } else {
                        for (const group of migrated) await this.storage.saveGroup?.(group);
                    }
                } catch (error) {
                    console.warn('TimerHub group grid migration failed:', error);
                }
            }
        }
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
        const rawStart = Number(raw.startTimestamp);
        const startTimestamp = Number.isFinite(rawStart) && rawStart > 0 ? rawStart : null;
        const hasEndValue = raw.endTimestamp !== null && raw.endTimestamp !== undefined;
        const rawEnd = hasEndValue ? Number(raw.endTimestamp) : null;
        const endTimestamp = !hasEndValue ? null
            : Number.isFinite(rawEnd) && rawEnd > 0 ? rawEnd
            : null;
        const timeDataInvalid = startTimestamp === null || (hasEndValue && endTimestamp === null);

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
            projectId: this.normalizeClockodoId(raw.projectId),
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
            clockodoErrorDetails: this.normalizeClockodoErrorDetails(raw.clockodoErrorDetails),
            timeDataInvalid
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
            projectId: this.normalizeClockodoId(data.projectId),
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
        if (entry.activityId !== undefined && entry.activityId !== null && typeof entry.activityId !== 'string') {
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
        if (!entry || !Number.isFinite(Number(entry.startTimestamp)) || Number(entry.startTimestamp) <= 0) return '';
        return this.toDateString(new Date(Number(entry.startTimestamp)));
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

    roundToFiveMinutes(timestamp) {
        const value = Number(timestamp);
        if (!Number.isFinite(value)) return value;
        const client = this.clockodoClient;
        if (client && typeof client.roundToNearestFiveMinutes === 'function') {
            return client.roundToNearestFiveMinutes(value);
        }
        if (typeof ClockodoClient !== 'undefined' && typeof ClockodoClient.roundToNearestFiveMinutes === 'function') {
            return ClockodoClient.roundToNearestFiveMinutes(value);
        }
        return value;
    }

    entryInterval(entry) {
        const start = Number(entry?.startTimestamp);
        if (!Number.isFinite(start) || start <= 0) return null;
        const rawEnd = entry?.endTimestamp;
        const end = rawEnd === null || rawEnd === undefined ? Infinity : Number(rawEnd);
        if (end !== Infinity && (!Number.isFinite(end) || end <= 0 || end <= start)) return null;
        // Overlap validation uses exactly the boundaries that Clockodo will
        // receive, including its five-minute rounding. This keeps the red
        // conflict state aligned with the actual synchronized payload.
        return {
            start: this.roundToFiveMinutes(start),
            end: end === Infinity ? Infinity : this.roundToFiveMinutes(end)
        };
    }

    entriesOverlap(first, second) {
        const a = this.entryInterval(first);
        const b = this.entryInterval(second);
        if (!a || !b) return false;
        return a.start < b.end && a.end > b.start;
    }

    getOverlappingEntryIds(entries = this.timeEntries) {
        const overlapping = new Set();
        const list = Array.isArray(entries) ? entries.filter(Boolean) : [];
        for (let i = 0; i < list.length; i++) {
            for (let j = i + 1; j < list.length; j++) {
                const first = list[i];
                const second = list[j];
                if (String(first.id) === String(second.id)) continue;
                if (this.entriesOverlap(first, second)) {
                    overlapping.add(String(first.id));
                    overlapping.add(String(second.id));
                }
            }
        }
        return overlapping;
    }

    getSuspiciousEntries(dateString) {
        const entries = this.getDayEntries(dateString);
        const suspicious = [];

        for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];
            const issues = [];
            const startValue = Number(entry.startTimestamp);
            const startValid = Number.isFinite(startValue) && startValue > 0;
            const endValue = entry.endTimestamp;
            const hasEndValue = endValue !== null && endValue !== undefined;
            const endValid = !hasEndValue || (Number.isFinite(Number(endValue)) && Number(endValue) > 0);

            if (!startValid || !endValid) {
                issues.push('invalidTime');
            } else if (endValue === null) {
                issues.push('running');
            } else {
                const duration = Number(endValue) - startValue;
                if (duration <= 0) {
                    issues.push('zeroDuration');
                } else if (duration > 16 * 60 * 60 * 1000) {
                    issues.push('unusuallyLong');
                }

                for (let j = 0; j < entries.length; j++) {
                    if (i === j) continue;
                    const other = entries[j];
                    // A stale duplicate of the same record is not a real
                    // overlap; the ID is the stable identity used everywhere
                    // else for conflict detection.
                    if (String(other.id) === String(entry.id)) continue;
                    if (other.endTimestamp !== null && this.entriesOverlap(entry, other)) {
                        issues.push('overlapping');
                        break;
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
        if (entryData.activityId) {
            const activity = this.activities.find(item => item.id === entryData.activityId)
                || this.archivedActivities?.find(item => item.id === entryData.activityId);
            if (activity) {
                if (entryData.customerId === undefined) entryData.customerId = activity.customerId || '';
                if (entryData.serviceId === undefined) entryData.serviceId = activity.serviceId || '';
                if (entryData.customerName === undefined) entryData.customerName = activity.customerName || '';
                if (entryData.serviceName === undefined) entryData.serviceName = activity.serviceName || '';
                if (entryData.projectId === undefined) entryData.projectId = activity.projectId || '';
                if (entryData.projectName === undefined) entryData.projectName = activity.projectName || '';
                if (entryData.project === undefined) entryData.project = activity.projectName || activity.project || '';
            }
        }
        const entry = this.createTimeEntry(entryData);
        const validation = this.validateTimeEntry(entry);
        if (!validation.valid) {
            throw new Error(`Invalid entry: ${validation.error}`);
        }
        await this.storage.saveTimeEntry(entry);
        const existingIndex = this.timeEntries.findIndex(item => String(item.id) === String(entry.id));
        if (existingIndex >= 0) this.timeEntries[existingIndex] = entry;
        else this.timeEntries.push(entry);
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
            merged.projectId !== existing.projectId ||
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

        await this.storage.saveTimeEntry(normalized);
        const currentIndex = this.timeEntries.findIndex(item => String(item.id) === String(id));
        if (currentIndex >= 0) this.timeEntries[currentIndex] = normalized;
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
            projectId: entry.projectId,
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
        const removed = this.timeEntries[index];
        await this.storage.deleteTimeEntry(id);
        this.timeEntries = this.timeEntries.filter(item => String(item.id) !== String(id));
        return removed;
    }

    activityAssignmentForEntry(activityId, activityList = null) {
        const id = String(activityId ?? '');
        if (!id) return { status: 'unresolved' };
        const list = Array.isArray(activityList)
            ? activityList
            : [...(this.activities || []), ...(this.archivedActivities || [])];
        const candidates = list.filter(activity => activity && String(activity.id) === id);
        if (!candidates.length) return { status: 'unresolved' };
        const projects = candidates.map(activity => ({
            projectId: this.normalizeClockodoId(activity.projectId),
            projectName: typeof activity.projectName === 'string'
                ? activity.projectName.trim()
                : typeof activity.project === 'string'
                    ? activity.project.trim()
                    : ''
        })).filter(project => project.projectId || project.projectName);
        if (!projects.length) return { status: 'empty' };
        const projectIds = [...new Set(projects.map(project => project.projectId).filter(Boolean))];
        const projectNames = [...new Set(projects.map(project => project.projectName).filter(Boolean)
            .map(name => name.toLowerCase()))];
        if (projectIds.length > 1 || projectNames.length > 1) return { status: 'conflict' };
        return {
            status: 'resolved',
            projectId: projectIds[0] || null,
            projectName: projects.find(project => project.projectName)?.projectName || ''
        };
    }

    async migrateDayReviewProjectAssignments(rawEntries = []) {
        const markerKey = 'dayReviewProjectAssignmentMigration';
        const currentVersion = Number(await this.storage.getSetting(markerKey, 0)) || 0;
        if (currentVersion >= DAY_REVIEW_PROJECT_MIGRATION_VERSION) {
            return { migrated: 0, conflicts: [], unresolved: [] };
        }
        if (!this.timeEntries.length) {
            return { migrated: 0, conflicts: [], unresolved: [] };
        }

        let activityList = [...(this.activities || []), ...(this.archivedActivities || [])];
        if (!activityList.length && typeof this.storage.getActivities === 'function') {
            try {
                const storedActivities = await this.storage.getActivities();
                if (Array.isArray(storedActivities)) activityList = storedActivities;
            } catch (error) {
                console.warn('TimerHub project assignment migration could not read activities:', error);
            }
        }
        const needsInference = entry => !this.normalizeClockodoId(entry.projectId)
            && !String(entry.project || '').trim();
        if (!activityList.length && this.timeEntries.some(needsInference)) {
            // Do not mark the migration complete before activities are available.
            return { migrated: 0, conflicts: [], unresolved: this.timeEntries.filter(needsInference).map(entry => entry.id) };
        }

        const migrated = [];
        const conflicts = [];
        const unresolved = [];
        this.timeEntries.forEach((entry, index) => {
            if (!String(entry.activityId || '').trim()) return;
            const currentProjectId = this.normalizeClockodoId(entry.projectId);
            const currentProjectName = String(entry.project || '').trim();
            if (currentProjectId) {
                if (!currentProjectName) {
                    const source = this.activityAssignmentForEntry(entry.activityId, activityList);
                    if (source.status === 'resolved' && source.projectId === currentProjectId && source.projectName) {
                        const updated = { ...entry, project: source.projectName };
                        migrated.push({ index, entry: updated, previous: entry });
                    }
                }
                return;
            }
            if (currentProjectName) {
                const source = this.activityAssignmentForEntry(entry.activityId, activityList);
                const sameName = source.status === 'resolved' && source.projectName
                    && source.projectName.toLowerCase() === currentProjectName.toLowerCase();
                const sameId = source.status === 'resolved' && source.projectId
                    && source.projectId === currentProjectName;
                if ((sameName || sameId) && source.projectId) {
                    const updated = {
                        ...entry,
                        projectId: source.projectId,
                        project: source.projectName || currentProjectName
                    };
                    migrated.push({ index, entry: updated, previous: entry });
                }
                return;
            }
            const source = this.activityAssignmentForEntry(entry.activityId, activityList);
            if (source.status === 'conflict') {
                conflicts.push({ entryId: entry.id, activityId: entry.activityId });
                return;
            }
            if (source.status === 'unresolved') {
                unresolved.push({ entryId: entry.id, activityId: entry.activityId });
                return;
            }
            if (source.status !== 'resolved') return;
            const updated = {
                ...entry,
                projectId: source.projectId,
                project: source.projectName || ''
            };
            migrated.push({ index, entry: updated, previous: entry });
        });

        const errors = [];
        const applied = [];
        for (const change of migrated) {
            const raw = Array.isArray(rawEntries) && rawEntries[change.index]
                ? rawEntries[change.index]
                : change.entry;
            try {
                await this.storage.saveTimeEntry({
                    ...raw,
                    projectId: change.entry.projectId,
                    project: change.entry.project
                });
                // Update memory only after the write succeeds. A failed
                // migration must not leave the UI with unsaved assignments.
                if (this.timeEntries[change.index] === change.previous) {
                    this.timeEntries[change.index] = change.entry;
                    applied.push(change);
                }
            } catch (error) {
                errors.push(change.entry.id);
                this.diagnostics?.warn('dayReview', 'project-assignment-migration', error, {
                    status: 'failed', details: { entryId: change.entry.id }
                });
            }
        }
        migrated.splice(0, migrated.length, ...applied);
        if (!errors.length) {
            try {
                await this.storage.setSetting(markerKey, DAY_REVIEW_PROJECT_MIGRATION_VERSION);
            } catch (error) {
                console.warn('TimerHub project assignment migration marker could not be saved:', error);
            }
        }
        if (conflicts.length) {
            console.warn('TimerHub project assignment migration skipped conflicting entries:', conflicts);
        }
        if (unresolved.length) {
            console.warn('TimerHub project assignment migration could not find activities for entries:', unresolved);
        }
        const result = { migrated: migrated.length, conflicts, unresolved };
        this.projectAssignmentMigration = result;
        return result;
    }

    async loadTimeEntries({ runMigration = true } = {}) {
        const rawEntries = await this.storage.getTimeEntries() || [];
        this._rawTimeEntries = rawEntries;
        this.timeEntries = rawEntries.map(e => this.normalizeTimeEntry(e));
        const invalidEntries = this.timeEntries.filter(entry => entry.timeDataInvalid);
        if (invalidEntries.length) {
            this.diagnostics?.warn('dayReview', 'load-time-entries', 'invalid_time_data_preserved', {
                status: 'failed',
                details: { count: invalidEntries.length, entryIds: invalidEntries.slice(0, 10).map(entry => entry.id) }
            });
        }
        this.syncBatches = this.storage.getSyncBatches
            ? await this.storage.getSyncBatches()
            : [];
        if (runMigration) await this.migrateDayReviewProjectAssignments(rawEntries);
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
        this.syncCanvasToolbarLayout();
        window.addEventListener?.('resize', () => this.syncCanvasToolbarLayout());
        window.addEventListener?.('orientationchange', () => this.syncCanvasToolbarLayout());
        window.addEventListener?.('online', () => {
            this.refreshClockodoConnectionOnStartup({ silent: true }).catch(error => {
                this.diagnostics?.warn('clockodo', 'online-connection-check', error, { status: 'failed' });
            });
        });

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

        // Secure day exchange
        sel('reviewImportDayBtn')?.addEventListener('click', () => this.showDayImportModal());
        sel('reviewShareDayBtn')?.addEventListener('click', () => this.shareDayExchange());
        sel('reviewShareLinkBtn')?.addEventListener('click', () => this.openShareLinkModal());
        sel('shareLinkCloseBtn')?.addEventListener('click', () => this.closeShareLinkModal());
        sel('shareLinkCancelBtn')?.addEventListener('click', () => this.closeShareLinkModal());
        sel('shareLinkCreateBtn')?.addEventListener('click', () => this.createShareLink());
        sel('shareLinkCopyBtn')?.addEventListener('click', () => this.copyShareLink());
        sel('shareLinkSendBtn')?.addEventListener('click', () => this.sendShareLink());
        sel('shareLinkExpirySelect')?.addEventListener('change', () => this.updateShareLinkSummary());
        sel('shareLinkEntryList')?.addEventListener('change', event => {
            const input = event.target;
            if (!input?.dataset?.shareEntry) return;
            this.setShareLinkEntrySelected(Number(input.dataset.shareEntry), input.checked);
        });
        sel('sharedDayCloseBtn')?.addEventListener('click', () => this.closeSharedDayModal());
        sel('sharedDayImportBtn')?.addEventListener('click', () => this.initiateSharedImport());
        sel('sharedDayRetryBtn')?.addEventListener('click', () => this.initiateSharedImport());
        sel('sharedDayConfigureBtn')?.addEventListener('click', () => this.initiateSharedImport());
        sel('dayExportCloseBtn')?.addEventListener('click', () => this.closeDayExportModal());
        sel('exchangeCopyCodeBtn')?.addEventListener('click', () => this.copyTransferCode());
        sel('exchangeShowQrBtn')?.addEventListener('click', () => this.showExchangeQr());
        sel('exchangeQrCloseBtn')?.addEventListener('click', () => this.closeExchangeQr());
        sel('exchangeQrDoneBtn')?.addEventListener('click', () => this.closeExchangeQr());
        sel('dayImportCloseBtn')?.addEventListener('click', () => this.closeDayImportModal());
        sel('dayImportCancelBtn')?.addEventListener('click', () => this.closeDayImportModal());
        sel('exchangeChooseFileBtn')?.addEventListener('click', () => document.getElementById('exchangeFileInput')?.click());
        sel('exchangeFileInput')?.addEventListener('change', event => this.handleExchangeFileSelected(event.target.files?.[0] || null));
        sel('exchangeCodeInput')?.addEventListener('input', () => this.refreshExchangeDecryptState());
        sel('exchangeDecryptBtn')?.addEventListener('click', () => this.decryptExchangeFile());
        sel('exchangeImportBtn')?.addEventListener('click', () => this.confirmExchangeImport());
        sel('exchangeScanQrBtn')?.addEventListener('click', () => this.openExchangeScan());
        sel('exchangeScanCloseBtn')?.addEventListener('click', () => this.closeExchangeScan());
        sel('exchangeScanDoneBtn')?.addEventListener('click', () => this.closeExchangeScan());

        // Work assignment JSON import
        sel('importAssignmentBtn')?.addEventListener('click', () => this.showAssignmentImportModal());
        sel('assignmentImportCloseBtn')?.addEventListener('click', () => this.closeAssignmentImportModal());
        sel('assignmentImportCancelBtn')?.addEventListener('click', () => this.closeAssignmentImportModal());
        sel('assignmentChooseFileBtn')?.addEventListener('click', () => document.getElementById('assignmentFileInput')?.click());
        sel('assignmentFileInput')?.addEventListener('change', event => this.handleAssignmentFileSelected(event.target.files?.[0] || null));
        sel('assignmentCopyPromptBtn')?.addEventListener('click', () => this.copyAssignmentPrompt());
        sel('assignmentValidateBtn')?.addEventListener('click', () => this.validateAssignmentJson());
        sel('assignmentImportConfirmBtn')?.addEventListener('click', () => this.confirmAssignmentImport());

        // Clockodo settings
        sel('clockodoToggleKeyBtn')?.addEventListener('click', () => this.toggleClockodoKeyVisibility());
        sel('clockodoSaveBtn')?.addEventListener('click', () => this.saveClockodoSettings());
        sel('clockodoTestBtn')?.addEventListener('click', () => this.testClockodoConnection());
        sel('clockodoRemoveBtn')?.addEventListener('click', () => this.removeClockodoSettings());

        // Add activity button
        sel('addActivityBtn')?.addEventListener('click', () => this.showActivityModal());
        sel('activityAssignmentsToggleBtn')?.addEventListener('click', () => this.toggleActivityAssignments());

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
        sel('groupEditModalCloseBtn')?.addEventListener('click', () => this.closeGroupEditModal());
        sel('groupEditCancelBtn')?.addEventListener('click', () => this.closeGroupEditModal());
        sel('groupEditSaveBtn')?.addEventListener('click', () => this.saveGroupEdit());
        sel('createGroupFromGroupsBtn')?.addEventListener('click', () => this.createGroupFromSelectedGroups());
        sel('deleteGroupsBtn')?.addEventListener('click', () => this.openGroupDeleteModal());
        sel('groupDeleteModalCloseBtn')?.addEventListener('click', () => this.closeGroupDeleteModal());
        sel('groupDeleteCancelBtn')?.addEventListener('click', () => this.closeGroupDeleteModal());
        sel('groupDeleteConfirmBtn')?.addEventListener('click', () => this.deleteSelectedGroups());
        for (const [id, field, value] of [
            ['groupDeleteActivitiesKeep', 'activities', 'keep'],
            ['groupDeleteActivitiesDelete', 'activities', 'delete'],
            ['groupDeleteNestedKeep', 'nested', 'keep'],
            ['groupDeleteNestedDelete', 'nested', 'delete']
        ]) {
            sel(id)?.addEventListener('change', () => {
                if (!this.pendingGroupDeletion) return;
                this.pendingGroupDeletion.choices[field] = value;
                this.updateGroupDeleteDialog();
            });
        }
        sel('undoCanvasBtn')?.addEventListener('click', () => this.undoCanvas());
        sel('redoCanvasBtn')?.addEventListener('click', () => this.redoCanvas());
        document.addEventListener?.('keydown', event => this.handleGlobalKeydown(event));
        document.getElementById('groupEditNameInput')?.addEventListener('keydown', event => {
            if (event.key === 'Enter') {
                event.preventDefault();
                this.saveGroupEdit();
            } else if (event.key === 'Escape') {
                event.preventDefault();
                this.closeGroupEditModal();
            }
        });

        // Activity menu modal
        sel('menuCloseBtn')?.addEventListener('click', () => this.closeActivityMenu());
        sel('menuEditBtn')?.addEventListener('click', () => this.editActivity());
        sel('menuDuplicateBtn')?.addEventListener('click', () => this.duplicateActivity());
        sel('menuArchiveBtn')?.addEventListener('click', () => this.archiveActivity());
        sel('menuDeleteBtn')?.addEventListener('click', () => this.deleteActivity());

        // Entry edit modal
        sel('entryEditCloseBtn')?.addEventListener('click', () => this.closeEntryEditModal());
        sel('entryEditCancelBtn')?.addEventListener('click', () => this.closeEntryEditModal());
        sel('entryEditSaveBtn')?.addEventListener('click', () => this.saveTimeEntry());
        sel('entryEditDeleteBtn')?.addEventListener('click', () => this.deleteTimeEntry());
        sel('entryEditActivity')?.addEventListener('change', (e) => {
            this.populateEntryAssignmentForActivity(e.target.value);
        });
        sel('activityClockodoRetryBtn')?.addEventListener('click', () => this.reloadClockodoReferenceData());
        sel('entryEditClockodoRetryBtn')?.addEventListener('click', () => this.reloadClockodoReferenceData());
        sel('groupEditClockodoRetryBtn')?.addEventListener('click', () => this.reloadClockodoReferenceData());
        sel('groupEditCustomerClearBtn')?.addEventListener('click', () => this.clearGroupDefaultCustomer());
        for (const [context, fieldName] of [
            ['activity', 'customer'], ['activity', 'project'], ['activity', 'service'],
            ['entry', 'customer'], ['entry', 'project'], ['entry', 'service'],
            ['group', 'customer']
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
        sel('externalBackupNowBtn')?.addEventListener('click', () => this.manualExternalBackup());
        sel('externalBackupChooseBtn')?.addEventListener('click', () => this.chooseExternalBackupDirectory());
        sel('externalBackupVerifyBtn')?.addEventListener('click', () => this.verifyExternalBackupDirectory());
        sel('externalBackupRefreshBtn')?.addEventListener('click', () => this.updateExternalBackupStatus());
        sel('externalBackupRestoreBtn')?.addEventListener('click', () => this.restoreSelectedExternalBackup());
        sel('externalBackupSelect')?.addEventListener('change', event => {
            const button = document.getElementById('externalBackupRestoreBtn');
            if (button) button.disabled = !event.target.value;
        });
        sel('externalBackupRetentionSelect')?.addEventListener('change', async event => {
            const retention = Math.max(1, Math.min(100, Number(event.target.value) || 20));
            if (this.backupService) this.backupService.retention = retention;
            try {
                await this.storage.setSetting('externalBackupRetention', retention);
            } catch (error) {
                this.diagnostics?.warn('settings', 'save-backup-retention', error, { status: 'failed' });
            }
            this.updateExternalBackupStatus().catch(() => {});
        });
        sel('diagnosticsExportBtn')?.addEventListener('click', () => this.exportDiagnosticsFile());
        sel('diagnosticsClearBtn')?.addEventListener('click', () => {
            this.diagnostics?.clear?.();
            this.renderDiagnostics();
            this.showToast(this.t('diagnosticsCleared'));
        });
        sel('missingDataRestoreExternalBtn')?.addEventListener('click', () => this.restoreLatestExternalBackup());
        sel('automaticSnapshotSelect')?.addEventListener('change', e => {
            const restoreButton = document.getElementById('restoreSnapshotBtn');
            if (restoreButton) restoreButton.disabled = !e.target.value;
        });
        sel('restoreSnapshotBtn')?.addEventListener('click', () => this.restoreSelectedSnapshot());
        sel('backupRestoreCloseBtn')?.addEventListener('click', () => this.cancelPendingRestore());
        sel('backupRestoreCancelBtn')?.addEventListener('click', () => this.cancelPendingRestore());
        sel('backupRestoreEmptyConfirm')?.addEventListener('change', event => this.setEmptyRestoreConfirmation(event.target.checked));
        sel('missingDataRestoreBtn')?.addEventListener('click', () => this.restoreData());
        sel('missingDataDismissBtn')?.addEventListener('click', () => this.dismissMissingDataWarning());
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

        // Activity template (icon) picker
        this.populateIconPicker();

        // Activity display mode (icon-only vs icon + text)
        document.querySelectorAll('.display-mode-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.display-mode-btn').forEach(other => other.classList.remove('selected'));
                btn.classList.add('selected');
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

    normalizeShapeOrder(order) {
        const shapes = Array.isArray(this.SHAPES) ? this.SHAPES : [];
        const known = new Map(shapes.map(shape => [shape.id, shape]));
        const result = [];
        if (Array.isArray(order)) {
            for (const id of order) {
                if (known.has(id) && !result.includes(id)) result.push(id);
            }
        }
        for (const shape of shapes) {
            if (!result.includes(shape.id)) result.push(shape.id);
        }
        return result;
    }

    orderedActivityShapes() {
        const byId = new Map((Array.isArray(this.SHAPES) ? this.SHAPES : []).map(shape => [shape.id, shape]));
        return this.normalizeShapeOrder(this.shapeOrder)
            .map(id => byId.get(id))
            .filter(Boolean);
    }

    defaultActivityShape() {
        return this.normalizeShapeOrder(this.shapeOrder)[0] || 'circle';
    }

    selectActivityShape(shapeId) {
        document.querySelectorAll('.shape-option').forEach(option => {
            option.classList.toggle('selected', option.dataset.shape === shapeId);
        });
    }

    async persistShapeOrder() {
        const picker = document.getElementById('shapePicker');
        if (!picker?.querySelectorAll) return;
        const ids = [...picker.querySelectorAll('.shape-option')].map(option => option.dataset.shape);
        this.shapeOrder = this.normalizeShapeOrder(ids);
        if (this.editingActivityId === null && !this.shapeSelectionTouched) {
            this.selectActivityShape(this.defaultActivityShape());
        }
        try {
            await this.storage.setSetting('activityShapeOrder', this.shapeOrder);
        } catch (error) {
            this.diagnostics?.warn('settings', 'save-shape-order', error, { status: 'failed' });
        }
    }

    bindShapeReorder(button, picker) {
        let pressTimer = null;
        let pointerId = null;
        let touchId = null;
        let startX = 0;
        let startY = 0;
        let active = false;
        let dragging = false;

        const clearTimer = () => {
            if (pressTimer) clearTimeout(pressTimer);
            pressTimer = null;
        };
        const beginDrag = () => {
            dragging = true;
            button.classList.add('dragging');
            picker.classList.add('shape-reordering');
            if (pointerId !== null && pointerId !== 'touch') {
                try { button.setPointerCapture?.(pointerId); } catch { /* ignore */ }
            }
        };
        const reorderAt = (x, y) => {
            const target = document.elementFromPoint?.(x, y)?.closest?.('.shape-option');
            if (!target || target === button || !picker.contains?.(target)) return;
            const rect = target.getBoundingClientRect();
            const insertBefore = x < rect.left + rect.width / 2;
            picker.insertBefore(button, insertBefore ? target : target.nextSibling);
        };
        const finish = () => {
            const wasDragging = dragging;
            active = false;
            dragging = false;
            pointerId = null;
            touchId = null;
            clearTimer();
            button.classList.remove('dragging');
            picker.classList.remove('shape-reordering');
            if (wasDragging) {
                this.shapeDragSuppressClickUntil = Date.now() + 400;
                this.persistShapeOrder();
            }
        };

        // Mouse and pen use pointer events. Touch uses touch events with a
        // non-passive move listener so the long-press drag can cancel native
        // scrolling after it begins.
        button.addEventListener('pointerdown', event => {
            if (event.pointerType === 'touch') return;
            if (event.button !== undefined && event.button !== 0) return;
            pointerId = event.pointerId;
            startX = event.clientX;
            startY = event.clientY;
            active = true;
            dragging = false;
        });
        button.addEventListener('pointermove', event => {
            if (!active || pointerId === 'touch' || event.pointerId !== pointerId) return;
            const distance = Math.hypot(event.clientX - startX, event.clientY - startY);
            if (!dragging) {
                if (distance < 8) return;
                beginDrag();
            }
            event.preventDefault();
            reorderAt(event.clientX, event.clientY);
        });
        button.addEventListener('pointerup', event => {
            if (!active || pointerId === 'touch' || event.pointerId !== pointerId) return;
            finish();
        });
        button.addEventListener('pointercancel', () => {
            if (!active || pointerId === 'touch') return;
            finish();
        });

        button.addEventListener('touchstart', event => {
            if (event.touches?.length !== 1) return;
            const touch = event.touches[0];
            touchId = touch.identifier;
            startX = touch.clientX;
            startY = touch.clientY;
            active = true;
            dragging = false;
            pressTimer = setTimeout(() => {
                if (!active || dragging) return;
                beginDrag();
            }, 300);
        }, { passive: true });
        button.addEventListener('touchmove', event => {
            if (!active || touchId === null) return;
            const touch = Array.from(event.touches || []).find(item => item.identifier === touchId);
            if (!touch) return;
            const distance = Math.hypot(touch.clientX - startX, touch.clientY - startY);
            if (!dragging) {
                if (distance < 8) return;
                // The user is scrolling the picker, not reordering it.
                active = false;
                clearTimer();
                return;
            }
            event.preventDefault();
            reorderAt(touch.clientX, touch.clientY);
        }, { passive: false });
        button.addEventListener('touchend', finish, { passive: true });
        button.addEventListener('touchcancel', finish, { passive: true });
        button.addEventListener('contextmenu', event => event.preventDefault());
    }

    populateShapePicker() {
        const picker = document.getElementById('shapePicker');
        if (!picker) return;
        picker.replaceChildren?.();
        this.orderedActivityShapes().forEach(shape => {
            const btn = document.createElement('button');
            btn.type = 'button';
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
            btn.addEventListener('click', event => {
                if (Date.now() < (this.shapeDragSuppressClickUntil || 0)) {
                    event.preventDefault();
                    return;
                }
                this.shapeSelectionTouched = true;
                this.selectActivityShape(shape.id);
            });
            this.bindShapeReorder(btn, picker);
            picker.appendChild(btn);
        });
    }

    activityIcon(iconId) {
        if (!iconId) return null;
        return (this.ACTIVITY_ICONS || []).find(icon => icon.id === iconId) || null;
    }

    buildIconSvg(icon, className = '') {
        if (!icon || typeof document.createElementNS !== 'function') return null;
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('aria-hidden', 'true');
        if (className) svg.classList.add(className);
        for (const item of icon.elements || []) {
            const element = document.createElementNS('http://www.w3.org/2000/svg', item.tag);
            for (const [name, value] of Object.entries(item.attrs || {})) {
                element.setAttribute(name, value);
            }
            svg.appendChild(element);
        }
        return svg;
    }

    populateIconPicker() {
        const picker = document.getElementById('iconPicker');
        if (!picker) return;
        picker.replaceChildren();
        const options = [{ id: '', key: 'iconNone', elements: [{ tag: 'path', attrs: { d: 'M5 12h14' } }] }]
            .concat(this.ACTIVITY_ICONS);
        for (const icon of options) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'icon-option';
            btn.dataset.icon = icon.id;
            btn.dataset.i18nTitle = icon.key;
            btn.dataset.i18nAriaLabel = icon.key;
            btn.setAttribute('aria-label', this.t(icon.key));
            btn.title = this.t(icon.key);
            const svg = this.buildIconSvg(icon, 'icon-option-svg');
            if (svg) btn.appendChild(svg);
            const label = document.createElement('span');
            label.className = 'icon-option-label';
            label.dataset.i18n = icon.key;
            label.textContent = this.t(icon.key);
            btn.appendChild(label);
            btn.addEventListener('click', () => {
                document.querySelectorAll('.icon-option').forEach(option => option.classList.remove('selected'));
                btn.classList.add('selected');
                this.applyIconServiceMapping(icon.id);
            });
            picker.appendChild(btn);
        }
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

        const tick = () => {
            if (document.hidden) return;
            this.updateTimerStatus();
            if (this.activeActivityId) {
                const btn = document.querySelector(`[data-activity-id="${this.activeActivityId}"]`);
                if (!btn) return;
                const durationElement = btn.querySelector('.btn-duration');
                if (durationElement) {
                    durationElement.textContent = this.formatDuration(this.getActiveDuration());
                }
            }
        };
        this.uiUpdateInterval = setInterval(tick, 1000);

        if (!this.visibilityHandlerReady) {
            this.visibilityHandlerReady = true;
            document.addEventListener?.('visibilitychange', () => {
                if (document.hidden) {
                    this.storage.flushAutomaticSnapshot().catch(() => {});
                    if (this.pendingAutoBackupRevision !== null) {
                        this.flushExternalBackup().catch(() => {});
                    }
                } else {
                    tick();
                }
            });
        }
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

        const issueKeys = { running: this.t('issueRunning'), zeroDuration: this.t('issueZeroDuration'), overlapping: this.t('issueOverlapping'), unusuallyLong: this.t('issueUnusuallyLong'), invalidTime: this.t('issueInvalidTime') };
        const overlappingIds = this.getOverlappingEntryIds(entries);
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
            const gapStartRaw = Number(previous?.endTimestamp);
            const gapEndRaw = Number(entry.startTimestamp);
            const hasRawGap = previous?.endTimestamp !== null && previous?.endTimestamp !== undefined &&
                Number.isFinite(gapStartRaw) && Number.isFinite(gapEndRaw) &&
                gapEndRaw - gapStartRaw >= 4 * 60 * 1000;
            const gapStart = hasRawGap ? this.roundToFiveMinutes(gapStartRaw) : null;
            const gapEnd = hasRawGap ? this.roundToFiveMinutes(gapEndRaw) : null;
            const gap = hasRawGap && gapEnd > gapStart
                ? `<div class="review-gap" aria-label="${this.t('gap')}"><span>${this.t('gap')}</span><time>${this.escapeHtml(this.formatTime(gapStart))}–${this.escapeHtml(this.formatTime(gapEnd))}</time><strong>${this.formatDuration(gapEnd - gapStart)}</strong><button class="review-gap-add" type="button" data-gap-start="${this.escapeHtml(gapStart)}" data-gap-end="${this.escapeHtml(gapEnd)}" aria-label="${this.escapeHtml(`${this.t('add')}: ${this.t('gap')} ${this.formatTime(gapStart)}–${this.formatTime(gapEnd)}`)}">${this.t('add')}</button></div>`
                : '';
            const assignmentTags = [
                { key: 'customer', value: entry.customerName || (entry.customerId ? `#${entry.customerId}` : '') },
                { key: 'project', value: entry.project || (entry.projectId ? `#${entry.projectId}` : '') },
                { key: 'service', value: entry.serviceName || entry.service || (entry.serviceId ? `#${entry.serviceId}` : '') }
            ].filter(tag => tag.value);
            const assignmentHtml = assignmentTags.length
                ? `<div class="review-entry-tags">${assignmentTags.map(tag => `<span class="review-tag"><span class="review-tag-label">${this.escapeHtml(this.t(tag.key))}</span>${this.escapeHtml(tag.value)}</span>`).join('')}</div>`
                : '';
            const notes = entry.notes ? `<div class="review-entry-notes">${this.escapeHtml(entry.notes)}</div>` : '';
            const issueText = issues.map(issue => issueKeys[issue]).filter(Boolean).join(' · ');
            const isConflict = overlappingIds.has(String(entry.id));
            const conflictNote = isConflict && !issues.includes('overlapping')
                ? `<small class="review-conflict-note">${this.escapeHtml(this.t('overlappingEntry'))}</small>`
                : '';
            const batch = entry.syncBatchId ? this.syncBatches.find(item => item.id === entry.syncBatchId) : null;
            const activityLabel = activity?.name || entry.activityNameSnapshot || this.t('noActivity');
            const retryButton = entry.syncStatus === SYNC_STATUS.FAILED && batch
                ? `<button class="review-action-btn review-retry-entry" type="button" data-batch-id="${this.escapeHtml(batch.id)}" data-entry-id="${this.escapeHtml(entry.id)}" aria-label="${this.escapeHtml(`${this.t('retry')}: ${activityLabel}`)}"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M20 7v5h-5M4.8 9a7.5 7.5 0 0 1 12.7-2L20 12M4 17v-5h5m10.2 3a7.5 7.5 0 0 1-12.7 2L4 12"/></svg>${this.t('retry')}</button>`
                : '';
            const resendUnknownButton = entry.syncStatus === SYNC_STATUS.UNKNOWN && batch
                ? `<button class="review-action-btn review-resend-unknown" type="button" data-entry-id="${this.escapeHtml(entry.id)}" aria-label="${this.escapeHtml(`${this.t('resendSyncBtn')}: ${activityLabel}`)}"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M20 7v5h-5M4.8 9a7.5 7.5 0 0 1 12.7-2L20 12M4 17v-5h5m10.2 3a7.5 7.5 0 0 1-12.7 2L4 12"/></svg>${this.t('resendSyncBtn')}</button>`
                : '';
            const unknownNotice = entry.syncStatus === SYNC_STATUS.UNKNOWN ? `<small>${this.t('syncOutcomeUnknown')}</small>` : '';
            const localOnlyNotice = entry.syncStatus === SYNC_STATUS.LOCAL_ONLY ? `<small>${this.t('syncLocalOnlyNotice')}</small>` : '';
            const errorNotice = entry.clockodoError && entry.syncStatus === SYNC_STATUS.FAILED
                ? `<small>${this.escapeHtml(this.clockodoErrorMessage({ code: entry.clockodoError, details: entry.clockodoErrorDetails }))}</small>`
                : '';
            const retryDiagnostic = this.retryDiagnostic && !this.retryDiagnostic.pending && String(this.retryDiagnostic.entryId) === String(entry.id)
                ? this.renderRetryDiagnostic(this.retryDiagnostic)
                : '';
            const editIcon = `<span class="review-edit-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m4 16.5-.8 4.3 4.3-.8L19 8.5 15.5 5 4 16.5Z"/><path d="m13.5 7 3.5 3.5"/></svg></span>`;
            const addActivityButton = `<button class="review-action-btn review-add-activity" type="button" data-entry-id="${this.escapeHtml(entry.id)}" aria-label="${this.escapeHtml(`${this.t('addActivityFromReview')}: ${activityLabel}`)}" title="${this.escapeHtml(this.t('addActivityFromReview'))}"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></button>`;
            const locked = entry.syncStatus === SYNC_STATUS.CONFIRMED || entry.syncStatus === SYNC_STATUS.SYNCING;
            return `${gap}<article class="review-entry-card${issues.length ? ' suspicious-entry' : ''}${isConflict ? ' conflict-entry' : ''}${locked ? ' review-entry-locked' : ''}" data-entry-id="${this.escapeHtml(entry.id)}" role="button" tabindex="0" aria-label="${this.escapeHtml(`${this.t('edit')}: ${activityLabel}`)}"${locked ? ' aria-disabled="true"' : ''}>
                <div class="review-entry-header">
                <div class="review-entry-times"><strong>${this.escapeHtml(start)}</strong><span>–</span><strong>${this.escapeHtml(end)}</strong></div>
                <span class="review-entry-duration">${this.escapeHtml(duration)}</span></div>
                <div class="review-entry-title"><span class="review-activity-dot" style="background-color:${this.escapeHtml(activity?.color || '#27AE60')}"></span>${this.escapeHtml(activityLabel)}</div>
                ${assignmentHtml}${notes}${issueText ? `<small>${this.escapeHtml(issueText)}</small>` : ''}${conflictNote}${errorNotice}${unknownNotice}${localOnlyNotice}
                <div class="review-entry-footer"><span class="sync-badge ${this.escapeHtml(entry.syncStatus)}">${this.escapeHtml(status)}</span><div class="review-entry-actions">${retryButton}${resendUnknownButton}${addActivityButton}${editIcon}</div></div>${retryDiagnostic}
            </article>`;
        }).join('');
        list.querySelectorAll('.review-entry-card').forEach(card => {
            const entryId = card.dataset.entryId;
            const entry = this.timeEntries.find(item => String(item.id) === String(entryId));
            const locked = Boolean(entry) && [SYNC_STATUS.CONFIRMED, SYNC_STATUS.SYNCING].includes(entry.syncStatus);
            const openEditor = () => {
                if (locked) {
                    this.showToast(this.t('confirmedEntryLocked'));
                    return;
                }
                this.showEntryEditModal(entryId);
            };
            card.addEventListener('click', event => {
                if (event.target.closest?.('.review-action-btn')) return;
                openEditor();
            });
            card.addEventListener('keydown', event => {
                if (event.key !== 'Enter' && event.key !== ' ') return;
                if (event.target.closest?.('.review-action-btn')) return;
                event.preventDefault();
                openEditor();
            });
        });
        list.querySelectorAll('.review-gap-add').forEach(button => button.addEventListener('click', event => {
            event.stopPropagation();
            this.showAddEntryModal({
                startTimestamp: Number(button.dataset.gapStart),
                endTimestamp: Number(button.dataset.gapEnd)
            });
        }));
        list.querySelectorAll('.review-add-activity').forEach(button => button.addEventListener('click', event => {
            event.stopPropagation();
            this.addActivityFromReviewEntry(button.dataset.entryId).catch(() => {});
        }));
        list.querySelectorAll('.review-retry-entry').forEach(button => button.addEventListener('click', () => this.retryFailedEntry(button.dataset.batchId, button.dataset.entryId)));
        list.querySelectorAll('.review-resend-unknown').forEach(button => button.addEventListener('click', () => this.showUnknownResendConfirmation(button.dataset.entryId)));
    }

    renderSyncConfirmEntry(entry) {
        const activity = this.activities.find(item => item.id === entry.activityId);
        const title = activity?.name || entry.activityNameSnapshot || this.t('noActivity');
        const sendStart = this.clockodoSendTimestamp(entry.startTimestamp);
        const sendEnd = this.clockodoSendTimestamp(entry.endTimestamp);
        return `<div class="sync-confirm-item"><span>${this.escapeHtml(title)} · ${this.escapeHtml(this.formatTime(sendStart))}–${this.escapeHtml(this.formatTime(sendEnd))}</span><strong>${this.formatDuration(this.getEntryDuration(entry))}</strong></div>`;
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
        this.syncUnknownEntryId = null;
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
        list.innerHTML = eligible.map(entry => this.renderSyncConfirmEntry(entry)).join('') || `<div class="review-empty">${this.t('noEntriesToSync')}</div>`;
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

    showUnknownResendConfirmation(entryId) {
        const entry = this.timeEntries.find(item => String(item.id) === String(entryId));
        if (!entry || entry.syncStatus !== SYNC_STATUS.UNKNOWN) return false;
        if (!this.clockodoConfigured || !this.clockodoClient) {
            this.showToast(this.t('clockodoConfigMissing'));
            return false;
        }
        const invalid = this.getEntryDuration(entry) <= 0 || this.getEntryDuration(entry) > 24 * 60 * 60 * 1000;
        this.syncUnknownEntryId = String(entry.id);
        this.syncResendMode = false;
        this.syncConfirmationOpen = true;
        this.confirmedSyncEntries = [{ ...entry }];
        document.getElementById('syncConfirmDesc').textContent = this.t('confirmSyncDesc', { count: 1 });
        document.getElementById('syncConfirmEntriesList').innerHTML = this.renderSyncConfirmEntry(entry);
        document.getElementById('syncConfirmSummary').innerHTML = `<span>${this.t('syncSummaryTotal')}</span><strong>${this.formatDuration(this.getEntryDuration(entry))}</strong>`;
        const notice = document.getElementById('syncConfirmAlreadySyncedNotice');
        notice.textContent = invalid ? this.t('dayReviewInvalid') : this.t('unknownResendNotice');
        notice.style.display = '';
        const submit = document.getElementById('syncConfirmSubmitBtn');
        submit.disabled = invalid;
        submit.textContent = this.t('resendSyncBtn');
        document.getElementById('syncConfirmModal').classList.add('active');
        return true;
    }

    closeSyncConfirmationModal() {
        document.getElementById('syncConfirmModal')?.classList.remove('active');
        this.confirmedSyncEntries = [];
        this.syncConfirmationOpen = false;
        this.syncResendMode = false;
        this.syncUnknownEntryId = null;
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
        if (this.syncUnknownEntryId) {
            const entryId = this.syncUnknownEntryId;
            this.closeSyncConfirmationModal();
            return this.resendUnknownEntry(entryId);
        }
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

    async resendUnknownEntry(entryId) {
        const entry = this.timeEntries.find(item => String(item.id) === String(entryId));
        if (!entry || entry.syncStatus !== SYNC_STATUS.UNKNOWN) return false;
        if (!this.clockodoConfigured || !this.clockodoClient) {
            this.showToast(this.t('clockodoConfigMissing'));
            return false;
        }
        // A manual resend always creates a fresh confirmed batch with a new idempotency key.
        // The original "timerhub-entry:<id>" operation stays untouched and permanently protected.
        const date = this.getEntryDate(entry);
        const dateBatches = this.syncBatches.filter(batch => batch.date === date);
        const version = dateBatches.reduce((latest, batch) => Math.max(latest, Number(batch.version) || 0), 0) + 1;
        const batchId = this.generateId();
        const frozenEntry = {
            ...entry,
            syncStatus: SYNC_STATUS.CONFIRMED,
            syncBatchId: batchId,
            clockodoResend: true,
            clockodoIdempotencyKey: `timerhub-entry:${entry.id}:resend:${batchId}`,
            clockodoPayload: null
        };
        const batch = {
            id: batchId,
            date,
            version,
            state: SYNC_STATUS.CONFIRMED,
            confirmedAt: Date.now(),
            entries: [{ ...frozenEntry, durationMs: frozenEntry.endTimestamp - frozenEntry.startTimestamp }]
        };
        await this.storage.saveConfirmedBatch(batch, [frozenEntry]);
        const local = this.timeEntries.find(item => String(item.id) === String(entryId));
        if (local) Object.assign(local, frozenEntry);
        else this.timeEntries.push(frozenEntry);
        this.syncBatches.push(batch);
        return this.syncConfirmedBatch(batchId);
    }

    async persistSyncProgress(batch) {
        const currentById = new Map(this.timeEntries.map(entry => [entry.id, entry]));
        const syncFields = [
            'syncStatus', 'syncBatchId', 'clockodoEntryId', 'clockodoSyncedAt',
            'clockodoError', 'clockodoErrorDetails', 'clockodoPayload',
            'clockodoResend', 'clockodoIdempotencyKey'
        ];
        const updatedEntries = batch.entries.map(snapshot => {
            const local = currentById.get(snapshot.id);
            if (!local) {
                const created = { ...snapshot };
                this.timeEntries.push(created);
                return created;
            }
            // The batch freezes time/activity/project data, but sync status is
            // the only thing a running sync is allowed to update in the local
            // record. Copying the whole frozen snapshot here would overwrite a
            // user's edit (for example, clearing an archived project) with the
            // stale value before a retry.
            for (const field of syncFields) {
                if (Object.prototype.hasOwnProperty.call(snapshot, field)) local[field] = snapshot[field];
            }
            return local;
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
            const retryingFailed = entry.syncStatus === SYNC_STATUS.FAILED;
            if (entry.clockodoEntryId && !entry.clockodoResend) {
                entry.syncStatus = SYNC_STATUS.LOCAL_ONLY;
                entry.clockodoError = null;
                entry.clockodoErrorDetails = null;
                await this.persistSyncProgress(batch);
                continue;
            }
            if (retryingFailed) {
                // A failed entry is still editable. Before retrying, use the
                // current local record instead of a stale frozen snapshot or a
                // cached payload from the rejected attempt. This is what makes
                // clearing an archived project take effect on "Retry".
                const local = this.timeEntries.find(item => String(item.id) === String(entry.id));
                if (local) {
                    for (const field of [
                        'activityId', 'activityNameSnapshot', 'startTimestamp', 'endTimestamp',
                        'notes', 'project', 'projectId', 'service', 'serviceId', 'customerId',
                        'customerName', 'serviceName', 'isEdited', 'editedAt'
                    ]) {
                        entry[field] = local[field];
                    }
                    entry.durationMs = entry.endTimestamp - entry.startTimestamp;
                }
                entry.clockodoPayload = null;
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
                        // On a failed retry the local entry is authoritative.
                        // An empty project means no project; do not fall back to
                        // an archived activity/default project.
                        projectId: retryingFailed
                            ? (entry.projectId || null)
                            : (activity?.projectId || this.clockodoProjectId),
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
                this.diagnostics?.warn('clockodo', 'create-entry', error, {
                    status: 'failed',
                    details: { entryId: entry.id, code: entry.clockodoError, outcome: entry.syncStatus }
                });
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
        this.updateDataPresenceMarker();
        const grid = document.getElementById('activitiesGrid');
        const viewport = document.getElementById('activityCanvasViewport');
        if (viewport && typeof viewport.getBoundingClientRect === 'function') {
            const rect = viewport.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
                this.canvasViewportSize = { width: rect.width, height: rect.height };
            }
        }
        this.updateTimerStatus();
        if (!grid) return;
        this.updateCanvasGroupAction();
        this.updateActivityAssignmentsToggle();
        grid.setAttribute('aria-busy', String(Boolean(this.timerActionInProgress)));
        grid.replaceChildren();
        this.canvasZIndex = 1;
        this.applyCanvasTransform(grid);
        // Fresh index for the whole render; removed afterwards so direct calls
        // from other code always fall back to a consistent lookup.
        this._canvasIndex = this.buildCanvasIndex();
        this._baseLayoutCache = new Map();
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
            this._canvasIndex = null;
            this._baseLayoutCache = null;
            return;
        }

        this.renderGroups(grid);

        this.activities.forEach((activity, index) => {
            if (!this.isActivityVisible(activity)) return;
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

            // Activity template icon. Unknown or missing ids simply render no
            // icon, so legacy and forward-compatible records stay valid.
            const iconDefinition = this.activityIcon(activity.icon);
            const iconElement = iconDefinition ? this.buildIconSvg(iconDefinition, 'activity-icon') : null;
            if (iconElement) {
                btn.classList.add('has-icon');
                // Icon-only is honored only when an icon actually exists; a
                // missing icon falls back to the visible name.
                if (activity.displayMode === 'icon-only') btn.classList.add('is-icon-only');
                btn.appendChild(iconElement);
            }
            btn.appendChild(name);

            if (activity.notes) {
                const noteMark = document.createElement('span');
                noteMark.className = 'btn-note-mark';
                noteMark.setAttribute('aria-hidden', 'true');
                btn.appendChild(noteMark);
            }

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

            const assignmentLabels = this.activityAssignmentLabels(activity);
            if (this.showActivityAssignments && (assignmentLabels.customerName || assignmentLabels.projectName)) {
                // Labels are siblings of the clipped activity node so shapes can
                // never cut off the debug text.
                const overlay = document.createElement('div');
                overlay.className = 'activity-assignment-overlay';
                overlay.dataset.activityId = activity.id;
                overlay.setAttribute('aria-hidden', 'true');
                overlay.style.left = `${layout.x}px`;
                overlay.style.top = `${layout.y}px`;
                overlay.style.width = `${layout.width}px`;
                overlay.style.height = `${layout.height}px`;
                overlay.style.zIndex = '1000000';
                for (const [kind, text] of [
                    ['customer', assignmentLabels.customerName],
                    ['project', assignmentLabels.projectName]
                ]) {
                    if (!text) continue;
                    const label = document.createElement('span');
                    label.className = `activity-assignment-label activity-${kind}-label`;
                    label.textContent = text;
                    label.title = text;
                    label.setAttribute('aria-hidden', 'true');
                    label.setAttribute('dir', 'auto');
                    overlay.appendChild(label);
                }
                grid.appendChild(overlay);
            }
        });

        this.populateActivityFilter();
        this._canvasIndex = null;
        this._baseLayoutCache = null;
    }

    renderGroups(grid) {
        const index = this._canvasIndex;
        // Ancestors first so nested containers stack above their parents.
        const ordered = [...this.groups].sort((a, b) =>
            (this.groupAncestors(a).length - this.groupAncestors(b).length)
            || this.compareGroupLogicalOrder(a, b));
        for (const group of ordered) {
            if (!this.isGroupVisible(group)) continue;
            const base = group.collapsed ? null : this.groupBaseBounds(group, index);
            const hasContent = group.collapsed
                ? Boolean(this.groupMembers(group, index).length || this.groupChildren(group, index).length)
                : Boolean(base);
            if (!hasContent) continue;
            const container = document.createElement('div');
            container.className = `group-container${group.collapsed ? ' is-collapsed' : ''}${this.selectedGroupIds?.has(group.id) ? ' is-selected' : ''}`;
            container.dataset.groupId = group.id;
            container.style.zIndex = String(-this.groupAncestors(group).length);
            if (group.color) container.style.setProperty('--group-accent', group.color);

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

            const editButton = document.createElement('button');
            editButton.type = 'button';
            editButton.className = 'group-edit-btn';
            editButton.dataset.groupId = group.id;
            editButton.setAttribute('aria-label', this.t('editGroup'));
            editButton.textContent = '✎';
            editButton.addEventListener('pointerdown', event => event.stopPropagation());
            editButton.addEventListener('click', event => {
                event.stopPropagation();
                this.openGroupEditModal(group.id);
            });

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
            title.appendChild(editButton);
            title.appendChild(duplicateButton);
            if (group.locked) {
                const lockIndicator = document.createElement('span');
                lockIndicator.className = 'group-lock-indicator';
                lockIndicator.textContent = '🔒';
                lockIndicator.setAttribute('aria-label', this.t('groupLocked'));
                title.appendChild(lockIndicator);
            }
            container.appendChild(title);

            if (group.collapsed) {
                const collapsed = this.groupCollapsedBounds(group);
                const offset = this.groupDisplayOffset(group.id);
                container.style.left = `${collapsed.left + offset.x}px`;
                container.style.top = `${collapsed.top + offset.y}px`;
                container.style.width = `${collapsed.width}px`;
                container.style.height = `${collapsed.height}px`;
                const resizeHandle = document.createElement('button');
                resizeHandle.type = 'button';
                resizeHandle.className = 'group-resize-handle';
                resizeHandle.dataset.groupId = group.id;
                resizeHandle.setAttribute('aria-label', this.t('resizeGroup'));
                resizeHandle.title = this.t('resizeGroup');
                resizeHandle.addEventListener('click', event => event.stopPropagation());
                container.appendChild(resizeHandle);
            } else {
                const offset = this.groupDisplayOffset(group.id);
                this.applyGroupBounds(container, {
                    left: base.left + offset.x,
                    top: base.top + offset.y,
                    width: base.width,
                    height: base.height
                });
            }

            grid.appendChild(container);
        }
    }

    groupMemberBoxes(group, includeDisplayOffset = true) {
        return this.groupMembers(group)
            .map(activity => this.getActivityCanvasLayout(activity, this.activityIndexOf(activity), includeDisplayOffset));
    }

    groupDisplayOffset(groupId) {
        return this.groupDisplayOffsets?.get(groupId) || { x: 0, y: 0 };
    }

    activityDisplayOffset(activityId) {
        return this.activityDisplayOffsets?.get(activityId) || { x: 0, y: 0 };
    }

    groupContainerBounds(boxes) {
        return CanvasGeometry.groupOuterBounds(boxes, CANVAS_GROUP_PADDING, CANVAS_GROUP_HEADER);
    }

    // Offset-free bounds of an expanded group: its direct activities plus every
    // nested child container, recursively. Children are measured first so a
    // parent always wraps its hierarchy.
    groupBaseBounds(group, index = this._canvasIndex) {
        const boxes = [];
        let displacedRight = Number.NEGATIVE_INFINITY;
        let displacedBottom = Number.NEGATIVE_INFINITY;
        for (const member of this.groupMembers(group, index)) {
            const layout = this.getActivityCanvasLayout(member, this.activityIndexOf(member, index), false);
            boxes.push({
                x: layout.x,
                y: layout.y,
                width: layout.width,
                height: layout.height
            });
            const own = this.activityDisplayOffset(member.id);
            displacedRight = Math.max(
                displacedRight,
                layout.x + layout.width + own.x + CANVAS_GROUP_PADDING
            );
            displacedBottom = Math.max(
                displacedBottom,
                layout.y + layout.height + own.y + CANVAS_GROUP_PADDING
            );
        }
        for (const child of this.groupChildren(group, index)) {
            const childBounds = child.collapsed
                ? this.groupCollapsedBounds(child)
                : this.groupBaseBounds(child, index);
            if (!childBounds) continue;
            // The parent's top-left is its stable identity anchor: temporary
            // right/down child offsets may extend its bounds, but must never
            // feed back into the min() that computes that anchor.
            boxes.push({
                x: childBounds.left,
                y: childBounds.top,
                width: childBounds.width,
                height: childBounds.height
            });
            const own = this.groupOwnDisplayOffsets?.get(child.id) || { x: 0, y: 0 };
            displacedRight = Math.max(
                displacedRight,
                childBounds.right + own.x + CANVAS_GROUP_PADDING
            );
            displacedBottom = Math.max(
                displacedBottom,
                childBounds.bottom + own.y + CANVAS_GROUP_PADDING
            );
        }
        if (!boxes.length) return null;
        const bounds = this.groupContainerBounds(boxes);
        if (Number.isFinite(displacedRight)) {
            bounds.right = Math.max(bounds.right, this.ceilToCanvasGrid(displacedRight));
        }
        if (Number.isFinite(displacedBottom)) {
            bounds.bottom = Math.max(bounds.bottom, this.ceilToCanvasGrid(displacedBottom));
        }
        bounds.width = bounds.right - bounds.left;
        bounds.height = bounds.bottom - bounds.top;
        const minWidth = this.ceilToCanvasGrid(this.groupTitleMinWidth(group));
        if (bounds.width < minWidth) {
            bounds.width = minWidth;
            bounds.right = bounds.left + minWidth;
        }
        return bounds;
    }

    groupDepth(group) {
        return this.groupAncestors(group).length;
    }

    measureCanvasTextWidth(text, font) {
        const value = String(text ?? '');
        if (!value) return 0;
        try {
            if (!this._groupTitleMeasureContext) {
                const canvas = document.createElement('canvas');
                this._groupTitleMeasureContext = canvas?.getContext?.('2d') || null;
            }
            if (this._groupTitleMeasureContext) {
                this._groupTitleMeasureContext.font = font;
                return Math.ceil(this._groupTitleMeasureContext.measureText(value).width);
            }
        } catch { /* fall back to a deterministic estimate */ }
        return Math.ceil(value.length * 9);
    }

    // The header controls are always visible; the group box must reserve enough
    // width for the full name instead of relying on the CSS ellipsis.
    measureGroupTitleTextWidth(text) {
        if (!text) return 0;
        const font = '700 12px system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif';
        return Math.ceil(this.measureCanvasTextWidth(text, font) + text.length * 0.72);
    }

    groupTitleMinWidth(group) {
        const text = String(group?.name || '').trim().toUpperCase();
        if (!text) return 0;
        const gaps = (group?.locked ? 4 : 3) * 4;
        // Three 32px controls, flex gaps, title padding, the 2px container
        // border on each side, and a small safety margin for font differences.
        const controls = 32 * 3 + gaps + 10 + 4 + 8 + (group?.locked ? 18 : 0);
        return controls + this.measureGroupTitleTextWidth(text);
    }

    applyGroupBounds(container, bounds) {
        container.style.left = `${bounds.left}px`;
        container.style.top = `${bounds.top}px`;
        container.style.width = `${bounds.width}px`;
        container.style.height = `${bounds.height}px`;
    }

    groupCollapsedWidth(group) {
        const configured = this.clampCanvasCoordinate(
            group?.collapsedWidth,
            CANVAS_GROUP_COLLAPSED_WIDTH,
            CANVAS_GROUP_COLLAPSED_MIN_WIDTH,
            CANVAS_GROUP_COLLAPSED_MAX_WIDTH
        );
        return this.ceilToCanvasGrid(Math.max(configured, this.groupTitleMinWidth(group)));
    }

    groupCollapsedHeight(group) {
        return this.ceilToCanvasGrid(this.clampCanvasCoordinate(
            group?.collapsedHeight,
            CANVAS_GROUP_COLLAPSED_HEIGHT,
            CANVAS_GROUP_COLLAPSED_MIN_HEIGHT,
            CANVAS_GROUP_COLLAPSED_MAX_HEIGHT
        ));
    }

    resizeCollapsedGroup(group, width, height) {
        if (!group) return null;
        const nextWidth = this.clampCanvasCoordinate(
            this.snapToCanvasGrid(this.clampCanvasCoordinate(width, this.groupCollapsedWidth(group), CANVAS_GROUP_COLLAPSED_MIN_WIDTH, CANVAS_GROUP_COLLAPSED_MAX_WIDTH)),
            this.groupCollapsedWidth(group),
            CANVAS_GROUP_COLLAPSED_MIN_WIDTH,
            CANVAS_GROUP_COLLAPSED_MAX_WIDTH
        );
        const nextHeight = this.clampCanvasCoordinate(
            this.snapToCanvasGrid(this.clampCanvasCoordinate(height, this.groupCollapsedHeight(group), CANVAS_GROUP_COLLAPSED_MIN_HEIGHT, CANVAS_GROUP_COLLAPSED_MAX_HEIGHT)),
            this.groupCollapsedHeight(group),
            CANVAS_GROUP_COLLAPSED_MIN_HEIGHT,
            CANVAS_GROUP_COLLAPSED_MAX_HEIGHT
        );
        group.collapsedWidth = nextWidth;
        group.collapsedHeight = nextHeight;
        return group;
    }

    groupContentAnchor(group, index = this._canvasIndex) {
        if (!group) return null;
        if (!this._groupContentAnchorCache) this._groupContentAnchorCache = new Map();
        // Group dragging mutates x/y between full layout passes; the cached
        // anchor must follow or collapsed nodes render at their old position.
        const cached = this._groupContentAnchorCache.get(group.id);
        if (cached && cached.x === group.x && cached.y === group.y) return cached;
        const base = this.groupBaseBounds(group, index);
        const anchor = base
            ? { left: base.left, top: base.top, x: group.x, y: group.y }
            : {
                left: this.floorToCanvasGrid(group.x - CANVAS_GROUP_PADDING),
                top: this.floorToCanvasGrid(group.y - CANVAS_GROUP_HEADER),
                x: group.x,
                y: group.y
            };
        this._groupContentAnchorCache.set(group.id, anchor);
        return anchor;
    }

    groupCollapsedBounds(group) {
        const width = this.groupCollapsedWidth(group);
        const height = this.groupCollapsedHeight(group);
        // Collapsed and expanded boxes share the same content-derived top-left,
        // so toggling never moves the group or its members.
        const anchor = this.groupContentAnchor(group);
        const left = anchor.left;
        const top = anchor.top;
        return {
            left,
            top,
            right: left + width,
            bottom: top + height,
            width,
            height
        };
    }

    groupAreasOverlap(first, second) {
        // Touching edges are not an area conflict. Group placement uses a
        // positive-area test; the shared 20px padding is applied only when the
        // boxes actually overlap.
        return first.left < second.right && first.right > second.left
            && first.top < second.bottom && first.bottom > second.top;
    }

    resolveGroupCollision(bounds, obstacles) {
        let left = bounds.left;
        let top = bounds.top;
        const origin = bounds.origin || null;
        let shifted = true;
        let guard = 0;
        while (shifted && guard < 500) {
            shifted = false;
            guard += 1;
            for (const other of obstacles) {
                const candidate = { left, top, right: left + bounds.width, bottom: top + bounds.height };
                if (!this.groupAreasOverlap(candidate, other)) continue;
                const shiftRight = other.right + CANVAS_GRID_SIZE - candidate.left;
                const shiftDown = other.bottom + CANVAS_GRID_SIZE - candidate.top;
                // Group layout passes stable base origins. Preserve the side
                // the group started on: moving a group that was above the
                // obstacle downward would teleport it past the obstacle and
                // reverse the visual order.
                let moveRight = shiftRight <= shiftDown;
                if (origin && other.origin) {
                    if (origin.top < other.origin.top) moveRight = true;
                    else if (origin.top > other.origin.top) moveRight = false;
                    else if (origin.left < other.origin.left) moveRight = false;
                    else if (origin.left > other.origin.left) moveRight = true;
                }
                if (moveRight) left += shiftRight;
                else top += shiftDown;
                shifted = true;
            }
        }
        return { left, top };
    }

    // Logical group order comes from the persisted identity (creation-time id),
    // not from incidental storage order. Geometry, expansion state, selection
    // and dimensions must never reorder groups.
    compareGroupLogicalOrder(first, second) {
        const firstId = String(first?.id || '');
        const secondId = String(second?.id || '');
        if (firstId === secondId) return 0;
        return firstId < secondId ? -1 : 1;
    }

    sortedGroupsForLayout() {
        return [...this.groups].sort((first, second) => this.compareGroupLogicalOrder(first, second));
    }

    groupDesiredOffset(groupId) {
        return this.groupExpansionDesiredOffsets.get(groupId) || { x: 0, y: 0 };
    }

    resetGroupExpansionState() {
        this.groupExpansionOrder = [];
        this.groupExpansionDesiredOffsets = new Map();
    }

    normalizeGroupExpansionState() {
        const existing = new Set(this.groups.map(group => group.id));
        const expanded = new Set(this.groups.filter(group => !group.collapsed).map(group => group.id));
        const order = [];
        for (const id of this.groupExpansionOrder || []) {
            if (existing.has(id) && expanded.has(id) && !order.includes(id)) order.push(id);
        }
        for (const group of this.sortedGroupsForLayout()) {
            if (!group.collapsed && !order.includes(group.id)) {
                order.push(group.id);
                if (!this.groupExpansionDesiredOffsets.has(group.id)) {
                    this.groupExpansionDesiredOffsets.set(group.id, { x: 0, y: 0 });
                }
            }
        }
        for (const id of [...this.groupExpansionDesiredOffsets.keys()]) {
            if (!expanded.has(id)) this.groupExpansionDesiredOffsets.delete(id);
        }
        this.groupExpansionOrder = order;
    }

    // Expand a collapsed group at its currently displayed top-left. The
    // offset-free base is measured before the state flips; the same stable
    // base is used by rendering, so content changes cannot move the anchor.
    expandGroupInPlace(group) {
        if (!group || !group.collapsed) return false;
        const offset = this.groupDisplayOffset(group.id);
        const collapsed = this.groupCollapsedBounds(group);
        const displayedLeft = collapsed.left + offset.x;
        const displayedTop = collapsed.top + offset.y;
        // Measure the expanded bounds before changing state. The base top-left
        // is the same while collapsed and expanded; using one stable value
        // prevents title/content changes from moving the anchor.
        const base = this.groupBaseBounds(group, this._canvasIndex);
        this.groupExpansionOrder = this.groupExpansionOrder.filter(id => id !== group.id);
        this.groupExpansionOrder.push(group.id);
        this.groupExpansionDesiredOffsets.set(group.id, base
            ? { x: displayedLeft - base.left, y: displayedTop - base.top }
            : { x: 0, y: 0 });
        group.collapsed = false;
        return true;
    }

    computeGroupDisplayOffsets(passesRemaining = 5) {
        this._groupContentAnchorCache = new Map();
        this.normalizeGroupExpansionState();
        const offsets = new Map();
        const displayBounds = new Map();
        const ownOffsets = new Map();
        // Published before placement so groupBaseBounds can wrap children that
        // already received their own downward displacement at a deeper level.
        this.groupOwnDisplayOffsets = ownOffsets;
        const index = this._canvasIndex;

        // Temporary layout rule: the most recently expanded group in a sibling
        // set keeps its displayed top-left. Every other sibling is moved only
        // right and/or downward until it no longer overlaps the placed groups.
        // Offsets are recomputed from saved anchors on every render, so a
        // collapse restores positions that no remaining expansion needs.
        const placeSiblings = siblings => {
            const ordered = [...siblings].sort((a, b) => this.compareGroupLogicalOrder(a, b));
            const expanded = ordered.filter(group => !group.collapsed);
            const priority = groupId => this.groupExpansionOrder.indexOf(groupId);
            let anchor = null;
            for (const group of expanded) {
                const base = this.groupBaseBounds(group, index);
                if (!base) continue;
                if (!anchor || priority(group.id) > priority(anchor.id)) anchor = group;
            }
            if (!anchor) {
                // With no expanded group, keep the first logical sibling fixed and
                // resolve the rest so collapsed cards cannot overlap.
                anchor = ordered.find(group => group.collapsed ? this.groupCollapsedBounds(group) : this.groupBaseBounds(group, index)) || null;
            }
            if (!anchor) return;
            const anchorBase = anchor.collapsed ? this.groupCollapsedBounds(anchor) : this.groupBaseBounds(anchor, index);
            const anchorDesired = anchor.collapsed ? { x: 0, y: 0 } : this.groupDesiredOffset(anchor.id);
            const placedAnchor = {
                left: anchorBase.left + anchorDesired.x,
                top: anchorBase.top + anchorDesired.y,
                width: anchorBase.width,
                height: anchorBase.height
            };
            placedAnchor.right = placedAnchor.left + placedAnchor.width;
            placedAnchor.bottom = placedAnchor.top + placedAnchor.height;
            placedAnchor.origin = { left: anchorBase.left, top: anchorBase.top };
            if (anchorDesired.x || anchorDesired.y) ownOffsets.set(anchor.id, anchorDesired);
            const obstacles = [placedAnchor];

            for (const group of ordered) {
                if (group.id === anchor.id) continue;
                const base = group.collapsed ? this.groupCollapsedBounds(group) : this.groupBaseBounds(group, index);
                if (!base) continue;
                const desired = group.collapsed ? { x: 0, y: 0 } : this.groupDesiredOffset(group.id);
                const start = {
                    left: base.left + desired.x,
                    top: base.top + desired.y,
                    width: base.width,
                    height: base.height,
                    origin: { left: base.left, top: base.top }
                };
                const resolved = this.resolveGroupCollision(start, obstacles);
                const own = { x: resolved.left - base.left, y: resolved.top - base.top };
                if (own.x || own.y) ownOffsets.set(group.id, own);
                const placed = {
                    left: resolved.left,
                    top: resolved.top,
                    width: base.width,
                    height: base.height,
                    origin: start.origin
                };
                placed.right = placed.left + placed.width;
                placed.bottom = placed.top + placed.height;
                obstacles.push(placed);
            }
        };

        // Deepest first: a group's sibling bounds must include the downward
        // displacement its own children already received.
        const byDepth = [...this.groups].sort((a, b) =>
            (this.groupDepth(b) - this.groupDepth(a)) || this.compareGroupLogicalOrder(a, b));
        for (const group of byDepth) {
            if (group.collapsed || !this.isGroupVisible(group)) continue;
            const children = this.groupChildren(group, index);
            if (children.length) placeSiblings(children);
        }
        const roots = this.groups.filter(group => !this.groupParent(group, index));
        placeSiblings(roots);

        // Top-down: every group's total offset is its ancestor total plus its
        // own local displacement; publish display bounds for hit testing.
        const ordered = [...this.groups].sort((a, b) =>
            (this.groupDepth(a) - this.groupDepth(b)) || this.compareGroupLogicalOrder(a, b));
        for (const group of ordered) {
            const parent = this.groupParent(group, index);
            const parentTotal = parent ? (offsets.get(parent.id) || { x: 0, y: 0 }) : { x: 0, y: 0 };
            const own = ownOffsets.get(group.id) || { x: 0, y: 0 };
            const totalOffset = { x: parentTotal.x + own.x, y: parentTotal.y + own.y };
            if (totalOffset.x || totalOffset.y) offsets.set(group.id, totalOffset);
            const base = group.collapsed ? this.groupCollapsedBounds(group) : this.groupBaseBounds(group, index);
            if (!base) continue;
            displayBounds.set(group.id, {
                left: base.left + totalOffset.x,
                top: base.top + totalOffset.y,
                right: base.right + totalOffset.x,
                bottom: base.bottom + totalOffset.y,
                width: base.width,
                height: base.height
            });
        }
        this.groupDisplayBounds = displayBounds;
        const groupObstacles = [];
        for (const group of this.groups) {
            if (!this.isGroupVisible(group)) continue;
            const bounds = displayBounds.get(group.id);
            if (!bounds) continue;
            const offset = offsets.get(group.id) || { x: 0, y: 0 };
            groupObstacles.push({
                ...bounds,
                groupId: group.id,
                origin: { left: bounds.left - offset.x, top: bounds.top - offset.y }
            });
        }
        const previousOffsets = this.activityDisplayOffsets instanceof Map
            ? this.activityDisplayOffsets
            : new Map();
        const nextOffsets = new Map();
        for (const activity of this.activities) {
            if (!this.isActivityVisible(activity)) continue;
            const group = this.activityGroup(activity);
            const excluded = new Set();
            let ancestor = group;
            while (ancestor) {
                excluded.add(ancestor.id);
                ancestor = this.groupParent(ancestor, index);
            }
            const obstacles = groupObstacles.filter(obstacle => !excluded.has(obstacle.groupId));
            if (!obstacles.length) continue;
            const base = this.getActivityCanvasLayout(activity, this.activityIndexOf(activity), false);
            const groupOffset = group ? (offsets.get(group.id) || { x: 0, y: 0 }) : { x: 0, y: 0 };
            const start = {
                left: base.x + groupOffset.x,
                top: base.y + groupOffset.y,
                width: base.width,
                height: base.height,
                origin: { left: base.x + groupOffset.x, top: base.y + groupOffset.y }
            };
            const resolved = this.resolveGroupCollision(start, obstacles);
            const own = { x: resolved.left - start.left, y: resolved.top - start.top };
            if (own.x || own.y) nextOffsets.set(activity.id, own);
        }
        this.activityDisplayOffsets = nextOffsets;
        const offsetsChanged = previousOffsets.size !== nextOffsets.size
            || [...nextOffsets].some(([id, offset]) => {
                const previous = previousOffsets.get(id);
                return !previous || previous.x !== offset.x || previous.y !== offset.y;
            });
        if (passesRemaining > 1 && offsetsChanged) {
            return this.computeGroupDisplayOffsets(passesRemaining - 1);
        }
        return offsets;
    }

    positionActivityVisual(activity, layout = null) {
        if (!activity) return;
        const stage = document.getElementById('activitiesGrid');
        if (!stage) return;
        const button = stage.querySelector(
            `.activity-btn[data-activity-id="${CSS.escape(activity.id)}"]`
        );
        if (!button) return;
        const resolved = layout || this.getActivityCanvasLayout(
            activity,
            this.activityIndexOf(activity)
        );
        button.style.left = `${resolved.x}px`;
        button.style.top = `${resolved.y}px`;
        button.style.width = `${resolved.width}px`;
        button.style.height = `${resolved.height}px`;
        this.positionActivityResizeHandle(activity.id, resolved);
    }

    positionCanvasObjects() {
        for (const group of this.groups) this.positionGroupVisuals(group);
        for (const activity of this.activities) {
            if (this.isActivityVisible(activity)) this.positionActivityVisual(activity);
        }
    }

    // Recompute transient offsets and reposition every canvas object through the
    // same post-layout contract. Used after geometry-changing gestures.
    refreshGroupLayout() {
        this._canvasIndex = this.buildCanvasIndex();
        this._baseLayoutCache = new Map();
        this.groupDisplayOffsets = this.computeGroupDisplayOffsets();
        this.positionCanvasObjects();
        this._canvasIndex = null;
        this._baseLayoutCache = null;
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
        for (const activity of this.groupMembers(group)) {
            const layout = this.getActivityCanvasLayout(activity, this.activityIndexOf(activity));
            this.positionActivityVisual(activity, layout);
            boxes.push(layout);
        }
        const container = stage.querySelector(
            `.group-container[data-group-id="${CSS.escape(group.id)}"]`
        );
        if (!container) return;
        container.children[0]?.classList.add('dragging');
        if (group.collapsed) {
            const collapsed = this.groupCollapsedBounds(group);
            const offset = this.groupDisplayOffset(group.id);
            container.style.left = `${collapsed.left + offset.x}px`;
            container.style.top = `${collapsed.top + offset.y}px`;
            container.style.width = `${collapsed.width}px`;
            container.style.height = `${collapsed.height}px`;
        } else {
            const base = this.groupBaseBounds(group);
            if (base) {
                const offset = this.groupDisplayOffset(group.id);
                this.applyGroupBounds(container, {
                    left: base.left + offset.x,
                    top: base.top + offset.y,
                    width: base.width,
                    height: base.height
                });
            }
        }
    }

    activityClientCenter(button) {
        if (!button || typeof button.getBoundingClientRect !== 'function') return null;
        const box = button.getBoundingClientRect();
        return { x: box.left + box.width / 2, y: box.top + box.height / 2 };
    }

    groupDropTargetAt(clientX, clientY) {
        const viewport = document.getElementById('activityCanvasViewport');
        if (!viewport || typeof viewport.getBoundingClientRect !== 'function') return null;
        const rect = viewport.getBoundingClientRect();
        const world = this.screenToWorld(clientX - rect.left, clientY - rect.top);
        let best = null;
        for (let order = 0; order < this.groups.length; order += 1) {
            const group = this.groups[order];
            const bounds = this.groupDisplayBounds.get(group.id);
            if (!bounds) continue;
            if (world.x < bounds.left || world.x > bounds.right || world.y < bounds.top || world.y > bounds.bottom) continue;
            const area = Math.max(0, bounds.right - bounds.left) * Math.max(0, bounds.bottom - bounds.top);
            if (!best || area < best.area || (area === best.area && order < best.order)) {
                best = { group, area, order };
            }
        }
        return best?.group || null;
    }

    setCanvasDropTarget(groupId) {
        const stage = document.getElementById('activitiesGrid');
        if (!stage) return;
        for (const group of this.groups) {
            const container = stage.querySelector(
                `.group-container[data-group-id="${CSS.escape(group.id)}"]`
            );
            if (!container) continue;
            container.classList.toggle('group-drop-target', group.id === groupId);
        }
    }

    // Find the visible group under the pointer that can become the new parent
    // of the dragged group. The dragged group and all its descendants are
    // excluded so a group can never be nested into itself.
    groupNestTargetAt(clientX, clientY, excludeGroup) {
        if (!excludeGroup) return null;
        const viewport = document.getElementById('activityCanvasViewport');
        if (!viewport || typeof viewport.getBoundingClientRect !== 'function') return null;
        const rect = viewport.getBoundingClientRect();
        const world = this.screenToWorld(clientX - rect.left, clientY - rect.top);
        const excluded = new Set([excludeGroup.id, ...this.groupDescendantIds(excludeGroup.id)]);
        let best = null;
        for (let order = 0; order < this.groups.length; order += 1) {
            const group = this.groups[order];
            if (excluded.has(group.id)) continue;
            if (!this.isGroupVisible(group)) continue;
            const bounds = this.groupDisplayBounds.get(group.id);
            if (!bounds) continue;
            if (world.x < bounds.left || world.x > bounds.right || world.y < bounds.top || world.y > bounds.bottom) continue;
            const area = Math.max(0, bounds.right - bounds.left) * Math.max(0, bounds.bottom - bounds.top);
            if (!best || area < best.area || (area === best.area && order < best.order)) {
                best = { group, area, order };
            }
        }
        return best?.group || null;
    }

    setCanvasGroupNestTarget(groupId) {
        const stage = document.getElementById('activitiesGrid');
        if (!stage) return;
        for (const group of this.groups) {
            const container = stage.querySelector(
                `.group-container[data-group-id="${CSS.escape(group.id)}"]`
            );
            if (!container) continue;
            container.classList.toggle('group-nest-target', group.id === groupId);
        }
    }

    // Move a group under a new parent (or back to the root level). Persistent
    // coordinates are never rewritten here, so the drag position is kept.
    async reparentGroup(group, parentId) {
        if (!group) return false;
        if (parentId) {
            const parent = this.groups.find(item => item.id === parentId);
            if (!parent || parent.id === group.id) return false;
            if (this.groupDescendantIds(group.id).includes(parent.id)) return false;
            group.parentId = parent.id;
            if (parent.collapsed) {
                this.expandGroupInPlace(parent);
                Promise.resolve(this.storage.saveGroup?.(parent)).catch(() => {});
            }
        } else {
            delete group.parentId;
        }
        try {
            await this.storage.saveGroup?.(group);
        } catch {
            this.showToast(this.t('groupCreateFailed'));
            return false;
        }
        this.renderMain();
        return true;
    }

    reparentCandidatesForGesture(gesture) {
        if (!gesture?.group) return [];
        if (gesture.groupMoveSnapshot && gesture.groupMoveSnapshot.size > 1
            && this.selectedGroupIds?.has(gesture.group.id)) {
            return this.selectedTopLevelGroups();
        }
        return [gesture.group];
    }

    // Batch nesting/detaching for a multi-group drag (or a single group). The
    // whole selection is written once and the canvas is rendered once.
    async reparentGroups(groups, parentId) {
        const unique = [...new Map(groups.filter(Boolean).map(group => [group.id, group])).values()];
        if (!unique.length) return false;
        const parent = parentId ? this.groups.find(group => group.id === parentId) : null;
        if (parentId && !parent) return false;
        for (const group of unique) {
            if (parentId && (parentId === group.id || this.groupDescendantIds(group.id).includes(parentId))) {
                continue;
            }
            if (parentId) group.parentId = parentId;
            else delete group.parentId;
        }
        if (parent && parent.collapsed) {
            this.expandGroupInPlace(parent);
        }
        try {
            if (parent) await this.storage.saveGroup?.(parent);
            for (const group of unique) await this.storage.saveGroup?.(group);
        } catch {
            this.showToast(this.t('groupCreateFailed'));
            return false;
        }
        if (parentId) this.setGroupSelection(unique.map(group => group.id));
        this.renderMain();
        return true;
    }

    updateMoveDropTarget(gesture) {
        const activity = this.activities.find(item => item.id === gesture.activityId);
        const center = this.activityClientCenter(gesture.activityButton);
        const target = center ? this.groupDropTargetAt(center.x, center.y) : null;
        const currentGroupId = activity?.groupId || null;
        const targetId = target && target.id !== currentGroupId ? target.id : null;
        if (gesture.dropTargetGroupId === targetId) return;
        gesture.dropTargetGroupId = targetId;
        this.setCanvasDropTarget(targetId);
    }

    groupMemberRelativeBoxes(group, excludeId) {
        const boxes = [];
        for (const member of this.activities) {
            if (member.groupId !== group.id || member.id === excludeId) continue;
            const layout = this.getActivityCanvasLayout(member, this.activities.indexOf(member), false);
            boxes.push({
                x: layout.x - group.x,
                y: layout.y - group.y,
                width: layout.width,
                height: layout.height
            });
        }
        return boxes;
    }

    findNearestFreePosition(movingBox, obstacles, step = CANVAS_GRID_SIZE) {
        const overlaps = box => obstacles.some(other =>
            box.x < other.x + other.width && other.x < box.x + box.width &&
            box.y < other.y + other.height && other.y < box.y + box.height
        );
        if (!overlaps(movingBox)) return { x: movingBox.x, y: movingBox.y };
        const baseX = this.snapToCanvasGrid(movingBox.x);
        const baseY = this.snapToCanvasGrid(movingBox.y);
        const candidates = [];
        const radius = 40;
        for (let dx = -radius; dx <= radius; dx += 1) {
            for (let dy = -radius; dy <= radius; dy += 1) {
                if (!dx && !dy) continue;
                candidates.push({ dx, dy, distance: dx * dx + dy * dy });
            }
        }
        candidates.sort((a, b) =>
            (a.distance - b.distance) ||
            (Math.abs(a.dy) - Math.abs(b.dy)) ||
            (Math.abs(a.dx) - Math.abs(b.dx)) ||
            (b.dy - a.dy) ||
            (b.dx - a.dx)
        );
        for (const candidate of candidates) {
            const box = {
                ...movingBox,
                x: baseX + candidate.dx * step,
                y: baseY + candidate.dy * step
            };
            if (!overlaps(box)) return { x: box.x, y: box.y };
        }
        const bottom = Math.max(...obstacles.map(box => box.y + box.height));
        return { x: baseX, y: this.snapToCanvasGrid(bottom + step) };
    }

    reassignActivityToGroup(activity, targetGroup, displayLayout) {
        const targetOffset = targetGroup ? this.groupDisplayOffset(targetGroup.id) : { x: 0, y: 0 };
        const originX = targetGroup ? targetGroup.x : 0;
        const originY = targetGroup ? targetGroup.y : 0;
        const dimensions = this.normalizeActivityGeometryDimensions(
            activity,
            displayLayout.width,
            displayLayout.height
        );
        const absoluteX = this.snapToCanvasGrid(displayLayout.x - targetOffset.x);
        const absoluteY = this.snapToCanvasGrid(displayLayout.y - targetOffset.y);
        const stored = {
            activityId: activity.id,
            x: absoluteX - originX,
            y: absoluteY - originY,
            width: dimensions.width,
            height: dimensions.height
        };
        if (targetGroup) {
            const obstacles = this.groupMemberRelativeBoxes(targetGroup, activity.id);
            const free = this.findNearestFreePosition(stored, obstacles);
            const freeAbsoluteX = this.snapToCanvasGrid(originX + free.x);
            const freeAbsoluteY = this.snapToCanvasGrid(originY + free.y);
            stored.x = freeAbsoluteX - originX;
            stored.y = freeAbsoluteY - originY;
        }
        if (targetGroup) activity.groupId = targetGroup.id;
        else delete activity.groupId;
        this.activityLayouts.set(activity.id, stored);
        this.renderMain();
        Promise.all([
            Promise.resolve(this.storage.saveActivity(activity)),
            Promise.resolve(this.storage.saveLayout(stored))
        ]).catch(() => this.showToast(this.t('canvasLayoutSaveFailed')));
        return stored;
    }


    async toggleGroupCollapsed(groupId) {
        const group = this.groups.find(item => item.id === groupId);
        if (!group) return null;
        if (group.collapsed) {
            this.expandGroupInPlace(group);
        } else {
            group.collapsed = true;
            this.groupExpansionOrder = this.groupExpansionOrder.filter(id => id !== group.id);
            this.groupExpansionDesiredOffsets.delete(group.id);
        }
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
        if (collapsed) {
            for (const group of this.groups) group.collapsed = true;
            this.resetGroupExpansionState();
        } else {
            // Preserve each group's currently displayed top-left where possible.
            const displayed = new Map();
            for (const group of this.groups) {
                const base = group.collapsed ? this.groupCollapsedBounds(group) : this.groupBaseBounds(group);
                if (!base) continue;
                const offset = this.groupDisplayOffset(group.id);
                displayed.set(group.id, { left: base.left + offset.x, top: base.top + offset.y });
            }
            for (const group of this.groups) group.collapsed = false;
            this.resetGroupExpansionState();
            for (const group of this.sortedGroupsForLayout()) {
                this.groupExpansionOrder.push(group.id);
                const base = this.groupBaseBounds(group);
                const anchor = displayed.get(group.id);
                this.groupExpansionDesiredOffsets.set(group.id, base && anchor
                    ? { x: anchor.left - base.left, y: anchor.top - base.top }
                    : { x: 0, y: 0 });
            }
        }
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
        const historyBefore = this.snapshotCanvasState();
        const members = this.activities.filter(activity => activity.groupId === group.id);
        const duplicate = {
            id: this.generateId(),
            name: this.t('groupCopyName', { name: group.name }),
            x: this.snapToCanvasGrid(group.x + CANVAS_GROUP_DUPLICATE_OFFSET),
            y: this.snapToCanvasGrid(group.y + CANVAS_GROUP_DUPLICATE_OFFSET),
            collapsed: false
        };
        // Keep the duplicate in the same hierarchy branch and preserve the
        // persistent presentation metadata.
        if (group.parentId) duplicate.parentId = group.parentId;
        if (group.color) duplicate.color = group.color;
        if (group.defaultCustomerId) {
            duplicate.defaultCustomerId = group.defaultCustomerId;
            if (group.defaultCustomerName) duplicate.defaultCustomerName = group.defaultCustomerName;
        }
        if (Number.isFinite(Number(group.collapsedWidth))) duplicate.collapsedWidth = group.collapsedWidth;
        if (Number.isFinite(Number(group.collapsedHeight))) duplicate.collapsedHeight = group.collapsedHeight;
        const now = Date.now();
        let position = Math.max(0, ...this.activities.map(activity => Number(activity.position) || 0));
        const derivedLayouts = this.deriveGroupRelativeLayouts(group);
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
            const assignment = this.resolveNewActivityCustomer({
                explicitCustomerId: activity.customerId,
                explicitCustomerName: activity.customerName,
                group: duplicate
            });
            copy.customerId = assignment.customerId;
            copy.customerName = assignment.customerName;
            const saved = this.activityLayouts.get(activity.id);
            let layout;
            if (this.isCompleteLayout(saved)) {
                layout = { ...saved, activityId: copy.id };
            } else {
                // Legacy members without a usable relative layout get a fresh
                // group-relative position instead of all stacking at {0,0}.
                const derived = derivedLayouts.get(activity.id) || {
                    activityId: activity.id,
                    x: 0,
                    y: 0,
                    width: 160,
                    height: 112
                };
                layout = { ...derived, activityId: copy.id };
            }
            const dimensions = this.normalizeActivityGeometryDimensions(copy, layout.width, layout.height);
            layout = {
                ...layout,
                x: this.snapToCanvasGrid(layout.x),
                y: this.snapToCanvasGrid(layout.y),
                width: dimensions.width,
                height: dimensions.height
            };
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
            try {
                await this.storage.deleteGroup?.(duplicate.id);
                for (const { copy } of copies) {
                    await this.storage.deleteActivity?.(copy.id);
                    await this.storage.deleteLayout?.(copy.id);
                }
            } catch { /* best-effort cleanup */ }
            this.showToast(this.t('groupCreateFailed'));
            return null;
        }
        this.renderMain();
        await this.recordCanvasHistoryFromSnapshot('duplicate-group', historyBefore);
        this.showToast(this.t('groupDuplicated', { name: duplicate.name }));
        return duplicate;
    }

    getActivityCanvasLayout(activity, index, includeDisplayOffset = true) {
        const cached = this._baseLayoutCache?.get(activity.id);
        if (cached) {
            const layout = { x: cached.x, y: cached.y, width: cached.width, height: cached.height };
            if (cached.groupId) {
                layout.x += cached.groupX;
                layout.y += cached.groupY;
                if (includeDisplayOffset) {
                    const offset = this.groupDisplayOffset(cached.groupId);
                    layout.x += offset.x;
                    layout.y += offset.y;
                }
            }
            if (includeDisplayOffset) {
                const offset = this.activityDisplayOffset(activity.id);
                layout.x += offset.x;
                layout.y += offset.y;
            }
            return layout;
        }
        const saved = this.activityLayouts.get(activity.id);
        const group = this.activityGroup(activity);
        // Only members without a stored position need the generated fallback.
        // That fallback is relative to the group and ordered by the member's
        // place inside the group; using the global activity order would scatter
        // legacy members far away from the saved anchor.
        let order = Number.isFinite(Number(activity.position)) ? Number(activity.position) : index;
        if (!Number.isFinite(Number(saved?.x)) || !Number.isFinite(Number(saved?.y))) {
            order = group
                ? Math.max(0, this.groupMembers(group).indexOf(activity))
                : (Number.isFinite(Number(activity.position)) ? Number(activity.position) : index);
        }
        const angle = order * 2.399963229728653;
        const radius = 82 * Math.sqrt(Math.max(0, order));
        const dimensions = this.normalizeActivityGeometryDimensions(activity, saved?.width, saved?.height);
        const groupX = group ? group.x : 0;
        const groupY = group ? group.y : 0;
        const relativeX = this.clampCanvasCoordinate(
            saved?.x,
            24 + radius * (1 + Math.cos(angle)),
            group ? -10000 : 0,
            group ? 10000 : 2800
        );
        const relativeY = this.clampCanvasCoordinate(
            saved?.y,
            24 + radius * (1 + Math.sin(angle)),
            group ? -10000 : 0,
            group ? 10000 : 1600
        );
        const absoluteX = this.snapToCanvasGrid(groupX + relativeX);
        const absoluteY = this.snapToCanvasGrid(groupY + relativeY);
        const base = {
            x: group ? absoluteX - groupX : absoluteX,
            y: group ? absoluteY - groupY : absoluteY,
            width: dimensions.width,
            height: dimensions.height,
            groupId: group ? group.id : null,
            groupX,
            groupY
        };
        if (this._baseLayoutCache) this._baseLayoutCache.set(activity.id, base);
        const layout = { x: base.x, y: base.y, width: base.width, height: base.height };
        if (base.groupId) {
            layout.x += base.groupX;
            layout.y += base.groupY;
            if (includeDisplayOffset) {
                const offset = this.groupDisplayOffset(base.groupId);
                layout.x += offset.x;
                layout.y += offset.y;
            }
        }
        if (includeDisplayOffset) {
            const offset = this.activityDisplayOffset(activity.id);
            layout.x += offset.x;
            layout.y += offset.y;
        }
        return layout;
    }

    activityGroup(activity) {
        if (!activity?.groupId) return null;
        if (this._canvasIndex) return this._canvasIndex.groupsById.get(activity.groupId) || null;
        return this.groups.find(group => group.id === activity.groupId) || null;
    }

    // One O(activities + groups) pass that removes the repeated groups.find /
    // activities.filter calls from rendering, collision and pointer handlers.
    // It is built fresh for every render and for every pointer-move query, so
    // it can never go stale.
    buildCanvasIndex() {
        const groupsById = new Map();
        const positionsById = new Map();
        const activitiesByGroup = new Map();
        const childrenByParent = new Map();
        for (let index = 0; index < this.groups.length; index += 1) {
            const group = this.groups[index];
            groupsById.set(group.id, group);
        }
        for (let index = 0; index < this.activities.length; index += 1) {
            const activity = this.activities[index];
            positionsById.set(activity.id, index);
            const groupId = activity.groupId;
            if (!groupId || !groupsById.has(groupId)) continue;
            let members = activitiesByGroup.get(groupId);
            if (!members) {
                members = [];
                activitiesByGroup.set(groupId, members);
            }
            members.push(activity);
        }
        for (const group of this.groups) {
            if (!group.parentId || !groupsById.has(group.parentId)) continue;
            let children = childrenByParent.get(group.parentId);
            if (!children) {
                children = [];
                childrenByParent.set(group.parentId, children);
            }
            children.push(group);
        }
        return { groupsById, positionsById, activitiesByGroup, childrenByParent };
    }

    groupParent(group, index = this._canvasIndex) {
        if (!group?.parentId) return null;
        if (index) return index.groupsById.get(group.parentId) || null;
        return this.groups.find(item => item.id === group.parentId) || null;
    }

    groupChildren(group, index = this._canvasIndex) {
        if (!group) return [];
        if (index) return index.childrenByParent?.get(group.id) || [];
        return this.groups.filter(item => item.parentId === group.id);
    }

    groupAncestors(group) {
        const ancestors = [];
        const seen = new Set([group?.id]);
        let current = group;
        while (current?.parentId && !seen.has(current.parentId)) {
            const parent = this.groups.find(item => item.id === current.parentId);
            if (!parent) break;
            seen.add(parent.id);
            ancestors.push(parent);
            current = parent;
        }
        return ancestors;
    }

    isGroupVisible(group) {
        return !this.groupAncestors(group).some(ancestor => ancestor.collapsed);
    }

    isActivityVisible(activity) {
        const group = this.activityGroup(activity);
        if (!group) return true;
        if (group.collapsed) return false;
        return this.isGroupVisible(group);
    }

    groupDescendantIds(groupId) {
        const descendants = [];
        const seen = new Set([groupId]);
        const queue = [groupId];
        while (queue.length) {
            const current = queue.shift();
            for (const child of this.groups.filter(item => item.parentId === current)) {
                if (seen.has(child.id)) continue;
                seen.add(child.id);
                descendants.push(child.id);
                queue.push(child.id);
            }
        }
        return descendants;
    }

    // Remove parents that no longer exist or that form a cycle. Keeps existing
    // records compatible when a group was deleted outside the app.
    sanitizeGroupParents() {
        const byId = new Map(this.groups.map(group => [group.id, group]));
        for (const group of this.groups) {
            if (!group.parentId) continue;
            if (!byId.has(group.parentId)) {
                delete group.parentId;
                continue;
            }
            const seen = new Set([group.id]);
            let current = group.parentId;
            while (current) {
                if (seen.has(current)) {
                    delete group.parentId;
                    break;
                }
                seen.add(current);
                current = byId.get(current)?.parentId || null;
            }
        }
    }

    groupMembers(group, index = this._canvasIndex) {
        if (index) return index.activitiesByGroup.get(group.id) || [];
        return this.activities.filter(activity => activity.groupId === group.id);
    }

    activityIndexOf(activity, index = this._canvasIndex) {
        const position = index?.positionsById?.get(activity.id);
        if (Number.isFinite(position)) return position;
        return this.activities.indexOf(activity);
    }

    // Plain-data clone for persisted canvas records. Works in every runtime the
    // app targets without depending on structuredClone support.
    cloneCanvasRecord(record) {
        return JSON.parse(JSON.stringify(record));
    }

    isCompleteLayout(layout) {
        return Boolean(layout)
            && Number.isFinite(Number(layout.x))
            && Number.isFinite(Number(layout.y))
            && Number.isFinite(Number(layout.width))
            && Number.isFinite(Number(layout.height));
    }

    clampCanvasCoordinate(value, fallback, min, max) {
        const number = Number(value);
        return Number.isFinite(number) ? Math.max(min, Math.min(max, number)) : fallback;
    }

    snapToCanvasGrid(value) {
        return CanvasGeometry.snap(value);
    }

    floorToCanvasGrid(value) {
        return CanvasGeometry.floor(value);
    }

    ceilToCanvasGrid(value) {
        return CanvasGeometry.ceil(value);
    }

    normalizeActivityGeometryDimensions(activity, width, height) {
        return CanvasGeometry.normalizeActivityDimensions(activity, width, height);
    }

    // Derive compact group-relative positions for members that have no usable
    // layout yet. Valid layouts are fixed obstacles. The result is a
    // deterministic cell grid anchored at the group origin, so the repair is
    // stable, fast and idempotent.
    deriveGroupRelativeLayouts(group) {
        const derived = new Map();
        const members = this.activities.filter(activity => activity.groupId === group.id);
        if (!members.length) return derived;
        const fixed = [];
        const missing = [];
        for (const member of members) {
            const layout = this.getActivityCanvasLayout(member, this.activities.indexOf(member), false);
            const relative = {
                x: layout.x - group.x,
                y: layout.y - group.y,
                width: layout.width,
                height: layout.height
            };
            if (this.isCompleteLayout(this.activityLayouts.get(member.id))) {
                fixed.push(relative);
                continue;
            }
            missing.push({ member, ...relative });
        }
        if (!missing.length) return derived;
        let maxWidth = this.ceilToCanvasGrid(CANVAS_GROUP_COLLAPSED_WIDTH);
        let maxHeight = this.ceilToCanvasGrid(CANVAS_GROUP_COLLAPSED_HEIGHT);
        for (const box of fixed) {
            maxWidth = Math.max(maxWidth, box.width);
            maxHeight = Math.max(maxHeight, box.height);
        }
        for (const entry of missing) {
            maxWidth = Math.max(maxWidth, entry.width);
            maxHeight = Math.max(maxHeight, entry.height);
        }
        const cellWidth = this.ceilToCanvasGrid(maxWidth + CANVAS_IMPORT_GAP * 2);
        const cellHeight = this.ceilToCanvasGrid(maxHeight + CANVAS_IMPORT_GAP * 2);
        const occupied = new Set();
        const markCells = (x, y, width, height) => {
            const firstColumn = Math.floor(x / cellWidth);
            const lastColumn = Math.floor((x + width) / cellWidth);
            const firstRow = Math.floor(y / cellHeight);
            const lastRow = Math.floor((y + height) / cellHeight);
            for (let row = firstRow; row <= lastRow; row += 1) {
                for (let column = firstColumn; column <= lastColumn; column += 1) {
                    occupied.add(`${row}:${column}`);
                }
            }
        };
        for (const box of fixed) markCells(box.x, box.y, box.width, box.height);
        const columns = Math.max(1, Math.ceil(Math.sqrt(missing.length + fixed.length)));
        let cell = 0;
        for (const entry of missing) {
            while (true) {
                const row = Math.floor(cell / columns);
                const column = cell % columns;
                cell += 1;
                const key = `${row}:${column}`;
                if (occupied.has(key)) continue;
                occupied.add(key);
                derived.set(entry.member.id, {
                    activityId: entry.member.id,
                    x: column * cellWidth,
                    y: row * cellHeight,
                    width: entry.width,
                    height: entry.height
                });
                break;
            }
        }
        return derived;
    }

    // Repair groups whose members predate group-relative layout records. Valid
    // layouts are never touched; once a derived record is written it is
    // complete, so a later call leaves it alone.
    async migrateActivityCanvasGeometry() {
        if (!this.activities.length || !this.activityLayouts.size) return 0;
        this._canvasIndex = this.buildCanvasIndex();
        this._baseLayoutCache = new Map();
        const migrated = [];
        for (const activity of this.activities) {
            const original = this.activityLayouts.get(activity.id);
            if (!original) continue;
            const absolute = this.getActivityCanvasLayout(activity, this.activityIndexOf(activity), false);
            const group = this.activityGroup(activity);
            const next = {
                ...original,
                x: group ? absolute.x - group.x : absolute.x,
                y: group ? absolute.y - group.y : absolute.y,
                width: absolute.width,
                height: absolute.height
            };
            const changed = original.x !== next.x || original.y !== next.y
                || original.width !== next.width || original.height !== next.height
                || typeof original.x !== 'number' || typeof original.y !== 'number'
                || typeof original.width !== 'number' || typeof original.height !== 'number';
            if (!changed) continue;
            this.activityLayouts.set(activity.id, next);
            migrated.push(next);
        }
        this._canvasIndex = null;
        this._baseLayoutCache = null;
        if (migrated.length) {
            try {
                if (typeof this.storage.saveLayouts === 'function') {
                    await this.storage.saveLayouts(migrated);
                } else {
                    for (const layout of migrated) await this.storage.saveLayout?.(layout);
                }
            } catch (error) {
                console.warn('TimerHub activity geometry migration failed:', error);
            }
        }
        return migrated.length;
    }

    async migrateMissingGroupLayouts() {
        if (!this.groups.length || !this.activities.length) return 0;
        const pending = [];
        for (const group of this.groups) {
            const derived = this.deriveGroupRelativeLayouts(group);
            for (const [activityId, layout] of derived) {
                this.activityLayouts.set(activityId, layout);
                pending.push(layout);
            }
        }
        for (const layout of pending) {
            try {
                await this.storage.saveLayout?.(layout);
            } catch {
                // The in-memory layout is repaired for this session; the next
                // start detects the still-missing record and retries.
            }
        }
        return pending.length;
    }

    magneticActivityOthers(excludeId) {
        const index = this.buildCanvasIndex();
        return this.activities
            .filter(activity => activity.id !== excludeId && !index.groupsById.get(activity.groupId)?.collapsed)
            .map(activity => this.getActivityCanvasLayout(activity, this.activityIndexOf(activity, index)));
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

    updateActivityAssignmentsToggle() {
        const button = document.getElementById('activityAssignmentsToggleBtn');
        if (!button) return;
        const visible = this.showActivityAssignments === true;
        const label = visible ? this.t('hideAssignments') : this.t('showAssignments');
        button.setAttribute('aria-pressed', String(visible));
        button.setAttribute('aria-label', label);
        button.title = label;
    }

    async toggleActivityAssignments() {
        this.showActivityAssignments = !this.showActivityAssignments;
        this.updateActivityAssignmentsToggle();
        this.renderMain();
        try {
            await this.storage.setSetting('showActivityAssignments', this.showActivityAssignments);
        } catch { /* display preference only */ }
    }

    activityAssignmentLabels(activity) {
        const lookupName = (items, id) => (Array.isArray(items) ? items : [])
            .find(item => String(item.id) === String(id))?.name || '';
        const customerName = String(activity?.customerName || '').trim()
            || String(lookupName(this.clockodoCustomers, activity?.customerId)).trim();
        const projectName = String(activity?.projectName || activity?.project || '').trim()
            || String(lookupName(this.clockodoProjects, activity?.projectId)).trim();
        return { customerName, projectName };
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
        const selectedGroups = this.selectedGroupIds?.size || 0;
        const groupIntoParent = document.getElementById('createGroupFromGroupsBtn');
        if (groupIntoParent) {
            const label = this.t('groupSelectedGroupsCount', { count: selectedGroups });
            groupIntoParent.hidden = selectedGroups === 0;
            groupIntoParent.setAttribute('aria-label', label);
            groupIntoParent.title = label;
        }
        const deleteGroups = document.getElementById('deleteGroupsBtn');
        if (deleteGroups) {
            const label = this.t('deleteSelectedGroups');
            deleteGroups.hidden = selectedGroups === 0;
            deleteGroups.setAttribute('aria-label', label);
            deleteGroups.title = label;
        }
        this.updateCanvasHistoryActions();
    }

    selectedTopLevelGroups() {
        return this.groups
            .filter(group => this.selectedGroupIds?.has(group.id))
            .filter(group => !this.groupAncestors(group).some(ancestor => this.selectedGroupIds.has(ancestor.id)));
    }

    setGroupSelection(ids) {
        const next = new Set([...(ids || [])].filter(id => this.groups.some(group => group.id === id)));
        this.selectedGroupIds = next;
        const stage = document.getElementById('activitiesGrid');
        if (stage) {
            for (const group of this.groups) {
                const container = stage.querySelector(
                    `.group-container[data-group-id="${CSS.escape(group.id)}"]`
                );
                if (!container) continue;
                container.classList.toggle('is-selected', next.has(group.id));
            }
        }
        this.updateCanvasGroupAction();
        return next;
    }

    toggleGroupSelection(groupId, additive = false) {
        if (!additive) {
            this.setGroupSelection([groupId]);
            return;
        }
        const next = new Set(this.selectedGroupIds);
        if (next.has(groupId)) next.delete(groupId);
        else next.add(groupId);
        this.setGroupSelection(next);
    }

    clearGroupSelection() {
        if (!this.selectedGroupIds?.size) return;
        this.setGroupSelection([]);
    }

    async createGroupFromSelectedGroups() {
        const selected = this.selectedTopLevelGroups();
        if (!selected.length) return null;
        const historyBefore = this.snapshotCanvasState();
        const boundsList = selected
            .map(group => group.collapsed ? this.groupCollapsedBounds(group) : this.groupBaseBounds(group))
            .filter(Boolean);
        if (!boundsList.length) return null;
        const minX = Math.min(...boundsList.map(bounds => bounds.left));
        const minY = Math.min(...boundsList.map(bounds => bounds.top));
        const parents = new Set(selected.map(group => group.parentId || null));
        const parentId = parents.size === 1 ? [...parents][0] : null;
        const parent = parentId ? this.groups.find(group => group.id === parentId) : null;
        const group = {
            id: this.generateId(),
            name: this.t('groupDefaultName', { number: this.groups.length + 1 }),
            x: this.snapToCanvasGrid(minX + CANVAS_GROUP_PADDING),
            y: this.snapToCanvasGrid(minY + CANVAS_GROUP_HEADER),
            collapsed: false
        };
        if (parentId && parent) group.parentId = parentId;
        this.groups.push(group);
        const previousParents = selected.map(child => ({ child, parentId: child.parentId }));
        for (const child of selected) child.parentId = group.id;
        try {
            await this.storage.saveGroup?.(group);
            for (const child of selected) await this.storage.saveGroup?.(child);
        } catch {
            this.groups = this.groups.filter(item => item.id !== group.id);
            for (const entry of previousParents) {
                if (entry.parentId) entry.child.parentId = entry.parentId;
                else delete entry.child.parentId;
            }
            this.showToast(this.t('groupCreateFailed'));
            return null;
        }
        this.setGroupSelection([group.id]);
        this.renderMain();
        await this.recordCanvasHistoryFromSnapshot('group-groups', historyBefore);
        this.showToast(this.t('groupCreated', { name: group.name }));
        return group;
    }

    isGroupDeletionProtected(group) {
        if (group?.locked === true) return true;
        return this.groupAncestors(group).some(ancestor => ancestor.locked === true);
    }

    groupDeletionPlan(choices = { activities: 'keep', nested: 'keep' }) {
        const roots = this.selectedTopLevelGroups();
        const deletingGroupIds = new Set(roots.map(group => group.id));
        if (choices.nested === 'delete') {
            for (const root of roots) {
                for (const id of this.groupDescendantIds(root.id)) deletingGroupIds.add(id);
            }
        }
        const hierarchyGroups = [];
        const visit = group => {
            hierarchyGroups.push(group);
            for (const child of this.groupChildren(group)) visit(child);
        };
        for (const root of roots) visit(root);
        const activities = [];
        for (const group of hierarchyGroups) activities.push(...this.groupMembers(group));
        const nestedGroups = hierarchyGroups.filter(group => !roots.includes(group));
        const deletingGroups = hierarchyGroups.filter(group => deletingGroupIds.has(group.id));
        const survivingGroups = hierarchyGroups.filter(group => !deletingGroupIds.has(group.id));
        return {
            roots,
            choices,
            deletingGroupIds,
            hierarchyGroups,
            nestedGroups,
            deletingGroups,
            survivingGroups,
            activities,
            activitiesToDelete: choices.activities === 'delete' ? activities : [],
            activitiesToKeep: choices.activities === 'delete' ? [] : activities,
            locked: deletingGroups.filter(group => this.isGroupDeletionProtected(group))
        };
    }

    openGroupDeleteModal() {
        const plan = this.groupDeletionPlan();
        if (!plan.roots.length) return false;
        this.pendingGroupDeletion = { choices: { activities: null, nested: null } };
        for (const id of ['groupDeleteActivitiesKeep', 'groupDeleteActivitiesDelete', 'groupDeleteNestedKeep', 'groupDeleteNestedDelete']) {
            const input = document.getElementById(id);
            if (input) input.checked = false;
        }
        const summary = document.getElementById('groupDeleteSummary');
        if (summary) {
            summary.textContent = this.t('deleteGroupsSummary', {
                groups: plan.hierarchyGroups.length,
                activities: plan.activities.length,
                children: plan.nestedGroups.length
            });
        }
        this.updateGroupDeleteDialog();
        document.getElementById('groupDeleteModal')?.classList.add('active');
        return true;
    }

    updateGroupDeleteDialog() {
        const pending = this.pendingGroupDeletion;
        if (!pending) return false;
        const outcome = document.getElementById('groupDeleteOutcome');
        const lockedWarning = document.getElementById('groupDeleteLockedWarning');
        const confirm = document.getElementById('groupDeleteConfirmBtn');
        const choices = pending.choices;
        if (!choices.activities || !choices.nested) {
            if (outcome) outcome.textContent = this.t('deleteChoiceRequired');
            if (lockedWarning) {
                lockedWarning.textContent = '';
                lockedWarning.style.display = 'none';
            }
            if (confirm) confirm.disabled = true;
            return false;
        }
        const plan = this.groupDeletionPlan(choices);
        if (outcome) {
            outcome.textContent = this.t('deleteOutcomeSummary', {
                keptActivities: plan.activitiesToKeep.length,
                deletedActivities: plan.activitiesToDelete.length,
                keptGroups: plan.survivingGroups.length,
                deletedGroups: plan.deletingGroups.length
            });
        }
        if (lockedWarning) {
            if (plan.locked.length) {
                lockedWarning.textContent = this.t('deleteLockedWarning', {
                    names: plan.locked.map(group => group.name).join(', ')
                });
                lockedWarning.style.display = '';
            } else {
                lockedWarning.textContent = '';
                lockedWarning.style.display = 'none';
            }
        }
        if (confirm) confirm.disabled = plan.locked.length > 0;
        return plan.locked.length === 0;
    }

    closeGroupDeleteModal() {
        this.pendingGroupDeletion = null;
        document.getElementById('groupDeleteModal')?.classList.remove('active');
    }

    captureGroupDeletionHistory(plan, reparented, ungrouped) {
        const groupIds = new Set(plan.deletingGroupIds);
        for (const entry of reparented) groupIds.add(entry.group.id);
        const activityIds = new Set(plan.activitiesToDelete.map(activity => activity.id));
        for (const entry of ungrouped) activityIds.add(entry.activity.id);
        const before = { groups: [], activities: [], layouts: [] };
        const after = { groups: [], activities: [], layouts: [] };
        for (const id of groupIds) {
            const group = this.groups.find(item => item.id === id);
            if (group) before.groups.push(this.cloneCanvasRecord(group));
        }
        for (const entry of reparented) {
            const group = this.groups.find(item => item.id === entry.group.id);
            if (!group) continue;
            const record = this.cloneCanvasRecord(group);
            if (entry.nextParentId) record.parentId = entry.nextParentId;
            else delete record.parentId;
            after.groups.push(record);
        }
        for (const id of activityIds) {
            const activity = this.activities.find(item => item.id === id);
            const layout = this.activityLayouts.get(id);
            if (activity) before.activities.push(this.cloneCanvasRecord(activity));
            if (layout) before.layouts.push(this.cloneCanvasRecord(layout));
        }
        for (const entry of ungrouped) {
            const activity = this.cloneCanvasRecord(entry.activity);
            delete activity.groupId;
            after.activities.push(activity);
            after.layouts.push(this.cloneCanvasRecord(entry.layout));
        }
        return {
            label: 'delete-groups',
            ids: {
                groups: [...groupIds],
                activities: [...activityIds],
                layouts: [...activityIds]
            },
            before,
            after
        };
    }

    snapshotCanvasState() {
        const activities = [...(this.activities || []), ...(this.archivedActivities || [])];
        return {
            groups: (this.groups || []).map(record => this.cloneCanvasRecord(record)),
            activities: activities.map(record => this.cloneCanvasRecord(record)),
            layouts: [...(this.activityLayouts?.values?.() || [])].map(record => this.cloneCanvasRecord(record))
        };
    }

    buildCanvasHistoryEntry(label, before, after) {
        if (!before || !after) return null;
        const diff = (beforeRecords, afterRecords, key) => {
            const beforeMap = new Map(beforeRecords.map(record => [String(record[key]), record]));
            const afterMap = new Map(afterRecords.map(record => [String(record[key]), record]));
            const ids = [...new Set([...beforeMap.keys(), ...afterMap.keys()])].sort();
            const changedIds = [];
            const beforeChanged = [];
            const afterChanged = [];
            for (const id of ids) {
                const beforeRecord = beforeMap.get(id);
                const afterRecord = afterMap.get(id);
                if (JSON.stringify(beforeRecord) === JSON.stringify(afterRecord)) continue;
                changedIds.push(id);
                if (beforeRecord) beforeChanged.push(beforeRecord);
                if (afterRecord) afterChanged.push(afterRecord);
            }
            return { ids: changedIds, before: beforeChanged, after: afterChanged };
        };
        const groups = diff(before.groups, after.groups, 'id');
        const activities = diff(before.activities, after.activities, 'id');
        const layouts = diff(before.layouts, after.layouts, 'activityId');
        if (!groups.ids.length && !activities.ids.length && !layouts.ids.length) return null;
        return {
            id: `canvas_${Date.now().toString(36)}_${this.generateId()}`,
            label: String(label || 'canvas-change').slice(0, 120),
            createdAt: Date.now(),
            sequence: ++this.canvasHistorySequence,
            undone: false,
            ids: {
                groups: groups.ids,
                activities: activities.ids,
                layouts: layouts.ids
            },
            before: {
                groups: groups.before,
                activities: activities.before,
                layouts: layouts.before
            },
            after: {
                groups: groups.after,
                activities: activities.after,
                layouts: layouts.after
            }
        };
    }

    async recordCanvasHistoryFromSnapshot(label, before) {
        const entry = this.buildCanvasHistoryEntry(label, before, this.snapshotCanvasState());
        if (!entry) return false;
        return this.recordCanvasHistory(entry);
    }

    async recordCanvasHistory(entry) {
        if (!entry) return false;
        if (!Array.isArray(this.canvasUndoStack)) this.canvasUndoStack = [];
        if (!Array.isArray(this.canvasRedoStack)) this.canvasRedoStack = [];
        if (!Number.isFinite(Number(this.maxCanvasHistory))) this.maxCanvasHistory = 50;
        if (!Number.isFinite(Number(this.canvasHistorySequence))) this.canvasHistorySequence = 0;
        entry.id = entry.id || `canvas_${Date.now().toString(36)}_${this.generateId()}`;
        entry.createdAt = Number(entry.createdAt) || Date.now();
        entry.sequence = Number(entry.sequence) || ++this.canvasHistorySequence;
        this.canvasHistorySequence = Math.max(this.canvasHistorySequence, entry.sequence);
        entry.undone = false;
        const redoEntries = this.canvasRedoStack;
        this.canvasRedoStack = [];
        this.canvasUndoStack.push(entry);
        const dropped = [];
        while (this.canvasUndoStack.length > this.maxCanvasHistory) {
            dropped.push(this.canvasUndoStack.shift());
        }
        this.updateCanvasHistoryActions();
        try {
            await this.storage.saveCanvasHistoryEntry?.(entry, this.maxCanvasHistory);
            if (redoEntries.length) {
                await this.storage.deleteCanvasHistoryEntries?.(redoEntries.map(item => item.id));
            }
            if (dropped.length) {
                await this.storage.deleteCanvasHistoryEntries?.(dropped.map(item => item.id));
            }
        } catch (error) {
            this.diagnostics?.warn('canvas', 'persist-history', error, { status: 'failed' });
        }
        return true;
    }

    async clearCanvasHistory() {
        this.canvasUndoStack = [];
        this.canvasRedoStack = [];
        this.canvasHistorySequence = 0;
        this.updateCanvasHistoryActions();
        try { await this.storage.clearCanvasHistory?.(); } catch (error) {
            this.diagnostics?.warn('canvas', 'clear-history', error, { status: 'failed' });
        }
    }

    async loadCanvasHistory() {
        try {
            const entries = await this.storage.getCanvasHistory?.() || [];
            const valid = entries.filter(entry => entry && entry.ids &&
                Array.isArray(entry.ids.groups) && Array.isArray(entry.ids.activities) &&
                Array.isArray(entry.ids.layouts) && entry.before && entry.after);
            this.canvasUndoStack = valid.filter(entry => entry.undone !== true)
                .sort((a, b) => (Number(a.sequence) || 0) - (Number(b.sequence) || 0));
            this.canvasRedoStack = valid.filter(entry => entry.undone === true)
                .sort((a, b) => (Number(b.sequence) || 0) - (Number(a.sequence) || 0));
            if (this.canvasUndoStack.length > this.maxCanvasHistory) {
                this.canvasUndoStack = this.canvasUndoStack.slice(-this.maxCanvasHistory);
            }
            this.canvasHistorySequence = Math.max(0, ...valid.map(entry => Number(entry.sequence) || 0));
            this.updateCanvasHistoryActions();
        } catch (error) {
            this.diagnostics?.warn('canvas', 'load-history', error, { status: 'failed' });
            this.canvasUndoStack = [];
            this.canvasRedoStack = [];
            this.updateCanvasHistoryActions();
        }
    }

    updateCanvasHistoryActions() {
        const undo = document.getElementById('undoCanvasBtn');
        if (undo) undo.hidden = (this.canvasUndoStack || []).length === 0;
        const redo = document.getElementById('redoCanvasBtn');
        if (redo) redo.hidden = (this.canvasRedoStack || []).length === 0;
    }

    async applyCanvasHistoryState(entry, side) {
        const state = entry[side];
        const groupRecords = new Map(state.groups.map(record => [record.id, record]));
        const activityRecords = new Map(state.activities.map(record => [record.id, record]));
        const layoutRecords = new Map(state.layouts.map(record => [record.activityId, record]));
        for (const id of entry.ids.groups) {
            const record = groupRecords.get(id);
            if (record) await this.storage.saveGroup?.(record);
            else await this.storage.deleteGroup?.(id);
        }
        for (const id of entry.ids.activities) {
            const record = activityRecords.get(id);
            if (record) await this.storage.saveActivity(record);
            else await this.storage.deleteActivity?.(id);
        }
        for (const id of entry.ids.layouts) {
            const record = layoutRecords.get(id);
            if (record) await this.storage.saveLayout(record);
            else await this.storage.deleteLayout?.(id);
        }
        const groupIds = new Set(entry.ids.groups);
        this.groups = this.groups.filter(group => !groupIds.has(group.id));
        for (const record of state.groups) this.groups.push(this.cloneCanvasRecord(record));
        const activityIds = new Set(entry.ids.activities);
        this.activities = this.activities.filter(activity => !activityIds.has(activity.id));
        this.archivedActivities = (this.archivedActivities || []).filter(activity => !activityIds.has(activity.id));
        for (const record of state.activities) {
            const copy = this.cloneCanvasRecord(record);
            if (copy.archived) this.archivedActivities.push(copy);
            else this.activities.push(copy);
        }
        this.activities.sort((a, b) => (a.position || 0) - (b.position || 0));
        for (const id of entry.ids.layouts) this.activityLayouts.delete(id);
        for (const record of state.layouts) this.activityLayouts.set(record.activityId, this.cloneCanvasRecord(record));
        this.selectedGroupIds = new Set();
        this.selectedActivityIds = new Set();
        this.renderMain();
    }

    async undoCanvas() {
        const entry = (this.canvasUndoStack || []).pop();
        if (!entry) return false;
        try {
            await this.applyCanvasHistoryState(entry, 'before');
        } catch (error) {
            this.canvasUndoStack.push(entry);
            this.diagnostics?.warn('canvas', 'undo', error, { status: 'failed' });
            return false;
        }
        entry.undone = true;
        this.canvasRedoStack.push(entry);
        this.updateCanvasHistoryActions();
        try { await this.storage.updateCanvasHistoryEntry?.(entry); } catch (error) {
            this.diagnostics?.warn('canvas', 'persist-undo', error, { status: 'failed' });
        }
        return true;
    }

    async redoCanvas() {
        const entry = (this.canvasRedoStack || []).pop();
        if (!entry) return false;
        try {
            await this.applyCanvasHistoryState(entry, 'after');
        } catch (error) {
            this.canvasRedoStack.push(entry);
            this.diagnostics?.warn('canvas', 'redo', error, { status: 'failed' });
            return false;
        }
        entry.undone = false;
        this.canvasUndoStack.push(entry);
        this.updateCanvasHistoryActions();
        try { await this.storage.updateCanvasHistoryEntry?.(entry); } catch (error) {
            this.diagnostics?.warn('canvas', 'persist-redo', error, { status: 'failed' });
        }
        return true;
    }

    async deleteSelectedGroups() {
        const pending = this.pendingGroupDeletion;
        const choices = pending?.choices;
        if (!choices?.activities || !choices?.nested) return false;
        const plan = this.groupDeletionPlan(choices);
        if (!plan.roots.length || plan.locked.length) return false;
        const deletingGroupIds = new Set(plan.deletingGroupIds);
        const groupById = new Map(this.groups.map(group => [group.id, group]));

        const reparented = [];
        for (const group of plan.hierarchyGroups) {
            if (deletingGroupIds.has(group.id)) continue;
            let nextParentId = group.parentId || null;
            while (nextParentId && deletingGroupIds.has(nextParentId)) {
                nextParentId = groupById.get(nextParentId)?.parentId || null;
            }
            if ((group.parentId || null) !== nextParentId) reparented.push({ group, nextParentId });
        }

        const ungrouped = [];
        if (choices.activities === 'keep') {
            for (const group of plan.deletingGroups) {
                for (const activity of this.groupMembers(group)) {
                    const stored = this.activityLayouts.get(activity.id);
                    const fallback = this.getActivityCanvasLayout(activity, this.activityIndexOf(activity), false);
                    const absolute = stored && Number.isFinite(Number(stored.x)) && Number.isFinite(Number(stored.y))
                        ? { x: group.x + Number(stored.x), y: group.y + Number(stored.y), width: stored.width, height: stored.height }
                        : { x: fallback.x, y: fallback.y, width: fallback.width, height: fallback.height };
                    ungrouped.push({
                        activity,
                        layout: {
                            activityId: activity.id,
                            x: absolute.x,
                            y: absolute.y,
                            width: absolute.width,
                            height: absolute.height
                        }
                    });
                }
            }
        }

        const historyEntry = this.captureGroupDeletionHistory(plan, reparented, ungrouped);
        this.closeGroupDeleteModal();
        try {
            for (const entry of reparented) {
                const record = this.cloneCanvasRecord(entry.group);
                if (entry.nextParentId) record.parentId = entry.nextParentId;
                else delete record.parentId;
                await this.storage.saveGroup?.(record);
            }
            for (const group of plan.deletingGroups) await this.storage.deleteGroup?.(group.id);
            for (const activity of plan.activitiesToDelete) {
                await this.storage.deleteActivity?.(activity.id);
                await this.storage.deleteLayout?.(activity.id);
            }
            for (const entry of ungrouped) {
                const record = this.cloneCanvasRecord(entry.activity);
                delete record.groupId;
                await this.storage.saveActivity(record);
                await this.storage.saveLayout(entry.layout);
            }
        } catch {
            this.showToast(this.t('groupDeleteFailed'));
            return false;
        }
        for (const entry of reparented) {
            if (entry.nextParentId) entry.group.parentId = entry.nextParentId;
            else delete entry.group.parentId;
        }
        const activityIdsToDelete = new Set(plan.activitiesToDelete.map(activity => activity.id));
        this.activities = this.activities.filter(activity => !activityIdsToDelete.has(activity.id));
        for (const id of activityIdsToDelete) this.activityLayouts.delete(id);
        for (const entry of ungrouped) {
            delete entry.activity.groupId;
            this.activityLayouts.set(entry.activity.id, entry.layout);
        }
        this.groups = this.groups.filter(group => !deletingGroupIds.has(group.id));
        this.selectedGroupIds = new Set();
        this.selectedActivityIds = new Set();
        await this.recordCanvasHistory(historyEntry);
        this.renderMain();
        this.showToast(this.t('groupDeleted'));
        return true;
    }

    handleGlobalKeydown(event) {
        if (!event?.key) return;
        const tag = event.target?.tagName?.toLowerCase?.();
        if (tag === 'input' || tag === 'textarea' || event.target?.isContentEditable) return;
        const modifier = Boolean(event.ctrlKey || event.metaKey);
        if (modifier && (event.key === 'z' || event.key === 'Z')) {
            if (typeof event.preventDefault === 'function') event.preventDefault();
            if (event.shiftKey) this.redoCanvas();
            else this.undoCanvas();
            return;
        }
        if (modifier && (event.key === 'y' || event.key === 'Y')) {
            if (typeof event.preventDefault === 'function') event.preventDefault();
            this.redoCanvas();
            return;
        }
        if (event.key === 'Escape') {
            if (this.pendingGroupDeletion) {
                this.closeGroupDeleteModal();
                return;
            }
            this.clearGroupSelection();
            return;
        }
        if ((event.key === 'Delete' || event.key === 'Backspace') && this.selectedGroupIds?.size) {
            if (typeof event.preventDefault === 'function') event.preventDefault();
            this.openGroupDeleteModal();
        }
    }

    syncCanvasToolbarLayout() {
        const nav = document.querySelector?.('.navbar-actions');
        if (!nav || typeof nav.getBoundingClientRect !== 'function') return;
        const root = document.documentElement;
        const styles = typeof window.getComputedStyle === 'function'
            ? window.getComputedStyle(nav)
            : null;
        const anchoredToBottom = Boolean(styles) &&
            styles.position === 'fixed' && (styles.bottom === '0px' || styles.bottom === '0');
        if (!anchoredToBottom) {
            root?.style?.removeProperty?.('--bottom-nav-height');
            return;
        }
        const height = nav.getBoundingClientRect().height;
        if (!Number.isFinite(height) || height <= 0) return;
        root?.style?.setProperty?.('--bottom-nav-height', `${height}px`);
    }

    pruneCanvasSelection() {
        if (!this.selectedActivityIds?.size) return;
        const valid = new Set();
        for (const id of this.selectedActivityIds) {
            const activity = this.activities.find(item => item.id === id);
            if (!activity) continue;
            if (!this.isActivityVisible(activity)) continue;
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

    hideGroupEditNameError() {
        const error = document.getElementById('groupEditNameError');
        if (!error) return;
        error.textContent = '';
        error.style.display = 'none';
    }

    showGroupEditNameError(message) {
        const error = document.getElementById('groupEditNameError');
        if (!error) return;
        error.textContent = message;
        error.style.display = '';
    }

    refreshGroupInheritedCustomer() {
        const group = this.groups.find(item => item.id === this.editingGroupId);
        if (!group || this.normalizeClockodoId(group.defaultCustomerId) !== null) {
            this.groupEditInheritedCustomer = null;
            return null;
        }
        const inherited = this.effectiveGroupDefaultCustomer(group);
        if (!inherited) {
            this.groupEditInheritedCustomer = null;
            return null;
        }
        const known = this.clockodoCustomerById(inherited.id);
        this.groupEditInheritedCustomer = {
            id: inherited.id,
            name: known?.name || inherited.name || `#${inherited.id}`,
            missing: !known && this.clockodoReferenceStatus === 'ready'
        };
        return this.groupEditInheritedCustomer;
    }

    openGroupEditModal(groupId) {
        const group = this.groups.find(item => item.id === groupId);
        if (!group) return false;
        this.editingGroupId = groupId;
        this.editingGroupColor = typeof group.color === 'string' ? group.color : '';
        const input = document.getElementById('groupEditNameInput');
        if (input) input.value = group.name;
        const lockedInput = document.getElementById('groupEditLockedInput');
        if (lockedInput) lockedInput.checked = group.locked === true;
        this.refreshGroupInheritedCustomer();
        this.populateClockodoAssignmentSelects(
            'group',
            group.defaultCustomerId,
            null,
            group.defaultCustomerName,
            ''
        );
        this.loadClockodoReferenceData();
        this.renderGroupColorOptions();
        this.hideGroupEditNameError();
        document.getElementById('groupEditModal')?.classList.add('active');
        input?.focus?.();
        return true;
    }

    closeGroupEditModal() {
        this.editingGroupId = null;
        this.editingGroupColor = '';
        this.groupEditInheritedCustomer = null;
        document.getElementById('groupEditModal')?.classList.remove('active');
    }

    renderGroupColorOptions() {
        const container = document.getElementById('groupEditColorOptions');
        if (!container) return;
        container.replaceChildren();
        const options = [''].concat(this.COLORS);
        for (const color of options) {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = `group-color-option${color === this.editingGroupColor ? ' is-selected' : ''}`;
            button.dataset.color = color;
            button.setAttribute('role', 'radio');
            button.setAttribute('aria-checked', String(color === this.editingGroupColor));
            button.setAttribute('aria-label', color || this.t('groupColorDefault'));
            button.style.setProperty('--swatch-color', color || 'transparent');
            button.addEventListener('click', () => {
                this.editingGroupColor = color;
                this.renderGroupColorOptions();
            });
            container.appendChild(button);
        }
    }

    clearGroupDefaultCustomer() {
        const ids = this.clockodoComboboxIds('group', 'customer');
        const hidden = document.getElementById(ids.hidden);
        const input = document.getElementById(ids.input);
        if (hidden) hidden.value = '';
        if (input) input.value = '';
        this.setClockodoAssignmentHint('group', null);
        return true;
    }

    async saveGroupEdit() {
        const group = this.groups.find(item => item.id === this.editingGroupId);
        if (!group) {
            this.closeGroupEditModal();
            return false;
        }
        const input = document.getElementById('groupEditNameInput');
        const name = String(input?.value ?? '').replace(/\s+/g, ' ').trim().slice(0, 120);
        if (!name) {
            this.showGroupEditNameError(this.t('groupNameRequired'));
            return false;
        }
        group.name = name;
        if (this.editingGroupColor) group.color = this.editingGroupColor;
        else delete group.color;
        const lockedInput = document.getElementById('groupEditLockedInput');
        if (lockedInput?.checked) group.locked = true;
        else delete group.locked;
        const assignment = this.readClockodoAssignment('group');
        if (assignment.customerId) {
            group.defaultCustomerId = assignment.customerId;
            group.defaultCustomerName = assignment.customerName || '';
        } else {
            delete group.defaultCustomerId;
            delete group.defaultCustomerName;
        }
        try {
            await this.storage.saveGroup?.(group);
        } catch {
            this.showGroupEditNameError(this.t('groupEditSaveFailed'));
            return false;
        }
        this.closeGroupEditModal();
        this.renderMain();
        return true;
    }

    async createGroupFromSelection(name) {
        const selected = [...(this.selectedActivityIds || [])];
        const members = this.activities.filter(activity => selected.includes(activity.id));
        if (!members.length) {
            this.showToast(this.t('selectActivitiesFirst'));
            return null;
        }
        const historyBefore = this.snapshotCanvasState();
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
        await this.recordCanvasHistoryFromSnapshot('create-group', historyBefore);
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
        // Groups are selected from their cached display bounds, converted from
        // world coordinates to client coordinates with the current pan/zoom.
        const viewport = document.getElementById('activityCanvasViewport');
        const viewportRect = typeof viewport?.getBoundingClientRect === 'function'
            ? viewport.getBoundingClientRect()
            : { left: 0, top: 0 };
        const selectedGroups = [];
        const screenPan = {
            x: this.canvasPan.x + viewportRect.left,
            y: this.canvasPan.y + viewportRect.top
        };
        for (const group of this.groups) {
            if (!this.isGroupVisible(group)) continue;
            const display = this.groupDisplayBounds.get(group.id);
            if (!display) continue;
            const topLeft = CanvasGeometry.worldToScreen(display.left, display.top, screenPan, this.canvasZoom);
            const bottomRight = CanvasGeometry.worldToScreen(display.right, display.bottom, screenPan, this.canvasZoom);
            const clientBounds = {
                left: topLeft.x,
                top: topLeft.y,
                right: bottomRight.x,
                bottom: bottomRight.y
            };
            if (this.rectanglesIntersect(bounds, clientBounds)) selectedGroups.push(group.id);
        }
        this.setCanvasSelection(selected);
        this.setGroupSelection(selectedGroups);
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
        // The dots live on the fixed viewport, so apply the stage transform to
        // their spacing and origin explicitly; otherwise pan/zoom desync them.
        const viewport = stage.parentElement || document.getElementById('activityCanvasViewport');
        if (viewport?.style) {
            const gridSize = CANVAS_GRID_SIZE * this.canvasZoom;
            viewport.style.backgroundSize = `${gridSize}px ${gridSize}px`;
            viewport.style.backgroundPosition = `${this.canvasPan.x}px ${this.canvasPan.y}px`;
        }
        this.updateCanvasControls();
    }

    screenToWorld(x, y) {
        return CanvasGeometry.screenToWorld(x, y, this.canvasPan, this.canvasZoom);
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
        if (handle) {
            handle.style.left = `${layout.x + layout.width}px`;
            handle.style.top = `${layout.y + layout.height}px`;
            if (zIndex !== undefined) handle.style.zIndex = String(zIndex + 1);
        }
        const overlay = document.querySelector(`.activity-assignment-overlay[data-activity-id="${CSS.escape(activityId)}"]`);
        if (overlay) {
            overlay.style.left = `${layout.x}px`;
            overlay.style.top = `${layout.y}px`;
            overlay.style.width = `${layout.width}px`;
            overlay.style.height = `${layout.height}px`;
        }
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
                    if (this.canvasGesture.mode === 'move') this.setCanvasDropTarget(null);
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
            const groupResizeHandle = event.target.closest?.('.group-resize-handle');
            const resizeGroup = groupResizeHandle
                && this.groups.find(item => item.id === groupResizeHandle.dataset.groupId);
            const gestureGroup = resizeGroup || group;
            const additiveGroupSelection = Boolean(event.ctrlKey || event.metaKey || event.shiftKey);
            const selectedGroups = this.selectedGroupIds || new Set();
            if (group && !selectedGroups.has(group.id) && selectedGroups.size && !additiveGroupSelection) this.clearGroupSelection();
            if (!gestureGroup && !activityButton && !resizeHandle && selectedGroups.size) this.clearGroupSelection();
            const movingGroups = group && selectedGroups.has(group.id) && selectedGroups.size > 1
                ? this.selectedTopLevelGroups()
                : gestureGroup ? [gestureGroup] : [];
            const moveIds = new Set();
            for (const item of movingGroups) {
                moveIds.add(item.id);
                for (const id of this.groupDescendantIds(item.id)) moveIds.add(id);
            }
            const groupMoveSnapshot = moveIds.size
                ? new Map([...moveIds]
                    .filter(id => this.groups.some(item => item.id === id))
                    .map(id => {
                        const item = this.groups.find(entry => entry.id === id);
                        return [id, { x: item.x, y: item.y }];
                    }))
                : null;

            this.canvasGesture = {
                pointerId: event.pointerId,
                mode: resizeGroup ? 'group-resize' : group ? 'group-move' : mode,
                activityId,
                activityButton,
                resizeHandle,
                groupId: gestureGroup?.id || null,
                group: gestureGroup || null,
                groupTitle: group ? groupTitle : null,
                groupResizeStart: resizeGroup
                    ? { width: this.groupCollapsedWidth(resizeGroup), height: this.groupCollapsedHeight(resizeGroup) }
                    : null,
                groupMoveSnapshot,
                groupSelectionAdditive: additiveGroupSelection,
                nestTargetId: null,
                groupStartX: gestureGroup?.x,
                groupStartY: gestureGroup?.y,
                dropTargetGroupId: null,
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

            this.canvasGesture.captureTarget = groupResizeHandle || resizeHandle || activityButton || viewport;
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
                if (gesture.mode !== 'pan' && gesture.mode !== 'select') {
                    gesture.canvasHistoryBefore = this.snapshotCanvasState();
                }

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

            if (gesture.mode === 'group-resize') {
                const { x: worldDx, y: worldDy } = CanvasGeometry.screenDeltaToWorld(dx, dy, this.canvasZoom);
                this.resizeCollapsedGroup(
                    gesture.group,
                    gesture.groupResizeStart.width + worldDx,
                    gesture.groupResizeStart.height + worldDy
                );
                this.positionGroupVisuals(gesture.group);
                return;
            }

            if (gesture.mode === 'group-move') {
                const { x: worldDx, y: worldDy } = CanvasGeometry.screenDeltaToWorld(dx, dy, this.canvasZoom);
                const snapshot = gesture.groupMoveSnapshot;
                const reference = snapshot?.get(gesture.group.id);
                if (reference) {
                    const snappedX = this.snapToCanvasGrid(reference.x + worldDx);
                    const snappedY = this.snapToCanvasGrid(reference.y + worldDy);
                    const moveX = snappedX - reference.x;
                    const moveY = snappedY - reference.y;
                    for (const [id, start] of snapshot) {
                        const item = this.groups.find(entry => entry.id === id);
                        if (!item) continue;
                        item.x = start.x + moveX;
                        item.y = start.y + moveY;
                    }
                    for (const id of snapshot.keys()) {
                        const item = this.groups.find(entry => entry.id === id);
                        if (item) this.positionGroupVisuals(item);
                    }
                }
                const nestTarget = this.groupNestTargetAt(event.clientX, event.clientY, gesture.group);
                const nestTargetId = nestTarget?.id || null;
                if (nestTargetId !== gesture.nestTargetId) {
                    gesture.nestTargetId = nestTargetId;
                    this.setCanvasGroupNestTarget(nestTargetId);
                }
                return;
            }

            if (gesture.mode === 'move') {
                const { x: worldDx, y: worldDy } = CanvasGeometry.screenDeltaToWorld(dx, dy, this.canvasZoom);

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
                const nextX = this.snapToCanvasGrid(gridX + magnet.x);
                const nextY = this.snapToCanvasGrid(gridY + magnet.y);

                gesture.activityButton.style.left = `${nextX}px`;
                gesture.activityButton.style.top = `${nextY}px`;

                this.positionActivityResizeHandle(gesture.activityId, {
                    ...gesture.layout,
                    x: nextX,
                    y: nextY
                });

                this.updateMoveDropTarget(gesture);
            } else if (gesture.mode === 'resize') {
                const { x: worldDx, y: worldDy } = CanvasGeometry.screenDeltaToWorld(dx, dy, this.canvasZoom);
                const activity = this.activities.find(item => item.id === gesture.activityId);
                const dimensions = this.normalizeActivityGeometryDimensions(
                    activity,
                    gesture.layout.width + worldDx,
                    gesture.layout.height + worldDy
                );
                const width = dimensions.width;
                const height = dimensions.height;

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

            if (gesture.mode === 'group-resize') {
                if (gesture.started) {
                    Promise.resolve(this.storage.saveGroup?.(gesture.group)).catch(() => {
                        this.showToast(this.t('groupCreateFailed'));
                    });
                    this.refreshGroupLayout();
                    this.recordCanvasHistoryFromSnapshot('resize-group', gesture.canvasHistoryBefore).catch(() => {});
                }
                return;
            }

            if (gesture.mode === 'group-move') {
                if (gesture.started) {
                    const movedIds = [...(gesture.groupMoveSnapshot?.keys() || [])];
                    for (const id of movedIds) {
                        const item = this.groups.find(entry => entry.id === id);
                        if (item) {
                            Promise.resolve(this.storage.saveGroup?.(item)).catch(() => {
                                this.showToast(this.t('groupCreateFailed'));
                            });
                        }
                    }
                    const targetId = gesture.nestTargetId || null;
                    this.setCanvasGroupNestTarget(null);
                    const groups = this.reparentCandidatesForGesture(gesture);
                    const needsReparent = groups.some(group => (group.parentId || null) !== targetId);
                    if (needsReparent) {
                        this.reparentGroups(groups, targetId);
                    } else {
                        // Positions changed: recompute temporary offsets without
                        // rebuilding the whole canvas.
                        this.refreshGroupLayout();
                    }
                    this.recordCanvasHistoryFromSnapshot('move-group', gesture.canvasHistoryBefore).catch(() => {});
                } else if (gesture.group) {
                    this.toggleGroupSelection(gesture.group.id, gesture.groupSelectionAdditive);
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
                        this.setCanvasDropTarget(null);
                        gesture.dropTargetGroupId = null;
                        const activity = this.activities.find(item => item.id === gesture.activityId);
                        const center = this.activityClientCenter(button);
                        const target = center ? this.groupDropTargetAt(center.x, center.y) : null;
                        const targetId = target?.id || null;
                        const currentId = activity ? (activity.groupId || null) : null;
                        if (activity && targetId !== currentId) {
                            this.reassignActivityToGroup(activity, target, finalLayout);
                            this.recordCanvasHistoryFromSnapshot('move-activity-group', gesture.canvasHistoryBefore).catch(() => {});
                            return;
                        }
                    }


                    this.saveActivityCanvasLayout(finalLayout);
                    this.refreshGroupLayout();
                    this.recordCanvasHistoryFromSnapshot('move-activity', gesture.canvasHistoryBefore).catch(() => {});
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

            const historyBefore = this.snapshotCanvasState();
            this.saveActivityCanvasLayout({ activityId, ...layout })
                .then(() => this.recordCanvasHistoryFromSnapshot('keyboard-layout', historyBefore))
                .catch(() => {});
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
        const activity = this.activities.find(item => item.id === layout.activityId);
        const base = this.toStoredActivityLayout(layout);
        const dimensions = this.normalizeActivityGeometryDimensions(activity, base.width, base.height);
        const stored = {
            ...base,
            x: this.snapToCanvasGrid(base.x),
            y: this.snapToCanvasGrid(base.y),
            width: dimensions.width,
            height: dimensions.height
        };
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
        const activityOffset = this.activityDisplayOffset(layout.activityId);
        if (!group) {
            return {
                ...layout,
                x: layout.x - activityOffset.x,
                y: layout.y - activityOffset.y
            };
        }
        const offset = this.groupDisplayOffset(group.id);
        return {
            ...layout,
            x: layout.x - group.x - offset.x - activityOffset.x,
            y: layout.y - group.y - offset.y - activityOffset.y
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
                // The activity note is a default template for new entries only;
                // it is copied as a plain string snapshot so later activity
                // edits never change an existing entry.
                const activityNote = typeof activity.notes === 'string' ? activity.notes : '';
                const entry = this.createTimeEntry({
                    id: this.generateId(),
                    activityId: activityId,
                    activityNameSnapshot: activity.name,
                    startTimestamp: now,
                    endTimestamp: null,
                    createdAt: now,
                    updatedAt: now,
                    source: 'timer',
                    notes: activityNote,
                    project: activity.projectName || activity.project || '',
                    projectId: activity.projectId || '',
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
        this.clockodoCustomerFilters.delete('activity');
        this.clockodoCustomerAutoSelected.delete('activity');
        this.activityServiceManuallySelected = false;
        this.editingActivityId = activityId;
        const modal = document.getElementById('activityModal');
        const title = document.getElementById('modalTitle');

        if (activityId) {
            const activity = this.activities.find(a => a.id === activityId);
            if (!activity) return;
            this.shapeSelectionTouched = false;
            title.textContent = this.t('editActivity');
            document.getElementById('activityName').value = activity.name;
            document.getElementById('activityNotes').value = activity.notes || '';

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

            // Select template icon (missing or unknown ids fall back to "none")
            document.querySelectorAll('.icon-option').forEach(opt => opt.classList.remove('selected'));
            const iconId = typeof activity.icon === 'string' ? activity.icon : '';
            const iconOpt = Array.from(document.querySelectorAll('.icon-option'))
                .find(opt => (opt.dataset.icon || '') === iconId);
            (iconOpt || document.querySelector('.icon-option[data-icon=""]'))?.classList.add('selected');

            // Select display mode (legacy activities without the property use the default)
            document.querySelectorAll('.display-mode-btn').forEach(opt => opt.classList.remove('selected'));
            const modeOpt = document.querySelector(`.display-mode-btn[data-display-mode="${activity.displayMode === 'icon-only' ? 'icon-only' : 'icon-and-text'}"]`);
            modeOpt?.classList.add('selected');
        } else {
            title.textContent = this.t('createActivity');
            document.getElementById('activityName').value = '';
            document.getElementById('activityNotes').value = '';
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
            this.shapeSelectionTouched = false;
            this.selectActivityShape(this.defaultActivityShape());
            document.querySelectorAll('.icon-option').forEach(opt => opt.classList.remove('selected'));
            document.querySelector('.icon-option[data-icon=""]')?.classList.add('selected');
            document.querySelectorAll('.display-mode-btn').forEach(opt => opt.classList.remove('selected'));
            document.querySelector('.display-mode-btn[data-display-mode="icon-and-text"]')?.classList.add('selected');
        }

        if (activityId) {
            const assignmentActivity = this.activities.find(a => a.id === activityId);
            this.populateClockodoAssignmentSelects(
                'activity',
                assignmentActivity?.customerId,
                assignmentActivity?.serviceId,
                assignmentActivity?.customerName,
                assignmentActivity?.serviceName,
                assignmentActivity?.projectId,
                assignmentActivity?.projectName
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
        reveal('iconPicker');
    }

    closeActivityModal() {
        this.closeClockodoCombobox();
        document.getElementById('activityModal').classList.remove('active');
        this.editingActivityId = null;
    }

    async syncActivityLayoutGeometry(activity) {
        if (!activity || !this.activityLayouts || typeof this.activityLayouts.get !== 'function') return null;
        const saved = this.activityLayouts.get(activity.id);
        if (!saved) return null;
        this._baseLayoutCache = null;
        this._canvasIndex = this.buildCanvasIndex();
        const absolute = this.getActivityCanvasLayout(activity, this.activityIndexOf(activity), false);
        const group = this.activityGroup(activity);
        this._canvasIndex = null;
        this._baseLayoutCache = null;
        const next = {
            ...saved,
            x: group ? absolute.x - group.x : absolute.x,
            y: group ? absolute.y - group.y : absolute.y,
            width: absolute.width,
            height: absolute.height
        };
        if (next.x === saved.x && next.y === saved.y
            && next.width === saved.width && next.height === saved.height) return next;
        this.activityLayouts.set(activity.id, next);
        try {
            await this.storage.saveLayout(next);
        } catch {
            this.showToast(this.t('canvasLayoutSaveFailed'));
        }
        return next;
    }

    async saveActivity() {
        const name = document.getElementById('activityName').value.trim();
        if (!name) {
            this.showToast(this.t('pleaseEnterName'));
            return;
        }
        const notes = document.getElementById('activityNotes')?.value.trim() || '';
        const historyBefore = this.snapshotCanvasState();

        const selectedColor = document.querySelector('.color-option.selected');
        const selectedShape = document.querySelector('.shape-option.selected');
        const selectedIcon = document.querySelector('.icon-option.selected');
        const selectedDisplayMode = document.querySelector('.display-mode-btn.selected');

        const color = selectedColor ? selectedColor.style.backgroundColor : this.COLORS[0];
        const shape = selectedShape ? selectedShape.dataset.shape : this.defaultActivityShape();
        const icon = selectedIcon && selectedIcon.dataset.icon ? selectedIcon.dataset.icon : '';
        // Normalize the default mode away: an absent property means icon + text.
        const displayMode = selectedDisplayMode?.dataset.displayMode === 'icon-only' ? 'icon-only' : '';

        const now = Date.now();
        const assignment = this.readClockodoAssignment('activity');

        if (!this.editingActivityId && !this.activityServiceManuallySelected) {
            const mappedServiceName = this.iconServiceName(icon);
            if (mappedServiceName) {
                const mappedService = this.clockodoReferenceStatus === 'ready'
                    ? this.findClockodoServiceByName(mappedServiceName)
                    : null;
                const assignedCustomerId = this.normalizeClockodoId(assignment.customerId);
                const allowedForCustomer = !mappedService || !assignedCustomerId ||
                    this.clockodoAllowedServices(assignedCustomerId)
                        .some(item => String(item.id) === String(mappedService.id));
                if (mappedService && allowedForCustomer) {
                    assignment.serviceId = String(mappedService.id);
                    assignment.serviceName = mappedService.name;
                } else if (this.clockodoReferenceStatus === 'ready' && !mappedService) {
                    this.showToast(this.t('iconServiceUnavailable', { service: mappedServiceName }));
                }
            }
        }

        if (this.editingActivityId) {
            // Edit
            const activity = this.activities.find(a => a.id === this.editingActivityId);
            if (activity) {
                activity.name = name;
                activity.color = color;
                activity.shape = shape;
                activity.notes = notes;
                activity.customerId = assignment.customerId;
                activity.serviceId = assignment.serviceId;
                activity.projectId = assignment.projectId;
                activity.customerName = assignment.customerName;
                activity.serviceName = assignment.serviceName;
                activity.projectName = assignment.projectName;
                if (icon) activity.icon = icon;
                else delete activity.icon;
                if (displayMode) activity.displayMode = displayMode;
                else delete activity.displayMode;
                activity.updatedAt = now;
                await this.storage.saveActivity(activity);
                await this.syncActivityLayoutGeometry(activity);
            }
        } else {
            // Create. `size` is a legacy initial-size hint: the canvas resize
            // controls are the single source of truth for node dimensions now.
            const activity = {
                id: this.generateId(),
                name: name,
                color: color,
                shape: shape,
                size: 'medium',
                notes: notes,
                customerId: assignment.customerId,
                serviceId: assignment.serviceId,
                projectId: assignment.projectId,
                customerName: assignment.customerName,
                serviceName: assignment.serviceName,
                projectName: assignment.projectName,
                position: this.activities.length,
                archived: false,
                createdAt: now,
                updatedAt: now
            };
            if (icon) activity.icon = icon;
            if (displayMode) activity.displayMode = displayMode;
            this.activities.push(activity);
            await this.storage.saveActivity(activity);
            if (this.activityLayouts && typeof this.activityLayouts.set === 'function') {
                const index = this.activities.indexOf(activity);
                const absolute = this.getActivityCanvasLayout(activity, index, false);
                const layout = {
                    activityId: activity.id,
                    x: absolute.x,
                    y: absolute.y,
                    width: absolute.width,
                    height: absolute.height
                };
                this.activityLayouts.set(activity.id, layout);
                try {
                    await this.storage.saveLayout(layout);
                } catch {
                    this.showToast(this.t('canvasLayoutSaveFailed'));
                }
            }
        }

        this.closeActivityModal();
        this.renderMain();
        await this.recordCanvasHistoryFromSnapshot('save-activity', historyBefore);
    }

    findActivityPlacementLayout(activity) {
        const dimensions = this.normalizeActivityGeometryDimensions(activity, undefined, undefined);
        const viewportSize = this.canvasViewportSize;
        const center = viewportSize && viewportSize.width > 0 && viewportSize.height > 0
            ? this.screenToWorld(viewportSize.width / 2, viewportSize.height / 2)
            : { x: 400, y: 300 };
        const desired = {
            x: this.snapToCanvasGrid(center.x - dimensions.width / 2),
            y: this.snapToCanvasGrid(center.y - dimensions.height / 2),
            width: dimensions.width,
            height: dimensions.height
        };
        const obstacles = [];
        this.activities.forEach((item, index) => {
            if (item.id === activity.id) return;
            const layout = this.getActivityCanvasLayout(item, index, true);
            obstacles.push({ x: layout.x, y: layout.y, width: layout.width, height: layout.height });
        });
        for (const group of this.groups) {
            let bounds = this.groupDisplayBounds?.get(group.id);
            if (!bounds) {
                const base = group.collapsed ? this.groupCollapsedBounds(group) : this.groupBaseBounds(group);
                if (!base) continue;
                const offset = this.groupDisplayOffset(group.id);
                bounds = {
                    left: base.left + offset.x,
                    top: base.top + offset.y,
                    width: base.width,
                    height: base.height
                };
            }
            obstacles.push({
                x: bounds.left,
                y: bounds.top,
                width: bounds.width,
                height: bounds.height
            });
        }
        const free = this.findNearestFreePosition(desired, obstacles, CANVAS_GRID_SIZE);
        return {
            activityId: activity.id,
            x: this.snapToCanvasGrid(free.x),
            y: this.snapToCanvasGrid(free.y),
            width: dimensions.width,
            height: dimensions.height
        };
    }

    async addActivityFromReviewEntry(entryId) {
        const entry = this.timeEntries.find(item => String(item.id) === String(entryId));
        if (!entry) return null;
        const existing = this.activities.find(item => item.id === entry.activityId)
            || this.archivedActivities?.find(item => item.id === entry.activityId)
            || null;
        // The card's project represents the object/address. Use it as the new
        // activity name first, then fall back to the next meaningful card field.
        const candidates = [
            entry.project,
            entry.activityNameSnapshot,
            existing?.name,
            String(entry.notes || '').split(/\r?\n/)[0],
            entry.service,
            entry.customerName
        ].map(value => String(value || '').trim()).filter(Boolean);
        let name = candidates[0] || `${this.t('activity')} ${this.formatTime(entry.startTimestamp)}`;
        name = name.slice(0, 120);
        const value = (primary, fallback) => {
            const text = primary === null || primary === undefined ? '' : String(primary).trim();
            return text || fallback || '';
        };
        const now = Date.now();
        // The card does not expose a shape, so a new activity always follows the
        // user's current default (the first shape in the reordered picker).
        const shape = this.defaultActivityShape();
        const activity = {
            id: this.generateId(),
            name,
            color: existing?.color || this.COLORS[0],
            shape,
            size: existing?.size || 'medium',
            notes: value(entry.notes, existing?.notes),
            customerId: value(entry.customerId, existing?.customerId),
            customerName: value(entry.customerName, existing?.customerName),
            projectId: value(entry.projectId, existing?.projectId),
            projectName: value(entry.project, existing?.projectName || existing?.project),
            serviceId: value(entry.serviceId, existing?.serviceId),
            serviceName: value(entry.serviceName, existing?.serviceName),
            position: Math.max(0, ...this.activities.map(item => Number(item.position) || 0)) + 1,
            archived: false,
            createdAt: now,
            updatedAt: now
        };
        if (existing?.icon) activity.icon = existing.icon;
        if (existing?.displayMode) activity.displayMode = existing.displayMode;
        const historyBefore = this.snapshotCanvasState();
        const layout = this.findActivityPlacementLayout(activity);
        this.activities.push(activity);
        this.activityLayouts.set(activity.id, layout);
        try {
            await this.storage.saveActivity(activity);
            await this.storage.saveLayout(layout);
        } catch (error) {
            this.activities = this.activities.filter(item => item.id !== activity.id);
            this.activityLayouts.delete(activity.id);
            try {
                await this.storage.deleteActivity?.(activity.id);
                await this.storage.deleteLayout?.(activity.id);
            } catch { /* best-effort cleanup */ }
            this.diagnostics?.error('canvas', 'add-activity-from-review', error, { status: 'rolled_back' });
            this.showToast(this.t('activityAddFromReviewFailed'));
            return null;
        }
        await this.recordCanvasHistoryFromSnapshot('add-activity-from-review', historyBefore);
        this.renderMain();
        this.showToast(this.t('activityAddedFromReview', { name }));
        return activity;
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

    async duplicateActivity() {
        const activity = this.activities.find(item => item.id === this.editingActivityId);
        this.closeActivityMenu();
        if (!activity) return null;
        const historyBefore = this.snapshotCanvasState();
        const group = activity.groupId
            ? this.groups.find(item => item.id === activity.groupId)
            : null;
        const assignment = this.resolveNewActivityCustomer({
            explicitCustomerId: activity.customerId,
            explicitCustomerName: activity.customerName,
            group
        });
        const now = Date.now();
        const duplicate = {
            ...activity,
            id: this.generateId(),
            name: this.t('activityCopyName', { name: activity.name }),
            customerId: assignment.customerId,
            customerName: assignment.customerName,
            position: Math.max(0, ...this.activities.map(item => Number(item.position) || 0)) + 1,
            archived: false,
            createdAt: now,
            updatedAt: now
        };
        // Import provenance belongs to the source record, not to a manual copy.
        delete duplicate.assignment;
        delete duplicate.importedAt;
        const current = this.getActivityCanvasLayout(activity, this.activities.indexOf(activity), false);
        const baseX = group ? current.x - group.x : current.x;
        const baseY = group ? current.y - group.y : current.y;
        const dimensions = this.normalizeActivityGeometryDimensions(duplicate, current.width, current.height);
        const layout = {
            activityId: duplicate.id,
            x: this.snapToCanvasGrid(baseX + CANVAS_GROUP_DUPLICATE_OFFSET),
            y: this.snapToCanvasGrid(baseY + CANVAS_GROUP_DUPLICATE_OFFSET),
            width: dimensions.width,
            height: dimensions.height
        };
        this.activities.push(duplicate);
        this.activityLayouts.set(duplicate.id, layout);
        try {
            await this.storage.saveActivity(duplicate);
            await this.storage.saveLayout(layout);
        } catch {
            this.activities = this.activities.filter(item => item.id !== duplicate.id);
            this.activityLayouts.delete(duplicate.id);
            try {
                await this.storage.deleteActivity?.(duplicate.id);
                await this.storage.deleteLayout?.(duplicate.id);
            } catch { /* best-effort cleanup */ }
            this.showToast(this.t('activityDuplicateFailed'));
            return null;
        }
        this.renderMain();
        await this.recordCanvasHistoryFromSnapshot('duplicate-activity', historyBefore);
        this.showToast(this.t('activityDuplicated', { name: duplicate.name }));
        return duplicate;
    }

    async archiveActivity() {
        const activity = this.activities.find(a => a.id === this.editingActivityId);
        const historyBefore = this.snapshotCanvasState();
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
        await this.recordCanvasHistoryFromSnapshot('archive-activity', historyBefore);
    }

    async deleteActivity() {
        if (this.confirmDelete && !confirm(this.t('deleteConfirm'))) {
            return;
        }

        const historyBefore = this.snapshotCanvasState();
        const activity = this.activities.find(a => a.id === this.editingActivityId);
        if (activity) {
            await this.storage.deleteActivity(activity.id);
            this.activities = this.activities.filter(a => a.id !== activity.id);
        }
        this.closeActivityMenu();
        this.renderMain();
        this.pruneCanvasSelection();
        await this.recordCanvasHistoryFromSnapshot('delete-activity', historyBefore);
    }

    renderLog() {
        const filterType = document.getElementById('logDateFilter').value;
        const filterActivity = document.getElementById('logActivityFilter').value;
        const content = document.getElementById('logContent');

        const dateRange = this.getDateRange(filterType);
        let entries = this.timeEntries.filter(e => {
            if (!Number.isFinite(Number(e.startTimestamp)) || Number(e.startTimestamp) <= 0) return false;
            if (e.endTimestamp === null || !Number.isFinite(Number(e.endTimestamp))) return false;
            const date = new Date(e.startTimestamp);
            const end = new Date(e.endTimestamp);
            return date < dateRange[1] && end > dateRange[0];
        });

        if (filterActivity) {
            entries = entries.filter(e => e.activityId === filterActivity);
        }

        entries.sort((a, b) => a.startTimestamp - b.startTimestamp);
        const overlappingIds = this.getOverlappingEntryIds(entries);

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
                        const snapshot = dayEntries.find(e => e.activityId === actId)?.activityNameSnapshot || this.t('noActivity');
                        return `<div class="log-activity-stat">${this.escapeHtml(snapshot)} — ${this.formatDuration(total)}</div>`;
                    }).join('')}
                </div>`;

            dayEntries.forEach(entry => {
                const snapshot = entry.activityNameSnapshot || this.t('noActivity');
                const duration = entry.endTimestamp - entry.startTimestamp;
                const start = this.formatDateTime(entry.startTimestamp);
                const end = this.formatDateTime(entry.endTimestamp);
                const isConflict = overlappingIds.has(String(entry.id));
                const conflictNote = isConflict
                    ? `<div class="log-entry-conflict-note">${this.escapeHtml(this.t('overlappingEntry'))}</div>`
                    : '';

                html += `<div class="log-entry${isConflict ? ' log-entry-conflict' : ''}" data-entry-id="${this.escapeHtml(entry.id)}">
                    <div class="log-entry-time">${start} – ${end}</div>
                    <div class="log-entry-activity">${this.escapeHtml(snapshot)}</div>
                    <div class="log-entry-duration">${this.formatDuration(duration)}</div>
                    ${conflictNote}
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

    populateEntryAssignmentForActivity(activityId) {
        const activity = this.activities.find(item => item.id === activityId);
        const group = activity?.groupId
            ? this.groups.find(item => item.id === activity.groupId)
            : null;
        // Group inheritance is a creation-time default for new entries only; an
        // existing entry keeps the assignment that was stored with it.
        const customer = this.editingEntryId === null
            ? this.resolveNewActivityCustomer({
                explicitCustomerId: activity?.customerId,
                explicitCustomerName: activity?.customerName,
                group
            })
            : { customerId: activity?.customerId, customerName: activity?.customerName };
        this.populateClockodoAssignmentSelects(
            'entry',
            customer.customerId,
            activity?.serviceId,
            customer.customerName,
            activity?.serviceName,
            activity?.projectId,
            activity?.projectName
        );
    }

    showEntryEditModal(entryId) {
        this.clockodoCustomerFilters.delete('entry');
        this.clockodoCustomerAutoSelected.delete('entry');
        this.editingEntryId = entryId;
        const entry = this.timeEntries.find(e => String(e.id) === String(entryId));
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
        this.populateClockodoAssignmentSelects(
            'entry',
            entry.customerId,
            entry.serviceId,
            entry.customerName,
            entry.serviceName,
            entry.projectId,
            entry.project
        );
        if (entry.project && !entry.projectId) {
            // Legacy entries stored a free-text project; keep it visible.
            document.getElementById('entryEditProject').value = entry.project;
        }
        document.getElementById('entryEditService').value = entry.service || '';
        document.getElementById('entryEditNotes').value = entry.notes || '';
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
        const empty = document.createElement('option');
        empty.value = '';
        empty.textContent = this.t('noActivity');
        activitySelect.appendChild(empty);
        this.activities.forEach(activity => {
            const option = document.createElement('option');
            option.value = activity.id;
            option.textContent = activity.name;
            activitySelect.appendChild(option);
        });
        activitySelect.value = selectedId || '';
    }

    showAddEntryModal({ startTimestamp = null, endTimestamp = null } = {}) {
        this.clockodoCustomerFilters.delete('entry');
        this.clockodoCustomerAutoSelected.delete('entry');
        this.editingEntryId = null;
        // A manually created entry starts without an activity. The user can
        // still choose one, but it is optional.
        this.populateEntryActivitySelect('');
        this.populateEntryAssignmentForActivity('');
        this.loadClockodoReferenceData();
        const startDate = startTimestamp !== null && startTimestamp !== undefined && Number.isFinite(Number(startTimestamp))
            ? new Date(Number(startTimestamp))
            : null;
        const endDate = endTimestamp !== null && endTimestamp !== undefined && Number.isFinite(Number(endTimestamp))
            ? new Date(Number(endTimestamp))
            : startDate;
        document.getElementById('entryEditDate').value = startDate ? this.toDateString(startDate) : this.reviewDate;
        document.getElementById('entryEditEndDate').value = endDate ? this.toDateString(endDate) : this.reviewDate;
        document.getElementById('entryEditStart').value = startDate ? this.toTimeString(startDate) : '';
        document.getElementById('entryEditEnd').value = endDate ? this.toTimeString(endDate) : '';
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

        if (start === null || end === null) {
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
        const candidate = { startTimestamp: start, endTimestamp: end };
        const hasConflict = this.timeEntries.some(entry => {
            if (editingId !== null && String(entry.id) === editingId) return false;
            return this.entriesOverlap(candidate, entry);
        });
        if (hasConflict) {
            warning.style.display = 'block';
        }

        const activity = activityId
            ? (this.activities.find(item => item.id === activityId)
                || this.archivedActivities?.find(item => item.id === activityId))
            : null;
        const assignment = this.readClockodoAssignment('entry');
        const updates = {
            activityId,
            activityNameSnapshot: activityId
                ? (activity?.name || editing?.activityNameSnapshot || '')
                : '',
            startTimestamp: start,
            endTimestamp: end,
            project: document.getElementById('entryEditProject').value.trim(),
            projectId: assignment.projectId,
            service: document.getElementById('entryEditService').value.trim(),
            customerId: assignment.customerId,
            serviceId: assignment.serviceId,
            customerName: assignment.customerName,
            serviceName: assignment.serviceName,
            notes: document.getElementById('entryEditNotes').value.trim()
        };

        try {
            if (editing) {
                await this.updateEntry(editing.id, updates);
            } else {
                await this.addEntry({ ...updates, source: 'manual' });
            }
        } catch (error) {
            this.diagnostics?.error('dayReview', 'save-entry', error, { status: 'rolled_back' });
            this.showToast(this.t('timerSaveFailed'));
            return;
        }
        this.closeEntryEditModal();
        this.renderLog();
        this.renderReview();
        if (hasConflict) this.showToast(this.t('overlappingEntry'));
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
            const previousEntries = this.timeEntries;
            this.deletedEntry = entry;
            try {
                await this.storage.deleteTimeEntry(entry.id);
            } catch (error) {
                this.diagnostics?.error('storage', 'delete-entry', error, { status: 'rolled_back' });
                this.showToast(this.t('timerSaveFailed'));
                return;
            }
            this.timeEntries = previousEntries.filter(e => e.id !== entry.id);
            this.closeEntryEditModal();
            this.renderLog();
            this.renderReview();

            // Show undo option
            this.showToast(`${this.t('deleted')} - ${this.t('undo')}`, 5000, () => this.undoDeleteEntry());
        }
    }

    async undoDeleteEntry() {
        if (!this.deletedEntry) return;
        try {
            await this.storage.saveTimeEntry(this.deletedEntry);
        } catch (error) {
            this.diagnostics?.error('storage', 'undo-delete-entry', error, { status: 'failed' });
            this.showToast(this.t('timerSaveFailed'));
            return;
        }
        const entry = this.deletedEntry;
        this.deletedEntry = null;
        const existingIndex = this.timeEntries.findIndex(item => String(item.id) === String(entry.id));
        if (existingIndex >= 0) this.timeEntries[existingIndex] = entry;
        else this.timeEntries.push(entry);
        this.renderLog();
        this.renderReview();
    }

    clockodoAssignmentIds(context) {
        if (context === 'group') {
            return {
                customer: 'groupEditCustomerSelect', customerInput: 'groupEditCustomerInput', customerList: 'groupEditCustomerList',
                hint: 'groupEditClockodoHint', retry: 'groupEditClockodoRetryBtn'
            };
        }
        return context === 'activity'
            ? {
                customer: 'activityCustomerSelect', customerInput: 'activityCustomerInput', customerList: 'activityCustomerList',
                service: 'activityServiceSelect', serviceInput: 'activityServiceInput', serviceList: 'activityServiceList',
                project: 'activityProjectSelect', projectInput: 'activityProjectInput', projectList: 'activityProjectList',
                hint: 'activityClockodoHint', retry: 'activityClockodoRetryBtn'
            }
            : {
                customer: 'entryEditCustomerSelect', customerInput: 'entryEditCustomerInput', customerList: 'entryEditCustomerList',
                service: 'entryEditServiceSelect', serviceInput: 'entryEditServiceInput', serviceList: 'entryEditServiceList',
                project: 'entryEditProjectSelect', projectInput: 'entryEditProject', projectList: 'entryEditProjectList',
                hint: 'entryEditClockodoHint', retry: 'entryEditClockodoRetryBtn'
            };
    }

    clockodoComboboxIds(context, fieldName) {
        const ids = this.clockodoAssignmentIds(context);
        if (fieldName === 'project') {
            return { input: ids.projectInput, hidden: ids.project, list: ids.projectList };
        }
        return fieldName === 'customer'
            ? { input: ids.customerInput, hidden: ids.customer, list: ids.customerList }
            : { input: ids.serviceInput, hidden: ids.service, list: ids.serviceList };
    }

    clockodoComboboxItems(context, fieldName) {
        if (fieldName === 'customer') {
            const filtered = this.clockodoCustomerFilters.get(context);
            if (Array.isArray(filtered)) {
                return filtered
                    .map(customerId => this.clockodoCustomerById(customerId))
                    .filter(Boolean);
            }
            return this.clockodoCustomers;
        }
        if (fieldName === 'project') return this.clockodoAllowedProjects(this.clockodoSelectedCustomerId(context));
        return this.clockodoAllowedServices(this.clockodoSelectedCustomerId(context));
    }

    // Project -> customer lookup. Uses the already loaded Clockodo cache; never
    // performs an extra API request. With a selected project its stable
    // customerId wins over name matching. Typed text matches project names
    // case-insensitively (partial allowed).
    syncCustomerFromProject(context, { fromSelection = false } = {}) {
        if (context === 'group' || this.clockodoReferenceStatus !== 'ready') return false;
        const projectIds = this.clockodoComboboxIds(context, 'project');
        const projectInput = String(document.getElementById(projectIds.input)?.value || '').trim();
        const selectedProjectId = this.normalizeClockodoId(document.getElementById(projectIds.hidden)?.value);
        const projects = selectedProjectId
            ? this.clockodoProjects.filter(project => String(project.id) === String(selectedProjectId))
            : projectInput
                ? this.clockodoProjects.filter(project =>
                    String(project.name || '').toLowerCase().includes(projectInput.toLowerCase()))
                : [];
        if (!selectedProjectId && !projectInput) {
            this.clockodoCustomerFilters.delete(context);
            this.setClockodoAssignmentHint(context, null);
            return false;
        }
        const customerIds = [...new Set(projects.map(project => String(project.customerId)))];
        const customers = customerIds
            .map(customerId => this.clockodoCustomerById(customerId))
            .filter(Boolean);
        if (!customers.length) {
            this.clockodoCustomerFilters.delete(context);
            this.setClockodoAssignmentHint(context, this.t('clockodoProjectNoCustomer', {
                project: projectInput || `#${selectedProjectId}`
            }));
            return false;
        }
        const currentCustomerId = this.clockodoSelectedCustomerId(context);
        const currentIsAuto = this.clockodoCustomerAutoSelected.has(context);
        if (customers.length === 1) {
            const customer = customers[0];
            this.clockodoCustomerFilters.delete(context);
            if (currentCustomerId && String(currentCustomerId) === String(customer.id)) {
                this.setClockodoAssignmentHint(context, null);
                return true;
            }
            if (currentCustomerId && !currentIsAuto) {
                // Never replace a customer the user explicitly selected.
                this.setClockodoAssignmentHint(context, this.t('clockodoProjectCustomerKept', { name: customer.name }));
                return false;
            }
            this.applySuggestedCustomer(context, customer);
            const serviceCleared = this.enforceClockodoServiceForCustomer(context);
            const projectCleared = this.enforceClockodoProjectForCustomer(context);
            this.setClockodoAssignmentHint(
                context,
                serviceCleared
                    ? this.t('clockodoServiceNotAllowedForCustomer')
                    : projectCleared
                        ? this.t('clockodoProjectNotAllowedForCustomer')
                        : this.t('clockodoProjectCustomerSelected', { name: customer.name })
            );
            return true;
        }
        const currentMatches = currentCustomerId &&
            customers.some(customer => String(customer.id) === String(currentCustomerId));
        if (currentCustomerId && !currentMatches && currentIsAuto) {
            // The previous suggestion came from another project; it is safe to
            // clear it so the user can choose between the new matches.
            this.applySuggestedCustomerCleared(context);
        }
        const showChoices = !currentCustomerId || currentMatches || currentIsAuto;
        if (showChoices) {
            this.clockodoCustomerFilters.set(context, customers.map(customer => String(customer.id)));
        } else {
            this.clockodoCustomerFilters.delete(context);
        }
        this.setClockodoAssignmentHint(context, this.t('clockodoProjectMultipleCustomers', {
            customers: customers.map(customer => customer.name).join(', ')
        }));
        const hasCurrentAfter = this.clockodoSelectedCustomerId(context);
        if (fromSelection && (!hasCurrentAfter || this.clockodoCustomerAutoSelected.has(context))) {
            this.openClockodoCombobox(context, 'customer');
        }
        return false;
    }

    applySuggestedCustomer(context, customer) {
        const ids = this.clockodoComboboxIds(context, 'customer');
        const hidden = document.getElementById(ids.hidden);
        const input = document.getElementById(ids.input);
        if (hidden) hidden.value = String(customer.id);
        if (input) input.value = customer.name;
        this.clockodoCustomerAutoSelected.add(context);
        this.clockodoCustomerFilters.delete(context);
    }

    applySuggestedCustomerCleared(context) {
        const ids = this.clockodoComboboxIds(context, 'customer');
        const hidden = document.getElementById(ids.hidden);
        const input = document.getElementById(ids.input);
        if (hidden) hidden.value = '';
        if (input) input.value = '';
        this.clockodoCustomerAutoSelected.delete(context);
    }

    clockodoCustomerById(customerId) {
        const id = this.normalizeClockodoId(customerId);
        if (!id) return null;
        const customers = Array.isArray(this.clockodoCustomers) ? this.clockodoCustomers : [];
        return customers.find(customer => String(customer.id) === id) || null;
    }

    // Nearest explicitly configured default customer in the group hierarchy.
    // Inherited values are only read; they are never written into child groups.
    effectiveGroupDefaultCustomer(group) {
        if (!group) return null;
        const seen = new Set();
        let current = group;
        while (current && !seen.has(current.id)) {
            seen.add(current.id);
            if (this.normalizeClockodoId(current.defaultCustomerId) !== null) {
                return {
                    id: current.defaultCustomerId,
                    name: current.defaultCustomerName || '',
                    group: current
                };
            }
            const parentId = current.parentId;
            current = parentId
                ? (this.groups.find(item => item.id === parentId) || null)
                : null;
        }
        return null;
    }

    // Creation-time customer precedence: an explicit button customer always
    // wins; otherwise the nearest group default (own or inherited) is used. A
    // default that no longer exists in a fully loaded Clockodo list is ignored
    // instead of creating a dangling reference. While the reference data is
    // unavailable (offline or not configured), the persisted default is
    // applied as-is.
    resolveNewActivityCustomer({ explicitCustomerId = null, explicitCustomerName = '', group = null } = {}) {
        const hasExplicit = explicitCustomerId !== null && explicitCustomerId !== undefined &&
            String(explicitCustomerId).trim() !== '';
        if (hasExplicit) {
            return {
                customerId: explicitCustomerId,
                customerName: explicitCustomerName ||
                    this.clockodoCustomerById(explicitCustomerId)?.name || ''
            };
        }
        const effective = this.effectiveGroupDefaultCustomer(group);
        const storedDefaultId = effective?.id;
        if (this.normalizeClockodoId(storedDefaultId) === null) {
            return { customerId: '', customerName: '' };
        }
        const known = this.clockodoCustomerById(storedDefaultId);
        if (known) return { customerId: storedDefaultId, customerName: known.name };
        if (this.clockodoReferenceStatus === 'ready') {
            return { customerId: '', customerName: '' };
        }
        return { customerId: storedDefaultId, customerName: effective.name || '' };
    }

    clockodoAllowedServices(customerId) {
        const services = Array.isArray(this.clockodoServices) ? this.clockodoServices : [];
        const customer = this.clockodoCustomerById(customerId);
        const assignments = customer?.serviceAssignments;
        if (!Array.isArray(assignments) || assignments.length === 0) return services;
        const allowed = new Set(assignments.map(String));
        return services.filter(service => allowed.has(String(service.id)));
    }

    iconServiceName(iconId) {
        // The service names are the stable, user-visible Clockodo names.
        return {
            car: 'Anfahrt',
            squeegee: 'Fensterreinigung',
            mop: 'Treppenhaus/Keller Reinigung'
        }[iconId] || '';
    }

    findClockodoServiceByName(serviceName) {
        const normalize = value => String(value || '').trim().replace(/\s+/g, ' ').toLowerCase();
        const target = normalize(serviceName);
        if (!target) return null;
        const matches = (this.clockodoServices || [])
            .filter(service => normalize(service.name) === target);
        // Ambiguous duplicates are not guessed.
        return matches.length === 1 ? matches[0] : null;
    }

    applyIconServiceMapping(iconId) {
        const serviceName = this.iconServiceName(iconId);
        if (!serviceName) return false;
        if (this.clockodoReferenceStatus !== 'ready') {
            this.setClockodoAssignmentHint('activity', this.t('iconServiceUnavailable', { service: serviceName }));
            return false;
        }
        const service = this.findClockodoServiceByName(serviceName);
        if (!service) {
            this.setClockodoAssignmentHint('activity', this.t('iconServiceUnavailable', { service: serviceName }));
            return false;
        }
        const customerId = this.clockodoSelectedCustomerId('activity');
        if (customerId) {
            const allowed = this.clockodoAllowedServices(customerId);
            if (!allowed.some(item => String(item.id) === String(service.id))) {
                this.setClockodoAssignmentHint('activity', this.t('clockodoServiceNotAllowedForCustomer'));
                return false;
            }
        }
        const ids = this.clockodoAssignmentIds('activity');
        const hidden = document.getElementById(ids.service);
        const input = document.getElementById(ids.serviceInput);
        if (hidden) hidden.value = String(service.id);
        if (input) input.value = service.name;
        this.activityServiceManuallySelected = false;
        this.setClockodoAssignmentHint('activity', null);
        return true;
    }

    clockodoAllowedProjects(customerId) {
        const projects = Array.isArray(this.clockodoProjects) ? this.clockodoProjects : [];
        const id = this.normalizeClockodoId(customerId);
        if (!id) return [];
        return projects.filter(project => String(project.customerId) === String(id));
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

    enforceClockodoProjectForCustomer(context) {
        if (this.clockodoReferenceStatus !== 'ready') return false;
        const { input, hidden } = this.clockodoComboboxIds(context, 'project');
        const hiddenEl = document.getElementById(hidden);
        const selected = this.normalizeClockodoId(hiddenEl?.value);
        if (!selected) return false;
        const allowed = this.clockodoAllowedProjects(this.clockodoSelectedCustomerId(context));
        if (allowed.some(project => String(project.id) === selected)) return false;
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

    populateClockodoAssignmentSelects(context, selectedCustomerId = null, selectedServiceId = null, customerName = '', serviceName = '', selectedProjectId = null, projectName = '') {
        const ids = this.clockodoAssignmentIds(context);
        const status = this.clockodoReferenceStatus;
        const ready = status === 'ready';
        this.populateClockodoAssignmentField(
            { hidden: ids.customer, input: ids.customerInput, list: ids.customerList },
            ready ? this.clockodoCustomers : [],
            selectedCustomerId,
            customerName
        );
        const groupContext = context === 'group';
        if (!groupContext) {
            this.populateClockodoAssignmentField(
                { hidden: ids.project, input: ids.projectInput, list: ids.projectList },
                ready ? this.clockodoAllowedProjects(this.clockodoSelectedCustomerId(context)) : [],
                selectedProjectId,
                projectName
            );
            this.populateClockodoAssignmentField(
                { hidden: ids.service, input: ids.serviceInput, list: ids.serviceList },
                ready ? this.clockodoAllowedServices(this.clockodoSelectedCustomerId(context)) : [],
                selectedServiceId,
                serviceName
            );
        }
        const serviceCleared = groupContext ? false : this.enforceClockodoServiceForCustomer(context);
        const projectCleared = groupContext ? false : this.enforceClockodoProjectForCustomer(context);
        const statePlaceholder = this.clockodoAssignmentPlaceholder();
        const placeholderFields = [[ids.customerInput, 'clockodoCustomerSelectLabel']];
        if (!groupContext) {
            placeholderFields.push(
                [ids.projectInput, 'clockodoProjectSelectLabel'],
                [ids.serviceInput, 'clockodoServiceSelectLabel']
            );
        }
        for (const [inputId, labelKey] of placeholderFields) {
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
            const selectedCustomerId = this.clockodoSelectedCustomerId(context);
            const projectHint = !groupContext && ready && !serviceCleared && !projectCleared && !this.clockodoProjectError
                ? this.clockodoProjects.length === 0
                    ? this.t('clockodoNoProjects')
                    : !selectedCustomerId
                        ? this.t('clockodoProjectChooseCustomer')
                        : this.clockodoAllowedProjects(selectedCustomerId).length === 0
                            ? this.t('clockodoNoProjectsForCustomer')
                            : null
                : null;
            const projectFailure = !groupContext ? this.clockodoProjectError : null;
            hint.textContent = serviceCleared
                ? this.t('clockodoServiceNotAllowedForCustomer')
                : projectCleared
                    ? this.t('clockodoProjectNotAllowedForCustomer')
                    : !groupContext && this.clockodoWorkerOutdated
                        ? this.t('clockodoWorkerOutdated')
                        : !groupContext && this.clockodoProjectErrorStatus === 410
                            ? this.t('clockodoProjectsUnavailable', { detail: this.clockodoProjectFailureDetail() || 'HTTP 410' })
                            : projectFailure
                                ? this.t('clockodoProjectLoadFailed', { detail: this.clockodoProjectFailureDetail() })
                                : groupContext && ready && selectedCustomerId && !this.clockodoCustomerById(selectedCustomerId)
                                    ? this.t('groupDefaultCustomerMissing')
                                    : groupContext && !selectedCustomerId && this.groupEditInheritedCustomer
                                        ? this.groupEditInheritedCustomer.missing
                                            ? this.t('groupDefaultCustomerMissing')
                                            : this.t('groupDefaultCustomerInherited', { name: this.groupEditInheritedCustomer.name })
                                        : projectHint || this.clockodoAssignmentHint();
        }
        const retry = document.getElementById(ids.retry);
        const hasProjectProblem = !groupContext && Boolean(this.clockodoProjectError);
        if (retry) retry.style.display = status === 'error' || hasProjectProblem ? '' : 'none';
    }

    applyClockodoAssignmentInput(context, fieldName) {
        const { input, hidden } = this.clockodoComboboxIds(context, fieldName);
        const inputEl = document.getElementById(input);
        const hiddenEl = document.getElementById(hidden);
        const match = this.findClockodoItem(this.clockodoComboboxItems(context, fieldName), inputEl?.value);
        if (hiddenEl) hiddenEl.value = match ? String(match.id) : '';
        if (context === 'activity' && fieldName === 'service') this.activityServiceManuallySelected = true;
        if (fieldName === 'customer') {
            this.clockodoCustomerFilters.delete(context);
            this.clockodoCustomerAutoSelected.delete(context);
        }
        if (fieldName === 'project' && context !== 'group') {
            this.syncCustomerFromProject(context);
            if (this.clockodoReferenceStatus === 'ready') this.openClockodoCombobox(context, fieldName, inputEl?.value || '');
            else this.closeClockodoCombobox();
            return;
        }
        const serviceCleared = fieldName === 'customer' ? this.enforceClockodoServiceForCustomer(context) : false;
        const projectCleared = fieldName === 'customer' ? this.enforceClockodoProjectForCustomer(context) : false;
        this.setClockodoAssignmentHint(
            context,
            serviceCleared
                ? this.t('clockodoServiceNotAllowedForCustomer')
                : projectCleared
                    ? this.t('clockodoProjectNotAllowedForCustomer')
                    : null
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
        if (context === 'activity' && fieldName === 'service') this.activityServiceManuallySelected = true;
        if (fieldName === 'customer') {
            this.clockodoCustomerFilters.delete(context);
            this.clockodoCustomerAutoSelected.delete(context);
        }
        if (fieldName === 'project' && context !== 'group') {
            this.syncCustomerFromProject(context, { fromSelection: true });
            return;
        }
        const serviceCleared = fieldName === 'customer' ? this.enforceClockodoServiceForCustomer(context) : false;
        const projectCleared = fieldName === 'customer' ? this.enforceClockodoProjectForCustomer(context) : false;
        this.setClockodoAssignmentHint(
            context,
            serviceCleared
                ? this.t('clockodoServiceNotAllowedForCustomer')
                : projectCleared
                    ? this.t('clockodoProjectNotAllowedForCustomer')
                    : null
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
        } else if (fieldName !== 'project' && String(inputEl.value || '').trim()) {
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
        const projectId = this.normalizeClockodoId(document.getElementById(ids.project)?.value);
        const nameById = (items, id) => (Array.isArray(items) ? items : []).find(item => String(item.id) === String(id))?.name || '';
        const inputName = inputId => (inputId ? String(document.getElementById(inputId)?.value || '').trim() : '');
        return {
            customerId: customerId || '',
            serviceId: serviceId || '',
            projectId: projectId || '',
            customerName: nameById(this.clockodoCustomers, customerId) || inputName(ids.customerInput),
            serviceName: nameById(this.clockodoServices, serviceId) || inputName(ids.serviceInput),
            projectName: nameById(this.clockodoProjects, projectId) || inputName(ids.projectInput)
        };
    }

    restoreProjectFreeText(context, previousText) {
        if (!previousText) return false;
        const { input, hidden } = this.clockodoComboboxIds(context, 'project');
        const hiddenEl = document.getElementById(hidden);
        const inputEl = document.getElementById(input);
        if (!hiddenEl || !inputEl || hiddenEl.value) return false;
        inputEl.value = previousText;
        return true;
    }

    refreshClockodoAssignmentViews() {
        const activityModal = document.getElementById('activityModal');
        if (activityModal?.classList?.contains?.('active')) {
            const projectText = document.getElementById('activityProjectInput')?.value || '';
            this.populateClockodoAssignmentSelects(
                'activity',
                document.getElementById('activityCustomerSelect')?.value,
                document.getElementById('activityServiceSelect')?.value,
                document.getElementById('activityCustomerInput')?.value,
                document.getElementById('activityServiceInput')?.value,
                document.getElementById('activityProjectSelect')?.value,
                projectText
            );
            this.restoreProjectFreeText('activity', projectText);
        }
        const groupModal = document.getElementById('groupEditModal');
        if (groupModal?.classList?.contains?.('active')) {
            this.refreshGroupInheritedCustomer();
            this.populateClockodoAssignmentSelects(
                'group',
                document.getElementById('groupEditCustomerSelect')?.value,
                null,
                document.getElementById('groupEditCustomerInput')?.value
            );
        }
        const entryModal = document.getElementById('entryEditModal');
        if (entryModal?.classList?.contains?.('active')) {
            const projectText = document.getElementById('entryEditProject')?.value || '';
            this.populateClockodoAssignmentSelects(
                'entry',
                document.getElementById('entryEditCustomerSelect')?.value,
                document.getElementById('entryEditServiceSelect')?.value,
                document.getElementById('entryEditCustomerInput')?.value,
                document.getElementById('entryEditServiceInput')?.value,
                document.getElementById('entryEditProjectSelect')?.value,
                projectText
            );
            this.restoreProjectFreeText('entry', projectText);
        }
    }

    clockodoProjectFailureDetail() {
        const details = this.clockodoProjectErrorDetails;
        const message = details?.message
            || (Array.isArray(details?.fields) && details.fields.length ? details.fields.join(', ') : '')
            || details?.path
            || '';
        return [
            this.clockodoProjectError,
            this.clockodoProjectErrorStatus ? `HTTP ${this.clockodoProjectErrorStatus}` : '',
            message
        ].filter(Boolean).join(' · ');
    }

    async detectOutdatedWorker() {
        const fetchImpl = this.getFetchImpl();
        if (!fetchImpl) return false;
        try {
            const response = await fetchImpl(`${this.locationOrigin()}/api/version`, { cache: 'no-store' });
            if (!response || response.status !== 200) return true;
            const contentType = response.headers?.get?.('content-type') || '';
            if (!contentType.includes('application/json')) return true;
            const data = await response.json();
            return data?.version !== REQUIRED_WORKER_VERSION;
        } catch {
            return false;
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
                this.clockodoProjects = [];
                this.clockodoProjectError = null;
                this.clockodoProjectErrorStatus = 0;
                this.clockodoProjectErrorDetails = null;
                this.clockodoWorkerOutdated = false;
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
                const supportsProjects = typeof this.clockodoClient.getProjects === 'function';
                // Projects are optional for assignment. A project endpoint failure
                // (permissions, plan, older API) must never block customers/services.
                const results = await Promise.allSettled([
                    this.clockodoClient.getCustomers(this.getPushClientId(), this.getClockodoAccessToken()),
                    this.clockodoClient.getServices(this.getPushClientId(), this.getClockodoAccessToken()),
                    supportsProjects
                        ? this.clockodoClient.getProjects(this.getPushClientId(), this.getClockodoAccessToken())
                        : Promise.resolve({ projects: [] })
                ]);
                if (configVersion !== this.clockodoConfigVersion) return false;
                const [customerResult, serviceResult, projectResult] = results;
                const requiredFailure = [customerResult, serviceResult].find(result => result.status === 'rejected');
                if (requiredFailure) throw requiredFailure.reason;
                this.clockodoCustomers = Array.isArray(customerResult.value?.customers) ? customerResult.value.customers : [];
                this.clockodoServices = Array.isArray(serviceResult.value?.services) ? serviceResult.value.services : [];
                const projectsLoaded = projectResult.status === 'fulfilled' && Array.isArray(projectResult.value?.projects);
                this.clockodoProjects = projectsLoaded ? projectResult.value.projects : [];
                this.clockodoProjectError = projectResult.status === 'rejected'
                    ? (projectResult.reason?.code || 'request_rejected')
                    : null;
                this.clockodoProjectErrorStatus = projectResult.status === 'rejected'
                    ? Number(projectResult.reason?.status) || 0
                    : 0;
                this.clockodoProjectErrorDetails = projectResult.status === 'rejected'
                    ? this.normalizeClockodoErrorDetails(projectResult.reason?.details)
                    : null;
                this.clockodoWorkerOutdated = this.clockodoProjectError
                    ? await this.detectOutdatedWorker()
                    : false;
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
            typeof this.clockodoClient.roundToNearestFiveMinutes !== 'function') return timestamp;
        return this.clockodoClient.roundToNearestFiveMinutes(timestamp);
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
                this.clockodoProjects = [];
                this.clockodoProjectError = null;
                this.clockodoProjectErrorStatus = 0;
                this.clockodoProjectErrorDetails = null;
                this.clockodoWorkerOutdated = false;
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
            this.clockodoProjects = [];
            this.clockodoProjectError = null;
            this.clockodoProjectErrorStatus = 0;
            this.clockodoProjectErrorDetails = null;
            this.clockodoWorkerOutdated = false;
            this.clockodoReferenceStatus = 'idle';
            this.clockodoReferencePromise = null;
            this.loadClockodoReferenceData();
            if (this.sharedImportNeedsConfig && this.pendingSharedDay) {
                this.sharedImportNeedsConfig = false;
                this.resumeSharedDayAfterConfig().catch(() => {});
            }
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

    async testClockodoConnection({ silent = false } = {}) {
        if (!this.clockodoConfigured || !this.clockodoClient || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.clockodoEmail)) {
            this.clockodoStatus = 'unconfigured';
            this.setClockodoStatus(this.t('clockodoStatusNotConfigured'));
            return false;
        }
        const button = document.getElementById('clockodoTestBtn');
        this.clockodoStatus = 'checking';
        this.setClockodoStatus(this.t('clockodoStatusChecking'));
        if (button) button.disabled = true;
        try {
            await this.clockodoClient.testConnection(this.getPushClientId(), this.getClockodoAccessToken());
            this.clockodoStatus = 'connected';
            this.setClockodoStatus(this.t('clockodoStatusConnected'));
            if (!silent) this.showToast(this.t('clockodoTestSuccess'));
            return true;
        } catch (error) {
            this.clockodoStatus = 'failed';
            this.setClockodoStatus(`${this.t('clockodoStatusFailed')}: ${this.clockodoErrorMessage(error)}`);
            return false;
        } finally {
            if (button) button.disabled = false;
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
        this.clockodoProjects = [];
        this.clockodoProjectError = null;
        this.clockodoProjectErrorStatus = 0;
        this.clockodoProjectErrorDetails = null;
        this.clockodoWorkerOutdated = false;
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
        const retentionSelect = document.getElementById('externalBackupRetentionSelect');
        if (retentionSelect) {
            const retention = Number(this.backupService?.retention || 20);
            retentionSelect.value = ['5', '10', '20', '50'].includes(String(retention)) ? String(retention) : '20';
        }
        this.updateExternalBackupStatus().catch(error => {
            this.diagnostics?.warn('backup', 'settings-status', error, { status: 'failed' });
        });
        this.renderDiagnostics();
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

    getExchange() {
        const api = (typeof window !== 'undefined' && window.TimerHubExchange) || globalThis.TimerHubExchange;
        if (!api) throw Object.assign(new Error('exchange_unavailable'), { code: 'exchange_unavailable' });
        return api;
    }

    normalizeExchangeActivityName(name) {
        return String(name || '').trim().replace(/\s+/g, ' ').toLowerCase();
    }

    getDayExchangeEntries(date) {
        return this.getDayEntries(date).filter(entry =>
            entry.endTimestamp !== null &&
            Number.isFinite(Number(entry.endTimestamp)) &&
            Number(entry.endTimestamp) > Number(entry.startTimestamp)
        );
    }

    async prepareExchangeExport() {
        try {
            const entries = this.getDayExchangeEntries(this.reviewDate);
            if (!entries.length) {
                this.showToast(this.t('exchangeNoEntries'));
                return null;
            }
            const Exchange = this.getExchange();
            const exportId = this.generateId();
            const payload = Exchange.buildDayPayload({ entries, date: this.reviewDate, exportId });
            const secret = Exchange.generateSecret();
            const envelope = await Exchange.encryptPayload(payload, secret);
            const fileName = `timerhub-exchange_${Date.now()}.timerhub`;
            this.renderedExchangeQr = null;
            this.lastExchange = {
                secret,
                exportId,
                payload,
                envelope,
                fileName,
                file: this.createExchangeFile(envelope, fileName),
                // Chromium's Web Share allow-list only accepts a fixed set of file
                // extensions and MIME types, so the same encrypted bytes also get a
                // share-safe representation (text/plain, ".timerhub.txt").
                shareFileName: `${fileName}.txt`,
                shareFile: this.createExchangeFile(envelope, `${fileName}.txt`, 'text/plain')
            };
            return this.lastExchange;
        } catch (error) {
            this.showToast(this.t('exchangeExportFailed'));
            return null;
        }
    }

    async exportReviewDay() {
        const prepared = await this.prepareExchangeExport();
        if (!prepared) return false;
        this.showDayExportModal();
        return true;
    }

    async shareDayExchange() {
        let prepared = this.lastExchange;
        if (!prepared?.file || prepared.payload?.date !== this.reviewDate) {
            prepared = await this.prepareExchangeExport();
            if (!prepared) return false;
        }
        return this.shareExchangeFile();
    }

    createExchangeFile(envelope, fileName, type = 'application/octet-stream') {
        const json = JSON.stringify(envelope);
        if (typeof File === 'function') return new File([json], fileName, { type });
        const blob = new Blob([json], { type });
        blob.name = fileName;
        return blob;
    }

    downloadExchangeFile(file) {
        const url = URL.createObjectURL(file);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = file?.name || `timerhub-exchange_${Date.now()}.timerhub`;
        anchor.rel = 'noopener';
        anchor.style.display = 'none';
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        setTimeout(() => URL.revokeObjectURL(url), 60_000);
    }

    async shareExchangeFile() {
        const prepared = this.lastExchange;
        if (!prepared?.file) {
            this.showToast(this.t('exchangeNothingToShare'));
            return false;
        }
        const shareFile = prepared.shareFile || prepared.file;
        let canAttemptShare = typeof navigator.share === 'function';
        if (canAttemptShare && typeof navigator.canShare === 'function') {
            try {
                canAttemptShare = navigator.canShare({ files: [shareFile] });
            } catch (error) {
                canAttemptShare = false;
            }
        }
        if (canAttemptShare) {
            try {
                await navigator.share({ files: [shareFile], title: this.t('exportDayTitle') });
                return true;
            } catch (error) {
                if (error?.name === 'AbortError') return false;
            }
        }
        this.downloadExchangeFile(prepared.file);
        // Native file sharing is unavailable: expose the transfer code and QR so
        // the downloaded .timerhub file can still be transferred manually.
        this.showDayExportModal();
        this.showToast(this.t('exchangeShareUnsupported'));
        return true;
    }

    showDayExportModal() {
        const display = document.getElementById('exchangeCodeDisplay');
        if (display) {
            display.textContent = this.lastExchange?.secret
                ? this.getExchange().formatTransferCode(this.lastExchange.secret)
                : '';
        }
        document.getElementById('dayExportModal')?.classList.add('active');
    }

    closeDayExportModal() {
        document.getElementById('dayExportModal')?.classList.remove('active');
    }

    async copyTransferCode() {
        const secret = this.lastExchange?.secret;
        if (!secret) return false;
        try {
            await navigator.clipboard.writeText(secret);
            this.showToast(this.t('copied'));
            return true;
        } catch (error) {
            this.showToast(this.t('failedToCopy'));
            return false;
        }
    }

    showExchangeQr() {
        const secret = this.lastExchange?.secret;
        if (!secret) return false;
        const qrPayload = this.getExchange().buildQrPayload(secret);
        if (this.renderedExchangeQr !== qrPayload) {
            this.renderExchangeQr(qrPayload);
            this.renderedExchangeQr = qrPayload;
        }
        document.getElementById('exchangeQrModal')?.classList.add('active');
        return true;
    }

    renderExchangeQr(text) {
        const canvas = document.getElementById('exchangeQrCanvas');
        if (!canvas || typeof canvas.getContext !== 'function' || typeof globalThis.qrcode !== 'function') return false;
        const qr = globalThis.qrcode(0, 'M');
        qr.addData(text);
        qr.make();
        const count = qr.getModuleCount();
        const size = Number(canvas.width) || 240;
        const cell = Math.max(1, Math.floor(size / count));
        const offset = Math.floor((size - cell * count) / 2);
        const context = canvas.getContext('2d');
        if (!context) return false;
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, size, size);
        context.fillStyle = '#000000';
        for (let row = 0; row < count; row++) {
            for (let column = 0; column < count; column++) {
                if (qr.isDark(row, column)) context.fillRect(offset + column * cell, offset + row * cell, cell, cell);
            }
        }
        return true;
    }

    closeExchangeQr() {
        document.getElementById('exchangeQrModal')?.classList.remove('active');
    }

    showDayImportModal() {
        this.pendingExchange = null;
        this.exchangeFile = null;
        const fileInput = document.getElementById('exchangeFileInput');
        if (fileInput) fileInput.value = '';
        const fileName = document.getElementById('exchangeFileName');
        if (fileName) fileName.textContent = '';
        const codeInput = document.getElementById('exchangeCodeInput');
        if (codeInput) codeInput.value = '';
        this.hideExchangeError();
        this.refreshExchangeDecryptState();
        document.getElementById('dayImportModal')?.classList.add('active');
    }

    closeDayImportModal() {
        this.closeExchangeScan();
        document.getElementById('dayImportModal')?.classList.remove('active');
    }

    handleExchangeFileSelected(file) {
        const nameNode = document.getElementById('exchangeFileName');
        if (!file) {
            this.exchangeFile = null;
            if (nameNode) nameNode.textContent = '';
            this.refreshExchangeDecryptState();
            return false;
        }
        if (!/\.timerhub(\.txt)?$/i.test(file.name || '')) {
            this.exchangeFile = null;
            if (nameNode) nameNode.textContent = '';
            this.showExchangeError('invalid_exchange_file');
            this.refreshExchangeDecryptState();
            return false;
        }
        if (Number(file.size) > 4 * 1024 * 1024) {
            this.exchangeFile = null;
            if (nameNode) nameNode.textContent = '';
            this.showExchangeError('invalid_exchange_file');
            this.refreshExchangeDecryptState();
            return false;
        }
        this.exchangeFile = file;
        if (nameNode) nameNode.textContent = String(file.name || '');
        this.hideExchangeError();
        this.refreshExchangeDecryptState();
        return true;
    }

    refreshExchangeDecryptState() {
        this.pendingExchange = null;
        const code = document.getElementById('exchangeCodeInput')?.value || '';
        const decryptButton = document.getElementById('exchangeDecryptBtn');
        if (decryptButton) {
            decryptButton.disabled = !this.exchangeFile || code.trim().length === 0;
            decryptButton.style.display = '';
        }
        const preview = document.getElementById('exchangePreview');
        if (preview) preview.style.display = 'none';
        const importButton = document.getElementById('exchangeImportBtn');
        if (importButton) {
            importButton.style.display = 'none';
            importButton.disabled = false;
        }
    }

    readExchangeFileText(file) {
        if (file && typeof file.text === 'function') return file.text();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = event => resolve(String(event?.target?.result || ''));
            reader.onerror = () => reject(new Error('exchange_read_failed'));
            reader.readAsText(file);
        });
    }

    async decryptExchangeFile() {
        const Exchange = this.getExchange();
        try {
            if (!this.exchangeFile) {
                this.showExchangeError('exchange_choose_file_first');
                return false;
            }
            const raw = await this.readExchangeFileText(this.exchangeFile);
            let envelope;
            try {
                envelope = JSON.parse(raw);
            } catch (error) {
                throw Object.assign(new Error('invalid_exchange_file'), { code: 'invalid_exchange_file' });
            }
            const secret = Exchange.normalizeTransferCode(document.getElementById('exchangeCodeInput')?.value || '');
            const payload = await Exchange.decryptPayload(envelope, secret);
            const repeat = await this.wasExchangeImported(payload.exportId);
            this.pendingExchange = { payload, repeat, analysis: this.analyzeExchangePayload(payload) };
            this.hideExchangeError();
            this.renderExchangePreview();
            return true;
        } catch (error) {
            this.pendingExchange = null;
            this.showExchangeError(error?.code || 'exchange_decrypt_failed');
            return false;
        }
    }

    analyzeExchangePayload(payload) {
        const existing = this.getDayEntries(payload.date);
        const activityNames = new Set(this.activities.map(activity => this.normalizeExchangeActivityName(activity.name)));
        const customerIds = new Set((this.clockodoCustomers || []).map(customer => String(customer.id)));
        const serviceIds = new Set((this.clockodoServices || []).map(service => String(service.id)));
        const rows = payload.entries.map(item => ({
            ...item,
            knownActivity: activityNames.has(this.normalizeExchangeActivityName(item.activityName)),
            duplicate: existing.some(entry =>
                Number(entry.startTimestamp) === Number(item.startTimestamp) &&
                Number(entry.endTimestamp) === Number(item.endTimestamp) &&
                this.normalizeExchangeActivityName(entry.activityNameSnapshot) === this.normalizeExchangeActivityName(item.activityName)
            ),
            unknownCustomer: Boolean(item.customerId && customerIds.size && !customerIds.has(String(item.customerId))),
            unknownService: Boolean(item.serviceId && serviceIds.size && !serviceIds.has(String(item.serviceId)))
        }));
        const warnings = [];
        if (rows.some(row => !row.knownActivity)) warnings.push('exchangeWarningNewActivity');
        if (rows.some(row => row.duplicate)) warnings.push('exchangeWarningDuplicate');
        if (rows.some(row => row.unknownCustomer)) warnings.push('exchangeWarningUnknownCustomer');
        if (rows.some(row => row.unknownService)) warnings.push('exchangeWarningUnknownService');
        if (payload.entries.some(entry => !entry.customerId || !entry.serviceId)) warnings.push('exchangeWarningMissingAssignment');
        return { rows, warnings };
    }

    renderExchangePreview() {
        const state = this.pendingExchange;
        if (!state) return false;
        const total = state.payload.entries.reduce((sum, entry) => sum + (entry.endTimestamp - entry.startTimestamp), 0);
        const summary = document.getElementById('exchangePreviewSummary');
        if (summary) {
            summary.innerHTML = `<strong>${this.escapeHtml(this.t('exchangeSourceDate'))}: ${this.escapeHtml(state.payload.date)}</strong>`
                + `<span>${this.escapeHtml(this.t('entriesCount', { count: state.payload.entries.length }))}</span>`
                + `<span>${this.escapeHtml(this.t('total'))}: ${this.escapeHtml(this.formatDuration(total))}</span>`;
        }
        const warnings = document.getElementById('exchangePreviewWarnings');
        if (warnings) {
            const labels = {
                exchangeWarningNewActivity: this.t('exchangeWarningNewActivity'),
                exchangeWarningDuplicate: this.t('exchangeWarningDuplicate'),
                exchangeWarningUnknownCustomer: this.t('exchangeWarningUnknownCustomer'),
                exchangeWarningUnknownService: this.t('exchangeWarningUnknownService'),
                exchangeWarningMissingAssignment: this.t('exchangeWarningMissingAssignment'),
                exchangeWarningRepeat: this.t('exchangeWarningRepeat')
            };
            const keys = [...(state.repeat ? ['exchangeWarningRepeat'] : []), ...state.analysis.warnings];
            warnings.innerHTML = keys.length
                ? `<div class="warning" style="display:block;">${keys.map(key => `<div>${this.escapeHtml(labels[key] || '')}</div>`).join('')}</div>`
                : '';
        }
        const list = document.getElementById('exchangePreviewList');
        if (list) {
            list.innerHTML = state.analysis.rows.map(row => {
                const customer = row.customerName || row.customerId || '—';
                const service = row.serviceName || row.serviceId || '—';
                const notes = row.notes ? `<div class="exchange-preview-notes">${this.escapeHtml(row.notes)}</div>` : '';
                return `<div class="exchange-preview-item">
                    <div class="exchange-preview-times"><strong>${this.escapeHtml(this.formatTime(row.startTimestamp))}</strong><span>–</span><strong>${this.escapeHtml(this.formatTime(row.endTimestamp))}</strong><span class="exchange-preview-duration">${this.escapeHtml(this.formatDuration(row.endTimestamp - row.startTimestamp))}</span></div>
                    <div class="exchange-preview-activity">${this.escapeHtml(row.activityName)}</div>
                    <div class="exchange-preview-meta">${this.escapeHtml(this.t('customer'))}: ${this.escapeHtml(customer)} · ${this.escapeHtml(this.t('service'))}: ${this.escapeHtml(service)}</div>
                    ${notes}
                </div>`;
            }).join('');
        }
        const preview = document.getElementById('exchangePreview');
        if (preview) preview.style.display = '';
        const decryptButton = document.getElementById('exchangeDecryptBtn');
        if (decryptButton) {
            decryptButton.disabled = true;
            decryptButton.style.display = 'none';
        }
        const importButton = document.getElementById('exchangeImportBtn');
        if (importButton) {
            importButton.style.display = '';
            importButton.disabled = false;
            importButton.textContent = state.repeat ? this.t('importAgainBtn') : this.t('importBtn');
        }
        return true;
    }

    async confirmExchangeImport() {
        const state = this.pendingExchange;
        if (!state) return false;
        const importButton = document.getElementById('exchangeImportBtn');
        if (importButton) importButton.disabled = true;
        try {
            const Exchange = this.getExchange();
            const payload = Exchange.validatePayload(state.payload);
            await this.recordExchangeImport(payload.exportId);
            let created = 0;
            for (const item of payload.entries) {
                const activity = await this.resolveExchangeActivity(item);
                await this.addEntry({
                    activityId: activity.id,
                    activityNameSnapshot: item.activityName,
                    startTimestamp: item.startTimestamp,
                    endTimestamp: item.endTimestamp,
                    source: 'manual',
                    notes: item.notes,
                    customerId: item.customerId || '',
                    serviceId: item.serviceId || '',
                    customerName: item.customerName || '',
                    serviceName: item.serviceName || ''
                });
                created += 1;
            }
            this.closeDayImportModal();
            this.reviewDate = payload.date;
            this.renderReview();
            this.showToast(this.t('exchangeImportedCount', { count: created }));
            return true;
        } catch (error) {
            if (importButton) importButton.disabled = false;
            this.showExchangeError(error?.code || 'exchange_import_failed');
            return false;
        }
    }

    async resolveExchangeActivity(item) {
        const key = this.normalizeExchangeActivityName(item.activityName);
        const existing = this.activities.find(activity => this.normalizeExchangeActivityName(activity.name) === key);
        if (existing) return existing;
        const now = Date.now();
        const activity = {
            id: this.generateId(),
            name: item.activityName,
            color: this.COLORS[this.activities.length % this.COLORS.length],
            shape: 'circle',
            size: 'medium',
            customerId: item.customerId || '',
            serviceId: item.serviceId || '',
            customerName: item.customerName || '',
            serviceName: item.serviceName || '',
            position: this.activities.length,
            archived: false,
            createdAt: now,
            updatedAt: now
        };
        this.activities.push(activity);
        await this.storage.saveActivity(activity);
        return activity;
    }

    async getExchangeImports() {
        const imports = await this.storage.getSetting('exchangeImports', []);
        return Array.isArray(imports) ? imports : [];
    }

    async wasExchangeImported(exportId) {
        return (await this.getExchangeImports()).some(item => item?.exportId === exportId);
    }

    async recordExchangeImport(exportId) {
        const imports = (await this.getExchangeImports()).filter(item => item?.exportId !== exportId);
        imports.push({ exportId, importedAt: Date.now() });
        await this.storage.setSetting('exchangeImports', imports.slice(-100));
    }

    getShareLinkModule() {
        const api = (typeof window !== 'undefined' && window.TimerHubShareLink) || globalThis.TimerHubShareLink;
        if (!api) throw Object.assign(new Error('share_link_unavailable'), { code: 'share_link_unavailable' });
        return api;
    }

    getFetchImpl() {
        return typeof globalThis.fetch === 'function' ? globalThis.fetch.bind(globalThis) : null;
    }

    locationOrigin() {
        return window.location?.origin || '';
    }

    locationPathname() {
        return window.location?.pathname || '/';
    }

    captureSharedLinkFromLocation() {
        try {
            const location = window.location || {};
            const href = location.href ||
                `${location.origin || ''}${location.pathname || '/'}${location.search || ''}${location.hash || ''}`;
            const parsed = this.getShareLinkModule().parseShareUrl(href);
            if (!parsed) return null;
            this.pendingShareLink = parsed;
            if (window.history?.replaceState) {
                try {
                    const clean = new URL(href);
                    clean.searchParams.delete('share');
                    clean.hash = '';
                    window.history.replaceState({}, '', clean.toString());
                } catch { /* keep the original URL */ }
            }
            return parsed;
        } catch {
            return null;
        }
    }

    openShareLinkModal() {
        const entries = this.getDayExchangeEntries(this.reviewDate);
        if (!entries.length) {
            this.showToast(this.t('exchangeNoEntries'));
            return false;
        }
        this.shareLinkEntries = entries;
        this.shareLinkSelection = new Set(entries.map((unused, index) => index));
        this.lastShareLink = null;
        this.setShareLinkStatus('');
        this.setShareLinkResult('');
        this.renderShareLinkEntries();
        const select = document.getElementById('shareLinkExpirySelect');
        if (select && !select.value) select.value = 'day';
        document.getElementById('shareLinkModal')?.classList.add('active');
        return true;
    }

    closeShareLinkModal() {
        document.getElementById('shareLinkModal')?.classList.remove('active');
    }

    setShareLinkEntrySelected(index, selected) {
        const position = Number(index);
        if (!Number.isInteger(position) || position < 0 || position >= this.shareLinkEntries.length) return false;
        if (selected) this.shareLinkSelection.add(position);
        else this.shareLinkSelection.delete(position);
        this.updateShareLinkSummary();
        return true;
    }

    updateShareLinkSummary() {
        const selected = this.shareLinkEntries.filter((unused, index) => this.shareLinkSelection.has(index));
        const total = selected.reduce((sum, entry) => sum + (Number(entry.endTimestamp) - Number(entry.startTimestamp)), 0);
        const summary = document.getElementById('shareLinkSummary');
        if (summary) {
            summary.textContent = this.t('shareLinkSelected', { count: selected.length, total: this.formatDuration(total) });
        }
        const button = document.getElementById('shareLinkCreateBtn');
        if (button) button.disabled = selected.length === 0;
        return selected.length;
    }

    renderShareLinkEntries() {
        const list = document.getElementById('shareLinkEntryList');
        if (!list) return false;
        list.innerHTML = this.shareLinkEntries.map((entry, index) => `
            <label class="share-link-entry">
                <input type="checkbox" data-share-entry="${index}" ${this.shareLinkSelection.has(index) ? 'checked' : ''}>
                <span class="exchange-preview-item">
                    <span class="exchange-preview-times"><strong>${this.escapeHtml(this.formatTime(entry.startTimestamp))}</strong><span>–</span><strong>${this.escapeHtml(this.formatTime(entry.endTimestamp))}</strong><span class="exchange-preview-duration">${this.escapeHtml(this.formatDuration(entry.endTimestamp - entry.startTimestamp))}</span></span>
                    <span class="exchange-preview-activity">${this.escapeHtml(entry.activityNameSnapshot || this.t('noActivity'))}</span>
                </span>
            </label>`).join('');
        this.updateShareLinkSummary();
        return true;
    }

    setShareLinkStatus(message) {
        this.shareLinkStatus = message || '';
        const node = document.getElementById('shareLinkStatus');
        if (node) {
            node.textContent = this.shareLinkStatus;
            node.style.display = this.shareLinkStatus ? '' : 'none';
        }
    }

    setShareLinkResult(url) {
        this.shareLinkResultUrl = url || '';
        const node = document.getElementById('shareLinkResult');
        if (node) {
            node.textContent = this.shareLinkResultUrl;
            node.style.display = this.shareLinkResultUrl ? '' : 'none';
        }
        const actions = document.getElementById('shareLinkActions');
        if (actions) actions.style.display = this.shareLinkResultUrl ? '' : 'none';
    }

    getShareLinkExpiryMinutes() {
        const ShareLink = this.getShareLinkModule();
        const selected = document.getElementById('shareLinkExpirySelect')?.value || 'day';
        const option = ShareLink.EXPIRY_OPTIONS.find(item => item.id === selected) || ShareLink.EXPIRY_OPTIONS[1];
        return option.minutes;
    }

    async createShareLink() {
        if (this.shareLinkInProgress) return false;
        const entries = this.shareLinkEntries.filter((unused, index) => this.shareLinkSelection.has(index));
        if (!entries.length) {
            this.setShareLinkStatus(this.t('shareLinkNoEntries'));
            return false;
        }
        this.shareLinkInProgress = true;
        try {
            const ShareLink = this.getShareLinkModule();
            const Exchange = this.getExchange();
            const payload = Exchange.buildDayPayload({ entries, date: this.reviewDate, exportId: this.generateId() });
            const secret = Exchange.generateSecret();
            const envelope = await Exchange.encryptPayload(payload, secret);
            const expiresAt = Date.now() + ShareLink.normalizeExpiryMs(this.getShareLinkExpiryMinutes());
            const shareId = ShareLink.generateShareId();
            await ShareLink.createShare(this.getFetchImpl(), this.locationOrigin(), { shareId, envelope, expiresAt });
            const url = ShareLink.buildShareUrl({
                origin: this.locationOrigin(),
                pathname: this.locationPathname(),
                shareId,
                secret
            });
            this.lastShareLink = { shareId, secret, url, expiresAt, payload };
            this.setShareLinkResult(url);
            this.setShareLinkStatus(this.t('shareLinkCreated', { count: payload.entries.length }));
            return true;
        } catch (error) {
            this.shareLinkErrorCode = error?.code || 'unknown';
            this.setShareLinkStatus(this.shareLinkErrorMessage(error?.code));
            return false;
        } finally {
            this.shareLinkInProgress = false;
        }
    }

    async copyShareLink() {
        const url = this.lastShareLink?.url;
        if (!url) return false;
        try {
            await navigator.clipboard.writeText(url);
            this.showToast(this.t('shareLinkCopied'));
            return true;
        } catch (error) {
            this.showToast(this.t('failedToCopy'));
            return false;
        }
    }

    async sendShareLink() {
        const url = this.lastShareLink?.url;
        if (!url) return false;
        if (typeof navigator.share === 'function') {
            try {
                await navigator.share({ title: this.t('shareLinkTitle'), text: url, url });
                return true;
            } catch (error) {
                if (error?.name === 'AbortError') return false;
            }
        }
        return this.copyShareLink();
    }

    shareLinkErrorMessage(code) {
        const messages = {
            share_not_found: this.t('shareLinkNotFound'),
            share_expired: this.t('shareLinkExpired'),
            share_exists: this.t('shareLinkExists'),
            invalid_share_payload: this.t('shareLinkInvalid'),
            invalid_share: this.t('shareLinkInvalid'),
            invalid_share_request: this.t('shareLinkInvalid'),
            invalid_expiry: this.t('shareLinkInvalid'),
            share_unavailable: this.t('shareLinkUnavailable'),
            network_error: this.t('shareLinkUnavailable'),
            share_storage_failed: this.t('shareLinkUnavailable'),
            share_link_unavailable: this.t('shareLinkUnavailable'),
            secure_crypto_unavailable: this.t('exchangeCryptoUnavailable')
        };
        return messages[code] || this.t('shareLinkUnavailable');
    }

    setSharedDayStatus(message) {
        this.sharedDayStatusMessage = message || '';
        const node = document.getElementById('sharedDayStatus');
        if (node) {
            node.textContent = this.sharedDayStatusMessage;
            node.style.display = this.sharedDayStatusMessage ? '' : 'none';
        }
    }

    analyzeSharedPayload(payload) {
        const customerIds = new Set((this.clockodoCustomers || []).map(customer => String(customer.id)));
        const serviceIds = new Set((this.clockodoServices || []).map(service => String(service.id)));
        const hasReferenceData = this.clockodoConfigured && this.clockodoReferenceStatus === 'ready';
        const rows = payload.entries.map(entry => {
            const customerId = String(entry.customerId || this.clockodoCustomerId || '');
            const serviceId = String(entry.serviceId || this.clockodoServiceId || '');
            return {
                entry,
                customerId,
                serviceId,
                missingCustomer: hasReferenceData ? (!customerId || !customerIds.has(customerId)) : false,
                missingService: hasReferenceData ? (!serviceId || !serviceIds.has(serviceId)) : false
            };
        });
        return { rows, hasReferenceData };
    }

    sharedEntryBadge(status) {
        return {
            synced: this.t('sharedImportBadgeSynced'),
            failed: this.t('sharedImportBadgeFailed'),
            unknown: this.t('sharedImportBadgeUnknown'),
            sending: this.t('sharedImportBadgeSending'),
            pending: this.t('sharedImportBadgePending')
        }[status] || '';
    }

    renderSharedDayPreview() {
        const state = this.pendingSharedDay;
        if (!state) return false;
        state.analysis = this.analyzeSharedPayload(state.payload);
        const { rows } = state.analysis;
        const total = state.payload.entries.reduce((sum, entry) => sum + (entry.endTimestamp - entry.startTimestamp), 0);
        const summary = document.getElementById('sharedDayPreviewSummary');
        if (summary) {
            summary.innerHTML = `<strong>${this.escapeHtml(this.t('exchangeSourceDate'))}: ${this.escapeHtml(state.payload.date)}</strong>`
                + `<span>${this.escapeHtml(this.t('entriesCount', { count: rows.length }))}</span>`
                + `<span>${this.escapeHtml(this.t('total'))}: ${this.escapeHtml(this.formatDuration(total))}</span>`
                + `<span>${this.escapeHtml(this.t('sharedDayExpires', { date: this.formatSnapshotDate(state.expiresAt) }))}</span>`;
        }
        const warnings = document.getElementById('sharedDayPreviewWarnings');
        if (warnings) {
            const warningKeys = [];
            if (state.repeat) warningKeys.push({ key: 'exchangeWarningRepeat' });
            if (!this.clockodoConfigured) warningKeys.push({ key: 'sharedDayConfigRequired' });
            if (rows.some(row => row.missingCustomer)) warningKeys.push({ key: 'sharedDayMissingCustomer' });
            if (rows.some(row => row.missingService)) warningKeys.push({ key: 'sharedDayMissingService' });
            warnings.innerHTML = warningKeys.length
                ? `<div class="warning" style="display:block;">${warningKeys.map(item => `<div>${this.escapeHtml(this.t(item.key))}</div>`).join('')}</div>`
                : '';
        }
        const list = document.getElementById('sharedDayPreviewList');
        if (list) {
            list.innerHTML = rows.map((row, index) => {
                const entry = row.entry;
                const customer = entry.customerName || entry.customerId || '—';
                const service = entry.serviceName || entry.serviceId || '—';
                const notes = entry.notes ? `<div class="exchange-preview-notes">${this.escapeHtml(entry.notes)}</div>` : '';
                const status = this.sharedImport?.entries?.[index];
                return `<div class="exchange-preview-item">
                    <div class="exchange-preview-times"><strong>${this.escapeHtml(this.formatTime(entry.startTimestamp))}</strong><span>–</span><strong>${this.escapeHtml(this.formatTime(entry.endTimestamp))}</strong><span class="exchange-preview-duration">${this.escapeHtml(this.formatDuration(entry.endTimestamp - entry.startTimestamp))}</span></div>
                    <div class="exchange-preview-activity">${this.escapeHtml(entry.activityName)} <span class="shared-import-badge" data-share-import-index="${index}">${this.escapeHtml(status ? this.sharedEntryBadge(status.status) : '')}</span></div>
                    <div class="exchange-preview-meta">${this.escapeHtml(this.t('customer'))}: ${this.escapeHtml(customer)} · ${this.escapeHtml(this.t('service'))}: ${this.escapeHtml(service)}</div>
                    ${notes}
                </div>`;
            }).join('');
        }
        const importButton = document.getElementById('sharedDayImportBtn');
        if (importButton) importButton.disabled = Boolean(this.sharedImport?.completed);
        const retryButton = document.getElementById('sharedDayRetryBtn');
        if (retryButton) retryButton.style.display = this.hasRetryableSharedEntries() ? '' : 'none';
        return true;
    }

    async openSharedDay(link = this.pendingShareLink) {
        if (!link?.shareId || !link?.secret) return false;
        this.pendingShareLink = link;
        this.setSharedDayStatus(this.t('shareLinkLoading'));
        try {
            const ShareLink = this.getShareLinkModule();
            const { envelope, expiresAt } = await ShareLink.fetchShare(this.getFetchImpl(), this.locationOrigin(), link.shareId);
            const payload = await this.getExchange().decryptPayload(envelope, link.secret);
            const repeat = await this.wasExchangeImported(payload.exportId);
            this.pendingSharedDay = { shareId: link.shareId, secret: link.secret, payload, expiresAt, repeat, analysis: null };
            this.sharedImport = null;
            this.sharedImportNeedsConfig = false;
            this.sharedImportStatus = 'idle';
            this.renderSharedDayPreview();
            this.setSharedDayStatus('');
            document.getElementById('sharedDayModal')?.classList.add('active');
            return true;
        } catch (error) {
            this.pendingSharedDay = null;
            const message = this.sharedLinkErrorMessage(error?.code);
            this.setSharedDayStatus(message);
            this.showToast(message);
            return false;
        }
    }

    sharedLinkErrorMessage(code) {
        const messages = {
            share_not_found: this.t('shareLinkNotFound'),
            share_expired: this.t('shareLinkExpired'),
            network_error: this.t('shareLinkUnavailable'),
            share_unavailable: this.t('shareLinkUnavailable'),
            invalid_exchange_file: this.t('exchangeInvalidFile'),
            unsupported_exchange_version: this.t('exchangeUnsupportedFormat'),
            exchange_decrypt_failed: this.t('exchangeDecryptFailed'),
            invalid_exchange_payload: this.t('exchangeInvalidPayload'),
            invalid_share_payload: this.t('shareLinkInvalid'),
            secure_crypto_unavailable: this.t('exchangeCryptoUnavailable')
        };
        return messages[code] || this.t('shareLinkUnavailable');
    }

    closeSharedDayModal() {
        document.getElementById('sharedDayModal')?.classList.remove('active');
    }

    hasRetryableSharedEntries() {
        return Boolean(this.sharedImport?.entries?.some(row => row.status === 'pending' || row.status === 'failed'));
    }

    async initiateSharedImport() {
        if (!this.pendingSharedDay) return false;
        if (!this.clockodoConfigured) {
            this.sharedImportNeedsConfig = true;
            this.setSharedDayStatus(this.t('sharedImportConfigRequired'));
            this.showToast(this.t('sharedImportConfigRequired'));
            this.closeSharedDayModal();
            this.switchScreen('settings');
            return false;
        }
        return this.performSharedImport();
    }

    async resumeSharedDayAfterConfig() {
        if (!this.pendingSharedDay) return false;
        await this.loadClockodoReferenceData({ force: true }).catch(() => false);
        this.renderSharedDayPreview();
        document.getElementById('sharedDayModal')?.classList.add('active');
        this.setSharedDayStatus(this.t('sharedImportConfigReady'));
        return true;
    }

    renderSharedDayImportProgress() {
        const entries = this.sharedImport?.entries || [];
        document.querySelectorAll?.('[data-share-import-index]').forEach(node => {
            const row = entries[Number(node?.dataset?.shareImportIndex)];
            if (row) node.textContent = this.sharedEntryBadge(row.status);
        });
        return true;
    }

    async performSharedImport() {
        const state = this.pendingSharedDay;
        if (!state || !this.clockodoClient) {
            this.setSharedDayStatus(this.t('sharedImportFailed'));
            return false;
        }
        if (this.sharedImport?.completed) return true;
        let ready = this.clockodoReferenceStatus === 'ready';
        if (!ready) {
            ready = await this.loadClockodoReferenceData({ force: true }).catch(() => false);
        }
        if (!ready) {
            this.sharedImportStatus = 'reference_failed';
            this.setSharedDayStatus(this.t('sharedImportReferenceFailed'));
            return false;
        }
        state.analysis = this.analyzeSharedPayload(state.payload);
        const missing = state.analysis.rows.filter(row => row.missingCustomer || row.missingService);
        if (missing.length) {
            this.sharedImportStatus = 'missing_mapping';
            this.setSharedDayStatus(this.t('sharedImportMissingMapping', {
                customers: missing.filter(row => row.missingCustomer).length,
                services: missing.filter(row => row.missingService).length
            }));
            return false;
        }
        if (!this.sharedImport) {
            this.sharedImport = {
                entries: state.payload.entries.map((entry, index) => ({ index, entry, status: 'pending', error: null, errorDetails: null, clockodoEntryId: null })),
                completed: false
            };
        }
        const accessToken = this.getClockodoAccessToken();
        const clientId = this.getPushClientId();
        const config = {
            customerId: this.clockodoCustomerId,
            serviceId: this.clockodoServiceId,
            projectId: this.clockodoProjectId,
            billable: this.clockodoBillable
        };
        const uncertainCodes = new Set([
            'network_error', 'timeout', 'malformed_response', 'network_outcome_unknown',
            'timeout_outcome_unknown', 'operation_outcome_unknown', 'clockodo_outcome_unknown'
        ]);
        for (const row of this.sharedImport.entries) {
            if (row.status === 'synced' || row.status === 'unknown') continue;
            row.status = 'sending';
            row.error = null;
            row.errorDetails = null;
            this.renderSharedDayImportProgress();
            try {
                const entryPayload = this.clockodoClient.buildEntryPayload({
                    startTimestamp: row.entry.startTimestamp,
                    endTimestamp: row.entry.endTimestamp,
                    notes: row.entry.notes,
                    customerId: row.entry.customerId || this.clockodoCustomerId,
                    serviceId: row.entry.serviceId || this.clockodoServiceId,
                    project: this.clockodoProjectId
                }, config);
                const idempotencyKey = `timerhub-share:${state.shareId}:${row.index}`;
                const result = await this.clockodoClient.createEntry(clientId, accessToken, entryPayload, idempotencyKey);
                if (result?.created === true && Number.isSafeInteger(Number(result.entryId)) && Number(result.entryId) > 0) {
                    row.status = 'synced';
                    row.clockodoEntryId = Number(result.entryId);
                } else {
                    row.status = 'unknown';
                    row.error = 'malformed_response';
                }
            } catch (error) {
                const uncertain = uncertainCodes.has(error?.code);
                row.status = uncertain ? 'unknown' : 'failed';
                row.error = error?.code || 'request_rejected';
                row.errorDetails = uncertain ? null : this.normalizeClockodoErrorDetails(error?.details);
            }
            this.renderSharedDayImportProgress();
        }
        const rows = this.sharedImport.entries;
        if (rows.every(row => row.status === 'synced')) {
            this.sharedImport.completed = true;
            this.sharedImportStatus = 'success';
            let linkInvalidated = false;
            try {
                await this.getShareLinkModule().completeShare(this.getFetchImpl(), this.locationOrigin(), state.shareId);
                linkInvalidated = true;
            } catch {
                linkInvalidated = false;
            }
            await this.recordExchangeImport(state.payload.exportId);
            const message = linkInvalidated
                ? this.t('sharedImportSuccess', { count: rows.length })
                : this.t('sharedImportSuccessLinkOpen', { count: rows.length });
            this.setSharedDayStatus(message);
            this.renderSharedDayPreview();
            this.showToast(message);
            return true;
        }
        this.sharedImportStatus = 'partial';
        this.setSharedDayStatus(this.t('sharedImportPartial', {
            failed: rows.filter(row => row.status === 'failed').length,
            unknown: rows.filter(row => row.status === 'unknown').length
        }));
        this.renderSharedDayPreview();
        return false;
    }

    exchangeErrorMessage(code) {
        const messages = {
            invalid_exchange_file: this.t('exchangeInvalidFile'),
            unsupported_exchange_version: this.t('exchangeUnsupportedFormat'),
            invalid_transfer_code: this.t('exchangeInvalidTransferCode'),
            exchange_decrypt_failed: this.t('exchangeDecryptFailed'),
            invalid_exchange_payload: this.t('exchangeInvalidPayload'),
            invalid_qr_payload: this.t('exchangeInvalidQr'),
            secure_crypto_unavailable: this.t('exchangeCryptoUnavailable'),
            exchange_unavailable: this.t('exchangeCryptoUnavailable'),
            exchange_choose_file_first: this.t('exchangeChooseFileFirst'),
            exchange_import_failed: this.t('exchangeImportFailed')
        };
        return messages[code] || this.t('exchangeImportFailed');
    }

    showExchangeError(code) {
        const node = document.getElementById('exchangeImportError');
        if (!node) return;
        node.textContent = this.exchangeErrorMessage(code);
        node.style.display = '';
    }

    hideExchangeError() {
        const node = document.getElementById('exchangeImportError');
        if (!node) return;
        node.textContent = '';
        node.style.display = 'none';
    }

    openExchangeScan() {
        this.closeExchangeScan();
        this.exchangeScanOperation = { stream: null, detector: null, frame: null, canvas: null, stopped: false };
        const status = document.getElementById('exchangeScanStatus');
        if (status) status.textContent = '';
        document.getElementById('exchangeScanModal')?.classList.add('active');
        if (!navigator.mediaDevices?.getUserMedia) {
            if (status) status.textContent = this.t('exchangeScanUnsupported');
            return false;
        }
        this.startExchangeScan();
        return true;
    }

    async startExchangeScan() {
        const operation = this.exchangeScanOperation;
        if (!operation) return false;
        const status = document.getElementById('exchangeScanStatus');
        const video = document.getElementById('exchangeScanVideo');
        let stream;
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
        } catch (error) {
            if (status) status.textContent = this.t('exchangeScanPermission');
            return false;
        }
        if (operation.stopped || this.exchangeScanOperation !== operation) {
            stream.getTracks().forEach(track => track.stop());
            return false;
        }
        operation.stream = stream;
        if (video) {
            video.srcObject = stream;
            await video.play?.().catch(() => {});
        }
        const detectorSupported = typeof globalThis.BarcodeDetector === 'function';
        const jsqrSupported = typeof globalThis.jsQR === 'function';
        if (!detectorSupported && !jsqrSupported) {
            if (status) status.textContent = this.t('exchangeScanUnsupported');
            return false;
        }
        if (detectorSupported) operation.detector = new globalThis.BarcodeDetector({ formats: ['qr_code'] });
        else operation.canvas = document.createElement('canvas');
        if (status) status.textContent = this.t('exchangeScanning');
        const tick = async () => {
            if (operation.stopped || this.exchangeScanOperation !== operation) return;
            try {
                let value = null;
                if (operation.detector) {
                    const codes = await operation.detector.detect(video);
                    value = codes?.[0]?.rawValue || null;
                } else if (jsqrSupported && video?.videoWidth) {
                    const canvas = operation.canvas;
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    const context = canvas.getContext('2d');
                    context.drawImage(video, 0, 0);
                    const image = context.getImageData(0, 0, canvas.width, canvas.height);
                    const result = globalThis.jsQR(image.data, image.width, image.height, { inversionAttempts: 'dontInvert' });
                    value = result?.data || null;
                }
                if (value && this.handleExchangeQrValue(value)) return;
            } catch (error) {
                // Keep scanning on transient frame errors.
            }
            operation.frame = setTimeout(tick, 350);
        };
        tick();
        return true;
    }

    handleExchangeQrValue(value) {
        try {
            const secret = this.getExchange().parseQrPayload(value);
            const input = document.getElementById('exchangeCodeInput');
            if (input) input.value = this.getExchange().formatTransferCode(secret);
            this.closeExchangeScan();
            this.refreshExchangeDecryptState();
            return true;
        } catch (error) {
            return false;
        }
    }

    closeExchangeScan() {
        const operation = this.exchangeScanOperation;
        this.exchangeScanOperation = null;
        if (operation) {
            operation.stopped = true;
            if (operation.frame) clearTimeout(operation.frame);
            operation.stream?.getTracks?.().forEach(track => track.stop());
        }
        const video = document.getElementById('exchangeScanVideo');
        if (video) video.srcObject = null;
        document.getElementById('exchangeScanModal')?.classList.remove('active');
    }

    getAssignment() {
        const api = (typeof window !== 'undefined' && window.TimerHubAssignment) || globalThis.TimerHubAssignment;
        if (!api) throw Object.assign(new Error('assignment_unavailable'), { code: 'assignment_unavailable' });
        return api;
    }

    assignmentErrorMessage(error) {
        const messages = {
            empty_input: this.t('assignmentInvalidJson'),
            invalid_json: this.t('assignmentInvalidJson'),
            invalid_format: this.t('assignmentInvalidFormat'),
            unsupported_version: this.t('assignmentUnsupportedVersion'),
            unexpected_property: this.t('assignmentUnexpectedProperty'),
            invalid_type: this.t('assignmentInvalidType'),
            invalid_name: this.t('assignmentInvalidName'),
            invalid_value: this.t('assignmentInvalidValue'),
            too_large: this.t('assignmentTooLarge'),
            too_deep: this.t('assignmentTooDeep'),
            too_many_groups: this.t('assignmentTooManyGroups'),
            too_many_activities: this.t('assignmentTooManyActivities'),
            too_many_excluded: this.t('assignmentTooLarge'),
            duplicate_name: this.t('assignmentDuplicateName'),
            empty_assignment: this.t('assignmentEmpty')
        };
        const base = messages[error?.code] || this.t('assignmentImportFailed');
        return error?.path
            ? `${base} (${this.t('assignmentErrorAt', { path: this.escapeHtml(error.path) })})`
            : base;
    }

    showAssignmentError(error) {
        const node = document.getElementById('assignmentImportError');
        if (!node) return;
        node.textContent = this.assignmentErrorMessage(error);
        node.style.display = '';
    }

    hideAssignmentError() {
        const node = document.getElementById('assignmentImportError');
        if (!node) return;
        node.textContent = '';
        node.style.display = 'none';
    }

    showAssignmentImportModal() {
        this.pendingAssignment = null;
        const input = document.getElementById('assignmentJsonInput');
        if (input) input.value = '';
        this.hideAssignmentError();
        this.clearAssignmentPreview();
        document.getElementById('assignmentImportModal')?.classList.add('active');
    }

    closeAssignmentImportModal() {
        this.pendingAssignment = null;
        this.clearAssignmentPreview();
        document.getElementById('assignmentImportModal')?.classList.remove('active');
    }

    clearAssignmentPreview() {
        const preview = document.getElementById('assignmentPreview');
        if (preview) preview.style.display = 'none';
        const importButton = document.getElementById('assignmentImportConfirmBtn');
        if (importButton) {
            importButton.style.display = 'none';
            importButton.disabled = false;
        }
    }

    async handleAssignmentFileSelected(file) {
        if (!file) return false;
        try {
            const text = await this.readExchangeFileText(file);
            const input = document.getElementById('assignmentJsonInput');
            if (input) input.value = text;
            return await this.validateAssignmentJson();
        } catch (error) {
            this.showAssignmentError(Object.assign(new Error('read_failed'), { code: 'read_failed' }));
            return false;
        }
    }

    async getAssignmentImports() {
        const imports = await this.storage.getSetting('assignmentImports', []);
        return Array.isArray(imports) ? imports : [];
    }

    async validateAssignmentJson() {
        const Assignment = this.getAssignment();
        this.pendingAssignment = null;
        this.hideAssignmentError();
        this.clearAssignmentPreview();
        try {
            const text = document.getElementById('assignmentJsonInput')?.value || '';
            const normalized = Assignment.parseAssignment(text);
            const plan = Assignment.buildPlan(normalized);
            plan.assignmentName = plan.assignmentName || this.t('assignmentImportDefaultName');
            const fingerprint = Assignment.fingerprint(normalized);
            const imports = await this.getAssignmentImports();
            const repeat = imports.some(item => item?.fingerprint === fingerprint);
            const replaceTargets = plan.mode === 'replace'
                ? {
                    groups: this.groups.filter(group => group.assignment === plan.assignmentName),
                    activities: this.activities.filter(activity => activity.assignment === plan.assignmentName)
                }
                : { groups: [], activities: [] };
            this.pendingAssignment = { normalized, plan, fingerprint, repeat, replaceTargets };
            this.renderAssignmentPreview();
            return true;
        } catch (error) {
            this.showAssignmentError(error);
            return false;
        }
    }

    renderAssignmentNode(node, depth) {
        const excluded = node.exclude === true;
        const padding = 8 + depth * 16;
        let html = `<div class="assignment-preview-row${excluded ? ' is-excluded' : ''}" style="padding-left:${padding}px;">
            <span class="assignment-preview-kind">${this.escapeHtml(this.t('assignmentPreviewGroup'))}</span>
            <strong>${this.escapeHtml(node.name)}</strong>
            ${excluded ? `<span class="assignment-preview-badge">${this.escapeHtml(this.t('assignmentExcludedShort'))}</span>` : ''}
        </div>`;
        if (excluded) return html;
        for (const activity of node.activities) {
            const activityExcluded = activity.exclude === true;
            html += `<div class="assignment-preview-row${activityExcluded ? ' is-excluded' : ''}" style="padding-left:${padding + 16}px;">
                <span class="assignment-preview-kind">${this.escapeHtml(this.t('activity'))}</span>
                <strong>${this.escapeHtml(activity.name)}</strong>
                ${activity.notes ? `<small>${this.escapeHtml(activity.notes)}</small>` : ''}
                ${activityExcluded ? `<span class="assignment-preview-badge">${this.escapeHtml(this.t('assignmentExcludedShort'))}</span>` : ''}
            </div>`;
        }
        for (const child of node.children) {
            html += this.renderAssignmentNode(child, depth + 1);
        }
        return html;
    }

    renderAssignmentPreview() {
        const state = this.pendingAssignment;
        if (!state) return false;
        const { plan, normalized } = state;
        const summary = document.getElementById('assignmentPreviewSummary');
        if (summary) {
            const modeLabel = plan.mode === 'replace' ? this.t('assignmentModeReplace') : this.t('assignmentModeAdd');
            summary.innerHTML = `<strong>${this.escapeHtml(plan.assignmentName)}</strong>`
                + `<span>${this.escapeHtml(this.t('assignmentPreviewSummary', {
                    groups: plan.groupCount,
                    activities: plan.activityCount,
                    mode: modeLabel
                }))}</span>`;
        }
        const warnings = document.getElementById('assignmentPreviewWarnings');
        if (warnings) {
            const rows = [];
            if (state.repeat) rows.push(this.t('assignmentRepeatWarning'));
            if (state.replaceTargets.groups.length || state.replaceTargets.activities.length) {
                rows.push(this.t('assignmentReplaceNotice', {
                    groups: state.replaceTargets.groups.length,
                    activities: state.replaceTargets.activities.length,
                    name: plan.assignmentName
                }));
            }
            if (plan.excluded.length) {
                rows.push(this.t('assignmentExcludedCount', { count: plan.excluded.length }));
            }
            warnings.innerHTML = rows.length
                ? `<div class="warning" style="display:block;">${rows.map(row => `<div>${this.escapeHtml(row)}</div>`).join('')}</div>`
                : '';
        }
        const list = document.getElementById('assignmentPreviewList');
        if (list) {
            let html = normalized.assignment.groupNodes.map(node => this.renderAssignmentNode(node, 0)).join('');
            for (const activity of normalized.assignment.activities) {
                const excluded = activity.exclude === true;
                html += `<div class="assignment-preview-row${excluded ? ' is-excluded' : ''}" style="padding-left:8px;">
                    <span class="assignment-preview-kind">${this.escapeHtml(this.t('activity'))}</span>
                    <strong>${this.escapeHtml(activity.name)}</strong>
                    ${excluded ? `<span class="assignment-preview-badge">${this.escapeHtml(this.t('assignmentExcludedShort'))}</span>` : ''}
                </div>`;
            }
            list.innerHTML = html;
        }
        const preview = document.getElementById('assignmentPreview');
        if (preview) preview.style.display = '';
        const importButton = document.getElementById('assignmentImportConfirmBtn');
        if (importButton) {
            importButton.style.display = '';
            importButton.disabled = false;
            importButton.textContent = state.repeat ? this.t('assignmentImportAgainBtn') : this.t('assignmentImportBtn');
        }
        return true;
    }

    measureGroupContainer(relativeBoxes) {
        if (!relativeBoxes.length) return { width: 0, height: 0 };
        const bounds = this.groupContainerBounds(relativeBoxes);
        return { width: bounds.width, height: bounds.height };
    }

    currentLayoutObstacles() {
        const obstacles = [];
        // Root group bounds already wrap their nested children.
        for (const group of this.groups) {
            if (this.groupParent(group)) continue;
            const bounds = this.groupBaseBounds(group);
            if (!bounds) continue;
            obstacles.push(bounds);
            const offset = this.groupDisplayOffset(group.id);
            if (offset.x || offset.y) {
                obstacles.push({
                    left: bounds.left + offset.x,
                    top: bounds.top + offset.y,
                    right: bounds.right + offset.x,
                    bottom: bounds.bottom + offset.y,
                    width: bounds.width,
                    height: bounds.height
                });
            }
        }
        for (const activity of this.activities) {
            if (activity.groupId) continue;
            const layout = this.getActivityCanvasLayout(activity, this.activities.indexOf(activity), false);
            obstacles.push({
                left: layout.x,
                top: layout.y,
                right: layout.x + layout.width,
                bottom: layout.y + layout.height,
                width: layout.width,
                height: layout.height
            });
        }
        return obstacles;
    }

    createImportPacking(obstacles = []) {
        return {
            left: CANVAS_IMPORT_ORIGIN,
            top: CANVAS_IMPORT_ORIGIN,
            rowHeight: 0,
            obstacles
        };
    }

    placeNextImportedGroup(packing, dimensions) {
        const width = Number.isFinite(dimensions.width) ? Math.max(0, dimensions.width) : 0;
        const height = Number.isFinite(dimensions.height) ? Math.max(0, dimensions.height) : 0;
        if (packing.left > CANVAS_IMPORT_ORIGIN && packing.left + width > CANVAS_IMPORT_ORIGIN + CANVAS_IMPORT_ROW_WIDTH) {
            packing.left = CANVAS_IMPORT_ORIGIN;
            packing.top += packing.rowHeight + CANVAS_IMPORT_GAP;
            packing.rowHeight = 0;
        }
        const anchorX = this.snapToCanvasGrid(packing.left + CANVAS_GROUP_PADDING);
        const anchorY = this.snapToCanvasGrid(packing.top + CANVAS_GROUP_HEADER);
        const free = this.resolveGroupCollision({
            left: anchorX - CANVAS_GROUP_PADDING,
            top: anchorY - CANVAS_GROUP_HEADER,
            right: anchorX - CANVAS_GROUP_PADDING + width,
            bottom: anchorY - CANVAS_GROUP_HEADER + height,
            width,
            height
        }, packing.obstacles);
        const placed = {
            // Import collision resolution can add arbitrary padding-derived
            // shifts. Persist the logical anchor on the canvas grid.
            x: this.snapToCanvasGrid(free.left + CANVAS_GROUP_PADDING),
            y: this.snapToCanvasGrid(free.top + CANVAS_GROUP_HEADER)
        };
        const bounds = {
            left: placed.x - CANVAS_GROUP_PADDING,
            top: placed.y - CANVAS_GROUP_HEADER,
            right: placed.x - CANVAS_GROUP_PADDING + width,
            bottom: placed.y - CANVAS_GROUP_HEADER + height,
            width,
            height
        };
        packing.obstacles.push(bounds);
        packing.left = bounds.right + CANVAS_IMPORT_GAP;
        packing.rowHeight = Math.max(packing.rowHeight, height);
        return placed;
    }

    createImportedActivity(activity, groupId, position, now, assignmentName) {
        const record = {
            id: this.generateId(),
            name: activity.name,
            color: activity.color || this.COLORS[position % this.COLORS.length],
            shape: activity.shape || 'circle',
            size: activity.size || 'small',
            notes: activity.notes || '',
            customerId: '',
            serviceId: '',
            customerName: '',
            serviceName: '',
            position,
            archived: false,
            createdAt: now,
            updatedAt: now,
            assignment: assignmentName,
            importedAt: now
        };
        if (activity.icon) record.icon = activity.icon;
        if (activity.displayMode) record.displayMode = activity.displayMode;
        if (groupId) record.groupId = groupId;
        return record;
    }

    async confirmAssignmentImport() {
        const state = this.pendingAssignment;
        if (!state) return false;
        const button = document.getElementById('assignmentImportConfirmBtn');
        if (button) button.disabled = true;
        try {
            const { plan } = state;
            const now = Date.now();
            const assignmentName = plan.assignmentName;
            const createdGroups = [];
            const createdActivities = [];
            const createdLayouts = [];
            const packing = this.createImportPacking(this.currentLayoutObstacles());
            let position = this.activities.length;
            plan.groups.forEach(group => {
                // Compute member layouts first with the per-group placement
                // rules, then measure the real container box and let the
                // size-aware packing place the anchor. Members are stored
                // relative to the anchor, exactly like manually created groups.
                const members = group.activities.map(activity =>
                    this.createImportedActivity(activity, null, position++, now, assignmentName));
                const memberLayouts = members.map((member, memberIndex) =>
                    this.getActivityCanvasLayout({ ...member, position: memberIndex }, 0));
                const minX = memberLayouts.length ? Math.min(...memberLayouts.map(layout => layout.x)) : 0;
                const minY = memberLayouts.length ? Math.min(...memberLayouts.map(layout => layout.y)) : 0;
                const relativeBoxes = memberLayouts.map((layout, memberIndex) => ({
                    x: layout.x - minX,
                    y: layout.y - minY,
                    width: layout.width,
                    height: layout.height
                }));
                const anchor = this.placeNextImportedGroup(
                    packing,
                    this.measureGroupContainer(relativeBoxes)
                );
                const groupRecord = {
                    id: this.generateId(),
                    name: group.name,
                    x: anchor.x,
                    y: anchor.y,
                    collapsed: group.collapsed === true,
                    assignment: assignmentName,
                    importedAt: now
                };
                createdGroups.push(groupRecord);
                members.forEach((member, memberIndex) => {
                    member.groupId = groupRecord.id;
                    createdActivities.push(member);
                    createdLayouts.push({
                        activityId: member.id,
                        x: memberLayouts[memberIndex].x - minX,
                        y: memberLayouts[memberIndex].y - minY,
                        width: memberLayouts[memberIndex].width,
                        height: memberLayouts[memberIndex].height
                    });
                });
            });
            for (const activity of plan.topLevelActivities) {
                createdActivities.push(this.createImportedActivity(activity, null, position++, now, assignmentName));
            }
            const imports = await this.getAssignmentImports();
            const ledger = imports.filter(item => item?.fingerprint !== state.fingerprint);
            ledger.push({ fingerprint: state.fingerprint, name: assignmentName, importedAt: now });
            await this.storage.applyAssignmentImport({
                putGroups: createdGroups,
                putActivities: createdActivities,
                putLayouts: createdLayouts,
                deleteGroupIds: state.replaceTargets.groups.map(group => group.id),
                deleteActivityIds: state.replaceTargets.activities.map(activity => activity.id),
                deleteLayoutIds: state.replaceTargets.activities.map(activity => activity.id),
                settings: { assignmentImports: ledger.slice(-50) }
            });
            const removedGroups = new Set(state.replaceTargets.groups.map(group => group.id));
            const removedActivities = new Set(state.replaceTargets.activities.map(activity => activity.id));
            this.groups = this.groups.filter(group => !removedGroups.has(group.id)).concat(createdGroups);
            this.activities = this.activities.filter(activity => !removedActivities.has(activity.id)).concat(createdActivities);
            createdLayouts.forEach(layout => this.activityLayouts.set(layout.activityId, layout));
            state.replaceTargets.activities.forEach(activity => this.activityLayouts.delete(activity.id));
            this.closeAssignmentImportModal();
            this.renderMain();
            this.showToast(this.t('assignmentImported', { groups: createdGroups.length, activities: createdActivities.length }));
            return true;
        } catch (error) {
            if (button) button.disabled = false;
            this.showAssignmentError(error);
            return false;
        }
    }

    async copyAssignmentPrompt() {
        try {
            await navigator.clipboard.writeText(this.getAssignment().ASSIGNMENT_PROMPT);
            this.showToast(this.t('assignmentPromptCopied'));
            return true;
        } catch (error) {
            this.showToast(this.t('assignmentPromptCopyFailed'));
            return false;
        }
    }

    exportLog(format) {
        const entries = [...this.timeEntries]
            .filter(e => e.endTimestamp !== null && Number.isFinite(Number(e.startTimestamp)) && Number(e.startTimestamp) > 0)
            .sort((a, b) => a.startTimestamp - b.startTimestamp);
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
        const entries = [...this.timeEntries]
            .filter(e => e.endTimestamp !== null && Number.isFinite(Number(e.startTimestamp)) && Number(e.startTimestamp) > 0)
            .sort((a, b) => a.startTimestamp - b.startTimestamp);

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
                text += `${start} – ${end} | ${entry.activityNameSnapshot || this.t('noActivity')} | ${duration}\n`;
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
            csv += [date, start, end, entry.activityNameSnapshot || this.t('noActivity'), duration].map(csvCell).join(',') + '\n';
        });

        return csv;
    }

    async backupData() {
        try {
            await this.exportCurrentDataFile({ setLastBackup: true });
            this.showToast(this.t('backupSuccess'));
        } catch (error) {
            this.diagnostics?.error('backup', 'download-backup', error, { status: 'failed' });
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
        if (status && select) {
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
        this.updateBackupStatusTexts();
    }

    hasLocalWorkData() {
        return this.activities.length > 0 || this.archivedActivities.length > 0 ||
            this.timeEntries.length > 0 || this.groups.length > 0;
    }

    isBackupPayloadEmpty(data) {
        const count = value => (Array.isArray(value) ? value.length : 0);
        return count(data?.activities) === 0 && count(data?.timeEntries) === 0 && count(data?.groups) === 0;
    }

    updateDataPresenceMarker() {
        if (this.missingDataSuspected && this.hasLocalWorkData()) {
            // Data appeared again (created or restored) after the warning was
            // shown; the warning no longer applies.
            this.missingDataSuspected = false;
            const warning = document.getElementById('missingDataWarning');
            if (warning) warning.style.display = 'none';
        }
        if (this.missingDataSuspected) return;
        try {
            const now = Date.now();
            if (this.hasLocalWorkData()) {
                const stored = Number(localStorage.getItem('timerhubLastDataSeenAt') || 0);
                if (!Number.isFinite(stored) || now - stored > 60 * 60 * 1000) {
                    localStorage.setItem('timerhubLastDataSeenAt', String(now));
                }
            } else {
                localStorage.removeItem('timerhubLastDataSeenAt');
            }
        } catch { /* storage unavailable */ }
    }

    evaluateSuspiciousEmptyState() {
        let marker = 0;
        try { marker = Number(localStorage.getItem('timerhubLastDataSeenAt') || 0); } catch { marker = 0; }
        const suspicious = !this.hasLocalWorkData() && Number.isFinite(marker) && marker > 0;
        this.missingDataSuspected = suspicious;
        const warning = document.getElementById('missingDataWarning');
        if (warning) warning.style.display = suspicious ? 'block' : 'none';
        return suspicious;
    }

    dismissMissingDataWarning() {
        this.missingDataSuspected = false;
        try {
            localStorage.removeItem('timerhubLastDataSeenAt');
            const latest = this.latestExternalBackup;
            if (latest) localStorage.setItem('timerhubExternalEmptyWarningDismissedAt', String(Number(latest.createdAt) || Date.now()));
        } catch { /* ignore */ }
        const warning = document.getElementById('missingDataWarning');
        if (warning) warning.style.display = 'none';
    }

    async refreshStoragePersistenceStatus() {
        let status = 'unsupported';
        try {
            const storage = navigator?.storage;
            if (storage?.persisted) {
                let persisted = await storage.persisted();
                if (!persisted && typeof storage.persist === 'function') {
                    let previouslyRequested = false;
                    try { previouslyRequested = localStorage.getItem('timerhubPersistRequested') === '1'; } catch { /* ignore */ }
                    if (!previouslyRequested) {
                        try { localStorage.setItem('timerhubPersistRequested', '1'); } catch { /* ignore */ }
                        persisted = await storage.persist();
                    }
                }
                status = persisted ? 'granted' : 'denied';
            }
        } catch { status = 'unknown'; }
        this.storagePersistenceStatus = status;
        this.updateBackupStatusTexts();
        return status;
    }

    updateBackupStatusTexts() {
        const lastBackupElement = document.getElementById('lastBackupStatus');
        let lastBackupAt = 0;
        try { lastBackupAt = Number(localStorage.getItem('timerhubLastBackupAt') || 0); } catch { lastBackupAt = 0; }
        if (lastBackupElement) {
            if (!Number.isFinite(lastBackupAt) || lastBackupAt <= 0) {
                lastBackupElement.textContent = this.t('lastBackupNever');
            } else {
                const overdue = Date.now() - lastBackupAt > 7 * 24 * 60 * 60 * 1000;
                lastBackupElement.textContent = overdue
                    ? `${this.t('lastBackupAt', { date: this.formatSnapshotDate(lastBackupAt) })} ${this.t('lastBackupOverdue')}`
                    : this.t('lastBackupAt', { date: this.formatSnapshotDate(lastBackupAt) });
            }
        }
        const persistenceElement = document.getElementById('storagePersistenceStatus');
        if (persistenceElement) {
            persistenceElement.textContent = this.storagePersistenceStatus === 'granted'
                ? this.t('persistentStorageGranted')
                : this.storagePersistenceStatus === 'denied'
                    ? this.t('persistentStorageDenied')
                    : this.storagePersistenceStatus === 'unsupported'
                        ? this.t('persistentStorageUnsupported')
                        : this.t('persistentStorageUnknown');
        }
        const diagnosticsElement = document.getElementById('backupDiagnostics');
        if (diagnosticsElement) {
            diagnosticsElement.textContent = this.t('diagnosticsSummary', {
                name: this.storage?.dbName || 'TimerHubDB',
                version: Number(this.storage?.version) || 0,
                activities: this.activities.length + this.archivedActivities.length,
                entries: this.timeEntries.length,
                groups: this.groups.length
            });
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
        this.pendingRestoreIsEmpty = this.isBackupPayloadEmpty(data);
        this.pendingRestoreEmptyConfirmed = false;
        const needsEmptyConfirmation = this.pendingRestoreIsEmpty && this.hasLocalWorkData();
        const warning = document.getElementById('backupRestoreEmptyWarning');
        if (warning) warning.hidden = !needsEmptyConfirmation;
        const checkbox = document.getElementById('backupRestoreEmptyConfirm');
        if (checkbox) checkbox.checked = false;
        const replaceButton = document.getElementById('backupRestoreReplaceBtn');
        if (replaceButton) replaceButton.disabled = needsEmptyConfirmation;
        document.getElementById('backupRestoreModal')?.classList.add('active');
    }

    setEmptyRestoreConfirmation(confirmed) {
        this.pendingRestoreEmptyConfirmed = Boolean(confirmed);
        const needsEmptyConfirmation = this.pendingRestoreIsEmpty && this.hasLocalWorkData();
        const replaceButton = document.getElementById('backupRestoreReplaceBtn');
        if (replaceButton && needsEmptyConfirmation) replaceButton.disabled = !this.pendingRestoreEmptyConfirmed;
    }

    cancelPendingRestore() {
        this.pendingRestoreData = null;
        this.pendingRestoreIsEmpty = false;
        this.pendingRestoreEmptyConfirmed = false;
        const warning = document.getElementById('backupRestoreEmptyWarning');
        if (warning) warning.hidden = true;
        document.getElementById('backupRestoreModal')?.classList.remove('active');
    }

    async restorePendingData(merge) {
        if (!this.pendingRestoreData) return false;
        if (!merge && this.pendingRestoreIsEmpty && this.hasLocalWorkData() && !this.pendingRestoreEmptyConfirmed) {
            this.showToast(this.t('backupEmptyNeedsConfirmation'));
            return false;
        }
        const buttons = ['backupRestoreMergeBtn', 'backupRestoreReplaceBtn'];
        buttons.forEach(id => { const button = document.getElementById(id); if (button) button.disabled = true; });
        let safetySnapshot = null;
        try {
            safetySnapshot = await this.storage.exportAll();
            if (!merge && this.hasLocalWorkData() && this.backupService?.directoryHandle) {
                try {
                    await this.backupService.createBackup({
                        kind: 'pre-restore',
                        reason: 'before-replace',
                        force: true,
                        revision: this.storage.dataRevision
                    });
                } catch (error) {
                    this.diagnostics?.error('restore', 'pre-restore-backup', error, { status: 'failed' });
                    this.showToast(this.t('externalBackupSafetyCopyFailed'));
                    return false;
                }
            }
            await this.storage.importAll(this.pendingRestoreData, merge);
            this.cancelPendingRestore();
            // Old undo records point at the replaced canvas and must never be
            // replayed against the restored database.
            await this.clearCanvasHistory().catch(() => {});
            await this.loadActivities();
            await this.loadGroups();
            await this.migrateMissingGroupLayouts();
            await this.migrateActivityCanvasGeometry();
            await this.loadTimeEntries();
            this.missingDataSuspected = false;
            this.updateDataPresenceMarker();
            this.renderAll();
            await this.refreshAutomaticBackupStatus();
            await this.updateExternalBackupStatus().catch(() => {});
            this.showToast(this.t('restoreSuccess'));
            this.flushExternalBackup({ force: true }).catch(() => {});
            return true;
        } catch (error) {
            this.diagnostics?.error('restore', 'restore-pending-data', error, { status: 'failed' });
            if (safetySnapshot) {
                try {
                    await this.storage.importAll(safetySnapshot, false);
                    await this.loadActivities();
                    await this.loadGroups();
                    await this.loadTimeEntries();
                    this.renderAll();
                    this.showToast(this.t('restoreFailed'));
                    this.diagnostics?.warn('restore', 'restore-rollback', 'previous_data_restored', { status: 'rolled_back' });
                } catch (rollbackError) {
                    this.diagnostics?.error('restore', 'restore-rollback', rollbackError, { status: 'failed' });
                }
            } else {
                this.showToast(this.t('restoreFailed'));
            }
            return false;
        } finally {
            buttons.forEach(id => { const button = document.getElementById(id); if (button) button.disabled = false; });
            if (!merge && this.pendingRestoreData) this.setEmptyRestoreConfirmation(this.pendingRestoreEmptyConfirmed);
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
        await this.clearCanvasHistory();

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
