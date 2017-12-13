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

            function DataProvider(dataSourceURL, dataParser) {
                var privateData = {
                    dataSourceURL: dataSourceURL,
                    dataParser: dataParser,
                    dataArray: undefined,
                    dataMap: undefined
                };

                this.DataProvider_ = function (key) {
                    if (theKey === key) {
                        return privateData;
                    }
                };
            }

            var prototype = DataProvider.prototype;

            /**
             * Returns the URL used by this data provider.
             * 
             * @returns {String} The URL as text used by this data provider
             * to fetch data.
             */
            prototype.getSourceURL = function () {
                return this.DataProvider_(theKey).dataSourceURL;
            };

            /**
             * Returns the parser used for this data provider.
             * 
             * @returns {ControlPanelDataParser} The data parser object used by
             * this class to parse data returned by the ajax call.
             */
            prototype.getDataParser = function () {
                return this.DataProvider_(theKey).dataParser;
            };

            /**
             * Returns the Promise Object created by the ajax call done in this
             * method.
             * 
             * @returns {Promise} An Object promise created by the ajax call.
             */
            prototype.fetchData = function () {
                var self = this;
                var promise = $.getJSON(this.getSourceURL());
                var deferred = $.Deferred();
                
                promise.then(
                        function (data) {
                            self.setDataArray(self.getDataParser().parse(data));
                            deferred.resolve(data);
                        }
                );

                return deferred;
            };
            
            /**
             * Returns the Promise Object created by the ajax call done in this
             * method.
             * 
             * @returns {Promise} An Object promise created by the ajax call.
             */
            prototype.fetchDataMap = function () {
                var self = this;
                var promise = $.getJSON(this.getSourceURL());
                var deferred = $.Deferred();
                
                promise.then(
                        function (data) {
                            self.setDataMap(self.getDataParser().parseMap(data));
                            deferred.resolve(data);
                        }
                );

                return deferred;
            };

            /**
             * Getter method for data stored as an Array.
             * 
             * @returns An Object with data stored as an Array containing parsed
             * data to be used mainly in the details panel.
             */
            prototype.getDataArray = function () {
                return this.DataProvider_(theKey).dataArray;
            };

            /**
             * Setter method for data stored as an Array.
             * 
             * @param{Array} dataArray An Object with data stored as 
             * an Array containing parsed data.
             */
            prototype.setDataArray = function (dataArray) {
                this.DataProvider_(theKey).dataArray = dataArray;
            };
            
            /**
             * Getter method for data stored as an Array.
             * 
             * @returns An Object with data stored as an Array containing parsed
             * data to be used mainly in the details panel.
             */
            prototype.getDataMap = function () {
                return this.DataProvider_(theKey).dataMap;
            };

            /**
             * Setter method for data stored as an Array.
             * 
             * @param{Array} dataMap An Object with data stored as 
             * an Array containing parsed data.
             */
            prototype.setDataMap = function (dataMap) {
                this.DataProvider_(theKey).dataMap = dataMap;
            };

            return DataProvider;
        }
);