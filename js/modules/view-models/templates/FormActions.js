define(
        [
            'view-models/GeneralViewModel',
            'view-models/events/EventTypes'
        ],
        function (GeneralViewModel, EventTypes) {
            function FormActions() {
                var self = this;
                this.listeners = [];
                
                self.resetTitle = self.nls("templates.formActions.resetTitle");
                self.saveTitle = self.nls("templates.formActions.saveTitle");
                
                self.resetHandler = function() {
                    self.callListeners(EventTypes.RESET_EVENT);
                };
                
                self.saveHandler = function() {
                    self.callListeners(EventTypes.SAVE_EVENT);
                };
            }
            
            FormActions.prototype = Object.create(GeneralViewModel);
            
            var prototype = FormActions.prototype;
            
            prototype.addResetListener = function(listener) {
                this.addListener(listener, EventTypes.RESET_EVENT);
            };
            
            prototype.addSaveListener = function(listener) {
                this.addListener(listener, EventTypes.SAVE_EVENT);
            };
            
            return FormActions;
        }
);