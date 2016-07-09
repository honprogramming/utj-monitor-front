define(['jquery', 'view-models/control-panel/SunBurst',
        'models/control-panel/ControlPanelDataParser',
        'view-models/control-panel/ControlPanelDetails'
        ],
        function ($, SunBurst, ControlPanelDataParser, ControlPanelDetails) {
            function ControlPanel() {
                var self = this;
                var controlPanelDataParser = new ControlPanelDataParser();

                $.getJSON("data/circular.json",
                        function (data) {
                            controlPanelDataParser = new ControlPanelDataParser(data);
                            self.sunBurst = new SunBurst(controlPanelDataParser);
                            self.sunBurst.addClickListener(handleSunBurstClick);
                            self.details = new ControlPanelDetails();
                        }
                );
        
                function handleSunBurstClick(id) {
                    var nodesMap = controlPanelDataParser.nodesMap;
                    var element = nodesMap[id];

                    self.details.setSelectedItem(element.node.name);

                    while (element.parent != null) {
                        element = nodesMap[element.parent];
                        console.log(element.node.name);
                    }
                }
            }

            return ControlPanel;
        }
);