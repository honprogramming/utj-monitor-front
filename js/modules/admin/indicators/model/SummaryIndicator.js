define(
        function () {

            /**
             * Indicator Item.
             * 
             * @param {type} id
             * @param {type} name
             * @param {type} type
             */
            function SummaryIndicator(id, name) {
                this.id = id;
                this.name = name;
                this.cloneOf = undefined;
            }
            
            var prototype = SummaryIndicator.prototype;
            
            prototype.getCloneOf = function() {
                return this.cloneOf;
            };
            
            prototype.setCloneOf = function(id) {
                this.cloneOf = id;
            };
            
            prototype.getId = function () {
                return this.id;
            };

            prototype.setId = function (id) {
                this.id = id;
            };

            prototype.getName = function () {
                return this.name;
            };

            prototype.setName = function (name) {
                this.name = name;
            };

            return SummaryIndicator;
        }
);