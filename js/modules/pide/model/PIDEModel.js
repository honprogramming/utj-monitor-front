/**
 * This class will hold a set of PlanElementMeasurable and PlanElementCalculated objects.
 * It's intetion is to provide functions to manage the data, like get, sort etc.
 * 
 * @returns {Function} The PIDEModel class.
 */
define([
            'modules/pide/model/PlanElementTypes'
        ],
        function (PlanElementTypes) {
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
            
            /**
             * Removes all indicators from objectives.
             * This is used when refreshing the sunburst with a different date.
             */
            prototype.cleanIndicators = function() {
                const objectives = this.getElementsByType(PlanElementTypes.OBJECTIVE);
                objectives.forEach(objective => objective.deleteChildren());
                
                const map = this.getData();
                for (const e in map) {
                    if (map[e].getType() === PlanElementTypes.INDICATOR) {
                        delete map[e];
                    }
                }
            };
            
            /**
             * Filters elements by a desired type.
             * 
             * @param {PlanElementTypes} type One of VISION, AXE, TOPIC, OBJECTIVE, INDICATOR
             * @returns {Arrat} An array of filtered elements.
             */
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