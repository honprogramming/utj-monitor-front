/**
 * Represents a plan element which values are provided from the constructor.
 * This class is immutable.
 * 
 * @returns {Function} The PlanElement class.
 */
define([], 
        function() {
            var theKey = {};
            
            function PlanElement(id, type, label, name, parent, children = []) {
                var privateData = {
                    id,
                    type,
                    label,
                    name,
                    parent,
                    children
                };
                
                this.PlanElement_ = function(key) {
                    if (theKey === key) {
                        return privateData;
                    }
                };
                
                return this;
            }
            
            var prototype = PlanElement.prototype;
            
            /**
             * Returns the id of this element.
             * 
             * @returns {Number} The id assigned in the database.
             */
            prototype.getId = function() {
                return this.PlanElement_(theKey).id;
            };
            
            /**
             * Returns the type of this element.
             * Types are defined in PlanElementTypes Object.
             * 
             * @returns {String} One of the constant Strings in PlanElementTypes.
             */
            prototype.getType = function() {
                return this.PlanElement_(theKey).type;
            };
            
            /**
             * Returns a String with the label to display.
             * 
             * @returns {String} Returns a String to be displayed as label.
             */
            prototype.getLabel = function() {
                return this.PlanElement_(theKey).label;
            };
            
            /**
             * Returns the name of the element.
             * 
             * @returns {String} A String with the name of the element.
             */
            prototype.getName = function() {
                return this.PlanElement_(theKey).name;
            };
            
            /**
             * Returns the current parent of this element or null if it's 
             * the root element.
             * 
             * @returns {Object} A reference to the parent Object or null if it's
             * the root element.
             */
            prototype.getParent = function() {
                return this.PlanElement_(theKey).parent;
            };
            
            /**
             * Returns the children elements of this element.
             * If the element doesn't have any children it will return an empty
             * array.
             * 
             * @returns {Array} An Array containing the children elements.
             */
            prototype.getChildren = function(classType) {
                var children = this.PlanElement_(theKey).children;
                
                if (classType && children) {
                    return children.filter(
                                function(element) {
                                    return element instanceof classType;
                                }
                            );
                } else {
                    return children;
                }
            };
            
            return PlanElement;
        }
);