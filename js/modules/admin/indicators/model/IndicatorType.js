define(function () {
    
    function IndicatorType(id, name) {
        this.id = id;
        this.name = name;
    }
    
    IndicatorType.prototype.getId = function () {
        return this.id;
    };

    IndicatorType.prototype.setId = function (id) {
        this.id = id;
    };

    IndicatorType.prototype.getName = function () {
        return this.name;
    };

    IndicatorType.prototype.setName = function (name) {
        this.name = name;
    };

    return IndicatorType;
});