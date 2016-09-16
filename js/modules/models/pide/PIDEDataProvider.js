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

            function PIDEDataProvider(dataSourceURL, controlPanelDataParser) {
                var privateData = {
                    dataSourceURL: dataSourceURL,
                    controlPanelDataParser: controlPanelDataParser,
                    planElementsArray: undefined
                };

                this.PIDEDataProvider_ = function (key) {
                    if (theKey === key) {
                        return privateData;
                    }
                };
            }

            var prototype = PIDEDataProvider.prototype;

            /**
             * Returns the URL used by this data provider.
             * 
             * @returns {String} The URL as text used by this data provider
             * to fetch data.
             */
            prototype.getSourceURL = function () {
                return this.PIDEDataProvider_(theKey).dataSourceURL;
            };

            /**
             * Returns the parser used for this data provider.
             * 
             * @returns {ControlPanelDataParser} The data parser object used by
             * this class to parse data returned by the ajax call.
             */
            prototype.getDataParser = function () {
                return this.PIDEDataProvider_(theKey).controlPanelDataParser;
            };

            /**
             * Returns the Promise Object created by the ajax call done in this
             * method.
             * 
             * @returns {Promise} An Object promise created by the ajax call.
             */
            prototype.fetchData = function () {
                var self = this;
                var promise = $.getJSON(this.getSourceURL()).then(
                        function (data) {
                            self.setDataArray(self.getDataParser().parse(data));
                        }
                );

                return promise;
            };

            /**
             * Getter method for data stored as an Array.
             * 
             * @returns An Object with data stored as an Array containing parsed
             * data to be used mainly in the details panel.
             */
            prototype.getDataArray = function () {
                return this.PIDEDataProvider_(theKey).planElementsArray;
            };

            /**
             * Setter method for data stored as an Array.
             * 
             * @param{Array} planElementsArray An Object with data stored as 
             * an Array containing parsed data.
             */
            prototype.setDataArray = function (planElementsArray) {
                this.PIDEDataProvider_(theKey).planElementsArray = planElementsArray;
            };

            return PIDEDataProvider;
        }
);