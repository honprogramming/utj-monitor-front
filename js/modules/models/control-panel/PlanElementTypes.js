/**
 * This object contains the constants for the diferent types of elements.
 * It also contains the plural of each type.
 * 
 * @returns {Object} PlanElementTypes Object with String constants.
 */
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
            /**
             * Returns the plurar of the given type.
             * @param {String} planElementType One of the singular types defined
             * in this Object.
             * @returns {String} A String with the plural name of the given type.
             */
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