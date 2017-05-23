define(
        [
            "modules/admin/strategic/model/StrategicType"
        ],
        function (StrategicType) {
            var types = {
                VISION: new StrategicType(1, "vision"),
                AXE: new StrategicType(2, "axe"),
                TOPIC: new StrategicType(3, "topic"),
                OBJECTIVE: new StrategicType(4, "objective"),
                STRATEGY: new StrategicType(5, "strategy"),
                getPlural: function (type) {
                    if (type) {
                        var lastChar = type.name.charAt(type.name.length - 1);

                        switch (lastChar) {
                            case 'e':
                            case 'c':
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
                getTypesMap: function() {
                    var map = {};
                    
                    map[types.VISION.name] = types.VISION;
                    map[types.AXE.name] = types.AXE;
                    map[types.TOPIC.name] = types.TOPIC;
                    map[types.OBJECTIVE.name] = types.OBJECTIVE;
                    map[types.STRATEGY.name] = types.STRATEGY;
                    
                    return map;
                }
            };

            return types;
        }
);