define(
        [
            'jquery', 'knockout', 'ojs/ojcore',
            'view-models/GeneralViewModel',
            'ojs/ojknockout', 'ojs/ojtabs',
            'ojs/ojinputtext', 'ojs/ojselectcombobox', 'ojs/ojinputnumber',
            'ojs/ojdatetimepicker', 'ojs/ojknockout-validation'
        ],
        function ($, ko, oj, GeneralViewModel) {
            function ProfileViewModel() {
                var self = this;

                self.id = "profile-tab";
                self.name = ko.observable();
                self.title = GeneralViewModel.nls("forms.profile.title");
                self.personalInfoTabTitle = GeneralViewModel.nls("forms.profile.tabs.personal-info.title");
                self.utjInfoTabTitle = GeneralViewModel.nls("forms.profile.tabs.utj-info.title");
                
                self.nameLabel = GeneralViewModel.nls("forms.profile.tabs.personal-info.name");
                self.lastNameLabel = GeneralViewModel.nls("forms.profile.tabs.personal-info.lastName");
                self.secondLastNameLabel = GeneralViewModel.nls("forms.profile.tabs.personal-info.secondLastName");
                self.phoneLabel = GeneralViewModel.nls("forms.profile.tabs.personal-info.phone");
                self.emailLabel = GeneralViewModel.nls("forms.profile.tabs.personal-info.email");
                self.studyLevelLabel = GeneralViewModel.nls("forms.profile.tabs.personal-info.studyLevel");
                self.studyLevelStatusLabel = GeneralViewModel.nls("forms.profile.tabs.personal-info.studyLevelStatus");
                
                self.areaLabel = GeneralViewModel.nls("forms.profile.tabs.utj-info.area");
                self.subAreaLabel = GeneralViewModel.nls("forms.profile.tabs.utj-info.subArea");
                self.positionLabel = GeneralViewModel.nls("forms.profile.tabs.utj-info.position");
                self.managerLabel = GeneralViewModel.nls("forms.profile.tabs.utj-info.manager");
                self.emailUTJLabel = GeneralViewModel.nls("forms.profile.tabs.utj-info.email");
                self.phoneUTJLabel = GeneralViewModel.nls("forms.profile.tabs.utj-info.phone");
                self.extLabel = GeneralViewModel.nls("forms.profile.tabs.utj-info.ext");
                self.joinDateLabel = GeneralViewModel.nls("forms.profile.tabs.utj-info.joinDate");
                        
                self.nextButtonLabel = GeneralViewModel.nls("forms.buttons.next");
                self.previousButtonLabel = GeneralViewModel.nls("forms.buttons.previous");
                self.saveButtonLabel = GeneralViewModel.nls("forms.buttons.save");
                
                self.startDate = ko.observable(oj.IntlConverterUtils.dateToLocalIso(new Date()));
                self.tracker = ko.observable();

                self.relative = function (tabsNumber) {
                    if (!validate()) {
                        var currentTab = $("#" + self.id).ojTabs("option", "selected");
                        $("#" + self.id).ojTabs("option", "selected", currentTab + tabsNumber);
                    }
                };

                function validate() {
                    var tracker = ko.unwrap(self.tracker);
                    tracker.showMessages();
                    return tracker.focusOnFirstInvalid();
                }
            }
            
            return ProfileViewModel;
        }
);