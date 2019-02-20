/**
 * Parses the data in order to populate the ControlPanelModel.
 * 
 * @param {Function} PlanElement The parent class of all plan elements.
 * @param {Function} PlanElementCalculated A plan element class which some of their values
 * are calculated based on its children values.
 * @param {Object} PlanElementTypes An Object with constants defining the
 * different types of plan elements.
 * @param {Object} StrategicTypes An Object with constants defining the
 * different types of strategic elements.
 * @returns {Object} The parser for the Control Panel Model.
 */
define(
  [
    'modules/pide/model/PlanElement',
    'modules/pide/model/PlanElementCalculated',
    'modules/pide/model/PlanElementTypes',
    'modules/admin/strategic/model/StrategicTypes'
  ],
  function (PlanElement, PlanElementCalculated, PlanElementTypes, StrategicTypes) {
    return {
      /**
       * Parses the data from JSON format into an Array of
       * PlanElementCalculated and PlanElementMeasurable objects.
       * 
       * @param {Object} data An Object in JSON format with the data
       * to parse.
       * @returns {Array} An Array containing PlanElementCalculated 
       * and PlanElementMeasurable objects.
       */
      parse: function (data) {
        function getVision(data) {
          const isVision = item => item.strategicType.name === StrategicTypes.VISION.name;
          if (Array.isArray(data)) {
            return data.filter(isVision)[0];
          } else {
            if (isVision(data)) {
              return data;
            } else {
              throw 'Vision element not found, cannot parse';
            }
          }
        }

        const visionObject = getVision(data);
        const planElements = [];
        const visionElement = new PlanElementCalculated(
            visionObject['id'],
            PlanElementTypes.VISION, 'Visión',
            visionObject['name'], null, []);

        planElements.push(visionElement);

        var axesArray = visionObject['children'];

        for (var i = 0; i < axesArray.length; i++) {
          const axeObject = axesArray[i];
          if (axeObject['name'].match(/eje 7/i)) {
            continue;
          }
          
          const axeElement = new PlanElementCalculated(
              axeObject['id'],
              PlanElementTypes.AXE, axeObject['name'],
              axeObject['name'], visionElement, []/*, axeObject['responsibles']*/);

          visionElement.getChildren().push(axeElement);
          planElements.push(axeElement);

          const themesArray = axeObject['children'];
          for (var j = 0; j < themesArray.length; j++) {
            const themeObject = themesArray[j];
            const themeElement = new PlanElement(
                themeObject['id'],
                PlanElementTypes.THEME, themeObject['name'],
                themeObject['name'], axeElement, []);

//                            axeElement.getChildren().push(themeElement);
//                            planElements.push(themeElement);

            const objectivesArray = themeObject['children'];
            for (var k = 0; k < objectivesArray.length; k++) {
              const objectiveObject = objectivesArray[k];
              const objectiveElement = new PlanElementCalculated(
                  objectiveObject['id'],
                  PlanElementTypes.OBJECTIVE, objectiveObject['name'],
                  objectiveObject['name'], axeElement, []/*,
                   objectiveObject['responsibles']*/);

//                                themeElement.getChildren().push(objectiveElement);
              axeElement.getChildren().push(objectiveElement);
              planElements.push(objectiveElement);

//                                var indicatorsArray = objectiveObject[PlanElementTypes.INDICATORS];
//                                for (var z = 0; z < indicatorsArray.length; z++) {
//                                    var indicatorObject = indicatorsArray[z];
//                                    var indicatorElement = new PlanElementMeasurable(
//                                            PlanElementTypes.INDICATOR, indicatorObject['label'],
//                                            indicatorObject['name'], indicatorObject['goal'],
//                                            indicatorObject['achieve'], objectiveElement, null,
//                                            indicatorObject['responsibles']);
//
//                                    objectiveElement.getChildren().push(indicatorElement);
//                                    planElements.push(indicatorElement);
//                                }

//                                var strategiesArray = objectiveObject[PlanElementTypes.STRATEGIES];
//                                for (var s = 0; s < strategiesArray.length; s++) {
//                                    var strategyObject = strategiesArray[s];
//                                    var strategyElement = new PlanElement(
//                                            PlanElementTypes.STRATEGY, strategyObject['label'],
//                                            strategyObject['name'], objectiveElement, null
//                                            );
//
//                                    objectiveElement.getChildren().push(strategyElement);
//                                }
            }
          }
        }

        return planElements;
      }
    };
  }
);