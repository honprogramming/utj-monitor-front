/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * chart module
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojbutton', 
    'ojs/ojchart', 'ojs/ojtoolbar'
], function (oj, ko) {

    /**
     * The view model for the main content view template
     */
    function ChartModel() {
        var self = this;

        /* toggle button variables */
        self.stackValue = ko.observable('off');
        self.orientationValue = ko.observable('vertical');

        /* chart data */
        var comboSeries = [{name: "Avances", items: [74, 42, 70, 46]},
            {name: "Metas", items: [50, 58, 46, 54]}];

        var comboGroups = ["2014", "2015", "2016", "2017"];

        this.comboSeriesValue = ko.observableArray(comboSeries);

        this.comboGroupsValue = ko.observableArray(comboGroups);


        /* toggle buttons*/
        self.stackOptions = [
            {id: 'unstacked', label: 'unstacked', value: 'off', icon: 'oj-icon demo-bar-unstack'},
            {id: 'stacked', label: 'stacked', value: 'on', icon: 'oj-icon demo-bar-stack'}
        ];
        self.orientationOptions = [
            {id: 'vertical', label: 'vertical', value: 'vertical', icon: 'oj-icon demo-bar-vert'},
            {id: 'horizontal', label: 'horizontal', value: 'horizontal', icon: 'oj-icon demo-bar-horiz'}
        ];
    }

    return ChartModel;
});
