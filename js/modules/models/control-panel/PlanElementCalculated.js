/**
 * Represents a plan element which has some values calculated from its children.
 * This class is immutable.
 * 
 * @returns {Function} Theh PlanElementCalculated class.
 */define([], 
        function() {
            var theKey = {};
            
            function PlanElementCalculated(type, label, name, parent, children,
                    responsibles) {
                var privateData = {
                    type: type,
                    label: label,
                    name: name,
                    parent: parent,
                    children: children,
                    responsibles: responsibles,
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
            
            var prototype = PlanElementCalculated.prototype;
            
            /**
             * Returns the type of this element.
             * Types are defined in PlanElementTypes Object.
             * 
             * @returns {String} One of the constant Strings in PlanElementTypes.
             */
            prototype.getType = function() {
                return this.PlanElementCalculated_(theKey).type;
            };
            
            /**
             * Returns a String with the label to display.
             * 
             * @returns {String} Returns a String to be displayed as label.
             */
            prototype.getLabel = function() {
                return this.PlanElementCalculated_(theKey).label;
            };
            
            /**
             * Returns the name of the element.
             * 
             * @returns {String} A String with the name of the element.
             */
            prototype.getName = function() {
                return this.PlanElementCalculated_(theKey).name;
            };
            
            /**
             * Returns the current parent of this element or null if it's 
             * the root element.
             * 
             * @returns {Object} A reference to the parent Object or null if it's
             * the root element.
             */
            prototype.getParent = function() {
                return this.PlanElementCalculated_(theKey).parent;
            };
            
            /**
             * Returns the children elements of this element.
             * If the element doesn't have any children it will return an empty
             * array.
             * 
             * @returns {Array} An Array containing the children elements.
             */
            prototype.getChildren = function() {
                return this.PlanElementCalculated_(theKey).children;
            };
            
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
                    var children = this.getChildren();
                    progress = 0;
                    
                    for (var i = 0; i < children.length; i ++) {
                        progress += children[i].getProgress();
                    }
                    
                    progress /= children.length;
                }
                
                return progress;
            };
            
            return PlanElementCalculated;
        }
);