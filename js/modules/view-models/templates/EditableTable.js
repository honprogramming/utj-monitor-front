define(
        [
            'knockout', 'ojs/ojcore', 'jquery',
            'view-models/GeneralViewModel',
            'utils/IdGenerator',
            'ojs/ojknockout',
            'ojs/ojcollapsible', 'ojs/ojinputtext',
            'ojs/ojtable', 'ojs/ojarraytabledatasource'
        ],
        function (ko, oj, $, GeneralViewModel, IdGenerator) {
            var theKey = {};
            
            function EditableTable(model, params) {
                var self = this;
                
                var privateData = {
                    model: model,
                    data: [],
                    type: null
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
                var dataSource = new oj.ArrayTableDataSource([]);
                self.observableDataSource = ko.observable(dataSource);
                        
                if (params) {
                    self.title = params.title || "Title";
                    self.columns = params.columns || [{headerText: 'Column Header'}];
                    self.tableSummary = params.tableSummary ? self.nls(params.tableSummary) : "";
                    self.tableAria = params.tableAria ? self.nls(params.tableAria) : "";
                    privateData.type = params.type;
                }
                
                if (model) {
                    this.setData(model.getItemsByType(this.getType()), theKey);
                    dataSource = new oj.ArrayTableDataSource(
                            this.getData(),
                            {idAttribute: "id"}
                    );
            
                    self.observableDataSource(dataSource);
                }

                self.getRowTemplate = function (data, context) {
                    var mode = context.$rowContext['mode'];

                    if (mode === 'edit') {
                        return 'editRowTemplate';
                    } else if (mode === 'navigation') {
                        return 'rowTemplate';
                    }
                };

                self.newClickHandler = function () {
                    var itemIds = Object.keys(self.getModel().getItems());
                    var id = IdGenerator.getNewIntegerId(itemIds, itemIds.length * 2);
                    
                    self.observableDataSource().add({id: id, name: ""});
                };

                self.deleteHandler = function (row) {
                    var currentRow = self.getCurrentRow();
                    console.debug("currentRow: %o", currentRow);
                    
                    self.observableDataSource().remove({id: currentRow.rowKey});
                };
            }
            
            EditableTable.prototype = Object.create(GeneralViewModel);
            
            var prototype = EditableTable.prototype;
            
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