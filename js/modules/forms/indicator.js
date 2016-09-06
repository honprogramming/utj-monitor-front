define(
        [
            'knockout', 'ojs/ojcore', 'ojs/ojknockout', 'ojs/ojtabs',
            'ojs/ojinputtext', 'ojs/ojselectcombobox',
            'ojs/ojdatetimepicker'
        ],
        function (ko, oj) {
            function IndicatorViewModel() {
                this.startDate = ko.observable(oj.IntlConverterUtils.dateToLocalIso(new Date()));
                this.lastUpdate = ko.observable(oj.IntlConverterUtils.dateToLocalIso(new Date()));
            }

            return IndicatorViewModel;
        }
);