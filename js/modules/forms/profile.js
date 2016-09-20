define(
        [
            'knockout', 'ojs/ojcore', 'ojs/ojknockout', 'ojs/ojtabs',
            'ojs/ojinputtext', 'ojs/ojselectcombobox',
            'ojs/ojdatetimepicker', 'ojs/ojtable', 'ojs/ojarraytabledatasource'
        ],
        function (ko, oj) {
            function ProfileViewModel() {
                var self = this;
                self.startDate = ko.observable(oj.IntlConverterUtils.dateToLocalIso(new Date()));    
            }

            return ProfileViewModel;
        }
);