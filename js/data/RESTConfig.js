define(
        function () {
            var paths = {};

            var restConfig = {
                subPath: "services/v1",

                admin: {
                    subPath: "/admin",

                    strategic: {
                        subPath: "/strategic",

                        items: {
                            endPath: "/items"
                        },
                        types: {
                            endPath: "/types"
                        }
                    }
                }
            };

            function init() {
                recursiveBuildPath(restConfig, "");
            }

            function recursiveBuildPath(object, subPath) {
                if (object) {
                    var objectSubPath = object["subPath"];

                    if (objectSubPath) {
                        var path = subPath + objectSubPath;

                        for (var property in object) {
                            if (property !== "subPath") {
                                recursiveBuildPath(object[property], path);
                            }
                        }
                    } else if (object["endPath"]) {
                        object["path"] = subPath + object["endPath"];
                    }
                }
            }

            init();

            return restConfig;
        }
);