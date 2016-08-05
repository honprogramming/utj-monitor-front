/**
 * Queries and parses the data from an URL and makes it available through the
 * function "onDataAvailable" which is triggered immediately after the data is
 * parsed.
 * 
 * @param {Object} $ The jquery library
 * @returns {Function} The ControlPanelProvider class.
 */
define(['jquery'],
        function ($) {
            var theKey = {};

            function ControlPanelDataProvider(dataSourceURL, controlPanelDataParser) {
                var self = this;
                var privateData = {
                    dataSourceURL: dataSourceURL,
                    controlPanelDataParser: controlPanelDataParser,
                    planElementsArray: undefined
                };

                this.ControlPanelDataProvider_ = function (key) {
                    if (theKey === key) {
                        return privateData;
                    }
                };

                $.getJSON(privateData.dataSourceURL,
                        function (data) {
                            privateData.planElementsArray = controlPanelDataParser.parse(data);
                            self.onDataAvailable(privateData.planElementsArray);
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
            prototype.getDataArray = function () {
                return this.ControlPanelDataProvider_(theKey).planElementsArray;
            };

            /**
             * This will be defined by the user, it must be a function that will be
             * called automatically when data is available.
             */
            prototype.onDataAvaliable = null;

            return ControlPanelDataProvider;
        }
);