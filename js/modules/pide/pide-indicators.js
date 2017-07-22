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
                var selectedNodeIds = [];
                var model = [];
                var modelTree = {};
                
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
                                    },
                                    model: modelTree,
                                    ids: selectedNodeIds
                                }
                            }
                    );
                };

                self.clickHandler = function (event, ui) {
                    var option = ui.option;

                    if (option === "selection") {
                        var node = ui.value[0];

                        if (node && node.type) {
                            self.selectedNodes([]);
                            var isSelected = node.type.includes("selected");
                            var type = "indicator";

                            if (!isSelected) {
                                type += "-selected";
                            }

                            node.type = type;
                            
                            var targetClass = " fa-";

                            if (node.type.includes("selected")) {
                                targetClass += "check-";
                                selectedNodeIds.push(node.id);
                            } else {
                                var nodeIndex = selectedNodeIds.indexOf(node.id);
                                
                                if (nodeIndex >= 0) {
                                    selectedNodeIds.splice(nodeIndex, 1);
                                }
                            }

                            targetClass += "square-o";

                            var regExp = /fa-\S*square-o/;

                            if (node.className.match(regExp)) {
                                node.className = node.className.replace(regExp, targetClass);
                            }
                        }
                    }
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
                            node.className += " fa fa-square-o";
                            node.style.display = "block";
                        }
                    }

                    function addNode(node) {
                        nodesArray.push(node);
                    }
                };
                
                self.getJson = function (node, fn) {
                    $.getJSON("data/pide-indicators.json").then(
                            function (data) {
                                model = data;
                                fn(model);  // pass to ojTree using supplied function
                                
                                var itemsArray = model;
                                
                                while(itemsArray.length > 0) {
                                    var element = itemsArray.shift();
                                    itemsArray = itemsArray.concat(element.children);

                                    modelTree[element.attr.id] = element;
                                }
                            }
                    );
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
                                "position": "left",
                                "select": function () {
                                    return true;
                                }
                            },
                            "indicator": {
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