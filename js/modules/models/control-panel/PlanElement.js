/**
 * Represents a plan element which values are provided from the constructor.
 * This class is immutable.
 * 
 * Inherits:
 * models/control-panel/PlanElementCalculated
 * 
 * @param {Function} PlanElementCalculated The base class of a plan element.
 * @returns {Function} Theh PlanElement class.
 */
define(['models/control-panel/PlanElementCalculated'], 
        function(PlanElementCalculated) {
            var theKey = {};
            
            function PlanElement(type, label, name, goal, achieve, parent, children, responsibles) {
                PlanElementCalculated.call(this, type, label, name, parent, children, responsibles);
                
                var privateData = {
                    goal: goal,
                    achieve: achieve
                };
                
                this.PlanElement_ = function(key) {
                    if (theKey === key) {
                        return privateData;
                    }
                };
            }
            
            PlanElement.prototype = Object.create(PlanElementCalculated.prototype);
            var prototype = PlanElement.prototype;
            
            /**
             * Returns the goal for this element.
             * 
             * @returns {Number} An integer with the current goal of the element.
             */
            prototype.getGoal = function() {
                return this.PlanElement_(theKey).goal;
            };
            
            /**
             * Returns the achieve for this element.
             * 
             * @returns {Number} An integer with the current achieve of the element.
             */
            prototype.getAchieve = function() {
                return this.PlanElement_(theKey).achieve;
            };
            
            /**
             * Returns the current progress for this element.
             * 
             * @returns {Decimal} A decimal number calculated from goal and 
             * achieve values. 1.0 represents 100%.
             */
            prototype.getProgress = function() {
                return this.getAchieve() / this.getGoal();
            };
            
            return PlanElement;
        }
);