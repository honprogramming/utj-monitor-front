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
                var cloneFunction = params.clone;
                var removalFunction = params.removal;
                var startEditingFunction = params.startEditing;
                var stopEditingFunction = params.stopEditing;
                var getGraphic = params.getGraphic;
                var index = params.index;
                
                var privateData = {
                    clonable: params.clone != null,
                    editable: params.startEditing != null,
                    removable: params.removal != null,
                    markerHandler: new oj.ShapeAttributeGroupHandler(),
                    series: [],
                    monthlySeries: [],
                    yearlySeries: [],
                    groups: [],
                    yaxes: [],
                    model: params.model,
                    ids: params.ids,
                    graphicType: self.graphicType.BAR,
                    indicator: params.indicator
                };
                
                this.GraphicViewModel_ = function(key) {
                    if (theKey === key) {
                        return privateData;
                    }
                };
                
                self.dateConverter = GeneralViewModel.converters.date;
                self.graphicId = params.idPrefix + index.toString();
                self.graphicMenuId = "graphic-menu-" + index.toString();
                self.graphicName = ko.observable(params.graphicName || "Grafica " + index);
                self.chartType = ko.observable("combo");
                self.fromLabel = self.nls("pide.graphicBoard.from");
                self.goalsLabel = self.nls("pide.graphicBoard.goals");
                self.graphicOptions = ko.observableArray([this.elementType.PROGRESS, this.elementType.GOAL]);
                self.editing = ko.observable(false);
                self.displayGraphicNameInputText = ko.observable(false);
                self.yAxis = ko.observable();
                self.y2Axis = ko.observable();
                self.seriesValues = ko.observableArray([]);
                self.groupsValues = ko.observableArray([]);
                self.zoom = ko.observable("off");
                self.zoomIconClass = ko.observable("fa-search-plus");
                self.minDate = oj.IntlConverterUtils.dateToLocalIso(new Date(2010, 0, 01));
                self.maxDate = oj.IntlConverterUtils.dateToLocalIso(new Date());
                self.progressLabel = self.nls("pide.graphicBoard.progress");
                self.rangeOverflowSummary = "La fecha es mayor a la máxima permitida";
                self.rangeOverflowDetail = "La fecha debe ser menor o igual a " + self.dateConverter.format(self.maxDate);
                self.rangeUnderflowSummary = "La fecha es menor a la mínima permitida";
                self.rangeUnderflowDetail = "La fecha debe ser mayor o igual a " + self.dateConverter.format(self.minDate);
                self.fromDateValue = ko.observable(params.startDate);
                self.toLabel = self.nls("pide.graphicBoard.to");
                self.toDateValue = ko.observable(params.endDate);
                self.xAxis = ko.observable(this.xAxisFormats["yearly"]);
                self.xAxisType = ko.observable();
                
                self.cloneClickHandler = function() {
                    cloneFunction(index);
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
                
                self.dateSelectionHandler = function(event, ui) {
                    if (ui.option === "value") {
                        var target = $("#" + event.target.id);
                        
                        if (target.ojInputDate("isValid")) {
                            self.refreshSeriesByDate.call(self);
                        }
                    }
                };
                
                self.zoomClickHandler = function() {
                    var mode = self.zoom() === "live" ? "yearly" : "monthly";
                    
                    self.zoom(mode === "yearly" ? "off" : "live");
                    self.zoomIconClass(mode === "yearly" ? "fa-search-plus" : "fa-search-minus");
                    self.setXAxisFormat(theKey, mode);
                    
                    var newSeries = mode === "yearly" ? this.getYearlySeries() : this.getMonthlySeries();
                    self.setSeries(theKey, newSeries);
                    
                    var progressSeries = self.getSeries().filter(filterProgress);

                    progressSeries.forEach(
                        function(element) {
                            element.type = self.getGraphicType();
                        }
                    );
            
                    self.seriesValues(self.filterSeriesByOptions(theKey, self.graphicOptions()));
                    self.xAxisType(mode === "yearly" ? "auto" : "mixedFrequency");
                };
                
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
                    var value = ui.value;
                    
                    if (ui.option === "checked") {
                        if (value.includes(self.graphicType.COMBO)) {
                            self.chartType(self.graphicType.COMBO);
                            self.setGraphicType(theKey, self.graphicType.BAR);
                        } else if (value.includes(self.graphicType.LINE)) {
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
                    }
                };
                
                self.trashClickHandler = function() {
                    removalFunction(index);
                };
                
                self.graphicOptionsHandler = function(event, ui) {
                    if (ui.option === "value") {
                        var options = ui.value;
                        var newSeries = [];

                        newSeries = self.filterSeriesByOptions(theKey, options);
                        
                        var progressSeries = newSeries.filter(filterProgress);

                        progressSeries.forEach(
                                function(element) {
                                    element.type = self.getGraphicType();
                                }
                        );
                
                        self.seriesValues(newSeries);
                    }
                };
                
                getGraphic.call(params, self);
                self.refreshSeriesByDate();
            }
            
            GraphicViewModel.prototype = Object.create(GeneralViewModel);
            var prototype = GraphicViewModel.prototype;
            
            prototype.getIndicator = function() {
                return this.GraphicViewModel_(theKey).indicator;
            };
            
            prototype.isClonable = function() {
                return this.GraphicViewModel_(theKey).clonable;
            };
            
            prototype.isEditable = function() {
                return this.GraphicViewModel_(theKey).editable;
            };
            
            prototype.isRemovable = function() {
                return this.GraphicViewModel_(theKey).removable;
            };
            
            prototype.graphicType = {
                BAR: "bar",
                LINE: "line",
                COMBO: "combo"
            };
            
            prototype.elementType = {
                GOAL: "goal",
                PROGRESS: "progress"
            };
            
            prototype.convertersMap = {
                number: GeneralViewModel.converters.decimal,
                percentage: GeneralViewModel.converters.percent,
                rate: GeneralViewModel.converters.percent,
                ordinal: GeneralViewModel.converters.integer,
                average: GeneralViewModel.converters.percent,
                currency: GeneralViewModel.converters.currency,
                time: GeneralViewModel.converters.decimal
            };
            
            prototype.xAxisFormats = {
                monthly: {tickLabel: {}},
                yearly: {tickLabel: {converter: GeneralViewModel.converters.year}}
            };
            
            prototype.getConverterByUnitType = function(key, unitType) {
                if (theKey === key) {
                    return this.convertersMap[unitType.toLowerCase()];
                }
            };
            
            prototype.getMarkerHandler = function(key) {
                if (theKey === key) {
                    return this.GraphicViewModel_(theKey).markerHandler;
                }
            };
            
            prototype.refreshSeriesByDate = function() {
                if (this.toDateValue() && this.fromDateValue()) {
                    this.setSeries(theKey, []);
                    this.setGroups(theKey, []);
                    this.setMonthlySeries(theKey, []);
                    this.setYearlySeries(theKey, []);
                    this.getIds().forEach(this.createSerie, this);
                    this.refreshSeries();
                    this.refreshAxes();
                }
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
                                options.includes(this.elementType.PROGRESS) ?
                                filterProgress : filterGoals
                        );
                    }            

                    var displayLegends = options.indexOf(this.elementType.GOAL) < 0;
                    this.setGoalsLegendsEnabled(key, displayLegends, newSeries);
                    
                    return newSeries;
                }
            };
            
            prototype.setGoalsLegendsEnabled = function(key, enable, series) {
                if (theKey === key) {

                    series.forEach(
                        function(serie) {
                            if (serie.elementType === this.elementType.PROGRESS) {
                                serie.displayInLegend = enable ? "on" : "off";
                            }
                        }, this
                    );
                }
            };
            
            prototype.refreshSeries = function(seriesValues) {
                if (!seriesValues) {
                    this.setSeries(theKey,
                        this.xAxis() === this.xAxisFormats.yearly 
                        ? this.getYearlySeries()
                        : this.getMonthlySeries()
                    );
                    
                    seriesValues = this.getSeries();
                }
                
                this.seriesValues(seriesValues);
                
                if (this.seriesValues().length > 0) {
                    this.groupsValues(this.getGroups(theKey));
                }
            };
            
            prototype.refreshAxes = function() {
                var yAxes = this.getYAxes();
                
                if (yAxes.length > 0) {
                    this.yAxis(
                            {
                                title: GeneralViewModel.nls("graphics.unit-types." + yAxes[0]),
                                tickLabel: {
                                    converter: this.getConverterByUnitType(theKey, yAxes[0]),
                                    scaling: "none"
                                }
                            }
                    );
                    
                    this.y2Axis({});

                    if (yAxes.length > 1) {
                        this.y2Axis(
                                {
                                    title: GeneralViewModel.nls("graphics.unit-types." + yAxes[1]),
                                    tickLabel: {
                                        converter: this.getConverterByUnitType(theKey, yAxes[1]),
                                        scaling: "none"
                                    }
                                }
                        );
                    }
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
            
            prototype.setIds = function(key, ids) {
                if (theKey === key) {
                    this.GraphicViewModel_(theKey).ids = ids;
                }
            };
            
            prototype.addId = function(key, id) {
                if (theKey === key) {
                    this.getIds().push(id);
                }
            };
            
            prototype.removeId = function(key, id) {
                if (theKey === key) {
                    var ids = this.getIds();
                    var index = ids.indexOf(id);
                    
                    ids.splice(index, 1);
                }
            };
            
            prototype.getModel = function() {
                return this.GraphicViewModel_(theKey).model;
            };
            
            prototype.getSeries = function() {
                return this.GraphicViewModel_(theKey).series;
            };
            
            prototype.getMonthlySeries = function() {
                return this.GraphicViewModel_(theKey).monthlySeries;
            };
            
            prototype.setMonthlySeries = function(key, monthlySeries) {
                if (theKey === key) {
                    this.GraphicViewModel_(theKey).monthlySeries = monthlySeries;
                }
            };
            
            prototype.getYearlySeries = function() {
                return this.GraphicViewModel_(theKey).yearlySeries;
            };
            
            prototype.setYearlySeries = function(key, yearlySeries) {
                if (theKey === key) {
                    this.GraphicViewModel_(theKey).yearlySeries = yearlySeries;
                }
            };
            
            prototype.setSeries = function(key, series) {
                if (theKey === key) {
                    this.GraphicViewModel_(theKey).series = series;
                }
            };
            
            prototype.getGroups = function(key) {
                if (theKey === key) {
                    return this.GraphicViewModel_(theKey).groups;
                }
            };
            
            prototype.setGroups = function(key, groups) {
                if (theKey === key) {
                    this.GraphicViewModel_(theKey).groups = groups;
                }
            };
            
            prototype.addGroup = function(key, group) {
                if (theKey === key) {
                    if (!this.getGroups(key).includes(group)) {
                        this.GraphicViewModel_(theKey).groups.push(group);
                    }
                }
            };
            
            prototype.getYAxes = function() {
                return this.GraphicViewModel_(theKey).yaxes;
            };
            
            prototype.addIndicator = function(id) {
                this.createSerie(id);
                this.addId(theKey, id);
                this.refreshAxes();
                var seriesValues = this.filterSeriesByOptions(theKey, this.graphicOptions());
                this.refreshSeries(seriesValues);
            };
            
            prototype.removeIndicator = function(id) {
                var series = this.getSeries();
                series = series.filter(
                    function(serie) {
                        return serie.id != id;
                    }
                );
        
                this.setSeries(series);
                
                this.seriesValues.remove(
                    function(serie) {
                        return serie.id == id;
                    }
                );
        
                this.removeId(theKey, id);
        
                this.refreshAxes();
            };
            
            prototype.setXAxisFormat = function(key, format) {
                if (theKey === key) {
                    var newFormat = this.xAxisFormats[format];
                    
                    if (newFormat) {
                        this.xAxis(newFormat);
                    }
                }
            };
            
            prototype.getItem = function(id) {
                const model = this.getModel();
                let item = model ? model[id] : undefined;
                
                if (item) {
                    item = {title: item.title, ...item.attr};
                } else {
                    item = this.getIndicator();
                    item = {title: item.name, ...item};
                }
                
                return item;
            };
            
            prototype.createSerie = function(id) {
                const yearlySeries = this.getYearlySeries();
                const monthlySeries = this.getMonthlySeries();
                const yaxes = this.getYAxes();
                const item = this.getItem(id);
                const unitType = item.measureUnit.type.name;
                const displayLegends = this.graphicOptions().indexOf(this.elementType.GOAL) < 0;
                const markerHandler = this.getMarkerHandler(theKey);
                const markerShape = markerHandler.getValue(id);
                
                if (yaxes.indexOf(unitType) < 0) {
                    yaxes.push(unitType);
                }

                const monthlyProgressElement = {
                    id: item.id,
                    elementType: this.elementType.PROGRESS,
                    name: item.title,
                    items: [],
                    displayInLegend: displayLegends ? "on" : "off",
                    type: this.getGraphicType(),
                    markerShape: markerShape,
                    markerDisplayed: "on",
                    assignedToY2: yaxes.indexOf(unitType) > 0 ? "on" : "off"
                };

                const monthlyGoalElement = {
                    id: item.id,
                    elementType: this.elementType.GOAL,
                    name: item.title,
                    items: [],
                    displayInLegend: "on",
                    type: this.graphicType.LINE,
                    lineStyle: "dotted",
                    markerShape: markerShape,
                    markerDisplayed: "on",
                    assignedToY2: yaxes.indexOf(unitType) > 0 ? "on" : "off"
                };

                const yearlyProgressElement = {
                    id: item.id,
                    elementType: this.elementType.PROGRESS,
                    name: item.title,
                    items: [],
                    displayInLegend: displayLegends ? "on" : "off",
                    type: this.getGraphicType(),
                    markerShape: markerShape,
                    markerDisplayed: "on",
                    assignedToY2: yaxes.indexOf(unitType) > 0 ? "on" : "off"
                };

                const yearlyGoalElement = {
                    id: item.id,
                    elementType: this.elementType.GOAL,
                    name: item.title,
                    items: [],
                    displayInLegend: "on",
                    type: this.graphicType.LINE,
                    lineStyle: "dotted",
                    markerShape: markerShape,
                    markerDisplayed: "on",
                    assignedToY2: yaxes.indexOf(unitType) > 0 ? "on" : "off"
                };
                
                const fromDate = Date.parse(this.fromDateValue());
                const toDate = Date.parse(this.toDateValue());
                const achievements = item.achievements.filter(
                    achievement => filterAchievementByDate(achievement, fromDate, toDate)
                );
        
                const monthlyElements = {
                    "GOAL": monthlyGoalElement,
                    "PROGRESS": monthlyProgressElement
                };
                
                const yearlyElements = {
                    "GOAL": yearlyGoalElement,
                    "PROGRESS": yearlyProgressElement
                };
                
                const yearlyData = {};
                
                achievements.forEach(
                    achievement => {
                        const date = new Date();
                        date.setTime(achievement.date.time);
                        
                        const isoDate = oj.IntlConverterUtils.dateToLocalIso(date);
                        const monthlyElement = monthlyElements[achievement.achievementType];
                    
                        monthlyElement.items.push({x: isoDate, y: achievement.data});
                        
                        if (!yearlyData[date.getFullYear()]) {
                            yearlyData[date.getFullYear()] = {
                                "GOAL": {}, 
                                "PROGRESS": {}
                            };
                            
                            yearlyData[date.getFullYear()][achievement.achievementType] =
                                    {date: date, value: achievement.data};
                        } else {
                            if(yearlyData[date.getFullYear()][achievement.achievementType].date) {
                                if (date > yearlyData[date.getFullYear()][achievement.achievementType].date) {
                                    yearlyData[date.getFullYear()][achievement.achievementType] =
                                            {date: date, value: achievement.data};
                                }
                            } else {
                                yearlyData[date.getFullYear()][achievement.achievementType] = 
                                        {date: date, value: achievement.data};
                            }
                        }
                    }
                );
                
                for (let year in yearlyData) {
                    this.addGroup(theKey, year);
                    
                    yearlyElements["GOAL"].items.push( 
                        {
                            x: oj.IntlConverterUtils.dateToLocalIso(new Date(year, 0, 1)),
                            y: yearlyData[year]["GOAL"].value
                        }
                    );
                    yearlyElements["PROGRESS"].items.push(
                        {
                            x: oj.IntlConverterUtils.dateToLocalIso(new Date(year, 0, 1)),
                            y: yearlyData[year]["PROGRESS"].value
                        } 
                    );
                }
                        
                monthlySeries.push(monthlyProgressElement);
                monthlySeries.push(monthlyGoalElement);

                yearlySeries.push(yearlyGoalElement);
                yearlySeries.push(yearlyProgressElement);
            };
            
            function filterProgress(element) {
                return element.elementType === prototype.elementType.PROGRESS;
            }
            
            function filterGoals(element) {
                return element.elementType === prototype.elementType.GOAL;
            }
            
            function filterAchievementByDate(achievement, startDate, endDate) {
                const date = new Date(achievement.date.time);
                return date >= startDate && date <= endDate;
            }
            
            return GraphicViewModel;
        }
);