/**
 * Parses the data in order to populate the ControlPanelModel.
 * 
 * @param {Object} Area
 * @param {Object} Responsible
 * @returns {Object} The parser for the .
 */
define(
        [
            'modules/performance/model/Area',
            'modules/performance/model/Responsible'
        ],
        function (Area, Responsible) {
            let elementsMap = {};
            var PerformanceDataParser = {
                /**
                 * Parses the data from JSON format into an Array of
                 * PlanElementCalculated and PlanElementMeasurable objects.
                 * 
                 * @param {Object} data An Object in JSON format with the data
                 * to parse.
                 * @returns {Array} An Array containing PlanElementCalculated 
                 * and PlanElementMeasurable objects.
                 */
                parseMap: function (data) {
                    let utjArea = new Area("utj", "Universidad Tecnológica de Jalisco", null, [], null);
                    elementsMap[utjArea.getId()] = utjArea;
                    
                    for (let i = 0; i < data.length; i ++) {
                        let area = this.createArea(data[i], utjArea);
                        
                        utjArea.getChildren().push(area);
                        elementsMap[area.getId()] = area;
                    }
                    
                    return elementsMap;
                },
                createArea: function(target, parent) {
                    let area = new Area(target.attr.id, target.title, parent, [], []);
                    
                    target.children.forEach(
                            child => {
                                if (child.attr.type === "area") {
                                    let childArea = this.createArea(child, area);
                                    area.getChildren().push(childArea);
                                    elementsMap[area.getId()] = childArea;
                                } else if (child.attr.type === "responsible") {
                                    let childResponsible = this.createResponsible(child, area);
                                    area.getResponsibles().push(childResponsible);
                                    elementsMap[childResponsible.getId()] = childResponsible;
                                }
                            }
                        );
                    
                    return area;
                },
                createResponsible: function(target, parent) {
                    return new Responsible(target.attr.id, target.title, parent);
                }
            };

            return PerformanceDataParser;
        }
);