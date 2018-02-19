define(
        [
            'jquery',
            'ojs/ojcore',
            'knockout',
            'data/RESTConfig',
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
        function ($, oj, ko, RESTConfig, GeneralViewModel) {
            var theKey = {};
            
            function PIDEIndicatorsViewModel() {
                var self = this;
                var arrowClassStart = "fa-chevron-";
                var left = "left";
                var right = "right";
                var model = [];
                var modelTree = {};
                var currentEditingGraphic;
                
                var privateData = {
                    selectedNodes: {},
                    selectedNodesBackup: undefined,
                    selectingNode: false,
                    hoverNode: undefined
                };
                
                this.PIDEIndicatorsViewModel_ = function(key) {
                    if(theKey === key) {
                        return privateData;
                    }
                };
                
                self.arrowClass = ko.observable(arrowClassStart + left);
                self.cardModule = ko.observable({viewName: 'empty'});
                self.dateConverter = GeneralViewModel.converters.date;
                self.displayPanel = ko.observable(true);
                self.editing = ko.observable(false);
                self.fromDateValue = ko.observable(oj.IntlConverterUtils.dateToLocalIso(new Date(2014, 0, 01)));
                self.graphics = ko.observableArray();
                self.id = "pide";
                self.minDate = oj.IntlConverterUtils.dateToLocalIso(new Date(2010, 0, 01));
                self.maxDate = oj.IntlConverterUtils.dateToLocalIso(new Date());
                self.nodes = ko.observableArray();
                self.rangeOverflowSummary = "La fecha es mayor a la máxima permitida";
                self.rangeOverflowDetail = "La fecha debe ser menor o igual a " + self.dateConverter.format(self.maxDate);
                self.rangeUnderflowSummary = "La fecha es menor a la mínima permitida";
                self.rangeUnderflowDetail = "La fecha debe ser mayor o igual a " + self.dateConverter.format(self.minDate);
                self.searchValue = ko.observable();
                self.toDateValue = ko.observable(oj.IntlConverterUtils.dateToLocalIso(new Date()));
                
                self.dateSelectionHandler = function(event, ui) {
                    if (ui.option === "value") {
                        var target = $("#" + event.target.id);
                        
                        if (target.ojInputDate("isValid")) {
                            var graphics = self.graphics().map(
                                function(graphicVM) {
                                    return graphicVM.params.graphic;
                                }
                            );
                            
                            graphics.forEach(
                                function(graphic) {
                                    if (self.fromDateValue() !== graphic.fromDateValue()) {
                                        graphic.fromDateValue(self.fromDateValue());
                                    }
                                    
                                    if (self.toDateValue() !== graphic.toDateValue()) {
                                        graphic.toDateValue(self.toDateValue());
                                    }
                                    
                                    graphic.refreshSeriesByDate();
                                }
                            );
                        }
                    }
                };
                
                self.fromValidator = {
                    validate: function(value) {
                        if(value > self.toDateValue()) {
                            throw new Error('La fecha debe ser menor o igual a la del campo \'Hasta\'');
                        }
                        
                        return true;
                    }
                };
                
                self.toValidator = {
                    validate: function(value) {
                        if(value < self.fromDateValue()) {
                            throw new Error('La fecha debe ser igual o mayor a la del campo \'Desde\'');
                        }
                        
                        return true;
                    }
                };
                
                self.handleKeyUp = function(event, ui) {
                    var value = self.searchValue();
                    
                    if (value.length >= 0) {
                        model.forEach(
                            function(node) {
                                recursiveDisplay(value.toLowerCase(), node);
                            }
                        );
                    }
                };
                
                self.hoverHandler = function(event, ui) {
                    var hoverNode = ui.item[0];
                    
                    if (hoverNode.type.includes("indicator")) {
                        self.setHoverNode(theKey, hoverNode);
                    }
                };
                
                self.menuSelectHandler = function(event, ui) {
                    self.cardModule(
                            {
                                name: 'pide/indicator', 
                                params: {
                                    model: modelTree,
                                    id: self.getHoverNode().id,
                                    graphicName: modelTree[self.getHoverNode().id]["title"]
                                }
                            }
                    );
            
                    $("#tree-menu-dialog").ojDialog("open");
                };
                
                self.validateNodeTypeHandler = function(event, ui) {
                    var hoverNode = self.getHoverNode();
                    
                    if (!hoverNode.type.includes("indicator")) {
                        event.preventDefault();
                    }
                };
                
                function recursiveDisplay(targetText, node) {
                    var display = false;
                    var htmlNode = document.getElementById(node.attr.id);
                    var displayStyle = isLeaf(node) ? "block" : "";
                    
                    if (targetText.length === 0) {
                        display = true;
                    } else {
                        var title = node.title.toLowerCase();
                        var includesText = title.includes(targetText);
                        
                        display = includesText;
                    }
                        
                    if (!isLeaf(node)) {
                        var children = node.children;

                        if (display) {
                            targetText = "";
                        }

                        var displayables = children.map(
                            function(element) {
                                return recursiveDisplay(targetText, element);
                            }
                        );

                        display = display || displayables.includes(true);
                    }
                    
                    htmlNode.style.display = display ? displayStyle : "none";
                    
                    return display;
                    
                    function isLeaf(node) {
                        return node.attr.type && node.attr.type.includes("indicator");
                    }
                }
                
                self.toggleDrawer = function () {
                    $("#indicators-tree-container").toggle({queue: false, duration: 1000});
                    self.arrowClass(arrowClassStart +
                            (self.arrowClass().includes(left) ? right : left));
                    self.displayPanel(!self.displayPanel());
                };
                
                self.addGraphicHandler = function () {
                    if (!self.editing()) {
                        self.graphics.push(
                                {
                                    name: "pide/graphic",
                                    animation: oj.ModuleAnimations["coverStart"],
                                    params: {
                                        idPrefix: "pide-graphic-",
                                        index: self.graphics().length + 1,
                                        startDate: self.fromDateValue(),
                                        endDate: self.toDateValue(),
                                        clone: function(index) {
                                            var graphicIndex = findGraphicIndex(
                                                self.graphics(),
                                                index
                                            );

                                            var graphicInitData = self.graphics()[graphicIndex];
                                            var graphicClone = Object.assign({}, graphicInitData);
                                            graphicClone["params"] = Object.assign({}, graphicInitData.params);
                                            var graphicCloneParams = graphicClone["params"];

                                            graphicCloneParams["index"] = self.graphics().length + 1;
                                            graphicCloneParams["ids"] = graphicInitData.params.graphic.getIds().slice();
                                            graphicCloneParams["startDate"] = self.fromDateValue();
                                            graphicCloneParams["endDate"] = self.toDateValue();

                                            self.graphics.push(graphicClone);
                                        },
                                        removal: function (index) {
                                            self.graphics.splice(
                                                    findGraphicIndex(
                                                        self.graphics(),
                                                        index
                                                    ), 1
                                            );

                                            currentEditingGraphic = undefined;
                                        },
                                        startEditing: function(currentGraphic) {
                                            if (!currentEditingGraphic) {
                                                self.setSelectedNodesBackup(theKey, self.getSelectedNodes(theKey));
                                            }

                                            currentEditingGraphic = currentGraphic;

                                            self.graphics().forEach(
                                                    function(element) {
                                                        var graphic = element.params.graphic;

                                                        if (graphic !== currentGraphic) {
                                                            graphic.editing(false);
                                                        }
                                                    }
                                            );

                                            self.resetSelection();
                                            self.selectNodesById(currentGraphic.getIds());
                                            self.editing(true);
                                        },
                                        stopEditing: function() {
                                            self.resetSelection();
                                            if (self.getSelectedNodesBackup(theKey)) {
                                                self.selectNodesById(Object.keys(self.getSelectedNodesBackup(theKey)));
                                            }

                                            currentEditingGraphic = undefined;
                                            self.editing(false);
                                        },
                                        getGraphic: function (graphicReference) {
                                            this.graphic = graphicReference;
                                        },
                                        graphic: undefined,
                                        model: modelTree,
                                        ids: Object.keys(self.getSelectedNodes(theKey))
                                    }
                                }
                        );
            
                        self.resetSelection();
                    }
                };

                self.clickHandler = function (event, ui) {
                    var option = ui.option;

                    if (option === "selection") {
                        var node = ui.value[0];
                        
                        if (self.getSelectingNode()) {
                            self.setSelectingNode(false);
                            return;
                        }
                        
                        self.setSelectingNode(true);

                        if (node && node.type) {
                            self.nodes([]);
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
                                        Object.keys(self.getSelectedNodes(theKey)),
                                        node.id
                                );
                                
                                if (isValidOperation) {
                                    self.addSelectedNode(theKey, node.id,
                                            {
                                                id: node.id,
                                                "unit-type": node["unit-type"]
                                            }
                                    );
                            
                                    if (currentEditingGraphic) {
                                        currentEditingGraphic.addIndicator(node.id);
                                    }
                                } else {
                                    var rect = document.getElementById(node.id).getBoundingClientRect();
                                    var position = {of:{x:rect.left + window.pageXOffset, y:rect.top + window.pageYOffset}};

                                    $("#unit-type-error-pop-up").ojPopup("open", "#" + node.id, position);
                                }
                            } else {
                                self.removeSelectedNode(theKey, node);
                                if (currentEditingGraphic) {
                                    currentEditingGraphic.removeIndicator(node.id);
                                }
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
//                    $.getJSON("data/pide-indicators.json").then(
                    $.getJSON(RESTConfig.pide.indicators.tree.path).then(
                            function (data) {
                                model = data;
                                fn(model);  // pass to ojTree using supplied function

                                var itemsArray = model.slice(0);

                                while (itemsArray.length > 0) {
                                    var element = itemsArray.shift();
                                    
                                    if (element.children) {
                                        itemsArray = itemsArray.concat(element.children);
                                    }

                                    modelTree[element.attr.id] = element;
                                }
                            }
                    );
                };

                self.getTypes = function () {
                    return {
                        "types": {
                            "default": {
                                "select": function () { return false; }
                            },
                            "indicator-selected": {
                                "position": "left",
                                "select": function () { return true; }
                            },
                            "indicator": {
                                "position": "left",
                                "select": function () { return true; }
                            }
                        }
                    };
                };
            }
            
            var prototype = PIDEIndicatorsViewModel.prototype;
            
            prototype.setSelectingNode = function(key, selectingNode) {
                if (theKey === key) {
                    this.PIDEIndicatorsViewModel_(key).selectingNode = selectingNode;
                }
            };
            
            prototype.getSelectingNode = function() {
                return this.PIDEIndicatorsViewModel_(theKey).selectingNode;
            };
            
            prototype.setHoverNode = function(key, hoverNode) {
                if (theKey === key) {
                    this.PIDEIndicatorsViewModel_(key).hoverNode = hoverNode;
                }
            };
            
            prototype.getHoverNode = function() {
                return this.PIDEIndicatorsViewModel_(theKey).hoverNode;
            };
            
            prototype.getComputedCssClass = function(index) {
                return ko.pureComputed(
                            function() {
                                var graphicsLength =this.graphics().length;
                                var cssClass;
                                
                                if (graphicsLength === 1) {
                                    cssClass = "container";
                                } else {
                                    cssClass = "half-height ";
                                    
                                    cssClass += graphicsLength > 2
                                            && (graphicsLength % 2 === 0
                                            || index() + 1 < graphicsLength)
                                            ? "half-width"
                                            : "full-width";
                                }
                                
                                return cssClass;
                            }, this
                       );
            };
            
            prototype.addSelectedNode = function(key, id, node) {
                if (theKey === key) {
                    var selectedNodes = this.getSelectedNodes(key);
                    
                    selectedNodes[id] = node;
                }
            };
            
            prototype.removeSelectedNode = function(key, node) {
                if (theKey === key) {
                    var selectedNodes = this.getSelectedNodes(key);
                    
                    delete selectedNodes[node.id];
                    node.type = "indicator";
                }
            };
            
            prototype.setSelectedNodes = function(key, selectedNodes) {
                if (theKey === key) {
                    this.PIDEIndicatorsViewModel_(key).selectedNodes = selectedNodes;
                }
            };
            
            prototype.getSelectedNodes = function(key) {
                if (theKey === key) {
                    return this.PIDEIndicatorsViewModel_(key).selectedNodes;
                }
            };
            
            prototype.setSelectedNodesBackup = function(key, selectedNodesBackup) {
                if (theKey === key) {
                    this.PIDEIndicatorsViewModel_(key).selectedNodesBackup = selectedNodesBackup;
                }
            };
            
            prototype.getSelectedNodesBackup = function(key) {
                if (theKey === key) {
                    return this.PIDEIndicatorsViewModel_(key).selectedNodesBackup;
                }
            };
            
            prototype.resetSelection = function() {
                var selectedNodes = this.getSelectedNodes(theKey);
                var ids = Object.keys(selectedNodes);
                
                ids.forEach(
                    function(id) {
                        var node = document.getElementById(id);
                        
                        var regExp = /fa-check-square-o/;
                        
                        node.type = "indicator";
                        
                        if (node.className.match(regExp)) {
                            node.className = node.className.replace(regExp, "fa-square-o");
                        }
                    }
                );
        
                this.setSelectedNodes(theKey, {});
            };
            
            prototype.selectNodesById = function (ids) {
                var selectedNodes = this.getSelectedNodes(theKey);
                
                ids.forEach(
                    function(id) {
                        var node = document.getElementById(id);
                        
                        var regExp = /fa-square-o/;
                        
                        node.type = "indicator-selected";
                        
                        if (node.className.match(regExp)) {
                            node.className = node.className.replace(regExp, "fa-check-square-o");
                        }
                        
                        selectedNodes[id] = {
                            id: node.id,
                            "unit-type": node["unit-type"]
                        };
                    }
                );
            };
            
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