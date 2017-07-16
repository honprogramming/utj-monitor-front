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
            'ojs/ojchart'
        ],
        function ($, oj, ko, GeneralViewModel) {
            function PIDEIndicatorsViewModel() {
                var self = this;
                var arrowClassStart = "fa-chevron-";
                var left = "left";
                var right = "right";

                self.arrowClass = ko.observable(arrowClassStart + right);

                var drawer = {
                    "displayMode": "push",
                    "selector": "#pide-indicators-selection-panel",
                    "content": "#pide-indicators-main-container"
                };

                self.toggleDrawer = function () {
                    self.arrowClass(arrowClassStart +
                            (self.arrowClass().includes(left) ? right : left));
                    return oj.OffcanvasUtils.toggle(drawer);
                };

                self.clickHandler = function (event, ui) {
                    console.dir(ui);
                };
                
                self.loadHandler = function(event, ui) {
                    var tree = $("#tree");
                    var root = tree[0];
                    var nodesArray = [];
                    
                    root.childNodes.forEach(addNode);
                    
                    while(nodesArray.length > 0) {
                        var node = nodesArray.shift(); 
                        node.childNodes.forEach(addNode);
                       
                       if (node.type && node.type.includes("indicator")) {
                           node.className += " fa fa-lg fa-square-o";
                       }
                    }
                    
                    
                    function addNode(node) {
                        nodesArray.push(node);
                    }
                };

                var lineSeries = [
                    {name: "Indicador 1.1", items: [74, 32, 40, 76]},
                    {name: "Indicador 1.2", items: [50, 78, 26, 54]},
                    {name: "Indicador 1.3", items: [34, 22, 70, 32]},
                    {name: "Indicador 2.1", items: [18, 6, 64, 22]},
                    {name: "Indicador 3.2", items: [33, 21, 63, 13]}
                ];

                var lineGroups = ["2014", "2015", "2016", "2017"];

                self.lineSeriesValue = ko.observableArray(lineSeries);
                self.lineGroupsValue = ko.observableArray(lineGroups);

                self.getJson = function (node, fn) {
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

                    fn(jo);  // pass to ojTree using supplied function
                };

                self.getTypes = function() {
                    return {
                        "types": {
                            "default": {
                                "select": function (node) {
                                    return false;
                                }
                            },
                            "indicator-selected": {
                                "image": "fa fa-lg fa-square-o",
                                "position": "left"
                            },
                            "indicator": {
                                "image": "fa fa-lg fa-check-square-o",
                                "position": "left"
                            }
                        }
                    };
                };
            }

            return PIDEIndicatorsViewModel;
        }
);