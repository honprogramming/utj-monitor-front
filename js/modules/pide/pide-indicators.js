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
            'ojs/ojmoduleanimations',
            'ojs/ojpopup'
        ],
        function ($, oj, ko, GeneralViewModel) {
            function PIDEIndicatorsViewModel() {
                var self = this;
                var arrowClassStart = "fa-chevron-";
                var left = "left";
                var right = "right";
                var selectedNodes = {};
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

                self.addGraphicHandler = function () {
                    self.graphics.push(
                            {
                                name: "pide/graphic",
                                animation: oj.ModuleAnimations["coverStart"],
                                params: {
                                    idPrefix: "pide-graphic-",
                                    index: self.graphics().length + 1,
                                    removal: function (index) {
                                        self.graphics.splice(
                                                findGraphicIndex(
                                                    self.graphics(),
                                                    index
                                                ), 1
                                        );
                                    },
                                    model: modelTree,
                                    ids: Object.keys(selectedNodes)
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
                            var isValidOperation = true;
                            var isSelected = node.type.includes("selected");
                            var type = "indicator";

                            if (!isSelected) {
                                type += "-selected";
                            }

                            node.type = type;

                            var targetClass = " fa-";

                            if (!isSelected) {
                                targetClass += "check-";

                                isValidOperation = validateUnitTypes(
                                        modelTree,
                                        Object.keys(selectedNodes),
                                        node.id
                                );
                                
                                if (isValidOperation) {
                                    selectedNodes[node.id] = {
                                        id: node.id,
                                        "unit-type": node["unit-type"]
                                    };
                                } else {
                                    var rect = document.getElementById(node.id).getBoundingClientRect();
                                    var position = {of:{x:rect.left + window.pageXOffset, y:rect.top + window.pageYOffset}};

                                    $("#unit-type-error-pop-up").ojPopup("open", "#" + node.id, position);
                                    console.log("No puedes seleccionar mas de 2 unidades de medida diferente");
                                    //open pop-up
                                }
                            } else {
                                delete selectedNodes[node.id];
                            }
                            
                            if (isValidOperation) {
                                targetClass += "square-o";

                                var regExp = /fa-\S*square-o/;

                                if (node.className.match(regExp)) {
                                    node.className = node.className.replace(regExp, targetClass);
                                }
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

                                while (itemsArray.length > 0) {
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

            function findGraphicIndex(graphics, target) {
                var value = -1;
                graphics.forEach(
                        function (element, index) {
                            if (element.params.index === target) {
                                value = index;
                                return;
                            }
                        }
                );

                return value;
            }

            function validateUnitTypes(modelTree, selectedIds, newId) {
                var unitTypes = [];
                
                selectedIds.forEach(
                        function(element) {
                            var modelElement = modelTree[element];
                            var unitType = modelElement["unit-type"];
                            
                            if (unitTypes.indexOf(unitType) < 0) {
                                unitTypes.push(unitType);
                            }
                        }
                );
        
                if (unitTypes.length < 2) {
                    return true;
                } else {
                    var newUnitType = modelTree[newId]["unit-type"];
                    
                    return unitTypes.indexOf(newUnitType) >= 0;
                }
            }
            
            return PIDEIndicatorsViewModel;
        }
);