/**
 * Módulo de PIDE Indicador
 */
define([
    'ojs/ojcore', 
    'knockout', 
    'jquery', 
    'ojs/ojknockout',
    'ojs/ojinputtext', 
    'ojs/ojchart',
    'ojs/ojtabs',
    'ojs/ojcollapsible',
    'ojs/ojtable',
    'ojs/ojdialog',
    'ojs/ojbutton',
    'ojs/ojarraytabledatasource'
], function (oj, ko) {
    
    /**
     * Vista-Modelo para el contenido de Ficha de Indicador PIDE
     */
    function PIDEIndicatorViewModel() {
        var self = this;

        // Información general
        self.nombreIndicador = ko.observable("Nombre del indicador");
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

        // Avances y metas
        self.chart = new ChartModel();
    }

    /**
     * Modelo para la Gráfica
     * @returns {indicatorL#6.ChartModel}
     */
    function ChartModel() {
        var self = this;

        /* toggle button variables */
        self.orientationValue = ko.observable('vertical');

        /* chart data */
        var lineSeries = [{name: "Series 1", items: [74, 62, 70, 76, 66]},
            {name: "Series 2", items: [50, 38, 46, 54, 42]},
            {name: "Series 3", items: [34, 22, 30, 32, 26]},
            {name: "Series 4", items: [18, 6, 14, 22, 10]},
            {name: "Series 5", items: [3, 2, 3, 3, 2]}];

        var lineGroups = ["Group A", "Group B", "Group C", "Group D", "Group E"];


        this.lineSeriesValue = ko.observableArray(lineSeries);
        this.lineGroupsValue = ko.observableArray(lineGroups);

        /* toggle buttons*/
        self.orientationOptions = [
            {id: 'vertical', label: 'vertical', value: 'vertical', icon: 'oj-icon demo-line-vert'},
            {id: 'horizontal', label: 'horizontal', value: 'horizontal', icon: 'oj-icon demo-line-horiz'}
        ];
    }

    return PIDEIndicatorViewModel;
});
