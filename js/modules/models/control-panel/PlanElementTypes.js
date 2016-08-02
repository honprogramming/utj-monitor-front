define([], 
    function() {
        var PlanElementTypes = {
            VISION: "vision",
            AXE: "axe",
            AXES: "axes",
            THEME: "theme",
            THEMES: "themes",
            OBJECTIVE: "objective",
            OBJECTIVES: "objectives",
            INDICATOR: "indicator",
            INDICATORS: "indicators",
            PROJECT: "project",
            PROJECTS: "projects",
            PRODUCT: "product",
            PRODUCTS: "products",
            getPlural: function(planElementType) {
                switch(planElementType) {
                    case this.AXE:
                        return this.AXES;
                    case this.THEME:
                        return this.THEMES;
                    case this.OBJECTIVE:
                        return this.OBJECTIVES;
                    case this.INDICATOR:
                        return this.INDICATORS;
                    case this.PROJECT:
                        return this.PROJECTS;
                    case this.PRODUCT:
                        return this.PRODUCTS;
                }
            }
        };
        
        return PlanElementTypes;
    }
);