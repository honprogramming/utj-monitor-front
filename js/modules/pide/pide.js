define(
        [
            'knockout',
            'view-models/GeneralViewModel',
            'ojs/ojbutton'
        ],
        function (ko, GeneralViewModel) {
            function PIDEViewModel() {
                var self = this;
                self.pideModule = ko.observable("pide/pide-satisfaction");
                
                self.switchButtonAriaLabel = GeneralViewModel.nls("pide.switchButtonAriaLabel");
                
                self.optionChangeHandler = function(event, ui) {
                    var value = ui.value;
                    
                    if (!self.pideModule().includes(value)) {
                        self.pideModule("pide/pide-" + value);
                    }
                };
            }

            return PIDEViewModel;
        }
);