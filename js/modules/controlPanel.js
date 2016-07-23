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
                    self.sunburst = new SunburstViewModel(controlPanelModel);
                    self.sunburst.addClickListener(handleSunburstClick);
                    self.details = new DetailsViewModel(controlPanelModel);
                };

                function handleSunburstClick(planElement) {
                    self.details.setSelectedItem(planElement);
                }
            }

            return ControlPanel;
        }
);