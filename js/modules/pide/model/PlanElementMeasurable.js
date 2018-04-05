/**
 * Represents a plan element which values are provided from the constructor.
 * This class is immutable.
 * 
 * Inherits:
 * models/control-panel/PlanElementCalculated
 * 
 * @param {Function} PlanElementCalculated The base class of a plan element.
 * @returns {Function} The PlanElementMeasurable class.
 */
define(['modules/pide/model/PlanElementCalculated'], 
        function(PlanElementCalculated) {
            var theKey = {};
            
            function PlanElementMeasurable(id, type, label, name, goal, achieve, parent, children, responsibles, grades) {
                PlanElementCalculated.call(this, id, type, label, name, parent, children, responsibles);
                
                var privateData = {
                    goal,
                    achieve,
                    grades
                };
                
                this.PlanElementMeasurable_ = function(key) {
                    if (theKey === key) {
                        return privateData;
                    }
                };
            }
            
            PlanElementMeasurable.prototype = Object.create(PlanElementCalculated.prototype);
            var prototype = PlanElementMeasurable.prototype;
            
            /**
             * Returns the goal for this element.
             * 
             * @returns {Number} An integer with the current goal of the element.
             */
            prototype.getGrades = function() {
                return this.PlanElementMeasurable_(theKey).grades;
            };
            
            /**
             * Returns the goal for this element.
             * 
             * @returns {Number} An integer with the current goal of the element.
             */
            prototype.getGoal = function() {
                return this.PlanElementMeasurable_(theKey).goal;
            };
            
            /**
             * Returns the achieve for this element.
             * 
             * @returns {Number} An integer with the current achieve of the element.
             */
            prototype.getAchieve = function() {
                return this.PlanElementMeasurable_(theKey).achieve;
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
            
            return PlanElementMeasurable;
        }
);