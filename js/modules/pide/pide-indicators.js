define(
        [
            'jquery',
            'ojs/ojcore',
            'knockout',
            'view-models/GeneralViewModel',
            'ojs/ojbutton',
            'hammerjs',
            'ojs/ojjquery-hammer',
            'ojs/ojoffcanvas',
            'ojs/ojselectcombobox',
            'ojs/ojtree',
            'ojs/ojdatetimepicker',
            'ojs/ojcheckboxset',
            'ojs/ojchart',
            'ojs/ojmodule',
            'ojs/ojmoduleanimations'
        ],
        function ($, oj, ko, GeneralViewModel) {
            function PIDEIndicatorsViewModel() {
                var self = this;
                var arrowClassStart = "fa-chevron-";
                var left = "left";
                var right = "right";

                self.arrowClass = ko.observable(arrowClassStart + left);
                self.displayPanel = ko.observable(true);
                self.selectedNodes = ko.observableArray();
                
                self.toggleDrawer = function () {
                    self.arrowClass(arrowClassStart +
                            (self.arrowClass().includes(left) ? right : left));
                    self.displayPanel(!self.displayPanel());
                };

                self.graphics = ko.observableArray();

                function findGraphicIndex(target) {
                    var value = -1;
                    self.graphics().forEach(
                            function (element, index) {
                                if (element.params.index === target) {
                                    value = index;
                                    return;
                                }
                            }
                    );

                    return value;
                }

                self.addGraphicHandler = function () {
                    self.graphics.push(
                            {
                                name: "pide/graphic",
                                animation: oj.ModuleAnimations["coverStart"],
                                params: {
                                    idPrefix: "pide-graphic-",
                                    index: self.graphics().length + 1,
                                    removal: function (index) {
                                        self.graphics.splice(findGraphicIndex(index), 1);
                                    }
                                }
                            }
                    );
                };

                self.clickHandler = function (event, ui) {
                    var option = ui.option;
                    self.selectedNodes([]);
                    
                    if (option === "selection") {
                        var node = ui.value[0];
                        var isSelected = node.type.includes("selected");
                        var type = "indicator";

                        if (!isSelected) {
                            type += "-selected";
                        }

                        //  Add new node before initial node
                        $("#tree").ojTree("setType", node, type);
                    }
                    
                    self.loadHandler();
                };

                self.loadHandler = function (event, ui) {
                    var tree = $("#tree");
                    var root = tree[0];
                    var nodesArray = [];

                    root.childNodes.forEach(addNode);

                    while (nodesArray.length > 0) {
                        var node = nodesArray.shift();
                        node.childNodes.forEach(addNode);

                        if (node.type && node.type.includes("indicator")) {
                            if (!node.className.includes("fa")) {
                                node.className += " fa fa-lg";
                            }
                            
                            var targetClass = " fa-";

                            if (node.type.includes("selected")) {
                                targetClass += "check-";
                            }

                            targetClass += "square-o";
                            
                            var regExp = /fa-\S*square-o/;
                            
                            if (node.className.match(regExp)) {
                                node.className = node.className.replace(regExp, targetClass);
                            } else {
                                node.className += targetClass;
                            }
                            
                            node.style.display = "block";
                        }
                    }


                    function addNode(node) {
                        nodesArray.push(node);
                    }
                };

                var jo = [
                    {
                        "title": "Eje1",
                        "attr": {"id": "eje1"},
                        "children": [
                            {
                                "title": "Objetivo 1",
                                "attr": {"id": "objetivo1"},
                                "children": [
                                    {
                                        "title": "Indicador 1.1",
                                        "attr": {
                                            "id": "indicador1.1",
                                            "type": "indicator-selected"
                                        }
                                    },
                                    {
                                        "title": "Indicador 1.2",
                                        "attr": {
                                            "id": "indicador1.2",
                                            "type": "indicator-selected"
                                        }
                                    },
                                    {
                                        "title": "Indicador 1.3",
                                        "attr": {"id": "indicador1.3",
                                            "type": "indicator-selected"
                                        }
                                    }
                                ]
                            },
                            {
                                "title": "Objetivo 2",
                                "attr": {"id": "objetivo2"},
                                "children": [
                                    {
                                        "title": "Indicador 2.1",
                                        "attr": {
                                            "id": "indicador2.1",
                                            "type": "indicator-selected"
                                        }
                                    },
                                    {
                                        "title": "Indicador 2.2",
                                        "attr": {
                                            "id": "indicador2.2",
                                            "type": "indicator"
                                        }
                                    },
                                    {
                                        "title": "Indicador 2.3",
                                        "attr": {
                                            "id": "indicador2.3",
                                            "type": "indicator"
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "title": "Eje 2",
                        "attr": {"id": "eje2"},
                        "children": [
                            {
                                "title": "Objetivo 3",
                                "attr": {"id": "objetivo3"},
                                "children": [
                                    {
                                        "title": "Indicador 3.1",
                                        "attr": {
                                            "id": "indicador3.1",
                                            "type": "indicator"
                                        }
                                    },
                                    {
                                        "title": "Indicador 3.2",
                                        "attr": {
                                            "id": "indicador3.2",
                                            "type": "indicator-selected"
                                        }
                                    },
                                    {
                                        "title": "Indicador 3.3",
                                        "attr": {
                                            "id": "indicador3.3",
                                            "type": "indicator"
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ];

                self.getJson = function (node, fn) {
                    fn(jo);  // pass to ojTree using supplied function
                };

                self.getTypes = function () {
                    return {
                        "types": {
                            "default": {
                                "select": function (node) {
                                    return false;
                                }
                            },
                            "indicator-selected": {
                                "image": "fa fa-lg fa-square-o",
                                "position": "left",
                                "select": function () {
                                    return true;
                                }
                            },
                            "indicator": {
                                "image": "fa fa-lg fa-check-square-o",
                                "position": "left",
                                "select": function () {
                                    return true;
                                }
                            }
                        }
                    };
                };
            }

            return PIDEIndicatorsViewModel;
        }
);