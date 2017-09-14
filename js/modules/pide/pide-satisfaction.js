define(
        [
            'knockout',
            'data/DataProvider',
            'modules/pide/view-model/SunburstViewModel',
            'modules/pide/model/PIDEModel',
            'modules/pide/model/PIDEDataParser',
            'modules/pide/view-model/DetailsViewModel',
            'view-models/GeneralViewModel'
        ],
        function (ko, DataProvider, SunburstViewModel, PIDEModel,
                 PIDEDataParser, DetailsViewModel, GeneralViewModel) {
            function PIDESatisfactionViewModel() {
                var self = this;
                var controlPanelDataProvider =
                        new DataProvider("data/pide.json",
                                PIDEDataParser);

                var dataPromise = controlPanelDataProvider.fetchData();
                self.observableSunburst = ko.observable();
                self.observableDetails = ko.observable();
                self.sunburstTitle = GeneralViewModel.nls("controlPanel.sunburst.title");
                self.detailsTitle = GeneralViewModel.nls("controlPanel.details.title");
                
                dataPromise.then(
                        function () {
                            var controlPanelModel = new PIDEModel(controlPanelDataProvider);
                            self.sunburst = new SunburstViewModel("control_panel", 
                                    controlPanelModel); 
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

            return PIDESatisfactionViewModel;
        }
);