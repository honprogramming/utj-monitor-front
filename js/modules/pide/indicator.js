/**
 * "PIDE Indicador" module.
 * 
 * @param {type} oj
 * @param {type} ko
 * @returns {indicatorL#21.PIDEIndicatorViewModel}
 */
define(
    [
        'ojs/ojcore',
        'knockout',
        'view-models/GeneralViewModel',
        'jquery',
        'ojs/ojknockout',
        'ojs/ojinputtext',
        'ojs/ojchart',
        'ojs/ojmodule',
        'ojs/ojtabs',
        'ojs/ojcollapsible',
        'ojs/ojtable',
        'ojs/ojdialog',
        'ojs/ojbutton',
        'ojs/ojarraytabledatasource',
        'ojs/ojsunburst',
        'ojs/ojlegend',
        'hammerjs',
        'ojs/ojjquery-hammer',
        'ojs/ojoffcanvas',
        'ojs/ojselectcombobox',
        'ojs/ojtree',
        'ojs/ojdatetimepicker',
        'ojs/ojcheckboxset',
        'ojs/ojchart',
        'ojs/ojmoduleanimations',
        'ojs/ojpopup'
    ],
    function (oj, ko, GeneralViewModel) {

        var theKey = {};

        /**
         * "Ficha de Indicador PIDE" ViewModel.
         */
        function PIDEIndicatorViewModel(params) {
            const self = this;
            const indicator = params.indicator;
            
            const privateData = {
                id: params.id,
                model: params.model
            };
            
            this.PIDEIndicatorViewModel_ = function(key) {
                if (theKey === key) {
                    return privateData;
                }
            };
            
            // Section names
            self.areaLabel = GeneralViewModel.nls("pide.details.card.general-info.responsible.area");
            self.axeLabel = GeneralViewModel.nls("pide.details.card.general-info.axe");
            self.classTypeLabel = GeneralViewModel.nls("mecasut.class");
            self.descriptionLabel = GeneralViewModel.nls("pide.details.card.general-info.responsible.description");
            self.extLabel = GeneralViewModel.nls("pide.details.card.general-info.responsible.ext");
            self.generalInfo = GeneralViewModel.nls("pide.details.card.general-info.title");
            self.implementedActionsLabel = GeneralViewModel.nls("pide.details.card.general-info.implemented-actions");
            self.measureUnitLabel = GeneralViewModel.nls("pide.details.card.general-info.responsible.measure-unit");
            self.nameLabel = GeneralViewModel.nls("pide.details.card.general-info.name-label");
            self.objectiveLabel = GeneralViewModel.nls("pide.details.card.general-info.objective");
            self.phoneLabel = GeneralViewModel.nls("pide.details.card.general-info.responsible.phone");
            self.potentialRiskLabel = GeneralViewModel.nls("pide.details.card.general-info.potential-risk");
            self.responsibleLabel = GeneralViewModel.nls("pide.details.card.general-info.responsible.title");
            self.sourceLabel = GeneralViewModel.nls("pide.details.card.general-info.responsible.source");
            self.title = GeneralViewModel.nls("pide.details.card.title");
            
            
            self.progressGoals = GeneralViewModel.nls("pide.details.card.goals-and-progress.title");
//            self.alignmentPOA = ko.observable("Alineación POA");

            // General information
            self.name = ko.observable(indicator.name);
            
            switch (indicator.indicatorType.name) {
                case "PIDE":
                    self.axeValue = indicator.axe.text;
                    self.objectiveValue = indicator.objective.text;
                    break;
                case "MECASUT":
                    self.classTypeValue = indicator.classType.name;
                    break;
            }
            
            self.areaValue = indicator.responsible.area.name;
            self.responsibleValue = indicator.responsible.jobTitle.name;
            self.phoneValue = indicator.responsible.player.phones[0].number;
            self.descriptionValue = indicator.description;
            self.measureUnitValue = GeneralViewModel.nls(`graphics.unit-types.${indicator.measureUnit.type.name}`);
            self.sourceValue = indicator.source;
            self.potentialRiskValue = indicator.potentialRisk;
            self.implementedActionsValue = indicator.implementedActions;

            // Progress and goals
            self.metas = new ChartModel(params);

            // POA Alignment
            self.alineacion = new SunburstModel();
        }

        /**
         * Chart content Model.
         */
        function ChartModel(params) {
            var self = this;

            // Date values
            self.fromDateValue = ko.observable(oj.IntlConverterUtils.dateToLocalIso(new Date(2014, 0, 01)));
            self.toDateValue = ko.observable(oj.IntlConverterUtils.dateToLocalIso(new Date()));

            // Progress and goals
            self.chart = ko.observable(
                {
                    name: 'pide/graphic',
                    animation: oj.ModuleAnimations["coverStart"],
                    params: {
                        idPrefix: "pide-graphic-",
                        index: "1",
                        startDate: self.fromDateValue(),
                        endDate: self.toDateValue(),                        
                        getGraphic: function (graphicReference) {
                            this.graphic = graphicReference;
                        },
                        graphic: undefined,
                        graphicName: params.indicator.name,
                        indicator: params.indicator,
                        ids: [params.indicator.id]
                    }
                }
            );
        }

        /**
         * Sunburst Model
         */
        function SunburstModel() {
            var self = this;

            // Color handler
            self.color = new oj.ColorAttributeGroupHandler();

            // Create node
            self.createNode = function (label, name, goal, achieve) {
                return {
                    id: label,
                    label: label,
                    name: name,
                    goal: goal,
                    achieve: achieve,
                    value: 360 / 360,
                    color: self.getColor(goal / achieve),
                    shortDesc: "&lt;b&gt;" + name + "&lt;/b&gt;"
                };
            };

            // Get color
            self.getColor = function (progress) {
                if (progress >= 90) {
                    return "#31B404";
                } else if (progress >= 60) {
                    return "#D7DF01";
                } else if (progress >= 40) {
                    return "#FE9A2E";
                } else {
                    return "#DF0101";
                }
            };

            // Add child
            self.addChildNodes = function (parent, childNodes) {
                parent.nodes = [];
                for (var i = 0; i < childNodes.length; i++) {
                    parent.nodes.push(childNodes[i]);
                }
            };

            // Mock Indicator
            var indicator = {
                label: "1.1.1",
                name: "Número de programas educativos acreditados ante COPAES",
                goal: 4,
                achieve: 0
            };

            // Mock process array
            var process = [
                {
                    label: "2",
                    name: "Desarrollo profesional docente",
                    goal: 10,
                    achieve: 0.18
                }, 
                {
                    label: "5",
                    name: "Aprendizaje de competencias",
                    goal: 4,
                    achieve: 0
                }, 
                {
                    label: "7",
                    name: "Servicios de apoyo al estudiante",
                    goal: 46,
                    achieve: 37
                }
            ];

            // Main node (Indicator) for Sunburst
            self.rootNode = self.createNode(indicator.label, indicator.name, indicator.goal, indicator.achieve);

            // Child nodes (Process)
            self.childNodes = [];

            // Array to store information about text and color for each process
            self.legendItems = [];

            process.forEach(
                function (pro) {
                    // New node
                    let p = self.createNode(pro.label, pro.name, pro.goal, pro.achieve);

                    // Add node to process nodes
                    self.childNodes.push(p);

                    // New legend
                    var legend = {
                        text: `${pro.label}. ${pro.name}`,
                        color: self.getColor(pro.goal / pro.achieve)
                    };

                    // Add legend to legend items
                    self.legendItems.push(legend);
                }
            );

            // Add indicator childs/process
            self.addChildNodes(self.rootNode, self.childNodes);

            // Add legends
            self.legendSections = ko.observableArray([{items: self.legendItems}]);

            // Show values
            self.nodeValues = ko.observableArray([self.rootNode]);
        }

        return PIDEIndicatorViewModel;
    }
);