/**
 * This class will hold a set of PlanElementMeasurable and PlanElementCalculated objects.
 * It's intetion is to provide functions to manage the data, like get, sort etc.
 * 
 * @returns {Function} The PIDEModel class.
 */
define([],
        function () {
            var theKey = {};

            function PIDEModel(dataProvider) {
                const privateData = {
                    dataProvider: dataProvider,
                    planElementsArray: undefined,
                    planElementsMap: {}
                };

                this.PIDEModel_ = function (key) {
                    if (theKey === key) {
                        return privateData;
                    }
                };

                privateData.planElementsArray = dataProvider.getDataArray();
                
                dataProvider
                        .getDataArray()
                        .forEach(e => privateData.planElementsMap[e.getId()] = e);
            }

            const prototype = PIDEModel.prototype;
            
            prototype.getElementsByType = function(type) {
                return this
                        .getPlanElementsArray()
                        .filter(e => e.getType() === type);
            };
            
            /**
             * Returns the Array of objects for this model.
             * 
             * @returns {Array} An Array containing the plan elements of the model.
             */
            prototype.getPlanElementsArray = function () {
                return this.PIDEModel_(theKey).planElementsArray;
            };
            
            /**
             * Returns the Map of objects for this model.
             * 
             * @returns {Object} An map containing the plan elements of the model.
             */
            prototype.getData = function () {
                return this.PIDEModel_(theKey).planElementsMap;
            };

            return PIDEModel;
        }
);