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
            function GraphicViewModel(params) {
                var self = this;
                var series = [];
                var removalFunction = params.removal;
                var model = params.model;
                var ids = params.ids;
                
                self.graphicId = params.idPrefix + params.index.toString();
                self.graphicMenuId = "graphic-menu-" + params.index.toString();
                self.graphicName = ko.observable("Grafica " + params.index);
                self.chartType = ko.observable("line");
                self.graphicOptions = ko.observableArray(["progress", "goals"]);
                        
                self.graphicTypeSelectHandler = function(event, ui) {
                    var id = ui.item[0].id;
                    
                    if (id.includes("bar")) {
                        self.chartType("bar");
                    } else if (id.includes("line")) {
                        self.chartType("line");
                    }
                };
                
                self.trashClickHandler = function() {
                    removalFunction(params.index);
                };
                
                self.graphicOptionsHandler = function(event, ui) {
                    var options = ui.value;
                    var optionsLength = options.length;
                    var newSeries = [];
                    
                    switch(optionsLength) {
                        case 1:
                            newSeries = 
                                    series.filter(
                                        options.includes("progress") ?
                                        filterProgress : filterGoals
                                    );
                            break;
                        case 2:
                            newSeries = series;
                            break;
                    }
                    
                    self.seriesValues(newSeries);
                    
                    function filterProgress(element) {
                        return !element.displayInLegend;
                    }
                    
                    function filterGoals(element) {
                        return element.displayInLegend;
                    }
                };
                
                ids.forEach(
                    function(element) {
                        var item = model[element];
                        
                        var progressElement = {
                            name: item.title,
                            items: []
                        };
                        
                        var goalElement = {
                            name: item.title,
                            items: [],
                            displayInLegend: "off",
                            lineStyle: "dashed"
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
                    }
                );

                var groups = ["2014", "2015", "2016", "2017"];

                self.seriesValues = ko.observableArray(series);
                self.groupsValues = ko.observableArray(groups);
            }

            return GraphicViewModel;
        }
);