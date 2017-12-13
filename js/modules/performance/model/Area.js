/**
 * Represents an area.
 * This class is immutable.
 * 
 * @returns {Function} The Area class.
 */
define([], 
        function() {
            var theKey = {};
            
            function Area(id, name, parent, children, responsibles) {
                var privateData = {
                    id: id,
                    name: name,
                    parent: parent,
                    children: children,
                    responsibles: responsibles
                };
                
                this.Area_ = function(key) {
                    if (theKey === key) {
                        return privateData;
                    }
                };
                
                return this;
            }
            
            var prototype = Area.prototype;
            
            /**
             * Returns the name of the element.
             * 
             * @returns {String} A String with the name of the element.
             */
            prototype.getName = function() {
                return this.Area_(theKey).name;
            };
            
            /**
             * Returns the current parent of this element or null if it's 
             * the root element.
             * 
             * @returns {Object} A reference to the parent Object or null if it's
             * the root element.
             */
            prototype.getParent = function() {
                return this.Area_(theKey).parent;
            };
            
            prototype.getId = function() {
                return this.Area_(theKey).id;
            };
            
            /**
             * Returns the children elements of this element.
             * If the element doesn't have any children it will return an empty
             * array.
             * 
             * @returns {Array} An Array containing the children elements.
             */
            prototype.getChildren = function() {
                return this.Area_(theKey).children;
            };
            
            prototype.getResponsibles = function() {
                return this.Area_(theKey).responsibles;
            };
            
            return Area;
        }
);