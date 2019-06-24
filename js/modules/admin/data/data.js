define(
    [
      'jquery',
      'knockout',
      'modules/admin/data/backups',
      'modules/admin/data/model/BackupsModel',
      'view-models/GeneralViewModel',
      'data/RESTConfig',
      'templates/EditableTable',
      'ojs/ojarraytabledatasource',
      'ojs/ojbutton',
      'ojs/ojcollapsible',
      'ojs/ojdialog',
      'ojs/ojtable'
    ],
    function($, ko, backups, BackupsModel, GeneralViewModel, RESTConfig, EditableTable) {
      const backupDialogId = "data-backup-dialog";      
      const backupDialogSetup = op => {
        dataViewModel.operation(GeneralViewModel.nls(`admin.data.backup.dialog.${op}`));
        dataViewModel.backupButtonLabel(GeneralViewModel.nls(`admin.data.backup.dialog.${op}ButtonLabel`));
        dataViewModel.isNewBackup(op.includes("create"));
        dataViewModel.isDelete(op.includes("delete"));
      };
      let resolveDelete;
      let rejectDelete;
      
      const tableConfig = {
        id: "backups-table",
        title: GeneralViewModel.nls("admin.data.backup.title"),
        tableSummary: GeneralViewModel.nls("admin.data.backup.tableSummary"),
        tableAria: GeneralViewModel.nls("admin.data.backup.tableAria"),
        columns: [
          {
            headerText: GeneralViewModel.nls("admin.data.backup.tableHeaders.nameColumn"),
            headerStyle: 'min-width: 50%; max-width: 50em; width: 90%',
            headerClassName: 'oj-helper-text-align-start',
            style: 'min-width: 50%; max-width: 50em; width: 90%;',
            className: 'oj-helper-text-align-start',
            sortProperty: 'name'
          },
          {
            headerText: GeneralViewModel.nls("admin.data.backup.tableHeaders.actionsColumn"),
            headerStyle: 'min-width: 2m; max-width: 5em; width: 10%',
            headerClassName: 'oj-helper-text-align-start',
            style: 'min-width: 2em; max-width: 5em; width: 10%; text-align:center;',
            sortable: 'disabled'
          }
        ],
        newErrorText: GeneralViewModel.nls("admin.data.backup.newErrorText"),
        deleteErrorText: GeneralViewModel.nls("admin.data.backup.deleteErrorText"),
        actions: ["edit", "delete"],
        itemCreator: function() {
          backupDialogSetup("create");
          $(`#${backupDialogId}`).ojDialog("open");
        },
        itemRemover: function(id) {
          backups.deleteBackup(id);
        },
        deleteValidator: function() {
          return new Promise(
              (resolve, reject) => {
                backupDialogSetup("delete");
                $(`#${backupDialogId}`).ojDialog("open");
                resolveDelete = resolve;
                rejectDelete = reject;
              }
          );
        }
      };
      
      const dataViewModel = {
        backupButtonClickHandler: function() {
          if (this.backupButtonLabel() === GeneralViewModel.nls("admin.data.backup.dialog.createButtonLabel")) {
            backups.createBackup(this.backupName())
              .done(
                () => {
                  this.backupButtonLabel(GeneralViewModel.nls("admin.data.backup.dialog.closeLabel"));
                  this.backupMessage(GeneralViewModel.nls("admin.data.backup.dialog.successMessage"));
                  this.backupName("");
                }
              );
          } else if (this.backupButtonLabel() === GeneralViewModel.nls("admin.data.backup.dialog.deleteButtonLabel")) {
            resolveDelete(true);
            $(`#${backupDialogId}`).ojDialog("close");
          } else {
            $(`#${backupDialogId}`).ojDialog("close");
            this.backupButtonLabel(GeneralViewModel.nls("admin.data.backup.dialog.createLabel"));
            this.backupMessage("");
          }
        },
        backupButtonLabel: ko.observable(),
        backupMessage: ko.observable(),
        backupName: ko.observable(),
        backupNameLabel: GeneralViewModel.nls("admin.data.backup.dialog.nameLabel"),
        backupsObservableTable: ko.observable(new EditableTable(new BackupsModel([]), tableConfig)),
        cancelButtonLabel: GeneralViewModel.nls("admin.data.backup.dialog.cancelButtonLabel"),
        cancelButtonClickHandler: function() {
          rejectDelete(true);
          $(`#${backupDialogId}`).ojDialog("close");
        },
        dataBackupDialogId: backupDialogId,
        dataBackupDialogTitle: GeneralViewModel.nls("admin.data.backup.dialog.title"),
        exportData: ko.observable(),
        exportFormId: "data-export-form",
        exportIndicatorsClickHandler: function() {
          this.exportData(JSON.stringify(
              {
                access_token: localStorage.getItem('access_token'),
                user_id: localStorage.getItem('user_id')
              }
            )
          );
      
          $(`#${this.exportFormId}`).submit();
        },
        exportIndicatorsLabel: GeneralViewModel.nls("admin.data.export.label"),
        exportTitle: GeneralViewModel.nls("admin.data.export.title"),
        exportURL: RESTConfig.export.indicators.path,
        isNewBackup: ko.observable(),
        isDelete: ko.observable(),
        operation: ko.observable(),
        title: GeneralViewModel.nls("admin.data.title")
      };
      
      backups.getBackups()
        .then(
          data => {
            dataViewModel.backupsObservableTable(new EditableTable(new BackupsModel(data), tableConfig));
          }
        );
    
      return dataViewModel;
    }
);