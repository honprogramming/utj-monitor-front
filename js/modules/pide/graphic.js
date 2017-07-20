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
                var removalFunction = params.removal;
                
                self.graphicId = params.idPrefix + params.index.toString();
                self.graphicMenuId = "graphic-menu-" + params.index.toString();
                self.graphicName = ko.observable("Grafica " + params.index);
                self.chartType = ko.observable("line");
                
                self.selectHandler = function(event, ui) {
                    var id = ui.item[0].id;
                    
                    if (id.includes("bar")) {
                        self.chartType("bar");
                    } else if (id.includes("line")) {
                        self.chartType("line");
                    }
                };
                
                self.trashHandler = function() {
                    removalFunction(params.index);
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
            }

            return GraphicViewModel;
        }
);