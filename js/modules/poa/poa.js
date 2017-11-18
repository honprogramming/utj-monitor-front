define(
        [
            'knockout',
            'view-models/GeneralViewModel',
            'ojs/ojbutton'
        ],
        function (ko, GeneralViewModel) {
            function POAViewModel() {
                var self = this;
                self.poaModule = ko.observable("poa/poa-satisfaction");
                
                self.switchButtonAriaLabel = GeneralViewModel.nls("poa.switchButtonAriaLabel");
                
                self.optionChangeHandler = function(event, ui) {
                    var value = ui.value;
                    
                    if (!self.poaModule().includes(value)) {
                        self.poaModule("poa/poa-" + value);
                    }
                };
            }

            return POAViewModel;
        }
);