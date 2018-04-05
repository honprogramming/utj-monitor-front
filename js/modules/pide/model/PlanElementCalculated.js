/**
 * Represents a plan element which has some values calculated from its children.
 * This class is immutable.
 * 
 * @param {Object} PlanElement The parent PlanElement class.
 * @returns {Function} The PlanElementCalculated class.
 */define(['modules/pide/model/PlanElement'], 
        function(PlanElement) {
            var theKey = {};
            
            function PlanElementCalculated(id, type, label, name, parent, children,
                    responsibles) {
                PlanElement.call(this, id, type, label, name, parent, children);
                
                var privateData = {
                    responsibles,
                    calculatedGoal: undefined,
                    calculatedProgress: undefined
                };
                
                this.PlanElementCalculated_ = function(key) {
                    if (theKey === key) {
                        return privateData;
                    }
                };
                
                return this;
            }
            
            PlanElementCalculated.prototype = Object.create(PlanElement.prototype);
            var prototype = PlanElementCalculated.prototype;
            
            /**
             * 
             * @returns {Array}
             */
            prototype.getResponsibles = function() {
                return this.PlanElementCalculated_(theKey).responsibles;
            };
            
            /**
             * Returns the goal for this element.
             * As this is a calculated element, the goal will always be 100%.
             * 
             * @returns {Number} An integer with the current goal of the element.
             */
            prototype.getGoal = function() {
                return 100;
            };
            
            /**
             * Returns the current progress for this element.
             * 
             * @returns {Decimal} A decimal number calculated from the average
             * of its children. 1.0 represents 100%.
             */
            prototype.getProgress = function() {
                var privateData = this.PlanElementCalculated_(theKey);
                var progress = privateData.calculatedProgress;
                
                if (!progress) {
                    var children = this.getChildren(PlanElementCalculated);
                    progress = 0;
                    
                    for (var i = 0; i < children.length; i ++) {
                        let child = children[i];
                        let childProgress = child.getProgress();
                        progress += isNaN(childProgress) ? 0 : childProgress;
                    }
                    
                    progress /= children.length;
                }
                
                return progress;
            };
            
            return PlanElementCalculated;
        }
);