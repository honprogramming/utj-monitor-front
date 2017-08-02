    define(
        [
            'jquery',
            'ojs/ojcore',
            'knockout',
            'view-models/GeneralViewModel',
            'ojs/ojbutton',
            'hammerjs',
            'ojs/ojjquery-hammer',
            'ojs/ojdatetimepicker',
            'ojs/ojchart'
        ],
        function ($, oj, ko, GeneralViewModel) {
            var theKey = {};
            
            function GraphicViewModel(params) {
                var self = this;
                var removalFunction = params.removal;
                var startEditingFunction = params.startEditing;
                var stopEditingFunction = params.stopEditing;
                var getGraphic = params.getGraphic;
                var ids = params.ids;
                var index = params.index;
                
                var privateData = {
                    series: [],
                    yaxes: [],
                    model: params.model,
                    ids: params.ids,
                    graphicType: self.graphicType.LINE
                };
                
                this.GraphicViewModel_ = function(key) {
                    if (theKey === key) {
                        return privateData;
                    }
                };
                
                self.graphicId = params.idPrefix + index.toString();
                self.graphicMenuId = "graphic-menu-" + index.toString();
                self.graphicName = ko.observable("Grafica " + index);
                self.chartType = ko.observable("line");
                self.graphicOptions = ko.observableArray(["progress", "goals"]);
                self.editing = ko.observable(false);
                self.displayGraphicNameInputText = ko.observable(false);
                
                self.graphicNameClickHandler = function(event, ui) {
                    if (ui.option === "value") {
                        self.displayGraphicNameInputText(false);
                    }
                };
                
                self.graphicNameLabelClickHandler = function() {
                    self.displayGraphicNameInputText(true);
                };
                
                self.startEditHandler = function() {
                    self.editing(true);
                    startEditingFunction(self);
                };
                
                self.stopEditHandler = function() {
                    self.editing(false);
                    stopEditingFunction();
                };
                
                self.graphicTypeSelectHandler = function(event, ui) {
                    var id = ui.item[0].id;
                    
                    if (id.includes(self.graphicType.BAR)) {
                        self.chartType(self.graphicType.COMBO);
                        self.setGraphicType(theKey, self.graphicType.BAR);
                    } else if (id.includes(self.graphicType.LINE)) {
                        self.chartType(self.graphicType.LINE);
                        self.setGraphicType(theKey, self.graphicType.LINE);
                    }
                    
                    var series = self.seriesValues();
                    
                    var progressSeries = series.filter(filterProgress);
                    
                    progressSeries.forEach(
                            function(element) {
                                element.type = self.getGraphicType();
                            }
                    );
            
                    $("#" + self.graphicId).ojChart("refresh");
                };
                
                self.trashClickHandler = function() {
                    removalFunction(index);
                };
                
                self.graphicOptionsHandler = function(event, ui) {
                    if (ui.option === "value") {
                        var options = ui.value;
                        var newSeries = [];

                        newSeries = self.filterSeriesByOptions(theKey, options);

                        self.seriesValues(newSeries);
                    }
                };
                
                self.yAxis = ko.observable();
                self.y2Axis = ko.observable();
                
                ids.forEach(self.createSerie, self);
                
                var groups = ["2014", "2015", "2016", "2017"];
                
                self.refreshAxes();
                
                self.seriesValues = ko.observableArray([]);
                self.groupsValues = ko.observableArray(groups);
                
                self.refreshSeries();
                
                getGraphic.call(params, self);
            }
            
            GraphicViewModel.prototype = Object.create(GeneralViewModel);
            var prototype = GraphicViewModel.prototype;
            
            prototype.graphicType = {
                BAR: "bar",
                LINE: "line",
                COMBO: "combo"
            };
            
            prototype.filterSeriesByOptions = function(key, options) {
                if (theKey === key) {
                    var optionsLength = options.length;
                    
                    if (optionsLength === 0) {
                        return [];
                    }
                    
                    var newSeries = this.getSeries();

                    if (optionsLength === 1) {
                        newSeries = 
                            this.getSeries().filter(
                                options.includes("progress") ?
                                filterProgress : filterGoals
                        );
                    }            

                    var displayLegends = options.indexOf("progress") < 0;
                    this.setGoalsLegendsEnabled(key, displayLegends, newSeries);
                    
                    return newSeries;
                }
            };
            
            prototype.setGoalsLegendsEnabled = function(key, enable, series) {
                if (theKey === key) {

                    series.forEach(
                        function(serie) {
                            if (serie.displayInLegend) {
                                serie.displayInLegend = enable ? "on" : "off";
                            }
                        }
                    );
                }
            };
            
            prototype.refreshSeries = function(seriesValues) {
                this.seriesValues(seriesValues ? seriesValues : this.getSeries());
            };
            
            prototype.refreshAxes = function() {
                this.yAxis({title: GeneralViewModel.nls("graphics.unit-types." + this.getYaxes()[0])});
                this.y2Axis(null);
                
                if (this.getYaxes()[1]) {
                    this.y2Axis({title: GeneralViewModel.nls("graphics.unit-types." + this.getYaxes()[1])});
                }
            };
            
            prototype.getGraphicType = function() {
                return this.GraphicViewModel_(theKey).graphicType;
            };
            
            prototype.setGraphicType = function(key, graphicType) {
                if (theKey === key) {
                    this.GraphicViewModel_(theKey).graphicType = graphicType;
                }
            };
            
            prototype.getIds = function() {
                return this.GraphicViewModel_(theKey).ids;
            };
            
            prototype.getModel = function() {
                return this.GraphicViewModel_(theKey).model;
            };
            
            prototype.getSeries = function() {
                return this.GraphicViewModel_(theKey).series;
            };
            
            prototype.setSeries = function(key, series) {
                if (theKey === key) {
                    return this.GraphicViewModel_(theKey).series = series;
                }
            };
            
            prototype.getYaxes = function() {
                return this.GraphicViewModel_(theKey).yaxes;
            };
            
            prototype.addIndicator = function(id) {
                this.createSerie(id);
                this.refreshAxes();
                var seriesValues = this.filterSeriesByOptions(theKey, this.graphicOptions());
                this.refreshSeries(seriesValues);
            };
            
            prototype.removeIndicator = function(id) {
                var series = this.getSeries();
                series = series.filter(
                    function(serie) {
                        return serie.id !== id;
                    }
                );
        
                this.setSeries(series);
                
                this.seriesValues.remove(
                    function(serie) {
                        return serie.id === id;
                    }
                );
        
                this.refreshAxes();
            };
            
            prototype.createSerie = function(id) {
                var model = this.getModel();
                var series = this.getSeries();
                var yaxes = this.getYaxes();
                var item = model[id];
                var unitType = item["unit-type"];
                var displayLegends = this.graphicOptions().indexOf("progress") < 0;
                
                if (yaxes.indexOf(unitType) < 0) {
                    yaxes.push(unitType);
                }

                var progressElement = {
                    id: item.attr.id,
                    name: item.title,
                    items: [],
                    type: this.getGraphicType(),
                    markerShape: "square",
                    markerDisplayed: "on",
                    assignedToY2: yaxes.indexOf(unitType) > 0 ? "on" : "off"
                };

                var goalElement = {
                    id: item.attr.id,
                    name: item.title,
                    items: [],
                    displayInLegend: displayLegends ? "on" : "off",
                    type: this.graphicType.LINE,
                    lineStyle: "dotted",
                    markerDisplayed: "on",
                    assignedToY2: yaxes.indexOf(unitType) > 0 ? "on" : "off"
                };

                var highestAllowed = item["values-range"].highest;
                var lowestAllowed = item["values-range"].lowest;

                for (var i = 1; i <= 4; i ++) {
                    var progress =  Math.random() * (highestAllowed - lowestAllowed) + lowestAllowed;
                    var goal =  Math.random() * (highestAllowed - lowestAllowed) + lowestAllowed;

                    progressElement.items.push(progress);
                    goalElement.items.push(goal);
                }

                series.push(progressElement);
                series.push(goalElement);
            };
            
            function filterProgress(element) {
                return !element.displayInLegend;
            }
            
            function filterGoals(element) {
                return element.displayInLegend;
            }
                    
            return GraphicViewModel;
        }
);