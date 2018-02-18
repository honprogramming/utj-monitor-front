define(
        function () {
            var restConfig = {
                subPath: "/utj/api/v1",

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
                    },
                    indicators: {
                        subPath: "/indicators",
                        
                        periodicities: {
                            endPath: "/periodicities"
                        },
                        types: {
                            endPath: "/types"
                        },
                        status: {
                            endPath: "/status"
                        },
                        pide: {
                            subPath: "/pide",
                            
                            items: {
                                endPath: "/items",
                                
                            }
                        }
                    }
                },
                pide: {
                    subPath: "/pide",
                    
                    indicators: {
                        subPath: "/indicators",
                        
                        tree: {
                            endPath: "/items/objectives/axes"
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