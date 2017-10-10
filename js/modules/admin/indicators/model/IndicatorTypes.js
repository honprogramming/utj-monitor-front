define([
    "modules/admin/indicators/model/IndicatorType"
], function (IndicatorType) {
    
    var types = {
        /**
         * tsu:{
         *  id: 'tsu'
         *  type: 'tsuclass'
         * }
         * 
         * TSU: new PEType('tsu', 'tsuclass')
         */
        VISION: new IndicatorType(1, "vision"),
        AXE: new IndicatorType(2, "axe"),
        TOPIC: new IndicatorType(3, "topic"),
        OBJECTIVE: new IndicatorType(4, "objective"),
        STRATEGY: new IndicatorType(5, "strategy"),
        INDICATOR: new IndicatorType(9, "indicator"),
        PROJECT: new IndicatorType(7, "project"),
        
        getPlural: function (type) {
            if (type) {
                var lastChar = type.name.charAt(type.name.length - 1);

                switch (lastChar) {
                    case 'e':
                    case 'c':
                    case 't':
                    case 'r':
                        return type.name.substr(0) + 's';
                        break;

                    case 'y':
                        return type.name.substr(0, type.name.length - 1) + 'ies';
                        break;
                        
                    default:
                        return null;
                }
            }

            return null;
        },
        
        getTypesMap: function () {
            var map = {};

            map[types.VISION.name] = types.VISION;
            map[types.AXE.name] = types.AXE;
            map[types.TOPIC.name] = types.TOPIC;
            map[types.OBJECTIVE.name] = types.OBJECTIVE;
            map[types.STRATEGY.name] = types.STRATEGY;
            map[types.INDICATOR.name] = types.INDICATOR;
            map[types.PROJECT.name] = types.PROJECT;

            return map;
        }
    };

    return types;
});