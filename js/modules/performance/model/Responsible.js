/**
 * Represents a plan element which values are provided from the constructor.
 * This class is immutable.
 * 
 * @returns {Function} The Responsible class.
 */
define([], 
        function() {
            var theKey = {};
            
            function Responsible(id, name, parent) {
                var privateData = {
                    id: id,
                    name: name,
                    parent: parent
                };
                
                this.Responsible_ = function(key) {
                    if (theKey === key) {
                        return privateData;
                    }
                };
                
                return this;
            }
            
            var prototype = Responsible.prototype;
            
            /**
             * Returns the name of the element.
             * 
             * @returns {String} A String with the name of the element.
             */
            prototype.getName = function() {
                return this.Responsible_(theKey).name;
            };
            
            /**
             * Returns the current parent of this element or null if it's 
             * the root element.
             * 
             * @returns {Object} A reference to the parent Object or null if it's
             * the root element.
             */
            prototype.getParent = function() {
                return this.Responsible_(theKey).parent;
            };
            
            prototype.getId = function() {
                return this.Responsible_(theKey).id;
            };
            
            return Responsible;
        }
);