define(
        function () {
            var restConfig = {
                subPath: '/utj/api/v1',

                admin: {
                    subPath: '/admin',

                    strategic: {
                        subPath: '/strategic',
                        endPath: '/strategic',
                        
                        items: {
                            endPath: '/items'
                        },
                        types: {
                            endPath: '/types'
                        }
                    },
                    indicators: {
                        subPath: '/indicators',
                        endPath: '/indicators',
                        
                        clone: {
                            endPath: '/clone'
                        },
                        positions: {
                            endPath: '/positions'
                        },
                        periodicities: {
                            endPath: '/periodicities'
                        },
                        types: {
                            endPath: '/types'
                        },
                        status: {
                            endPath: '/status'
                        }
                    }
                },
                indicators: {
                    subPath: '/indicators',
                    
                    pide: {
                        subPath: '/pide',

                        active: {
                            endPath: '/active'
                        },
                        tree: {
                            endPath: '/objectives/axes'
                        }
                    },
                    mecasut: {
                        subPath: '/mecasut',
                        
                        active: {
                            endPath: '/active'
                        }
                    }
                }
            };

            function init() {
                recursiveBuildPath(restConfig, '');
            }

            function recursiveBuildPath(object, subPath) {
                if (object) {
                    var objectSubPath = object['subPath'];

                    if (objectSubPath) {
                        var path = subPath + objectSubPath;

                        for (var property in object) {
                            if (property !== 'subPath') {
                                recursiveBuildPath(object[property], path);
                            }
                        }
                    } 
                    
                    if (object['endPath']) {
                        object['path'] = subPath + object['endPath'];
                    }
                }
            }

            init();

            return restConfig;
        }
);