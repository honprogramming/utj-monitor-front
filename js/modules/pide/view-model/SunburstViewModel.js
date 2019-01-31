define(
        [
            'ojs/ojcore', 'jquery', 'knockout', 'view-models/GeneralViewModel',
            'events/EventTypes',
            'modules/pide/model/PlanElementCalculated',
            'modules/pide/model/PlanElementMeasurable',
            'modules/pide/model/PlanElementTypes',
            'utils/Colors',
            'ojs/ojknockout', 'ojs/ojsunburst', 'ojs/ojdatetimepicker'
        ],
        function (oj, $, ko, GeneralViewModel, EventTypes, 
                PlanElementCalculated, PlanElementMeasurable, PlanElementTypes,
                Colors) {
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
                self.dateConverter = GeneralViewModel.converters.date;
                self.minDate = oj.IntlConverterUtils.dateToLocalIso(new Date(2010, 0, 01));
                self.maxDate = oj.IntlConverterUtils.dateToLocalIso(new Date());
                self.rangeOverflowSummary = "La fecha es mayor a la máxima permitida";
                self.rangeOverflowDetail = "La fecha debe ser menor o igual a " + self.dateConverter.format(self.maxDate);
                self.rangeUnderflowSummary = "La fecha es menor a la mínima permitida";
                self.rangeUnderflowDetail = "La fecha debe ser mayor o igual a " + self.dateConverter.format(self.minDate);
                self.dateValue = ko.observable(oj.IntlConverterUtils.dateToLocalIso(new Date()));
                
                self.clickHandler = function (ui, data) {
                    if (data.option === "selection") {
                        if (data.value.length > 0) {
                            var id = data.value[0];
                            self.onClick(self.getControlPanelModel().getData()[id]);
                        }
                    }
                };
                
                self.dateSelectionHandler = function(ui, data) {
                    if (data.option === "value") {
                        if (data.value.length > 0) {
                            const date = new Date(data.value);
                            self.onDateChange(date.getTime());
                        }
                    }                    
                };
            }
            
            SunburstViewModel.prototype = Object.create(GeneralViewModel);
            var prototype = SunburstViewModel.prototype;
            
            SunburstViewModel.directions = {
                POSITIVE: GeneralViewModel.nls("pide.POSITIVE"),
                NEGATIVE: GeneralViewModel.nls("pide.NEGATIVE")
            };
            
            prototype.getControlPanelModel = function () {
                return this.SunburstViewModel_(theKey).controlPanelModel;
            };
            
            prototype.refresh = function() {
                this.setPlanElementsMap(parsePlanElementsArray(this.getControlPanelModel()));
                this.nodeValues([this.getMainNode()]);
            };
            
            prototype.getDirections = function () {
                return this.SunburstViewModel_(theKey).directions;
            };

            prototype.addClickListener = function (listener) {
                this.addListener(listener, EventTypes.CLICK_EVENT);
            };
            
            prototype.addDataListener = function(listener) {
                this.addListener(listener, EventTypes.DATA_EVENT);
            };
            
            prototype.onClick = function (planElement) {
                this.callListeners(EventTypes.CLICK_EVENT, planElement);
                updateSiblingsNodes.call(this, planElement, this.getPlanElementsMap(), this.getControlPanelModel());
                this.selection([]);
            };
            
            prototype.onDateChange = function(date) {
                this.callListeners(EventTypes.DATA_EVENT, date);
            };
            
            prototype.getPlanElementsArray = function () {
                return this.SunburstViewModel_(theKey).planElementsArray;
            };

            prototype.getPlanElementsMap = function () {
                return this.SunburstViewModel_(theKey).planElementsMap;
            };
            
            prototype.setPlanElementsMap = function (map) {
                this.SunburstViewModel_(theKey).planElementsMap = map;
            };

            prototype.setSelectedItem = function (selectedPlanElement) {
                this.selection([selectedPlanElement.getId()]);
            };

            prototype.getMainNode = function () {
                const mainElement = this.getControlPanelModel().getElementsByType(PlanElementTypes.VISION)[0];
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
                    const goalPlusAchieve = "&lt;br/&gt;" + "Meta: " + planElement.getGoal() +
                            "&lt;br/&gt;" + "Avance: " + planElement.getAchieve();                            
                    shortDesc += goalPlusAchieve;
                }

                progress *= 100;
                progress = Math.round(progress);
                
                if (isNaN(progress)) {
                    progress = 0;
                }

//                var color = getColor(progress, planElement instanceof PlanElementMeasurable ? planElement.getGrades() : null);
                var color = Colors.getProgressColor(progress, planElement instanceof PlanElementMeasurable ? planElement.getGrades() : null);
                var progressDesc = "&lt;br/&gt;Progreso: " + progress + "%";

                shortDesc += progressDesc;
                
                if (planElement instanceof PlanElementMeasurable) {
                    shortDesc += "&lt;br/&gt;" + "Sentido: " + SunburstViewModel.directions[planElement.getDirection()];
                }
                
                var responsiblesDesc;
                var responsibles = planElement.getResponsibles();
                
                if (responsibles) {
                    responsiblesDesc = "&lt;br/&gt;Responsable:&lt;br/&gt;";
                    responsiblesDesc += "&lt;table style='width:100%;margin:2px' border='1'&gt;";
                    responsiblesDesc += "&lt;tr&gt;";
//                    responsiblesDesc += "&lt;td style='text-align:center'&gt;";
//                    responsiblesDesc += "&lt;b&gt;";
//                    responsiblesDesc += "Persona";
//                    responsiblesDesc += "&lt;/b&gt;";
//                    responsiblesDesc += "&lt;/td&gt;";
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
//                    responsiblesDesc += "&lt;td&gt;";
//                    responsiblesDesc += responsibles['player']['name'];
//                    responsiblesDesc += "&lt;/td&gt;";
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

            return SunburstViewModel;
        }
);
