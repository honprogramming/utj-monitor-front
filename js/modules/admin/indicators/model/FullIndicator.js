define(
        [
            'modules/admin/indicators/model/SummaryIndicator'
        ],
        function (SummaryIndicator) {

            /**
             * Indicator Item.
             * 
             * @param {type} id
             * @param {type} name
             * @param {type} indicatorType
             */
            function FullIndicator(id, name, type) {
                //general
                SummaryIndicator.call(this, id, type, name);
                this.description;
                this.direction;
                this.periodicity;
                this.measureUnit;
                this.resetType;
                this.baseYear;                
                this.resetDates;
                this.status;
                //alignment
                this.strategicItem;
                //pe
                this.pe;
                this.pideIndicator;
                //responsible
                this.responsible;
                //meta data
                this.source;
                this.link;
                this.formula;
                this.variables;
                this.method;
                this.metaDataObservations;
                this.grades;
                this.gradesMap = {};
                //achievements
                this.achievements;
                this.potentialRisk;
                this.implementedActions;
                //class
                this.classType;
            }
            
            FullIndicator.prototype = Object.create(SummaryIndicator.prototype);
            FullIndicator.prototype.constructor = FullIndicator;
            
            var prototype = FullIndicator.prototype;
            
            FullIndicator.GradesColor = {
                RED: "red",
                ORANGE: "orange",
                YELLOW: "yellow",
                GREEN: "green"
            };
            
            prototype.getPideIndicator = function() {
                return this.pideIndicator;
            };
            
            prototype.setPideIndicator = function(pideIndicator) {
                this.pideIndicator = pideIndicator;
            };
            
            prototype.getPe = function() {
                return this.pe;
            };
            
            prototype.setPe = function(pe) {
                this.pe = pe;
            };
            
            prototype.getClassType = function() {
                return this.classType;
            };
            
            prototype.setClassType = function(classType) {
                this.classType = classType;
            };
            
            prototype.getResponsible = function() {
                return this.responsible;
            };
            
            prototype.setResponsible = function(responsible) {
                this.responsible = responsible;
            };
            
            prototype.getImplementedActions = function() {
                return this.implementedActions;
            };
            
            prototype.setImplementedActions = function(implementedActions) {
                this.implementedActions = implementedActions;
            };
            
            prototype.getPotentialRisk = function() {
                return this.potentialRisk;
            };
            
            prototype.setPotentialRisk = function(potentialRisk) {
                this.potentialRisk = potentialRisk;
            };
            
            prototype.getGradeByColor = function(color) {
                return this.gradesMap[color];
            };
            
            prototype.getGrades = function() {
                return this.grades;
            };
            
            prototype.setGrades = function(grades) {
                this.grades = grades;
                
                if (Array.isArray(grades)) {
                    grades.forEach(g => this.gradesMap[g.color] = g);
                }
            };
            
            prototype.getMetaDataObservations = function() {
                return this.metaDataObservations;
            };
            
            prototype.setMetaDataObservations = function(metaDataObservations) {
                this.metaDataObservations = metaDataObservations;
            };
            
            prototype.getMethod = function() {
                return this.method;
            };
            
            prototype.setMethod = function(method) {
                this.method = method;
            };
            
            prototype.getVariables = function() {
                return this.variables;
            };
            
            prototype.setVariables = function(variables) {
                this.variables = variables;
            };
            
            prototype.getFormula = function() {
                return this.formula;
            };
            
            prototype.setFormula = function(formula) {
                this.formula = formula;
            };
            
            prototype.getLink = function() {
                return this.link;
            };
            
            prototype.setLink = function(link) {
                this.link = link;
            };
            
            prototype.getSource = function() {
                return this.source;
            };
            
            prototype.setSource = function(source) {
                this.source = source;
            };
            
            prototype.getIndicatorType = function () {
                return this.indicatorType;
            };

            prototype.setIndicatorType = function (type) {
                this.indicatorType = type;
            };
            
            prototype.getDescription = function() {
                return this.description;
            };
            
            prototype.setDescription = function(description) {
                this.description = description;
            };
            
            prototype.getDirection = function() {
                return this.getDirection;
            };
            
            prototype.setDirection = function(direction) {
                this.direction = direction;
            };
            
            prototype.getPeriodicity = function() {
                return this.periodicity;
            };
            
            prototype.setPeriodicity = function(periodicity) {
                this.periodicity = periodicity;
            };
            
            prototype.getMeasureUnit = function() {
                return this.measureUnit;
            };
            
            prototype.setMeasureUnit = function(measureUnit) {
                this.measureUnit = measureUnit;
            };
            
            prototype.getResetType = function() {
                return this.resetType;
            };
            
            prototype.setResetType = function(resetType) {
                this.resetType = resetType;
            };
            
            prototype.getBaseYear = function() {
                return this.baseYear;
            };
            
            prototype.setBaseYear = function(baseYear) {
                this.baseYear = baseYear;
            };
            
            prototype.getStatus = function() {
                return this.status;
            };
            
            prototype.setStatus = function(status) {
                this.status = status;
            };
            
            prototype.getStrategicItem = function() {
                return this.strategicItem;
            };
            
            prototype.setStrategicItem = function(strategicItem) {
                this.strategicItem = strategicItem;
            };
            
            prototype.getAchievements = function() {
                return this.achievements;
            };
            
            prototype.setAchievements = function(achievements) {
                this.achievements = achievements;
            };
            
            prototype.getResetDates = function() {
                return this.resetDates;
            };
            
            prototype.setResetDates = function(resetDates) {
                this.resetDates = resetDates;
            };
            
            return FullIndicator;
        }
);