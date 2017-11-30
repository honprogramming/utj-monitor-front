define(function () {

    function ComponentItem(item) {
        this.id = item.id;
        this.name = item.name;
        this.description = item.description;
        this.indicator = item.indicator;
        this.measure = item.measure;
        this.initialValue = item.initialValue;
        this.finalGoal = item.finalGoal;
        this.generalProgress = item.generalProgress;
        this.initialDate = item.initialDate;
        this.finalDate = item.finalDate;
        this.responsible = item.responsible;
        this.justification = item.justification;
        this.goals = item.goals;
        this.progress = item.progress;
    }

    ComponentItem.prototype.getId = function () {
        return this.id;
    };

    ComponentItem.prototype.getName = function () {
        return this.name;
    };

    ComponentItem.prototype.getDescription = function () {
        return this.description;
    };

    ComponentItem.prototype.getIndicator = function () {
        return this.indicator;
    };

    ComponentItem.prototype.getMeasure = function () {
        return this.measure;
    };

    ComponentItem.prototype.getInitialValue = function () {
        return this.initialValue;
    };

    ComponentItem.prototype.getFinalGoal = function () {
        return this.finalGoal;
    };

    ComponentItem.prototype.getGeneralProgress = function () {
        return this.generalProgress;
    };

    ComponentItem.prototype.getInitialDate = function () {
        return this.initialDate;
    };

    ComponentItem.prototype.getFinalDate = function () {
        return this.finalDate;
    };

    ComponentItem.prototype.getResponsible = function () {
        return this.responsible;
    };

    ComponentItem.prototype.getJustification = function () {
        return this.justification;
    };

    ComponentItem.prototype.getGoals = function () {
        return this.goals;
    };

    ComponentItem.prototype.getProgress = function () {
        return this.progress;
    };

    ComponentItem.prototype.setId = function (id) {
        this.id = id;
    };

    ComponentItem.prototype.setName = function (name) {
        this.name = name;
    };

    ComponentItem.prototype.setDescription = function (description) {
        this.description = description;
    };

    ComponentItem.prototype.setIndicator = function (indicator) {
        this.indicator = indicator;
    };

    ComponentItem.prototype.setMeasure = function (measure) {
        this.measure = measure;
    };

    ComponentItem.prototype.setInitialValue = function (initialValue) {
        this.initialValue = initialValue;
    };

    ComponentItem.prototype.setFinalGoal = function (finalGoal) {
        this.finalGoal = finalGoal;
    };

    ComponentItem.prototype.setGeneralProgress = function (generalProgress) {
        this.generalProgress = generalProgress;
    };

    ComponentItem.prototype.setInitialDate = function (initialDate) {
        this.initialDate = initialDate;
    };

    ComponentItem.prototype.setFinalDate = function (finalDate) {
        this.finalDate = finalDate;
    };

    ComponentItem.prototype.setResponsible = function (responsible) {
        this.responsible = responsible;
    };

    ComponentItem.prototype.setJustification = function (justification) {
        this.justification = justification;
    };

    ComponentItem.prototype.setGoals = function (goals) {
        this.goals = goals;
    };
    
    ComponentItem.prototype.setProgress = function (progress) {
        this.progress = progress;
    };

    return ComponentItem;

});