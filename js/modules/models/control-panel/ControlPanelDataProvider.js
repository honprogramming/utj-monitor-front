define(['jquery'],
        function ($) {
            var theKey = {};

            function ControlPanelDataProvider(dataSourceURL, controlPanelDataParser) {
                var self = this;
                var privateData = {
                    dataSourceURL: dataSourceURL,
                    controlPanelDataParser: controlPanelDataParser,
                    planElementsMap: undefined,
                    planElementsTree: undefined
                };

                this.ControlPanelDataProvider_ = function (key) {
                    if (theKey === key) {
                        return privateData;
                    }
                };

                $.getJSON(privateData.dataSourceURL,
                        function (data) {
                            var parsedData = controlPanelDataParser.parse(data);
                            privateData.planElementsMap = parsedData.map;
                            privateData.planElementsTree = parsedData.tree;
                            
                            self.onDataAvailable(data);
                        }
                );
            }

            var prototype = ControlPanelDataProvider.prototype;

            /**
             * Getter method for data stored as a map.
             * 
             * @returns An Object with data stored as a map containing parsed
             * data to be used mainly in the details panel.
             */
            prototype.getDataMap = function () {
                return this.ControlPanelDataProvider_(theKey).planElementsMap;
            };
            
            /**
             * Getter method for data stored as a tree.
             * 
             * @returns An Object with data stored as a tree containing parsed
             * data to be displayed in a Sunburst control.
             */
            prototype.getDataTree = function () {
                return this.ControlPanelDataProvider_(theKey).planElementsTree;
            };
            
            /**
             * This will be defined by the user, it must be a function that will be
             * called automatically when data is available.
             */
            prototype.onDataAvaliable = null;

            return ControlPanelDataProvider;
        }
);