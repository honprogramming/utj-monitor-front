/**
 * This class will hold a set of PlanElementMeasurable and PlanElementCalculated objects.
 * It's intetion is to provide functions to manage the data, like get, sort etc.
 * 
 * @returns {Function} The ControlPanel class.
 */
define([],
        function () {
            var theKey = {};

            function PIDEModel(dataProvider) {
                var privateData = {
                    dataProvider: dataProvider,
                    planElementsArray: undefined
                };

                this.ControlPanel_ = function (key) {
                    if (theKey === key) {
                        return privateData;
                    }
                };

                privateData.planElementsArray = dataProvider.getDataArray();
            }

            var prototype = PIDEModel.prototype;
            
            /**
             * Returns the Array of objects for this model.
             * 
             * @returns {Array} An Array containing the plan elements of the model.
             */
            prototype.getPlanElementsArray = function () {
                return this.ControlPanel_(theKey).planElementsArray;
            };

            return PIDEModel;
        }
);