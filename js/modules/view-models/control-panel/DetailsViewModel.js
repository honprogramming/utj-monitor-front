define(['knockout', 'view-models/GeneralViewModel', 'jquery', 'ojs/ojcore', 'ojs/ojknockout', 'ojs/ojgauge'],
        function (ko, GeneralViewModel) {
            var theKey = {};
            
            function DetailsViewModel(controlPanel) {
                var privateData = {
                    controlPanel: controlPanel
                };
                
                this.ControlPanelDetails_ = function(key) {
                    if (theKey === key) {
                        return privateData;
                    }
                };
                
                this.thresholdValues = [{max: 39, color: "#DF0101"}, 
                    {max: 59, color: "#FE9A2E"}, {max: 89, color: "#D7DF01"},
                    {color: "#31B404"}];
                this.referenceLines = [{value: 0, color: "#000000"}];
                this.min = -20; //if value is negative then min = value else min = 0
                this.max = 100;
                this.value = 95;
                this.title = {text: "value: " + this.value, position: "center"};
                this.selectedPlanElementName = ko.observable();
                this.currentParents = ko.observableArray();
            }
            
            DetailsViewModel.prototype = Object.create(GeneralViewModel);
            var prototype = DetailsViewModel.prototype;
            
            prototype.setSelectedItemId = function(selectedPlanElementId) {
                var controlPanel = this.getControlPanel();
                
                this.selectedPlanElementName(controlPanel.getPlanElementName(selectedPlanElementId));
                this.updateParents(selectedPlanElementId);
            };
            
            prototype.updateParents = function(selectedPlanElementId) {
                var controlPanel = this.getControlPanel();
                
                var parents = controlPanel.getParents(selectedPlanElementId);
                this.currentParents(parents);
            };
            
            /**
             * Getter method for ControlPanel
             * @returns The ControlPanel Model.
             */
            prototype.getControlPanel = function() {
                return this.ControlPanelDetails_(theKey).controlPanel;
            };
            
            return DetailsViewModel;
        }
);