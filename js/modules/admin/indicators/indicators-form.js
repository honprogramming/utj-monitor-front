define(
    [
      'ojs/ojcore',
      'jquery',
      'knockout',
      'view-models/GeneralViewModel',
      'data/RESTConfig',
      'data/AjaxUtils',
      'data/DataProvider',
      'modules/admin/strategic/model/StrategicModel',
      'modules/admin/strategic/model/StrategicTypes',
      'modules/admin/strategic/model/StrategicDataParser',
      'modules/admin/indicators/model/IndicatorDataParser',
      'modules/admin/pe/model/PEDataParser',
      'modules/admin/indicators/model/FullIndicator',
//      'modules/admin/indicators/model/ComponentItem',
      'ojs/ojknockout',
      'ojs/ojradioset',
      'ojs/ojswitch',
      'ojs/ojcollapsible',
      'ojs/ojinputtext',
      'ojs/ojselectcombobox',
      'ojs/ojdatetimepicker',
      'ojs/ojinputnumber',
      'ojs/ojchart',
      'ojs/ojtable',
      'ojs/ojarraytabledatasource',
      'promise'
    ],
    function (oj, $, ko, GeneralViewModel, RESTConfig, AjaxUtils, DataProvider,
        StrategicModel, StrategicTypes,
        StrategicDataParser, IndicatorDataParser, PEDataParser,
        FullIndicator
        /*ComponentItem*/) {
      /**
       * Indicators Form ViewModel.
       */
      function FormViewModel(params) {
        const self = this;

        // Date converter
        const dateOptions = {formatStyle: 'date', pattern: 'dd/MM/yyyy'};
        let saveDialogClass;

        // Sections enabled
        self.generalEnable = ko.observable(false);
        self.responsibleEnable = ko.observable(false);
        self.metadataEnable = ko.observable(false);
        self.progressTableId = 'progress-table';

        self.saveDialogId = "indicator-form-save-dialog";
        self.saveDialogTitle = GeneralViewModel.nls("admin.indicators.main.dialogs.save.title");
        self.saveMessage = ko.observable();
        self.resetDialogId = "indicator-form-reset-dialog";
        self.resetDialogTitle = GeneralViewModel.nls("admin.indicators.main.dialogs.reset.title");
        self.resetMessage = ko.observable();
        
        self.clickOkHandler = function () {
          const resetDialog = $("#" + self.resetDialogId);
          resetDialog.ojDialog("close");
          initializeForm();
        };
        self.resetDialogOkButtonLabel = GeneralViewModel.nls("admin.indicators.main.dialogs.reset.okButton");
        
        self.clickCancelHandler = function () {
          const resetDialog = $("#" + self.resetDialogId);
          resetDialog.ojDialog("close");
        };
        self.resetDialogCancelButtonLabel = GeneralViewModel.nls("admin.indicators.main.dialogs.reset.cancelButton");
        
        self.saveForm = function () {
          const indicator = new FullIndicator(params.id, self.nameValue(), self.typeValue());
          populateIndicator(indicator);

          let path = RESTConfig.admin.indicators.path;
          const method = indicator.getId() ? "PUT" : "POST";

          path += indicator.getId() ? "/" + params.id : "";

          function successFunction(data) {
            self.saveMessage(GeneralViewModel.nls("admin.strategic.saveDialog.success"));
            saveDialogClass = "success";

            if (data) {
              indicator.setId(data.id);
              params.id = data.id;
            }
          }

          function errorFunction(jqXHR, textStatus, errMsg) {
            const message = errMsg.length > 0 ? errMsg : jqXHR.responseText;
            self.saveMessage(GeneralViewModel.nls("admin.strategic.saveDialog.error") + message);
            saveDialogClass = "error";
          }
          
          const bodyData = Object.assign({...indicator},
            {
              access_token: localStorage.getItem('access_token'),
              user_id: localStorage.getItem('user_id')
            }
          );
      
          const savePromise = AjaxUtils.ajax(path, method, bodyData, successFunction, errorFunction);

          savePromise.always(
            function () {
              self.showDialog();
            }
          );
        };
        
        self.resetForm = function () {
          const resetDialog = $("#" + self.resetDialogId);
          resetDialog.ojDialog("open");
        };
        
        self.switchToList = function () {
          params.switchFunction();
        };
        
        /*
         * Main section.
         */
        // Type option
        self.typeLabel = GeneralViewModel.nls("admin.indicators.form.sections.main.type");
        /**
         * Type change event.
         *
         * This function is triggered after selecting an option in
         * type's radioset.
         *
         * @param {*} event
         * @param {*} data
         */
        self.typeChange = function (event, data) {
          if (data.option === 'value') {
            switch (data.value) {
              case "1":
                self.generalEnable(false);
                self.responsibleEnable(false);
                self.metadataEnable(false);
                setGradesToDefaultValues();
                self.isGlobal(false);
                break;

              case "2":
                self.generalEnable(false);
                self.responsibleEnable(true);
                self.metadataEnable(false);
                self.isGlobal(false);
                break;

              case "3":
                self.generalEnable(false);
                self.responsibleEnable(true);
                self.metadataEnable(false);
                break;
            }
          }
        };
        
        self.typeValue = ko.observable('1');

        // Active/Inactive option
        self.activeLabel = GeneralViewModel.nls("admin.indicators.form.sections.main.active");
        self.activeValue = ko.observable(true);
        
        self.globalLabel = GeneralViewModel.nls("admin.indicators.form.sections.main.global");
        self.displayGlobal = ko.pureComputed(() => self.typeValue() === '3'); //PE
        self.isGlobal = ko.observable(false);
        
        self.generalSectionExpanded = ko.observable(true);
        self.generalTitle = GeneralViewModel.nls("admin.indicators.form.sections.general.title");
        self.peIndicatorsLabel = GeneralViewModel.nls("admin.indicators.form.sections.general.indicators");
        self.peIndicatorsOptions = ko.observableArray([]);
        self.peIndicatorsValue = ko.observable("");
        
        // ----- GENERAL-----
        // Name field
        self.nameLabel = GeneralViewModel.nls("admin.indicators.form.sections.general.name.label");
        self.namePlaceholder = GeneralViewModel.nls("admin.indicators.form.sections.general.name.placeholder");
        self.nameValue = ko.observable("");

        // Description field
        self.descriptionLabel = GeneralViewModel.nls("admin.indicators.form.sections.general.description.label");
        self.descriptionPlaceholder = GeneralViewModel.nls("admin.indicators.form.sections.general.description.placeholder");
        self.descriptionValue = ko.observable("");
        
        // Class field
        self.classLabel = GeneralViewModel.nls("admin.indicators.form.sections.general.class");
        self.classOptions = ko.observableArray(
          [
            {value: '1', label: 'Eficiencia'},
            {value: '2', label: 'Eficacia'},
            {value: '3', label: 'Pertinencia'},
            {value: '4', label: 'Equidad'},
            {value: '5', label: 'Vinculación'},
            {value: '6', label: 'Otros'}
          ]
        );
        self.classValue = ko.observable("");
        
        // PE type
        self.peTypeLabel = GeneralViewModel.nls("admin.indicators.form.sections.general.pe.typeLabel");
        self.peTypeOptions = ko.observableArray([]);
        self.peTypesChange = function (event, data) {
          if (data.option === "value") {
            self.peOptions(peTypesMap[self.peTypeValue()[0]]);
          }
        };
        self.peTypeValue = ko.observable("");
        
        // PE field
        self.peLabel = GeneralViewModel.nls("admin.indicators.form.sections.general.pe.label");
        self.peOptions = ko.observableArray([]);
        self.peChange = function (event, data) {
          if (data.option === "value") {
            const pe = peTypesMatrix[self.peTypeValue()[0]][self.peValue()[0]];
            self.shortNameValue(pe.shortName);
          } else if (data.option === "options") {
            const pes = peTypesMap[self.peTypeValue()[0]];
            
            if (!pes.some(pe => pe.value == self.peValue())) {
              self.peValue([pes[0]['value']]);
            }
          }
        };
        
        self.peValue = ko.observable("");
        
        // Short name field
        self.shortNameLabel = GeneralViewModel.nls("admin.indicators.form.sections.general.shortName.label");
        self.shortNamePlaceholder = GeneralViewModel.nls("admin.indicators.form.sections.general.shortName.placeholder");
        self.shortNameValue = ko.observable("");
        
        // Direction option
        self.directionLabel = GeneralViewModel.nls("admin.indicators.form.sections.general.direction");
        self.directionOptions = ko.observableArray(
          [
            {value: 'POSITIVE', label: 'Positivo'},
            {value: 'NEGATIVE', label: 'Negativo'}
          ]
        );
        
        self.directionValue = ko.observable('POSITIVE');
        
        // Unit of measurement field
        self.measureUnitLabel = GeneralViewModel.nls("admin.indicators.form.sections.general.measure.label");
        self.measureUnitOptions = ko.observableArray();
        const unitsPromise = $.getJSON(RESTConfig.catalogs.unitTypes.path).then(
          (types) => {
            self.measureUnitOptions(
              types.map(
                t => (
                  {
                    value: t.id,
                    label: GeneralViewModel.nls(`graphics.unit-types.${t.name}`)
                  }
                )
              )
            );
          }
        )
        .fail(
          () => {
            self.measureUnitOptions(
              [
                {value: 1, label: 'Numérico'},
                {value: 2, label: 'Porcentaje'},
                {value: 3, label: 'Ordinal'},
                {value: 4, label: 'Promedio'},
                {value: 5, label: 'Moneda'},
                {value: 6, label: 'Tiempo'}
              ]
            );
          }
        )
        .always(() => self.measureUnitValue([1]));
        self.measureUnitValue = ko.observable();

        // Base year field
        self.baseYearLabel = GeneralViewModel.nls("admin.indicators.form.sections.general.baseYear.label");
        self.baseYearPlaceholder = GeneralViewModel.nls("admin.indicators.form.sections.general.baseYear.placeholder");
        self.baseYearValue = ko.observable("");

        // Periodicity option
        self.periodicityLabel = GeneralViewModel.nls("admin.indicators.form.sections.general.periodicity");
        self.periodicityOptions = ko.observableArray([
          {value: '1', label: 'Mensual'},
          {value: '2', label: 'Cuatrimestral'},
          {value: '3', label: 'Semestral'},
          {value: '4', label: 'Anual'}
        ]);
        self.periodicityValue = ko.observable('1');

        // Reset option
        self.resetLabel = GeneralViewModel.nls("admin.indicators.form.sections.general.reset");
        self.resetOptions = ko.observableArray([
          {value: '1', label: 'Continuo'},
          {value: '2', label: 'Cuatrimestral'},
          {value: '3', label: 'Anual'}
        ]);
        self.resetValue = ko.observable('1');

        // Reset date field
        self.resetDateLabel = GeneralViewModel.nls("admin.indicators.form.sections.general.resetDates");
        self.dateConverter = oj.Validation.converterFactory("datetime").createConverter(dateOptions);
        self.resetDateValues = [];

        for (let i = 0; i < 3; i++) {
          self.resetDateValues.push(ko.observable(oj.IntlConverterUtils.dateToLocalIso(new Date())));
        }
        
        // ----- ALIGNMENT -----
        self.alignmentSectionExpanded = ko.observable(false);
        // PIDE table
        self.alignmentTitle = GeneralViewModel.nls("admin.indicators.form.sections.alignment.title");
        self.pideTableLabel = GeneralViewModel.nls("admin.indicators.form.sections.alignment.table.title");
        self.axeColumnLabel = GeneralViewModel.nls("admin.indicators.form.sections.alignment.table.axe");
        self.topicColumnLabel = GeneralViewModel.nls("admin.indicators.form.sections.alignment.table.topic");
        self.objectiveColumnLabel = GeneralViewModel.nls("admin.indicators.form.sections.alignment.table.objective");
        
        self.axesOptions = ko.observableArray();
        /**
        * Axes change event.
        *
        * Triggered after changing the axe to align.
        *
        */
        self.axeChange = function (event, data) {
          if (data.option === "value" && strategicModel && self.alignmentSectionExpanded()) {
            self.axesOptions(axes);
            self.topicsOptions(getTopicsByAxe(self.alignmentAxe()[0]));
          }
        };

        const getTopicsByAxe = axeId => {
          return strategicModel
            .getItemsByTypeByParent(
              StrategicTypes.TOPIC, 
              [strategicModel.getItemById(axeId)]
            )
            .map(topic => ({value: topic.id, label: topic.name}));
        };
        
        self.alignmentAxe = ko.observable();
        
        self.topicsOptions = ko.observableArray();
        /**
        * Topics change event.
        *
        * Triggered after changing the topic to align.
        */
        self.topicChange = function (event, data) {
          if (data.option === "value" && strategicModel && self.alignmentSectionExpanded() && self.alignmentTopic()) {
            self.objectivesOptions(getObjectivesByTopic(self.alignmentTopic()[0]));
          }
        };

        const getObjectivesByTopic = topicId => {
          return strategicModel
            .getItemsByTypeByParent(
              StrategicTypes.OBJECTIVE,
              [strategicModel.getItemById(topicId)]
            )
            .map(objective => ({value: objective.id, label: objective.name}));
        };
        self.alignmentTopic = ko.observable();
        
        self.objectivesOptions = ko.observableArray();
        self.alignmentObjective = ko.observable();
        
        /*
         * Responsible section
         */
        self.responsibleTitle = GeneralViewModel.nls("admin.indicators.form.sections.responsible.title");
        self.areaLabel = GeneralViewModel.nls("admin.indicators.form.sections.responsible.area");
        self.areaOptions = ko.observableArray();
        self.areaChangeHandler = (event, data) => {
          if (data.option === 'value') {
            self.jobTitleOptions(jobTitlesByArea[data.value]);
          }
        };
        self.areaValue = ko.observable();
        
        self.jobTitleLabel = GeneralViewModel.nls("admin.indicators.form.sections.responsible.jobTitle");
        self.jobTitleOptions = ko.observableArray();
        self.jobChangeHandler = (event, data) => {
          if (data.option === 'value') {
            const player = playersByAreaAndJobTitle[`${self.areaValue()}#${self.jobTitleValue()[0]}`];

            if (player) {
//              self.responsibleNameValue(player.name);z

//              const phone = player.phones[0];
//              self.phoneValue(phone ? phone.number : '');

              responsibleId = player.id;
            }
          }
        };
        self.jobTitleValue = ko.observable();
        
        const positionsPromise = AjaxUtils.ajax(RESTConfig.admin.indicators.positions.path, 'GET');
        const areaValues = [];
        const jobTitlesByArea = {};
        const playersByAreaAndJobTitle = {};

        // Responsible name
//        self.responsibleNameLabel = GeneralViewModel.nls("admin.indicators.form.sections.responsible.name.label");
//        self.responsibleNamePlaceHolder = GeneralViewModel.nls("admin.indicators.form.sections.responsible.name.placeholder");
//        self.responsibleNameValue = ko.observable("Nombre del responsable");

        // Email field
//        self.emailLabel = GeneralViewModel.nls("admin.indicators.form.sections.responsible.email.label");
//        self.emailPlaceholder = GeneralViewModel.nls("admin.indicators.form.sections.responsible.email.placeholder");
//        self.emailValue = ko.observable("");

        // Phone field
//        self.phoneLabel = GeneralViewModel.nls("admin.indicators.form.sections.responsible.phone.label");
//        self.phonePlaceholder = GeneralViewModel.nls("admin.indicators.form.sections.responsible.phone.placeholder");
//        self.phoneValue = ko.observable("");

        // Extension field
//        self.extensionLabel = GeneralViewModel.nls("admin.indicators.form.sections.responsible.extension.label");
//        self.extensionPlaceholder = GeneralViewModel.nls("admin.indicators.form.sections.responsible.extension.placeholder");
//        self.extensionValue = ko.observable("");
        
        // Observations field
        self.observationsRLabel = GeneralViewModel.nls("admin.indicators.form.sections.responsible.observations");
        self.observationsRValue = ko.observable("");
        
        self.metadataTitle = GeneralViewModel.nls("admin.indicators.form.sections.metadata.title");

        // Source field
        self.sourceLabel = GeneralViewModel.nls("admin.indicators.form.sections.metadata.source.label");
        self.sourcePlaceholder = GeneralViewModel.nls("admin.indicators.form.sections.metadata.source.placeholder");
        self.sourceValue = ko.observable("");

        // Link field
        self.linkLabel = GeneralViewModel.nls("admin.indicators.form.sections.metadata.link.label");
        self.linkPlaceholder = GeneralViewModel.nls("admin.indicators.form.sections.metadata.link.placeholder");
        self.linkValue = ko.observable("");

        // Formula field
        self.formulaLabel = GeneralViewModel.nls("admin.indicators.form.sections.metadata.formula.label");
        self.formulaPlaceholder = GeneralViewModel.nls("admin.indicators.form.sections.metadata.formula.placeholder");
        self.formulaValue = ko.observable("");

        // Variables field
        self.variablesLabel = GeneralViewModel.nls("admin.indicators.form.sections.metadata.variables.label");
        self.variablesPlaceholder = GeneralViewModel.nls("admin.indicators.form.sections.metadata.variables.placeholder");
        self.variablesValue = ko.observable("");

        // Method field
        self.methodLabel = GeneralViewModel.nls("admin.indicators.form.sections.metadata.method.label");
        self.methodPlaceholder = GeneralViewModel.nls("admin.indicators.form.sections.metadata.method.placeholder");
        self.methodValue = ko.observable("");

        // Observations field
        self.observationsMLabel = GeneralViewModel.nls("admin.indicators.form.sections.metadata.observations.label");
        self.observationsMPlaceholder = GeneralViewModel.nls("admin.indicators.form.sections.metadata.observations.placeholder");
        self.observationsMValue = ko.observable("");
        
        self.scoreLabel = GeneralViewModel.nls("admin.indicators.form.sections.metadata.score.label");
        self.scoreConverter = GeneralViewModel.converters.percent;

        // Red score field
        self.redLabel = GeneralViewModel.nls("admin.indicators.form.sections.metadata.score.red");
        self.redValue = ko.observable(0.35);

        // Orange score field
        self.orangeLabel = GeneralViewModel.nls("admin.indicators.form.sections.metadata.score.orange");
        self.orangeValue = ko.observable(0.6);

        // Yello score field
        self.yellowLabel = GeneralViewModel.nls("admin.indicators.form.sections.metadata.score.yellow");
        self.yellowValue = ko.observable(0.8);

        // Green score field
        self.greenLabel = GeneralViewModel.nls("admin.indicators.form.sections.metadata.score.green");
        self.greenValue = ko.observable(1);
        
        self.goalsTitle = GeneralViewModel.nls("admin.indicators.form.sections.goals.title");
        self.chartSeriesValue = ko.observableArray([]);
        self.goalsLabel = GeneralViewModel.nls("admin.indicators.form.sections.goals.table.goals");
        self.beforeRowEditEnd = function () {
          self.updateChart();
        };
        self.goalsColumns = [
          {
            "headerText": "Valor",
            "headerStyle": 'max-width: 5em;',
            "style": 'min-width: 45%; width: 45%;',
            "sortable": "disabled"
          },
          {
            "headerText": "Fecha",
            "headerStyle": 'max-width: 5em;',
            "style": 'min-width: 45%; width: 45%;',
            "sortable": "auto"
          },
          {
            "headerText": 'Acciones',
            "headerStyle": 'max-width: 5em;',
            "style": 'min-width: 10%; width: 10%;',
            "sortable": "disabled"
          }
        ];
        
        self.goalId = Math.floor(Math.random() * 100) + 1;
        self.goalObservableArray = ko.observableArray([]);
        self.goalDataSource = new oj.ArrayTableDataSource(self.goalObservableArray(), {idAttribute: 'id'});

        self.getGoalRowTemplate = function (data, context) {
          const mode = context.$rowContext['mode'];
          return mode === 'edit' ? 'goalEditRowTemplate' : 'goalRowTemplate';
        };
        
        self.progressLabel = GeneralViewModel.nls("admin.indicators.form.sections.goals.table.progress");
        self.progressObservableArray = ko.observableArray([]);
        self.progressDataSource = new oj.ArrayTableDataSource(self.progressObservableArray(), {idAttribute: 'id'});

        self.getProgressRowTemplate = function (data, context) {
          const mode = context.$rowContext['mode'];
          return mode === 'edit' ? 'progressEditRowTemplate' : 'progressRowTemplate';
        };
        
        self.riskLabel = GeneralViewModel.nls("admin.indicators.form.sections.goals.risk.label");
        self.riskPlaceholder = GeneralViewModel.nls("admin.indicators.form.sections.goals.risk.placeholder");
        self.riskValue = ko.observable("");

        self.actionsLabel = GeneralViewModel.nls("admin.indicators.form.sections.goals.actions.label");
        self.actionsPlaceholder = GeneralViewModel.nls("admin.indicators.form.sections.goals.actions.placeholder");
        self.actionsValue = ko.observable("");
        
        self.progressTitle = GeneralViewModel.nls("admin.indicators.form.sections.goals.alternative");
        /**
         * Update chart values.
         */
        self.updateChart = function () {
          // New chart series
          var chartSeries = [
            {name: 'Metas', items: []},
            {name: 'Avances', items: []}
          ];

          // For each goal in Goals' table
          self.goalObservableArray().forEach(function (goal) {
            // Add new item to Chart series
            chartSeries[0].items.push({
              x: goal.date, // Goal date
              value: goal.value // Goal value
            });
          });

          // For each progress in Progress' table
          self.progressObservableArray().forEach(function (progress) {
            // Add new item to Chart Series
            chartSeries[1].items.push({
              x: progress.date, // Progress date
              value: progress.value // Progress value
            });
          });

          // Sort arrays by date
          chartSeries[0].items.sort(self.orderChartByDate);
          chartSeries[1].items.sort(self.orderChartByDate);

          // Set chart values
          self.chartSeriesValue(chartSeries);
        };

        /**
         * Order chart by date.
         *
         * @param elem1
         * @param elem2
         * @returns {int}
         */
        self.orderChartByDate = function (elem1, elem2) {
          if (elem1.x > elem2.x)
            return 1;
          else if (elem1.x < elem2.x)
            return -1;
          else if (elem1.x === elem2.x)
            return 0;
        };

        /**
         * Add new row table.
         *
         * @param {String} table
         * @returns {void}
         */
        self.addRow = function (table) {
          // New row
          var row = {
            'id': self.goalId++,
            'value': 0,
            'date': oj.IntlConverterUtils.dateToLocalIso(new Date())
          };

          // Pick table
          if (table === 'Goals') {
            self.goalObservableArray.push(row);
            self.goalDataSource.add(row);
          } else if (table === 'Progress') {
            self.progressObservableArray.push(row);
            self.progressDataSource.add(row);
          }
          // Update chart values
          self.updateChart();
        };

        /**
         * Remove selected row.
         *
         * @param {String} table Table source.
         * @param {Object} row Goal/Progress object with ID, Value and Date.
         * @returns {void}
         */
        self.removeRow = function (table, row) {
          if (table === 'Goals') {
            // Remove from Goals table
            self.goalObservableArray.remove(function (item) {
              return item.id === row.id && item.value === row.value && item.date === row.date;
            });
            self.goalDataSource.remove({id: row.id, date: row.date, value: row.value});
          } else if (table === 'Progress') {
            // Remove from Progress table
            self.progressObservableArray.remove(function (item) {
              return item.id === row.id && item.value === row.value && item.date === row.date;
            });
            self.progressDataSource.remove({id: row.id, date: row.date, value: row.value});
          }

          // Update chart values
          self.updateChart();
        };
        
        let responsibleId;
        let positionsMap = {};
        
        function populateIndicator(indicator) {
          //general
          indicator.setIndicatorType({id: parseInt(self.typeValue())});
          indicator.setStatus({id: self.activeValue() ? 1 : 2});
          indicator.setDescription(self.descriptionValue());
          
          if (indicator.getIndicatorType().id !== 3 || self.isGlobal()) {
            indicator.setDirection(self.directionValue()[0]);
            indicator.setPeriodicity({id: parseInt(self.periodicityValue()[0])});
            indicator.setMeasureUnit({type: {id: self.measureUnitValue()[0]}});
          }
          
          if (indicator.getIndicatorType().id === 3) {
            indicator.setIsGlobal(self.isGlobal());
          }

          indicator.setBaseYear(self.baseYearValue());
          indicator.setResetType({id: parseInt(self.resetValue()[0])});

          let resetType = indicator.getResetType().id;
          let resetDatesNumber = resetType === 1 ? 0 : resetType === 2 ? 3 : 1;
          let resetDates = [];

          for (let i = 0; i < resetDatesNumber; i++) {
            resetDates.push(isoToTimestamp(self.resetDateValues[i]()));
          }

          indicator.setResetDates(resetDates);

          //alignment
          switch (indicator.getIndicatorType().id) {
            case 1:
              if (self.alignmentObjective() && self.alignmentObjective().length > 0) {
                indicator.setStrategicItem({id: self.alignmentObjective()[0]});
              }
              break;
            case 3:
              if (!self.isGlobal() && self.peIndicatorsValue() && self.peIndicatorsValue().length > 0) {
                indicator.setPideIndicator({id: self.peIndicatorsValue()[0]});
              }
              break;
            default:
              //MECASUT
              break;
          }

          //PE
          if (indicator.getIndicatorType().id === 3) {
            indicator.setPe({id: self.peValue()[0]});
          }

          //responsible
          indicator.setResponsible({id: responsibleId});

          //metadata
          indicator.setSource(self.sourceValue());
          indicator.setLink(self.linkValue());
          indicator.setFormula(self.formulaValue());
          indicator.setVariables(self.variablesValue());
          indicator.setMethod(self.methodValue());
          indicator.setMetaDataObservations(self.observationsMValue());

          if (indicator.getIndicatorType().id !== 2) {
            indicator.setGrades(
                [
                  {
                    color: "red",
                    maxPercentage: self.redValue() * 100
                  },
                  {
                    color: "orange",
                    maxPercentage: self.orangeValue() * 100
                  },
                  {
                    color: "yellow",
                    maxPercentage: self.yellowValue() * 100
                  },
                  {
                    color: "green",
                    maxPercentage: self.greenValue() * 100
                  }
                ]
                );
          } else {
            delete indicator.gradesMap;
            delete indicator.grades;
          }
          //achievements
          let achievements = [];
          let progressItems = self.progressObservableArray();

          if (progressItems.length > 0) {
            let items =
                progressItems.map(
                    item => {
                      return {
                        data: item.value,
                        date: isoToTimestamp(item.date),
                        achievementType: 'PROGRESS'
                      };
                    }
                );

            achievements = achievements.concat(items);
          }

          if (indicator.getIndicatorType().id !== 2) {
            let goalItems = self.goalObservableArray();

            if (goalItems.length > 0) {
              let items =
                  goalItems.map(
                      item => {
                        return {
                          data: item.value,
                          date: isoToTimestamp(item.date),
                          achievementType: 'GOAL'
                        };
                      }
                  );

              achievements = achievements.concat(items);
            }
          }

          indicator.setAchievements(achievements);

          if (indicator.getIndicatorType().id !== 2) {
            indicator.setPotentialRisk(self.riskValue());
            indicator.setImplementedActions(self.actionsValue());
          }

          if (indicator.getIndicatorType().id === 2) {
            indicator.setClassType({id: parseInt(self.classValue()[0])});
          }

          function isoToTimestamp(isoDate) {
            let date = oj.IntlConverterUtils.isoToLocalDate(isoDate);
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            month = month < 10 ? "0" + month : month;
            let day = date.getDate();
            day = day < 10 ? "0" + day : day;

            return year + "-" + month + "-" + day + " 00:00:00";
          }
        }

        function initializeForm() {
          if (params.id) {
            let id = params.cloneOf ? params.cloneOf : params.id;
            let path = RESTConfig.admin.indicators.path + "/" + id;
            let method = "GET";

            function errorFunction(jqXHR, textStatus, errMsg) {
              console.error(errMsg);
            }

            let indicatorPromise = AjaxUtils.ajax(path, method, undefined, null, errorFunction);

            indicatorPromise.then(
                function (indicator) {
                  //general
                  let name = params.cloneOf ? params.name : indicator.name;
                  self.nameValue(name);
                  self.typeValue(indicator.indicatorType.id.toString());
                  self.activeValue(indicator.status.id === 1);
                  self.descriptionValue(indicator.description);

                  if (indicator.indicatorType.id !== 3 || indicator.isGlobal) {
                    self.directionValue([indicator.direction]);
                    self.periodicityValue([String(indicator.periodicity.id)]);
                    self.measureUnitValue([indicator.measureUnit.type.id]);
                    self.baseYearValue(indicator.baseYear);
                    self.resetValue(String(indicator.resetType.id));
                  }

                  let resetDates = indicator.resetDates;

                  resetDates = resetDates.map(
                    (date) => {
                      let resetDate = new Date();
                      resetDate.setTime(date.time);

                      return resetDate;
                    }
                  );

                  resetDates.sort((a, b) => a.getTime() > b.getTime());

                  resetDates.forEach(
                    (date, index) => {
                      self.resetDateValues[index](oj.IntlConverterUtils.dateToLocalIso(date));
                    }
                  );
                
                  if (indicator.indicatorType.id === 3) {
                    self.isGlobal(indicator.isGlobal);
                  }
                  
                  //alignment
                  if (indicator.strategicItem) {
                    let objective = strategicModel.getItemById(indicator.strategicItem.id);
                    let topic = strategicModel
                        .getItemsByType(StrategicTypes.TOPIC)
                        .filter(item => item.children.includes(objective));
                    topic = topic[0];

                    let axe = strategicModel.getItemsByType(StrategicTypes.AXE)
                        .filter(item => item.children.includes(topic));
                    axe = axe[0];

                    let topicOptionsArray;
                    topicOptionsArray = strategicModel
                    .getItemsByTypeByParent(StrategicTypes.TOPIC, [axe])
                    .map(
                      topic => {
                        return {value: topic.id, label: topic.name};
                      }
                    );

                    self.topicsOptions(topicOptionsArray);

                    let objectiveOptionsArray;
                    objectiveOptionsArray = strategicModel
                    .getItemsByTypeByParent(StrategicTypes.OBJECTIVE, [topic])
                    .map(
                      objective => {
                        return {value: objective.id, label: objective.name};
                      }
                    );

                    self.objectivesOptions(objectiveOptionsArray);

                    self.alignmentAxe([axe.id]);
                    self.alignmentTopic([topic.id]);
                    self.alignmentObjective([objective.id]);
                  }

                  if (indicator.pe) {
                    self.peTypeValue([indicator.pe.type.id]);
                    const peOptionsSubscription = self.peOptions.subscribe(
                      () => {
                        self.peValue([indicator.pe.id]);
                        peOptionsSubscription.dispose();
                      }
                    );
                    self.shortNameValue(indicator.pe.shortName);
                    
                    if (!indicator.isGlobal) {
                      self.peIndicatorsValue([indicator.pideIndicator.id]);
                    }
                  }

                  //responsible
                  responsibleId = indicator.responsible.id;
                  const jobsSubscription = self.jobTitleOptions.subscribe(
                    () => { 
                      self.jobTitleValue(`${positionsMap[responsibleId].jobTitle.id}#${responsibleId}`);
                      jobsSubscription.dispose();
                    }
                  );
                  
                  self.areaValue(positionsMap[responsibleId].area.id);
//                  self.responsibleNameValue(positionsMap[responsibleId].player.name);
//                  let phone = positionsMap[responsibleId].player.phones[0];
//                  self.phoneValue(phone ? phone.number : '');

                  //metadata
                  self.sourceValue(indicator.source);
                  self.linkValue(indicator.link);
                  self.formulaValue(indicator.formula);
                  self.variablesValue(indicator.variables);
                  self.methodValue(indicator.method);
                  self.observationsMValue(indicator.metaDataObservations);

                  let colorGradesMap = {};
                  indicator.grades.forEach(g => colorGradesMap[g.color] = g.maxPercentage / 100);

                  self.redValue(colorGradesMap[FullIndicator.GradesColor.RED]);
                  self.orangeValue(colorGradesMap[FullIndicator.GradesColor.ORANGE]);
                  self.yellowValue(colorGradesMap[FullIndicator.GradesColor.YELLOW]);
                  self.greenValue(colorGradesMap[FullIndicator.GradesColor.GREEN]);
                  //achievements
                  let achievementTypes = ['PROGRESS', 'GOAL'];
                  let observableAchievements = [self.progressObservableArray, self.goalObservableArray];

                  indicator.achievements.forEach(
                    (achievement, index) => {
                      let typeIndex = achievementTypes.indexOf(achievement.achievementType);
                      let observableAchievement = observableAchievements[typeIndex];
                      let date = new Date();
                      date.setTime(achievement.date.time);

                      let row = {
                        id: index,
                        value: achievement.data,
                        date: oj.IntlConverterUtils.dateToLocalIso(date)
                      };

                      observableAchievement.push(row);
                    }
                  );
                  
                  self.progressDataSource.reset(self.progressObservableArray(), {idAttribute: 'id'});
                  self.goalDataSource.reset(self.goalObservableArray(), {idAttribute: 'id'})

                  self.riskValue(indicator.potentialRisk);
                  self.actionsValue(indicator.implementedActions);

                  if (indicator.classType) {
                    self.classValue(`${indicator.classType.id}`);
                  }

                  self.updateChart();
                }
            );
          }
        }

        self.showDialog = function () {
          const saveDialog = $("#" + self.saveDialogId);
          const classToRemove = saveDialogClass === "success" ? "error": "success";
          
          saveDialog.ojDialog("widget").removeClass(`save-dialog-${classToRemove}`);
          saveDialog.ojDialog("widget").addClass(`save-dialog-${saveDialogClass}`);
          saveDialog.ojDialog("open");
        };

        self.resetMessage(GeneralViewModel.nls("admin.indicators.main.dialogs.reset.warningText"));

        const peDataProvider =
            new DataProvider(
                RESTConfig.admin.pe.path,
                PEDataParser);

        const pePromise = peDataProvider.fetchData();
        let peTypesMap = {};
        let peTypesMatrix = {};
        let peTypesArray = [];

        pePromise.then(
            () => {
          peDataProvider.getDataArray()
              .forEach(
                  pe => {
                    if (!peTypesMap[pe.type.id]) {
                      peTypesMap[pe.type.id] = [];
                      peTypesArray.push({value: pe.type.id, label: pe.type.name});
                      peTypesMatrix[pe.type.id] = {};
                    }

                    peTypesMap[pe.type.id].push({value: pe.id, label: pe.name});
                    peTypesMatrix[pe.type.id][pe.id] = pe;
                  }
              );

          self.peTypeOptions([{value: -1, label: ''}].concat(peTypesArray));
          self.peTypeValue(-1);
        }
        );

        let sortByName = (a, b) => a.name.localeCompare(b.name);

        //PE Filter select controls population
        const strategicDataProvider =
            new DataProvider(
                RESTConfig.admin.strategic.path,
                StrategicDataParser);

        const peGlobalIndicatorsDataProvider =
            new DataProvider(
                RESTConfig.admin.indicators.pe.globals.path,
                IndicatorDataParser);

        const strategicPromise = strategicDataProvider.fetchData();
        const indicatorsPromise = peGlobalIndicatorsDataProvider.fetchData();
        let strategicModel;
        let axes = [];
        
        const strategicLoadedPromise = strategicPromise.then(
          () => {
            strategicModel = new StrategicModel(strategicDataProvider.getDataArray());
            axes = strategicModel
            .getItemsByType(StrategicTypes.AXE)
            .sort(sortByName)
            .map(
                (axe) => {
                    return {value: axe.id, label: axe.name};
                }
            );
            
            self.axesOptions([{value: -1, label: ''}].concat(axes));
            self.alignmentAxe(-1);
          }
        );

        const indicatorsLoadPromise = indicatorsPromise.then(
          () => {
            const indicators = peGlobalIndicatorsDataProvider.getDataArray();
            const peIndicatorsArray = [];
            
            indicators.forEach(
              i => {
                peIndicatorsArray.push({value: i.id, label: i.name});
              }
            );
            
            self.peIndicatorsOptions([{value: -1, label: ''}].concat(peIndicatorsArray));
          }
        )
        .catch(
          e => console.log(e)
        );

        positionsPromise.then(
            positions => {
              positions.forEach(
                  p => {
                    const area = p.area;
                    const areaObject = {label: area.name, value: area.id};

                    if (!areaValues.includes(areaObject.value)) {
                      self.areaOptions.push(areaObject);
                      areaValues.push(areaObject.value);
                    }

                    const jobTitle = p.jobTitle;
                    const jobTitleObject = {label: jobTitle.name, value: `${jobTitle.id}#${p.id}`};

                    if (!jobTitlesByArea[areaObject.value]) {
                      jobTitlesByArea[areaObject.value] = [];
                    }

                    let jobTitles = jobTitlesByArea[areaObject.value];
                    jobTitles.push(jobTitleObject);

                    playersByAreaAndJobTitle[`${areaObject.value}#${jobTitleObject.value}`] = p.player;
                    p.player.id = p.id;

                    positionsMap[p.id] = p;
                  }
              );
            }
        ).then(
          () => {
            self.jobTitleOptions(jobTitlesByArea[self.areaValue()[0]]);
          }
        ).then(
            () => {
              let player = playersByAreaAndJobTitle[`${self.areaValue()[0]}#${self.jobTitleValue()[0]}`];
//              self.responsibleNameValue(player.name);
              responsibleId = player.id;
            }
        );

        function setGradesToDefaultValues() {
          self.redValue(0.35);
          self.orangeValue(0.6);
          self.yellowValue(0.8);
          self.greenValue(1);
        }

        const promises = [unitsPromise, strategicLoadedPromise, positionsPromise, indicatorsLoadPromise, pePromise];
        Promise.all(promises)
        .then(() => initializeForm());
      }

      return FormViewModel;
    }
);