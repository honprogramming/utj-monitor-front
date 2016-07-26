define([], 
    function() {
        var PlanElementTypes = {
            VISION: "vision",
            AXE: "axe",
            AXES: "axes",
            OBJECTIVE: "objective",
            OBJECTIVES: "objectives",
            INDICATOR: "indicator",
            INDICATORS: "indicators",
            getPlural: function(planElementType) {
                switch(planElementType) {
                    case this.AXE:
                        return this.AXES;
                    case this.OBJECTIVE:
                        return this.OBJECTIVES;
                    case this.INDICATOR:
                        return this.INDICATORS;
                }
            }
        };
        
        return PlanElementTypes;
    }
);