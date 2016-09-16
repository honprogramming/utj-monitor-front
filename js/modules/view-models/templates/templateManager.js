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
            'ojs/ojknockout'
        ],
        /**
         * Installs the template manager.
         * 
         * @param {type} oj The JET oj library.
         * @param {type} ko The knockout library.
         * @param {type} Details The template for the progress bar in activity chart and time picker.
         * @param {type} Sunburst The template for time selector component.
         */
                function (oj, ko, Details, Sunburst) {
                    oj.koStringTemplateEngine.install();

                    ko.templates["Details"] = Details;
                    ko.templates["Sunburst"] = Sunburst;
                }
        );
