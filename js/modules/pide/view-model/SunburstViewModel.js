define(
        [
            'jquery', 'knockout', 'view-models/GeneralViewModel',
            'events/EventTypes',
            'modules/pide/model/PlanElementCalculated',
            'modules/pide/model/PlanElementMeasurable',
            'modules/pide/model/PlanElementTypes',
            'ojs/ojcore', 'ojs/ojknockout', 'ojs/ojsunburst'
        ],
        function ($, ko, GeneralViewModel, EventTypes, 
            PlanElementCalculated, PlanElementMeasurable, PlanElementTypes) {
            var theKey = {};
            function SunburstViewModel(prefix, controlPanelModel) {
                var self = this;
                var privateData = {
                    controlPanelModel: controlPanelModel,
                    planElementsMap: undefined,
                    selectedPlanElementId: undefined
                };

                privateData.planElementsMap =
                        parsePlanElementsArray(controlPanelModel);

                this.SunburstViewModel_ = function (key) {
                    if (theKey === key) {
                        return privateData;
                    }
                };

                self.id = prefix + "_sunburst";
                self.nodeValues = ko.observableArray([self.getMainNode()]);
                self.selection = ko.observableArray();

                self.clickHandler = function (ui, data) {
                    if (data.option === "selection") {
                        if (data.value.length > 0) {
                            var id = data.value[0];
                            self.onClick(self.getControlPanelModel().getData()[id]);
                        }
                    }
                };
            }

            SunburstViewModel.prototype = Object.create(GeneralViewModel);
            var prototype = SunburstViewModel.prototype;

            prototype.getControlPanelModel = function () {
                return this.SunburstViewModel_(theKey).controlPanelModel;
            };

            prototype.addClickListener = function (listener) {
                this.addListener(listener, EventTypes.CLICK_EVENT);
            };

            prototype.onClick = function (planElement) {
                this.callListeners(EventTypes.CLICK_EVENT, planElement);
                updateSiblingsNodes.call(this, planElement, this.getPlanElementsMap(), this.getControlPanelModel());
                this.selection([]);
            };

            prototype.getPlanElementsArray = function () {
                return this.SunburstViewModel_(theKey).planElementsArray;
            };

            prototype.getPlanElementsMap = function () {
                return this.SunburstViewModel_(theKey).planElementsMap;
            };

            prototype.setSelectedItem = function (selectedPlanElement) {
                this.selection([selectedPlanElement.getId()]);
            };

            prototype.getMainNode = function () {
                let mainElement = this.getControlPanelModel().getElementsByType(PlanElementTypes.VISION)[0];
                return this.SunburstViewModel_(theKey).planElementsMap[mainElement.getId()];
            };

            function updateSiblingsNodes(planElement, planElementsMap) {
                var planElementParent = planElement.getParent();

                if (planElementParent) {
                    var planElementNodeToKeep = planElementsMap[planElement.getId()];
                    var planElementParentNode = planElementsMap[planElementParent.getId()];

                    updateChildrenNodes(planElementParentNode, planElementNodeToKeep);
                } else {
                    for (var nodeId in planElementsMap) {
                        showChildrenNodes(planElementsMap[nodeId]);
                    }
                }

                $("#" + this.id).ojSunburst("refresh");
            }

            function updateChildrenNodes(planElementParentNode, planElementNodeToKeep) {
                if (planElementParentNode.hiddenNodes.length > 0) {
                    showChildrenNodes(planElementParentNode);
                } else {
                    hideChildrenNodes(planElementParentNode, planElementNodeToKeep);
                }
            }

            function showChildrenNodes(planElementNode) {
                if (planElementNode.hiddenNodes.length > 0) {
                    var nodes = planElementNode.nodes;
                    planElementNode.hiddenNodes.push(nodes[0]);
                    planElementNode.nodes = planElementNode.hiddenNodes;

                    nodes.splice(0, 1);
                    planElementNode.hiddenNodes = nodes;
                }
            }

            function hideChildrenNodes(planElementNode, planElementNodeToKeep) {
                var nodes = planElementNode.nodes;
                var indexToKeep = nodes.indexOf(planElementNodeToKeep);
                planElementNode.hiddenNodes = nodes;

                planElementNode.nodes = planElementNode.hiddenNodes.splice(indexToKeep, 1);
            }

            function parsePlanElementsArray(controlPanelModel) {
                const nodesMap = {};
                const visionObject = controlPanelModel.getElementsByType(PlanElementTypes.VISION)[0];
                const planElementsMap = controlPanelModel.getData();

                nodesMap[visionObject.getId()] = createNode(visionObject, 360);

                for (let prop in planElementsMap) {
                    let planElement = planElementsMap[prop];
                    
                    if (planElement !== visionObject) {
                        if (planElement instanceof PlanElementCalculated) {
                            let parentElement = planElement.getParent();
                            let sibilings = parentElement.getChildren(PlanElementCalculated).length;

                            nodesMap[planElement.getId()] = createNode(planElement, sibilings);
                        }
                    }
                }

                for (let p in nodesMap) {
                    addChildNodes(p, controlPanelModel.getData(), nodesMap);
                }

                return nodesMap;
            }

            function createNode(planElement, length) {

                var progress = planElement.getProgress();
                var shortDesc = "&lt;b&gt;" + planElement.getName() + "&lt;/b&gt;";

                if (planElement instanceof PlanElementMeasurable) {
                    var goalPlusAchieve = "&lt;br/&gt;" + "Meta: " + planElement.getGoal() +
                            "&lt;br/&gt;" + "Avance: " + planElement.getAchieve();
                    shortDesc += goalPlusAchieve;
                }

                progress *= 100;
                progress = Math.round(progress);
                
                if (isNaN(progress)) {
                    progress = 0;
                }

                var color = getColor(progress, planElement instanceof PlanElementMeasurable ? planElement.getGrades() : null);
                var progressDesc = "&lt;br/&gt;Progreso: " + progress + "%";

                shortDesc += progressDesc;
                
                var responsiblesDesc;
                var responsibles = planElement.getResponsibles();
                
                if (responsibles) {
                    responsiblesDesc = "&lt;br/&gt;Responsable:&lt;br/&gt;";
                    responsiblesDesc += "&lt;table style='width:100%;margin:2px' border='1'&gt;";
                    responsiblesDesc += "&lt;tr&gt;";
                    responsiblesDesc += "&lt;td style='text-align:center'&gt;";
                    responsiblesDesc += "&lt;b&gt;";
                    responsiblesDesc += "Persona";
                    responsiblesDesc += "&lt;/b&gt;";
                    responsiblesDesc += "&lt;/td&gt;";
                    responsiblesDesc += "&lt;td style='text-align:center'&gt;";
                    responsiblesDesc += "&lt;b&gt;";
                    responsiblesDesc += "Area";
                    responsiblesDesc += "&lt;/b&gt;";
                    responsiblesDesc += "&lt;/td&gt;";
                    responsiblesDesc += "&lt;td style='text-align:center'&gt;";
                    responsiblesDesc += "&lt;b&gt;";
                    responsiblesDesc += "Puesto";
                    responsiblesDesc += "&lt;/b&gt;";
                    responsiblesDesc += "&lt;/td&gt;";
                    responsiblesDesc += "&lt;/tr&gt;";
                    
                    responsiblesDesc += "&lt;tr&gt;";
                    responsiblesDesc += "&lt;td&gt;";
                    responsiblesDesc += responsibles['player']['name'];
                    responsiblesDesc += "&lt;/td&gt;";
                    responsiblesDesc += "&lt;td&gt;";
                    responsiblesDesc += responsibles['area']['name'];
                    responsiblesDesc += "&lt;/td&gt;";
                    responsiblesDesc += "&lt;td&gt;";
                    responsiblesDesc += responsibles['jobTitle']['name'];
                    responsiblesDesc += "&lt;/td&gt;";
                    responsiblesDesc += "&lt;/tr&gt;";
                    
                    responsiblesDesc += "&lt;/table&gt;";
                    shortDesc += responsiblesDesc;
                }
                

                return {
                    id: planElement.getId(),
                    label: planElement.getLabel(),
                    value: 360 / length,
                    color,
                    borderWidth: 2,
                    shortDesc
                };
            }

            /**
             * 
             * @param {type} id
             * @param {type} planElementsArray
             * @param {type} nodesMap
             * @returns {undefined}
             */
            function addChildNodes(id, planElementsMap, nodesMap) {
                let planElement = planElementsMap[id];
                let children = planElement.getChildren(PlanElementCalculated);
                let node = nodesMap[id];

                node.nodes = [];
                node.hiddenNodes = [];

                if (children) {
                    let nodes = node.nodes;
                    let childrenLength = children.length;

                    for (let i = 0; i < childrenLength; i++) {
                        let child = children[i];
                        nodes.push(nodesMap[child.getId()]);
                    }
                }
            }

            /**
             * 
             * @param {type} achieve
             * @returns {String}
             */
            function getColor(progress, grades) {
                const colorGrades = {
                        green: {
                            maxPercentage: 100,
                            color: '#31B404'
                        }, 
                        yellow: {
                          maxPercentage: 90,
                          color: '#D7DF01'
                        },
                        orange: {
                            maxPercentage: 60,
                            color: '#FE9A2E'
                        },
                        red: {
                            maxPercentage: 40,
                            color: '#DF0101'
                        },
                        white: {
                            color: '#FFFFFF'
                        }
                    };
                
                if (grades) {
                    grades.forEach(
                        g => {
                            colorGrades[g['color']]['maxPercentage'] = g['maxPercentage'];
                        }
                    );
                }
                
                const colorNames = ['green', 'yellow', 'orange', 'red'];
                
                for (let i = 1; i < colorNames.length; i ++) {
                    if (progress >= colorGrades[colorNames[i]].maxPercentage) {
                        return colorGrades[colorNames[i - 1]].color;
                    }
                }
                
                return colorGrades['red'].color;;
            }
            return SunburstViewModel;
        }
);
