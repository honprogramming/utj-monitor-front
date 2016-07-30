define(['view-models/control-panel/SunburstViewModel',
    'models/control-panel/ControlPanelModel',
    'models/control-panel/ControlPanelDataProvider',
    'models/control-panel/ControlPanelDataParser',
    'view-models/control-panel/DetailsViewModel'
],
        function (SunburstViewModel, ControlPanelModel,
                ControlPanelDataProvider, ControlPanelDataParser, DetailsViewModel) {
            function ControlPanel() {
                var self = this;
                var controlPanelDataProvider = 
                        new ControlPanelDataProvider("data/control-panel.json", 
                        ControlPanelDataParser);

                controlPanelDataProvider.onDataAvailable = function () {
                    var controlPanelModel = new ControlPanelModel(controlPanelDataProvider);
                    self.sunburst = new SunburstViewModel("control_panel", controlPanelModel);
                    self.sunburst.addClickListener(handleSunburstClick);
                    self.details = new DetailsViewModel(controlPanelModel);
                    self.details.addSelectionListener(handleDetailsSelection);
                };

                function handleSunburstClick(planElement) {
                    self.details.setSelectedItem(planElement);
                }
                
                function handleDetailsSelection(planElement) {
                    self.sunburst.setSelectedItem(planElement);
                }
            }

            return ControlPanel;
        }
);