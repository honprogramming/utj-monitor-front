/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
define([
    'jquery', 
    'knockout', 
    'modules/admin/view-model/AdminItems',
    'modules/admin/poa/model/PoaModel',
    'modules/admin/poa/model/PoaDataParser',
    'view-models/GeneralViewModel',
    'data/DataProvider',
    'templates/EditableTable',
    'templates/FormActions',
    'ojs/ojknockout', 
    'ojs/ojselectcombobox',
    'ojs/ojcollapsible',
    'ojs/ojinputtext',
    'ojs/ojtable',
    'ojs/ojdialog',
    'ojs/ojbutton',
    'ojs/ojarraytabledatasource',
    'ojs/ojselectcombobox',
    'promise',
    'ojs/ojtable',
    'ojs/ojradioset'
],
function($, ko, AdminItems, PoaModel, PoaDataParser, GeneralViewModel, DataProvider, EditableTable, FormActions)
{   
        function PoaEditViewModel() {
	    var self = this;
            self.title = AdminItems["editPoa"]["label"];
            
            self.formActions = new FormActions();
            
            self.formActions.addResetListener(
                        function() {
                            $("#" + self.resetDialogId).ojDialog("open");
                        }
                );
                
                var clickOkHandlerObservable = ko.observable();
                
                self.clickOkHandler = function() {
                    var handler = clickOkHandlerObservable();
                    handler();
                };

                self.clickCancelHandler = function() {
                    $("#" + self.resetDialogId).ojDialog("close");
                };
            
            //TYPE
            self.typeLabel = GeneralViewModel.nls("admin.poa.edit.main.label");
            self.proceso = GeneralViewModel.nls("admin.poa.edit.main.proceso");
            self.proyecto = GeneralViewModel.nls("admin.poa.edit.main.proyecto");
            self.typeValue = ko.observable(self.proceso);
            
            //SECCIÓN GENERAL 
            self.titleGeneral = GeneralViewModel.nls("admin.poa.edit.general.title");
            
            //ALCANCE RADIO BUTTON
            self.scopeLabel = GeneralViewModel.nls("admin.poa.edit.general.scope.label");
            self.anual = GeneralViewModel.nls("admin.poa.edit.general.scope.anual");
            self.multiAnual = GeneralViewModel.nls("admin.poa.edit.general.scope.multiAnual");
            self.scopeValue = ko.observable(self.anual);
            
            //DENOMINACIÓN DEL PROCESO
            self.nameLabel = GeneralViewModel.nls("admin.poa.edit.general.name.label");
            self.namePlaceHolder = GeneralViewModel.nls("admin.poa.edit.general.name.placeHolder");
            self.nameValue = ko.observable("");
            
            //OBJETIVO DEL PROCESO
            self.objectiveLabel = GeneralViewModel.nls("admin.poa.edit.general.objective.label");
            self.objectivePlaceHolder = GeneralViewModel.nls("admin.poa.edit.general.objective.placeHolder");
            self.objectiveValue = ko.observable("");
            
            //CLASE
            self.classLabel = GeneralViewModel.nls("admin.poa.edit.general.class.label")
            self.class1 = GeneralViewModel.nls("admin.poa.edit.general.class.option1");
            self.class2 = GeneralViewModel.nls("admin.poa.edit.general.class.option2");
            self.classOptions = ko.observableArray([
                {value: self.class1, label: self.class1}, 
                {value: self.class2, label: self.class2}
            ]);
            self.classValue = ko.observable(self.class1);
            
            //PROBLEMÁTICA
            self.problematicLabel = GeneralViewModel.nls("admin.poa.edit.general.problematic.label");
            self.problematicPlaceHolder = GeneralViewModel.nls("admin.poa.edit.general.problematic.placeHolder");
            self.problematicValue = ko.observable("");
            
        }
        
    return new PoaEditViewModel();
 
});  





