/**
 * chart module
 */
define(
        [
            'knockout',
            'view-models/GeneralViewModel',
            'ojs/ojcore',
            'jquery', 'ojs/ojknockout', 'ojs/ojchart'
        ],
        function (ko, GeneralViewModel) {

            /**
             * The view model for the main content view template
             */
            function ChartModel(params) {
                var self = this;
                /* toggle button variables */
                self.stackValue = ko.observable('off');
                self.orientationValue = ko.observable('vertical');
                
                let years = params.goals.reduce(
                    (hash, goal) => {
                        if (!hash[goal.date.getFullYear()]) {
                            hash[goal.date.getFullYear()] = {goals: [], progress: []};
                        }
                        
                        hash[goal.date.getFullYear()]["goals"].push(goal);
                        
                        return hash;
                    },
                    {}
                );
        
                years = params.progress.reduce(
                    (hash, progress) => {
                        if (!hash[progress.date.getFullYear()]) {
                            hash[progress.date.getFullYear()] = {goals: [], progress: []};
                        }
                        
                        hash[progress.date.getFullYear()]["progress"].push(progress);
                        
                        return hash;
                    },
                    years
                );
                
                const comboGroups = Object.keys(years);
                const progressValues = [];
                const goalsValues = [];
                
                comboGroups.forEach(
                    year => {
                        if (years[year].goals.length > 0) {
                            goalsValues.push(years[year].goals[years[year].goals.length - 1]);
                        } else {
                            goalsValues.push(0);
                        }
                
                        if (years[year].progress.length > 0) {
                            progressValues.push(years[year].progress[years[year].progress.length - 1]);
                        } else {
                            progressValues.push(0);
                        }
                    }
                );
        
                /* chart data */
                const comboSeries = [
                    {name: GeneralViewModel.nls("pide.progress"), items: progressValues},
                    {name: GeneralViewModel.nls("pide.goals"), items: goalsValues}
                ];

                self.comboSeriesValue = ko.observableArray(comboSeries);

                self.comboGroupsValue = ko.observableArray(comboGroups);


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
        }
);