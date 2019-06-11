define(
    [
      'jquery',
      'knockout',
      'view-models/GeneralViewModel',
      'data/RESTConfig',
      'ojs/ojcollapsible',
      'ojs/ojbutton'
    ],
    function($, ko, GeneralViewModel, RESTConfig) {
      return {
        title: GeneralViewModel.nls("admin.data.title"),
        exportIndicatorsLabel: GeneralViewModel.nls("admin.data.export.label"),
        exportTitle: GeneralViewModel.nls("admin.data.export.title"),
        exportURL: RESTConfig.export.indicators.path,
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
        }
      };
    }
);