define(
        [
            'knockout', 'ojs/ojcore', 'ojs/ojknockout', 'ojs/ojtabs',
            'ojs/ojinputtext', 'ojs/ojselectcombobox',
            'ojs/ojdatetimepicker', 'ojs/ojtable', 'ojs/ojarraytabledatasource'
        ],
        function (ko, oj) {
            function IndicatorViewModel() {
                var self = this;
                self.startDate = ko.observable(oj.IntlConverterUtils.dateToLocalIso(new Date()));
                self.lastUpdate = ko.observable(oj.IntlConverterUtils.dateToLocalIso(new Date()));
                
                self.selectedProcesses = ko.observable(new oj.ArrayTableDataSource([]));
                self.selectedProjects = ko.observable(new oj.ArrayTableDataSource([]));
                self.responsibles = ko.observableArray();
                
                self.showForm = ko.observable(false);
                
                self.setFormVisibility = function(visibility) {
                    self.showForm(visibility);
                };
            }

            return IndicatorViewModel;
        }
);