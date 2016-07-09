define(['knockout', 'view-models/GeneralViewModel', 'jquery', 'ojs/ojcore', 'ojs/ojknockout', 'ojs/ojgauge'],
        function (ko, GeneralViewModel) {
            function ControlPanelDetails() {
                this.thresholdValues = [{max: 39, color: "#DF0101"}, 
                    {max: 59, color: "#FE9A2E"}, {max: 89, color: "#D7DF01"},
                    {color: "#31B404"}];
                this.referenceLines = [{value: 0, color: "#000000"}];
                this.min = -20; //if value is negative then min = value else min = 0
                this.max = 100;
                this.value = 95;
                this.title = {text: "value: " + this.value, position: "center"};
                this.selectedItem = ko.observable();
            }
            
            ControlPanelDetails.prototype = Object.create(GeneralViewModel);
            var prototype = ControlPanelDetails.prototype;
            
            prototype.setSelectedItem = function(selectedItem) {
                this.selectedItem(selectedItem);
            };
            
            return ControlPanelDetails;
        }
);