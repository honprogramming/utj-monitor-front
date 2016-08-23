define(
        [
            'knockout',
            'view-models/control-panel/SunburstViewModel',
            'models/control-panel/ControlPanelModel',
            'models/control-panel/ControlPanelDataProvider',
            'models/control-panel/ControlPanelDataParser',
            'view-models/control-panel/DetailsViewModel'
        ],
        function (ko, SunburstViewModel, ControlPanelModel,
                ControlPanelDataProvider, ControlPanelDataParser, DetailsViewModel) {
            function ControlPanel() {
                var self = this;
                var controlPanelDataProvider =
                        new ControlPanelDataProvider("data/control-panel.json",
                                ControlPanelDataParser);

                var fetchData = controlPanelDataProvider.fetchData();
                self.observableSunburst = ko.observable();
                self.observableDetails = ko.observable();
                
                fetchData.then(
                        function () {
                            var controlPanelModel = new ControlPanelModel(controlPanelDataProvider);
                            self.sunburst = new SunburstViewModel("control_panel", controlPanelModel);
                            self.sunburst.addClickListener(handleSunburstClick);
                            self.details = new DetailsViewModel(controlPanelModel);
                            self.details.addSelectionListener(handleDetailsSelection);
                            self.observableSunburst(self.sunburst);
                            self.observableDetails(self.details);
                        }
                );

                /**
                 * Callback function for click event on Details panel.
                 * 
                 * @param {PlanElementCalculated} planElement The object from
                 * the model with the info for the clicked view element.
                 */
                function handleSunburstClick(planElement) {
                    self.details.setSelectedItem(planElement);
                }

                /**
                 * Callback function for click event on Sunburst graphic.
                 * 
                 * @param {PlanElementCalculated} planElement The object from
                 * the model with the info for the clicked view element.
                 */
                function handleDetailsSelection(planElement) {
                    self.sunburst.setSelectedItem(planElement);
                }
            }

            return ControlPanel;
        }
);