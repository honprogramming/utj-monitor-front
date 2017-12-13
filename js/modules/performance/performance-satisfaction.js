define(
        [
            'jquery',
            'ojs/ojcore',
            'knockout',
            'data/DataProvider',
            'modules/performance/model/PerformanceModel',
            'modules/performance/model/PerformanceDataParser',
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
        function ($, oj, ko, DataProvider, PerformanceModel, PerformanceDataParser, GeneralViewModel) {
            var theKey = {};
            
            function PerformanceSatisfactionViewModel() {
                var self = this;
                var arrowClassStart = "fa-chevron-";
                var left = "left";
                var right = "right";
                var model = [];
                var modelTree = {};
                
                var detailsPanelDataProvider =
                        new DataProvider("data/positions.json",
                                PerformanceDataParser);

                var dataPromise = detailsPanelDataProvider.fetchDataMap();
                
                dataPromise.then(
                        function () {
                            self.setDetailsPanelModel(theKey, new PerformanceModel(detailsPanelDataProvider));
                            self.detailsData(
                                    {
                                        name: 'performance/performance-satisfaction-details',
                                        params: {
                                            model: self.getDetailsPanelModel(theKey),
                                            autoExport: function(view) {
                                                self.setView(theKey, view);
                                            }
                                        }
                                    }
                            );
                        }
                );
        
                var privateData = {
                    selectedNode: undefined,
                    selectingNode: false,
                    detailsPanelModel: undefined,
                    detailsView: undefined
                };
                
                this.PerformanceSatisfactionViewModel_ = function(key) {
                    if(theKey === key) {
                        return privateData;
                    }
                };
                
                self.arrowClass = ko.observable(arrowClassStart + left);
                self.cardModule = ko.observable({viewName: 'empty'});
                self.dateConverter = GeneralViewModel.converters.date;
                self.detailsData = ko.observable({viewName: 'empty'});
                self.displayPanel = ko.observable(true);
                self.editing = ko.observable(false);
                self.fromDateValue = ko.observable(oj.IntlConverterUtils.dateToLocalIso(new Date(2014, 0, 01)));
                self.graphics = ko.observableArray();
                self.id = "performance";
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
                
//                self.menuSelectHandler = function(event, ui) {
//                    self.cardModule(
//                            {
//                                name: 'pide/indicator', 
//                                params: {
//                                    model: modelTree,
//                                    id: self.getHoverNode().id,
//                                    graphicName: modelTree[self.getHoverNode().id]["title"]
//                                }
//                            }
//                    );
//            
//                    $("#tree-menu-dialog").ojDialog("open");
//                };
                
//                self.validateNodeTypeHandler = function(event, ui) {
//                    var hoverNode = self.getHoverNode();
//                    
//                    if (!hoverNode.type.includes("indicator")) {
//                        event.preventDefault();
//                    }
//                };
                
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
                        return node.attr.type && node.attr.type.includes("responsible");
                    }
                }
                
                self.toggleDrawer = function () {
                    $("#indicators-tree-container").toggle({queue: false, duration: 1000});
                    self.arrowClass(arrowClassStart +
                            (self.arrowClass().includes(left) ? right : left));
                    self.displayPanel(!self.displayPanel());
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
                            let currentNode = self.getSelectedNode(theKey);
                            
                            if (currentNode) {
                                setTargetClass(currentNode, "fa-square-o");
                                currentNode.type = "responsible";
                            }
                            
                            var isSelected = node.type.includes("selected");
                            var type = "responsible";

                            if (!isSelected) {
                                type += "-selected";
                            }

                            node.type = type;
                            
                            var targetClass = " fa-";
                            
                            if (!isSelected) {
                                targetClass += "check-";
                                self.setSelection(theKey, node);
                            } else {
                                self.removeSelection(theKey);
                            }
                            
                            targetClass += "square-o";

                            setTargetClass(node, targetClass);
                            self.setSelectedIndicator(node.id);
                        }
                    }
                    
                    function setTargetClass(node, targetClass) {
                        var regExp = /fa-\S*square-o/;

                        if (node.className.match(regExp)) {
                            node.className = node.className.replace(regExp, targetClass);
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

                        if (node.type && node.type.includes("responsible")) {
                            node.className += " fa fa-square-o";
                            node.style.display = "block";
                        }
                    }

                    function addNode(node) {
                        nodesArray.push(node);
                    }
                };
                
                self.getJson = function (node, fn) {
                    $.getJSON("data/positions.json").then(
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
                            "responsible": {
                                "position": "left",
                                "select": function () { return true; }
                            },
                            "responsible-selected": {
                                "position": "left",
                                "select": function () { return true; }
                            }
                        }
                    };
                };
            }
            
            var prototype = PerformanceSatisfactionViewModel.prototype;
            
            prototype.setSelectingNode = function(key, selectingNode) {
                if (theKey === key) {
                    this.PerformanceSatisfactionViewModel_(key).selectingNode = selectingNode;
                }
            };
            
            prototype.getSelectingNode = function() {
                return this.PerformanceSatisfactionViewModel_(theKey).selectingNode;
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
            
            prototype.setSelection = function(key, node) {
                if (theKey === key) {
                    this.PerformanceSatisfactionViewModel_(key).selectedNode = node;
                }
            };
            
            prototype.removeSelection = function(key) {
                if (theKey === key) {
                    this.PerformanceSatisfactionViewModel_(key).selectedNode = null;
                }
            };
            
            prototype.getSelectedNode = function(key) {
                if (theKey === key) {
                    return this.PerformanceSatisfactionViewModel_(key).selectedNode;
                }
            };
            
            prototype.setDetailsPanelModel = function(key, model) {
                if (theKey === key) {
                    this.PerformanceSatisfactionViewModel_(key).detailsPanelModel = model;
                }
            };
            
            prototype.getDetailsPanelModel = function(key) {
                if (theKey === key) {
                    return this.PerformanceSatisfactionViewModel_(key).detailsPanelModel;
                }
            };
            
            prototype.setSelectedIndicator = function(id) {
                if (id) {
                    this.getView(theKey).setSelectedItem(id);
                }
            };
            
            prototype.setView = function(key, view) {
                if (theKey === key) {
                    this.PerformanceSatisfactionViewModel_(key).detailsView = view;
                }
            };
            
            prototype.getView = function(key, view) {
                if (theKey === key) {
                    return this.PerformanceSatisfactionViewModel_(key).detailsView;
                }
            };
            
            return PerformanceSatisfactionViewModel;
        }
);