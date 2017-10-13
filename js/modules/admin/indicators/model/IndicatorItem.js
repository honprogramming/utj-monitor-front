define(function () {

    /**
     * Indicator Item.
     * 
     * @param {type} id
     * @param {type} name
     * @param {type} type
     * @returns {IndicatorItemL#1.IndicatorItem}
     */
    function IndicatorItem(id, name, indicatorType) {
        this.id = id;
        this.name = name;
        this.indicatorType = indicatorType;
        this.children = [];
    }

    IndicatorItem.prototype.getId = function () {
        return this.id;
    };

    IndicatorItem.prototype.setId = function (id) {
        this.id = id;
    };

    IndicatorItem.prototype.getName = function () {
        return this.name;
    };

    IndicatorItem.prototype.setName = function (name) {
        this.name = name;
    };

    IndicatorItem.prototype.getIndicatorType = function () {
        return this.indicatorType;
    };

    IndicatorItem.prototype.setIndicatorType = function (indicatorType) {
        this.indicatorType = indicatorType;
    };

    IndicatorItem.prototype.getChildren = function () {
        return this.children;
    };

    IndicatorItem.prototype.setChildren = function (children) {
        this.children = children;
    };

    return IndicatorItem;
});