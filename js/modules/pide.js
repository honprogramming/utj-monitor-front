define(
        [
            'knockout',
            'view-models/pide/SunburstViewModel',
            'models/pide/PIDEModel',
            'models/pide/PIDEDataProvider',
            'models/pide/PIDEDataParser',
            'view-models/pide/DetailsViewModel'
        ],
        function (ko, SunburstViewModel, PIDEModel,
                PIDEDataProvider, PIDEDataParser, DetailsViewModel) {
            function PIDEViewModel() {
                var self = this;
                var controlPanelDataProvider =
                        new PIDEDataProvider("data/pide.json",
                                PIDEDataParser);

                var fetchData = controlPanelDataProvider.fetchData();
                self.observableSunburst = ko.observable();
                self.observableDetails = ko.observable();
                
                fetchData.then(
                        function () {
                            var controlPanelModel = new PIDEModel(controlPanelDataProvider);
                            self.sunburst = new SunburstViewModel("control_panel", 
                                    "controlPanel.sunburst.title", controlPanelModel);
                            self.sunburst.addClickListener(handleSunburstClick);
                            self.details = new DetailsViewModel("controlPanel.details.title", 
                                    controlPanelModel);
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

            return PIDEViewModel;
        }
);