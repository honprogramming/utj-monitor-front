define(function () {

    /**
     * Strategic Item Class.
     * @constructor
     * @param {Number} id
     * @param {String} name
     * @param {String} type
     * @param {Array} children
     */
    function StrategicItem(id, name, type, children) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.children = children;
    }

    /**
     * Get ID.
     * @returns {Number}
     */
    StrategicItem.prototype.getID = function () {
        return this.id;
    };

    /**
     * Get name.
     * @returns {String}
     */
    StrategicItem.prototype.getName = function () {
        return this.name;
    };

    /**
     * Get type.
     * @returns {String}
     */
    StrategicItem.prototype.getType = function () {
        return this.type;
    };

    /**
     * Get children-
     * @returns {Array}
     */
    StrategicItem.prototype.getChildren = function () {
        return this.children;
    };

    /**
     * Set ID.
     * @param {Number} id
     * @returns {void}
     */
    StrategicItem.prototype.setID = function (id) {
        this.id = id;
    };

    /**
     * Set name.
     * @param {String} name
     * @returns {void}
     */
    StrategicItem.prototype.setName = function (name) {
        this.name = name;
    };

    /**
     * Set type.
     * @param {String} type
     * @returns {void}
     */
    StrategicItem.prototype.setType = function (type) {
        this.type = type;
    };

    /**
     * Set children.
     * @param {Array} children
     * @returns {void}
     */
    StrategicItem.prototype.setChildren = function (children) {
        this.children = children;
    };

    return StrategicItem;
});