define(
        [
            'knockout', 'ojs/ojcore', 'jquery',
            'view-models/GeneralViewModel',
            'view-models/events/EventTypes',
            'view-models/events/ActionTypes',
            'utils/IdGenerator',
            'ojs/ojknockout',
            'ojs/ojcollapsible', 'ojs/ojinputtext',
            'ojs/ojtable', 'ojs/ojarraytabledatasource'
        ],
        function (ko, oj, $, GeneralViewModel, EventTypes, ActionTypes, IdGenerator) {
            var theKey = {};
            
            function EditableTable(data, model, params) {
                var self = this;
                
                self.listeners = [];
                
                var privateData = {
                    model: model,
                    data: [],
                    type: null,
                    newValidator: function() {return true;},
                    ENABLED: 1.0,
                    DISABLED: 0.5
                    
                };
                
                this.EditableTable_ = function(key) {
                    if (theKey === key) {
                        return privateData;
                    }
                };
                
                self.id = params.id || Math.random();
                self.collapsibleId = self.id + "-collapsible";
                self.titleId = self.id + "-title";
                self.title = "Title";
                self.newHint = self.nls("templates.editableTable.newHint");
                self.summaryTable = "";
                self.ariaTable = "";
                self.rowTemplateId = self.id + "-rowTemplate";
                self.editRowTemplateId = self.id + "-editRowTemplate";
                self.columns = [{headerText: 'Column Header'}];
                self.state = ko.observable(privateData.ENABLE);
                self.showError = ko.observable(false);
                self.errorText = "Error";
                self.currentRow = ko.observable();
                
                var dataSource = new oj.ArrayTableDataSource([]);
                self.observableDataSource = ko.observable(dataSource);
                        
                if (params) {
                    self.title = params.title ? params.title : "Title";
                    self.columns = params.columns || [{headerText: 'Column Header'}];
                    self.tableSummary = params.tableSummary ? params.tableSummary : "";
                    self.tableAria = params.tableAria ? params.tableAria : "";
                    self.errorText = params.errorText ? params.errorText : "Error";
                    self.setNewValidator(params.newValidator);
                    self.setNewEnabled(params.newEnabled !== undefined ? params.newEnabled : true);
                    
                    privateData.type = params.type;
                }
                
                if (data) {
                    this.setData(data, theKey);
                    dataSource = new oj.ArrayTableDataSource(
                            this.getData(),
                            {idAttribute: "id"}
                    );
            
                    self.observableDataSource(dataSource);
                }

                self.getRowTemplate = function (data, context) {
                    var mode = context.$rowContext['mode'];
                    return mode === 'edit' ? self.editRowTemplateId : self.rowTemplateId;
                };

                self.newClickHandler = function () {
                    if (self.validate()) {
                        var itemIds = Object.keys(self.getModel().getItems());
                        var id = IdGenerator.getNewIntegerId(itemIds, itemIds.length * 2);
                        
                        var newItem = {id: id, name: ""};
                        self.observableDataSource().add(newItem);
                        self.callListeners(EventTypes.DATA_EVENT, newItem, ActionTypes.ADD);
                    } else {
                        self.showError(true);
                    }
                };

                self.deleteHandler = function () {
                    var currentRow = self.getCurrentRow();
                    console.debug("currentRow: %o", currentRow);
                    
                    self.observableDataSource().remove({id: currentRow.rowKey});
                };
                
                self.filterHandler = function() {
                    var currentRow = self.getCurrentRow();
                    
                    self.callListeners(EventTypes.FILTER_EVENT, currentRow.rowKey);
                };
                
                self.currentRowHandler = function(event, ui) {
                    self.currentRow(ui.currentRow);
                };
                
                self.computedColor = function(id, data) {
                    console.debug("data: %o", data);
                    return ko.pureComputed(
                                function() {
                                    if (self.currentRow()) {
                                        var currentRowKey = self.currentRow().rowKey;
                                        return currentRowKey === id ? "lightgray" : "";
                                    }
                                }
                            );
                };
            }
            
            EditableTable.prototype = Object.create(GeneralViewModel);
            
            var prototype = EditableTable.prototype;
            
            prototype.validate = function() {
                var validator = this.getNewValidator();
                return validator();
            };
            
            prototype.getNewValidator = function() {
                return this.EditableTable_(theKey).newValidator;
            };
            
            prototype.setNewValidator = function(newValidator) {
                if (typeof newValidator === 'function') {
                    this.EditableTable_(theKey).newValidator = newValidator;
                }
            };
            
            prototype.setNewEnabled = function(state) {
                var privateData = this.EditableTable_(theKey);
                
                if(state) {
                    this.showError(false);
                }
                
                this.state(state ? privateData.ENABLED : privateData.DISABLED) ;
            };
            
            prototype.getNewEnabled = function() {
                return this.state();
            };
            
            prototype.addFilterListener = function(listener) {
                this.addListener(listener, EventTypes.FILTER_EVENT);
            };
            
            prototype.addDataListener = function(listener) {
                this.addListener(listener, EventTypes.DATA_EVENT);
            };
            
            prototype.getData = function() {
                return this.EditableTable_(theKey).data;
            };
            
            prototype.setData = function(data, key) {
                var privateData = this.EditableTable_(key);
                
                if (privateData) {
                    privateData.data = data;
                }
            };
            
            prototype.getType = function() {
                return this.EditableTable_(theKey).type;
            };
            
            prototype.getModel = function() {
                return this.EditableTable_(theKey).model;
            };
            
            prototype.setModel = function(model) {
                this.EditableTable_(theKey).model = model;
            };
            
            prototype.refresh = function() {
                $("#" + this.id).ojTable("refresh");
            };
            
            prototype.getCurrentRow = function() {
                return $("#" + this.id).ojTable("option", "currentRow");
            };
            
            return EditableTable;
        }
);