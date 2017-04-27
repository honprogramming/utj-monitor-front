define(
        function () {
            var types = {
                VISION: "vision",
                AXE: "axe",
                TOPIC: "topic",
                OBJECTIVE: "objective",
                STRATEGY: "strategy",
                getPlural: function (type) {
                    if (type) {
                        var lastChar = type.charAt(type.length - 1);

                        switch (lastChar) {
                            case 'e':
                            case 'c':
                                return type.substr(0) + 's';
                                break;

                            case 'y':
                                return type.substr(0, type.length - 1) + 'ies';
                                break;
                            default:
                                return null;
                        }
                    }

                    return null;
                }
            };

            return types;
        }
);