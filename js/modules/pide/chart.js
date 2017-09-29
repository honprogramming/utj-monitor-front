/**
 * chart module
 */
define(
    [
        'knockout',
        'ojs/ojcore', 'jquery', 'ojs/ojknockout', 'ojs/ojchart'
    ], function (ko) {

        /**
         * The view model for the main content view template
         */
        function ChartModel() {
            var self = this;
            /* toggle button variables */
            self.stackValue = ko.observable('off');
            self.orientationValue = ko.observable('vertical');

            /* chart data */
            var comboSeries = [
                { name: "Avances", items: [74, 42, 70, 46] },
                { name: "Metas", items: [50, 58, 46, 54] }
            ];

            var comboGroups = ["2014", "2015", "2016", "2017"];

            self.comboSeriesValue = ko.observableArray(comboSeries);

            self.comboGroupsValue = ko.observableArray(comboGroups);


            /* toggle buttons*/
            self.stackOptions = [
                { id: 'unstacked', label: 'unstacked', value: 'off', icon: 'oj-icon demo-bar-unstack' },
                { id: 'stacked', label: 'stacked', value: 'on', icon: 'oj-icon demo-bar-stack' }
            ];

            self.orientationOptions = [
                { id: 'vertical', label: 'vertical', value: 'vertical', icon: 'oj-icon demo-bar-vert' },
                { id: 'horizontal', label: 'horizontal', value: 'horizontal', icon: 'oj-icon demo-bar-horiz' }
            ];
        }

        return ChartModel;
    }
);