define(['jquery', 'knockout', 'ojs/ojcore', 'ojs/ojtimeline'],
        function ($, ko) {
            function ProjectsViewModel() {
                var self = this;
                var defaultData = { 
                    id: 's1',
                    emptyText: 'No Data.',
                    items: null,
                    label: 'Oracle Events'
                };
                
                self.series = ko.observableArray();
                self.startDate = ko.observable(new Date('Jan 1, 2016').toISOString());
                self.endDate = ko.observable(new Date('Dec 31, 2016').toISOString());
                
                $.getJSON("data/projects.json",
                        function (data) {
                            defaultData.items = data;
                            self.series([defaultData]);
                        }
                );
            }

            return ProjectsViewModel;
        }
);