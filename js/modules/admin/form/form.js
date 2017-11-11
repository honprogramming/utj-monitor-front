define([
    'ojs/ojcore',
    'jquery',
    'knockout',
    'view-models/GeneralViewModel',
    'ojs/ojknockout',
    'ojs/ojradioset',
    'ojs/ojswitch',
    'ojs/ojcollapsible'
], function (oj, $, ko, GeneralViewModel) {

    function FormViewModel() {
        var self = this;

        /*
         * Main section.
         */
        // Type option
        self.typeLabel = GeneralViewModel.nls("admin.indicators.form.sections.main.type");
        self.typeValue = ko.observable('PIDE');

        // Active/Inactive option
        self.activeLabel = GeneralViewModel.nls("admin.indicators.form.sections.main.active");
        self.activeValue = ko.observable(true);

        /*
         * General section.
         */
        self.generalTitle = GeneralViewModel.nls("admin.indicators.form.sections.general.title");
        
        /*
         * Alignment section
         */
        self.alignmentTitle = GeneralViewModel.nls("admin.indicators.form.sections.alignment.title");

        /*
         * Responsible section
         */
        self.responsibleTitle = GeneralViewModel.nls("admin.indicators.form.sections.responsible.title");

        /*
         * Metadata section 
         */
        self.metadataTitle = GeneralViewModel.nls("admin.indicators.form.sections.metadata.title");

        /*
         * Goals and progress section
         */
        self.goalsTitle = GeneralViewModel.nls("admin.indicators.form.sections.goals.title");
    }
    
    return new FormViewModel();
});