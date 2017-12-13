define(
        [
            'knockout',
            'view-models/GeneralViewModel',
            'ojs/ojbutton'
        ],
        function (ko, GeneralViewModel) {
            function PerformanceViewModel() {
                var self = this;
                self.performanceModule = ko.observable("performance/performance-satisfaction");
                
                self.switchButtonAriaLabel = GeneralViewModel.nls("performance.switchButtonAriaLabel");
                
                self.optionChangeHandler = function(event, ui) {
                    var value = ui.value;
                    
                    if (!self.performanceModule().includes(value)) {
                        self.performanceModule("performance/performance-" + value);
                    }
                };
            }

            return PerformanceViewModel;
        }
);