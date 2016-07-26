define(['knockout', 'view-models/GeneralViewModel',
    'view-models/events/EventTypes',
    'models/control-panel/PlanElementTypes',
    'ojs/ojcore', 'ojs/ojknockout', 'ojs/ojsunburst'],
        function (ko, GeneralViewModel, EventTypes, PlanElementTypes) {
            var theKey = {};
            function SunburstViewModel(controlPanelModel) {
                var self = this;
                var privateData = {
                    planElementsArray: controlPanelModel.getPlanElementsArray(),
                    planElementsMap: undefined
                };

                privateData.planElementsMap = parsePlanElementsArray(privateData.planElementsArray);

                this.SunburstViewModel_ = function (key) {
                    if (theKey === key) {
                        return privateData;
                    }
                };

                self.nodeValues = ko.observableArray([self.getMainNode()]);

                self.clickHandler = function (ui, data) {
                    if (data.option === "selection") {
                        var id = data.value[0];

                        self.onClick(privateData.planElementsArray[id]);
                    }
                };
            }

            SunburstViewModel.prototype = Object.create(GeneralViewModel);
            var prototype = SunburstViewModel.prototype;

            prototype.addClickListener = function (listener) {
                this.addListener(listener, EventTypes.CLICK_EVENT);
            };

            prototype.onClick = function (id) {
                this.callListeners(EventTypes.CLICK_EVENT, id);
            };

            prototype.getMainNode = function () {
                return this.SunburstViewModel_(theKey).planElementsMap[0];
            };

            function parsePlanElementsArray(planElementsArray) {
                var id = 0;
                var nodesMap = {};
                var visionObject = planElementsArray[0];
                
                var textId = id.toString();
                nodesMap[textId] = createNode(textId, visionObject, 360);
                id ++;

                for (var i = 1; i < planElementsArray.length; i++, id++) {
                    var planElement = planElementsArray[i];
                    var parentElement = planElement.getParent();
                    var sibilings = parentElement.getChildren().length;
                    textId = id.toString();
                    
                    nodesMap[textId] = createNode(textId, planElement, sibilings);
                }

                for (var id in nodesMap) {
                    addChildNodes(id, planElementsArray, nodesMap);
                }

                return nodesMap;
            }

            function createNode(id, planElement, length) {
                
                var progress = planElement.getProgress();
                var shortDesc = "&lt;b&gt;" + planElement.getName() + "&lt;/b&gt;";
                
                if (planElement.getType() === PlanElementTypes.INDICATOR) {
                    var goalPlusAchieve = "&lt;br/&gt;" + "Meta: " + planElement.getGoal() + 
                            "&lt;br/&gt;" + "Avance: " + planElement.getAchieve();
                    shortDesc += goalPlusAchieve;
                }
                
                progress *= 100;
                progress = Math.round(progress);
                
                var color = getColor(progress);
                var progressDesc = "&lt;br/&gt;Progreso: " + progress + "%";
                shortDesc += progressDesc;
                
                return {
                    id: id,
                    label: planElement.getLabel(),
                    value: 360 / length,
                    color: color,
                    borderWidth: 2,
                    shortDesc: shortDesc 
                };
            }

            /**
             * 
             * @param {type} parent
             * @param {type} childNodes
             * @returns {undefined}
             */
            function addChildNodes(id, planElementsArray, nodesMap) {
                var planElement = planElementsArray[id];
                var children = planElement.getChildren();
                var node = nodesMap[id];

                node.nodes = [];

                if (children) {
                    var nodes = node.nodes;
                    var childrenLength = children.length;

                    for (var i = 0; i < childrenLength; i++) {
                        nodes.push(nodesMap[planElementsArray.indexOf(children[i])]);
                    }
                }
            }

            /**
             * 
             * @param {type} achieve
             * @returns {String}
             */
            function getColor(progress) {
                if (progress >= 90) {
                    return "#31B404";
                } else if (progress >= 60) {
                    return "#D7DF01";
                } else if (progress >= 40) {
                    return "#FE9A2E";
                } else {
                    return "#DF0101";
                }
            }
            return SunburstViewModel;
        }
);
