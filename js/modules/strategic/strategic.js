/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

define(
        [
            'ojs/ojcore','knockout', 'jquery',
            'view-models/admin/AdminItems',
            'ojs/ojknockout',
            'ojs/ojcollapsible', 'ojs/ojinputtext',
            'ojs/ojtable', 'ojs/ojinputtext', 'ojs/ojarraytabledatasource'
        ],
        function (oj, ko, $, AdminItems) {
            function StrategicViewModel() {
                var self = this;
                var currentRow = -1;
                var data = [
                            {
                                id: 1,
                                name: "Calidad Educativa"
                            },
                            {
                                id: 2,
                                name: "Formación integral y aprovechamiento académico"
                            },
                            {
                                id: 3,
                                name: "Planeación, administración, equidad y gobierno"
                            },
                            {
                                id: 4,
                                name: "Vinculación e incubación de empresas"
                            },
                            {
                                id: 5,
                                name: "Inovación y desarrollo tecnológico"
                            },
                            {
                                id: 6,
                                name: "Internacionalización e idiomas"
                            }
                        ];
                        
                self.title = AdminItems["strategic"]["label"];
                self.visionLabel = "Visión";
                self.axesLabel = "Ejes";
                self.vision = ko.observable();
                self.placeholder = "La visión de la escuela...";

                self.dataSource = ko.observable(
                        new oj.ArrayTableDataSource(data,
                            {
                                idAttribute: "id"
                            }
                        )
                );

                self.columns = [
                    {
                        headerText: 'Nombre',
                        headerStyle: 'min-width: 90%; max-width: 90%; width: 90%',
                        headerClassName: 'oj-helper-text-align-start',
                        style: 'min-width: 90%; max-width: 90%; width: 90%;',
                        className: 'oj-helper-text-align-start',
                        sortProperty: 'name'
                    },
                    {
                        headerText: 'Acciones',
                        headerStyle: 'min-width: 10%; max-width: 10%; width: 10%',
                        headerClassName: 'oj-helper-text-align-start',
                        style: 'min-width: 10%; max-width: 10%; width: 10%; text-align:center;',
                        sortable: 'disabled'
                    }
                ];

                self.getRowTemplate = function (data, context) {
                    var mode = context.$rowContext['mode'];

                    if (mode === 'edit') {
                        return 'editRowTemplate';
                    } else if (mode === 'navigation') {
                        return 'rowTemplate';
                    }
                };
                
                self.newClickHandler = function() {
                    data.push({id: "", name: ""});
                    self.dataSource(new oj.ArrayTableDataSource(data, {idAttribute: "id"}));
                    $("#axes-table").ojTable("refresh");
                };
                
                self.clickHandler = function(event, ui) {
                    if (ui.option === "currentRow") {
                        currentRow = ui.value.rowIndex;
                    }
                };
                
                self.deleteHandler = function() {
                    data.splice(currentRow, 1);
                    self.dataSource(new oj.ArrayTableDataSource(data, {idAttribute: "id"}));
                };
            }

            return new StrategicViewModel();
        }
);