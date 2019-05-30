define(
    function () {

      /**
       * Indicator Item.
       * 
       * @param {type} id
       * @param {type} name
       */
      function SummaryIndicator(id, type, name, status, strategicItem,
          description, periodicity) {
        this.id = id;
        this.type = type;
        this.name = name;
        this.status = status;
        this.strategicItem = strategicItem;
        this.description = description;
        this.periodicity = periodicity;
        this.cloneOf = undefined;
      }

      var prototype = SummaryIndicator.prototype;

      prototype.getCloneOf = function () {
        return this.cloneOf;
      };

      prototype.setCloneOf = function (id) {
        this.cloneOf = id;
      };

      prototype.getId = function () {
        return this.id;
      };

      prototype.setId = function (id) {
        this.id = id;
      };

      prototype.getName = function () {
        return this.name;
      };

      prototype.setName = function (name) {
        this.name = name;
      };

      prototype.setStatus = function (status) {
        this.status = status;
      };

      prototype.getStatus = function () {
        return this.status;
      };

      prototype.setStrategicItem = function (strategicItem) {
        this.strategicItem = strategicItem;
      };

      prototype.getStrategicItem = function () {
        return this.strategicItem;
      };

      prototype.getType = function () {
        return this.type;
      };

      prototype.setType = function (type) {
        this.type = type;
      };

      return SummaryIndicator;
    }
);