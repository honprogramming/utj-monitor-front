/**
 * This class will hold a set of PlanElementMeasurable and PlanElementCalculated objects.
 * It's intetion is to provide functions to manage the data, like get, sort etc.
 * 
 * @returns {Function} The ControlPanel class.
 */
define([],
        function () {
            var theKey = {};

            function PerformanceModel(dataProvider) {
                var privateData = {
                    dataProvider: dataProvider,
                    elementsMap: undefined
                };

                this.PerformanceModel_ = function (key) {
                    if (theKey === key) {
                        return privateData;
                    }
                };

                privateData.elementsMap = dataProvider.getDataMap();
            }

            var prototype = PerformanceModel.prototype;
            
            /**
             * Returns the Array of objects for this model.
             * 
             * @returns {Array} An Array containing the plan elements of the model.
             */
            prototype.getElementsMap = function () {
                return this.PerformanceModel_(theKey).elementsMap;
            };

            return PerformanceModel;
        }
);