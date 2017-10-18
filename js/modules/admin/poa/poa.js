/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/*define ( [
    "jquery",
    "knockout",
    "ojs/ojcore"
], function ($, ko, oj) {
    
    function PEViewModel() {
        var self = this;
        
    };
    
    return new PEViewModel();
    
});*/

define(['jquery', 'knockout', 'modules/admin/view-model/AdminItems', 'view-models/GeneralViewModel', 'ojs/ojknockout', 'ojs/ojselectcombobox', 'view-models/GeneralViewModel'],
function($, ko, AdminItems, GeneralViewModel)
{   

        function PoaViewModel() {
	    var self = this;
            self.title = AdminItems["poa"]["label"];
            //Tipo
            self.process1 = GeneralViewModel.nls("admin.poa.typesPoa.option1");
            self.process2 = GeneralViewModel.nls("admin.poa.typesPoa.option2");
            self.process3 = GeneralViewModel.nls("admin.poa.typesPoa.option3");
            self.processOptions = ko.observableArray([
                {value: self.process1, label: self.process1}, 
                {value: self.process2, label: self.process2},
                {value: self.process3, label: self.process3}
            ]);
            self.processValue = ko.observable(self.process1);
            
            //Periodicidad
            self.anual = GeneralViewModel.nls("admin.poa.periodicityPoa.option1");
            self.mensual = GeneralViewModel.nls("admin.poa.periodicityPoa.option2");
            self.semanal = GeneralViewModel.nls("admin.poa.periodicityPoa.option3");
            self.periodicityOptions = ko.observableArray([
                {value: self.anual, label: self.anual}, 
                {value: self.mensual, label: self.mensual},
                {value: self.semanal, label: self.semanal}
            ]);
            self.periodicityValue = ko.observable(self.anual);
            
            //Año
            self.year1 = GeneralViewModel.nls("admin.poa.yearPoa.option1");
            self.year2 = GeneralViewModel.nls("admin.poa.yearPoa.option2");
            self.year3 = GeneralViewModel.nls("admin.poa.yearPoa.option3");
            self.yearOptions = ko.observableArray([
                {value: self.year1, label: self.year1}, 
                {value: self.year2, label: self.year2},
                {value: self.year3, label: self.year3}
            ]);
            self.yearValue = ko.observable(self.year1);
            
            //Status
            self.status1 = GeneralViewModel.nls("admin.poa.statusPoa.option1");
            self.status2 = GeneralViewModel.nls("admin.poa.statusPoa.option2");
            self.statusOptions = ko.observableArray([
                {value: self.status1, label: self.status1}, 
                {value: self.status2, label: self.status2}
            ]);
            self.statusValue = ko.observable(self.status1);
            
        }
        
    return new PoaViewModel();
 
});  



