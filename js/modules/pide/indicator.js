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
    function (oj, ko) {

        var theKey = {};

        /**
         * "Ficha de Indicador PIDE" ViewModel.
         */
        function PIDEIndicatorViewModel(params) {
            var self = this;
            
            var privateData = {
                id: params.id,
                model: params.model
            };
            
            this.PIDEIndicatorViewModel_ = function(key) {
                if (theKey === key) {
                    return privateData;
                }
            };
            
            // Section names
            self.generalInfo = ko.observable("Información general");
            self.progressGoals = ko.observable("Avances y metas");
            self.alignmentPOA = ko.observable("Alineación POA");

            // General information
            self.nombreIndicador = ko.observable(params.graphicName || "Nombre del indicador");
            self.clave = ko.observable("Clave");
            self.eje = ko.observable("Eje");
            self.tema = ko.observable("Tema");
            self.objetivo = ko.observable("Objetivo");
            self.areaResponsable = ko.observable("Área responsable");
            self.personaResponsable = ko.observable("Persona responsable");
            self.telefono = ko.observable("Teléfono");
            self.extension = ko.observable("Extensión");
            self.descripcion = ko.observable("Descripción");
            self.unidadMedida = ko.observable("Unidad de medida");
            self.fuente = ko.observable("Fuente");

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
                        graphicName: params.model[params.id]["title"],
                        model: params.model,
                        ids: [params.id]
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