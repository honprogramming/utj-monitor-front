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
            
            function PlanElementMeasurable(id, type, label, name, goal, achieve, parent, children, responsibles, grades, direction, firstAchieve) {
                PlanElementCalculated.call(this, id, type, label, name, parent, children, responsibles);
                
                var privateData = {
                    goal,
                    achieve,
                    grades,
                    direction,
                    firstAchieve
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
             * Returns the direction for this element.
             * 
             * @returns {Number} A String with one of 'POSITIVE' or 'NEGATIVE' values.
             */
            prototype.getDirection = function() {
                return this.PlanElementMeasurable_(theKey).direction;
            };
            
            /**
             * Returns the first achieve for this element.
             * An indicator may need the firt achieve if the direction is 'NEGATIVE'
             * @returns {Number} An number with the current first achieve of the element.
             */
            prototype.getFirstAchieve = function() {
                return this.PlanElementMeasurable_(theKey).firstAchieve;
            };
            
            /**
             * Returns the current progress for this element.
             * 
             * @returns {Decimal} A decimal number calculated from goal and 
             * achieve values. 1.0 represents 100%.
             */
            prototype.getProgress = function() {
                const direction = this.getDirection();
                const achieve = this.getAchieve();
                const goal = this.getGoal();
                
                if (!direction || direction === 'POSITIVE') {
                    return achieve / goal;
                } else {
                    const firstAchieve = this.getFirstAchieve();
                    
                    return (firstAchieve - achieve) / (firstAchieve - goal);
                }
            };
            
            return PlanElementMeasurable;
        }
);