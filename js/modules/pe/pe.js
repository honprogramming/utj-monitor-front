define(
        [
            'knockout',
            'ojs/ojbutton'
        ],
        function (ko) {
            function PIDEViewModel() {
                var self = this;
                self.pideModule = ko.observable("pe/pe-indicators");
            }

            return PIDEViewModel;
        }
);