define(
        [
            'knockout', 'ojs/ojcore', 'ojs/ojknockout', 'ojs/ojtabs',
            'ojs/ojinputtext', 'ojs/ojselectcombobox',
            'ojs/ojdatetimepicker', 'ojs/ojtable', 'ojs/ojarraytabledatasource'
        ],
        function (ko, oj) {
            function IndicatorViewModel() {
                this.startDate = ko.observable(oj.IntlConverterUtils.dateToLocalIso(new Date()));
                this.lastUpdate = ko.observable(oj.IntlConverterUtils.dateToLocalIso(new Date()));
                
                this.selectedProcesses = ko.observable(new oj.ArrayTableDataSource([]));
                this.selectedProjects = ko.observable(new oj.ArrayTableDataSource([]));
            }

            return IndicatorViewModel;
        }
);