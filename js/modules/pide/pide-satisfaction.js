define(
        [
            'knockout',
            'data/AjaxUtils',
            'data/DataProvider',
            'data/RESTConfig',
            'modules/pide/view-model/SunburstViewModel',
            'modules/pide/model/PIDEModel',
            'modules/pide/model/PIDEDataParser',
            'modules/pide/view-model/DetailsViewModel',
            'modules/pide/model/PlanElementMeasurable',
            'modules/pide/model/PlanElementTypes',
            'view-models/GeneralViewModel'
        ],
        function (
                ko, AjaxUtils, DataProvider, RESTConfig, 
                SunburstViewModel, PIDEModel,
                 PIDEDataParser, DetailsViewModel,
                 PlanElementMeasurable,
                 PlanElementTypes,
                 GeneralViewModel
            ) {
            function PIDESatisfactionViewModel() {
                const self = this;
                const controlPanelDataProvider =
                        new DataProvider(
                                RESTConfig.admin.strategic.path,
//                                "data/pide.json",
                                PIDEDataParser);

                const dataPromise = controlPanelDataProvider.fetchData();
                self.observableSunburst = ko.observable();
                self.observableDetails = ko.observable();
                self.sunburstTitle = GeneralViewModel.nls("controlPanel.sunburst.title");
                self.detailsTitle = GeneralViewModel.nls("controlPanel.details.title");
                
                dataPromise.then(
                    () => {
                        const pideModel = new PIDEModel(controlPanelDataProvider);
                        updateSunburst(pideModel)
                        .then(
                            sunburst => {
                                self.observableSunburst(sunburst);
                                sunburst.addDataListener(date => updateSunburst(pideModel, date, sunburst))
                            }
                        );
                    }
                );
                
                function updateSunburst(pideModel, date, sunburst) {
                    let url = RESTConfig.indicators.pide.active.path;

                    if (date) {
                        url = `${url}?date=${date}`;
                    }
                    
                    const indicatorsPromise = AjaxUtils.ajax(url);
//                            const indicatorsPromise = AjaxUtils.ajax("data/sunburst-utj.json");
                            
                    return indicatorsPromise.then(
                        indicators => new Promise(
                            resolve => {
                                pideModel.cleanIndicators();
                                const strategicMap = pideModel.getData();

                                indicators.forEach(
                                    i => {
                                        const goals = i.achievements.filter(a => a.achievementType === 'GOAL');
                                        const progresses = i.achievements.filter(a => a.achievementType === 'PROGRESS');

                                        let latestGoal = goals[0];
                                        let latestProgress = progresses[0];

                                        let firstGoal = goals[0];

                                        goals.forEach(
                                          g => {
                                            if (latestGoal.date.time < g.date.time) {
                                                latestGoal = g;
                                            }

                                            if (firstGoal.date.time > g.date.time) {
                                                firstGoal = g;
                                            }
                                          }
                                        );

                                        progresses.forEach(
                                          p => {
                                            if (latestProgress.date.time < p.date.time) {
                                                latestProgress = p;
                                            }
                                          }
                                        );

                                        if (latestProgress && latestGoal) {
                                            const indicator = new PlanElementMeasurable(
                                                    `i_${i.id}`,
                                                    PlanElementTypes.INDICATOR,
                                                    i.name,
                                                    i.name,
                                                    latestGoal.data,
                                                    latestProgress.data,
                                                    strategicMap[i.strategicItem],
                                                    null,
                                                    i.responsible,
                                                    i.grades,
                                                    i.direction
                                            );

                                            if (strategicMap[i.strategicItem]) {
                                                strategicMap[i.strategicItem].getChildren().push(indicator);
                                                strategicMap[`i_${i.id}`] = indicator;
                                            }
                                        }
                                    }
                                );
                                
                                if (sunburst) {
                                    sunburst.refresh();
                                    self.details.refresh();
                                } else {
                                    sunburst = new SunburstViewModel("control_panel", 
                                            pideModel); 
                                    self.sunburst = sunburst;
                                    sunburst.addClickListener(handleSunburstClick);
                                    self.details = new DetailsViewModel(pideModel);
                                    self.details.addSelectionListener(handleDetailsSelection);
                                    self.observableDetails(self.details);                                    
                                }

                                resolve(sunburst);
                            }
                        )
                    );                    
                }
                
                /**
                 * Callback function for click event on Details panel.
                 * 
                 * @param {PlanElementCalculated} planElement The object from
                 * the model with the info for the clicked view element.
                 */
                function handleSunburstClick(planElement) {
                    self.details.setSelectedItem(planElement);
                }

                /**
                 * Callback function for click event on Sunburst graphic.
                 * 
                 * @param {PlanElementCalculated} planElement The object from
                 * the model with the info for the clicked view element.
                 */
                function handleDetailsSelection(planElement) {
                    self.sunburst.setSelectedItem(planElement);
                }
            }

            return PIDESatisfactionViewModel;
        }
);