define(['models/control-panel/PlanElementCalculated'], 
        function(PlanElementCalculated) {
            var theKey = {};
            
            function PlanElement(type, label, name, goal, achieve, parent, children) {
                PlanElementCalculated.call(this, type, label, name, parent, children);
                
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
            
            prototype.getGoal = function() {
                return this.PlanElement_(theKey).goal;
            };
            
            prototype.getAchieve = function() {
                return this.PlanElement_(theKey).achieve;
            };
            
            prototype.getProgress = function() {
                return this.getAchieve() / this.getGoal();
            };
            
            return PlanElement;
        }
);