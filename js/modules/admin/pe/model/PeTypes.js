define(
        [
            "modules/admin/pe/model/PeType"
        ],
        function (PeType) {
            var types = {
                PE: new PeType(1, "pe"),
                TIPO: new PeType(2, "tipo"),
                CARRERA: new PeType(3, "carrera"),
                
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
                    
                    map[types.PE.name] = types.PE;
                    map[types.TIPO.name] = types.TIPO;
                    map[types.CARRERA.name] = types.CARRERA;
                                 
                    return map;
                }
            };

            return types;
        }
);