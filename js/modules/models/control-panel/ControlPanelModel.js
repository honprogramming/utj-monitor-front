define([],
    function(){
        var theKey = {};
        
        function ControlPanel(dataProvider) {
            var self = this;
            
            var privateData = {
                dataProvider: dataProvider,
                planElementsMap: undefined,
                planElementsTree: undefined
            };
            
            this.ControlPanel_ = function(key) {
                if (theKey === key) {
                    return privateData;
                }
            };
            
            privateData.planElementsMap = dataProvider.getDataMap();
            privateData.planElementsTree = dataProvider.getDataTree();
        }
        
        var prototype = ControlPanel.prototype;
        
        prototype.getParents = function(planElementId) {
            var parentElements = [];
            var planElementsMap = this.getPlanElementsMap();
            var element = planElementsMap[planElementId];
            
            while(element["parent"]) {
                element = planElementsMap[element["parent"]];
                parentElements.unshift(element["node"]["name"]);
            }
            
            return parentElements;
        };
        
        prototype.getPlanElementName = function(planElementId) {
            var element = this.getPlanElementsMap()[planElementId];
            
            try {
                return element["node"]["name"];
            } catch(error) {
                console.debug(error);
            }
        };
        
        prototype.getPlanElementsMap = function() {
            return this.ControlPanel_(theKey).planElementsMap;
        };
        
        prototype.getPlanElementsTree = function() {
            return this.ControlPanel_(theKey).planElementsTree;
        };
        
        return ControlPanel;
    }
);