/**
 * requireJS bootstrap for loading file-based templates.
 * For more info about require text library go to:
 * https://github.com/requirejs/text
 */

var VIEWS_PATH = "text!../../../..";

define(
        [
            'ojs/ojcore',
            'knockout',
            'text!views/pide/details.html!strip',
            'text!views/pide/sunburst.html!strip',
            'text!views/templates/CollapsibleEditableTable.html!strip',
            'text!views/templates/EditableTable.html!strip',
            'text!views/templates/FormActions.html!strip',
            'ojs/ojknockout'
        ],
        /**
         * Installs the template manager.
         * 
         * @param {type} oj The JET oj library.
         * @param {type} ko The knockout library.
         * @param {type} Details The template for the progress bar in activity chart and time picker.
         * @param {type} Sunburst The template for time selector component.
         * @param {type} CollapsibleEditableTable The template for an editable table contained in a collapsible component.
         * @param {type} EditableTable The template for an editable table.
         * @param {type} FormActions The template for save and reset buttons in a form.
         */
                function (oj, ko, Details, Sunburst, CollapsibleEditableTable,
                            EditableTable, FormActions) {
                    oj.koStringTemplateEngine.install();

                    ko.templates["Details"] = Details;
                    ko.templates["Sunburst"] = Sunburst;
                    ko.templates["CollapsibleEditableTable"] = CollapsibleEditableTable;
                    ko.templates["EditableTable"] = EditableTable;
                    ko.templates["FormActions"] = FormActions;
                }
        );
