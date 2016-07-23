define([], 
        function() {
            var theKey = {};
            
            function PlanElementCalculated(type, label, name, parent, children) {
                var privateData = {
                    type: type,
                    label: label,
                    name: name,
                    parent: parent,
                    children: children,
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
            
            prototype.getType = function() {
                return this.PlanElementCalculated_(theKey).type;
            };
            
            prototype.getLabel = function() {
                return this.PlanElementCalculated_(theKey).label;
            };
            
            prototype.getName = function() {
                return this.PlanElementCalculated_(theKey).name;
            };
            
            prototype.getParent = function() {
                return this.PlanElementCalculated_(theKey).parent;
            };
            
            prototype.getChildren = function() {
                return this.PlanElementCalculated_(theKey).children;
            };
            
            prototype.getGoal = function() {
                return 100;
            };
            
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