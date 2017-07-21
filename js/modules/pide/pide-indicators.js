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

                    if (option === "selection") {
                        var node = ui.value[0];

                        if (node && node.type) {
                            self.selectedNodes([]);
                            var isSelected = node.type.includes("selected");
                            var type = "indicator";

                            if (!isSelected) {
                                type += "-selected";
                            }

                            //  Add new node before initial node
//                            $("#tree").ojTree("setType", node, type);
                            node.type = type;
                            
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
                var jo = [];

                self.getJson = function (node, fn) {
                    $.getJSON("data/pide-indicators.json").then(
                            function (data) {
                                jo = data;
                                fn(jo);  // pass to ojTree using supplied function
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