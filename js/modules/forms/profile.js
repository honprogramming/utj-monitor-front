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
                self.lastName = ko.observable();
                self.secondLastName = ko.observable();
                self.phoneNumber = ko.observable();
                self.email = ko.observable();
                self.studyLevel = ko.observable();
                self.studyStatus = ko.observable();
                self.area = ko.observable();
                self.subArea = ko.observable();
                self.position = ko.observable();
                self.manager = ko.observable();
                self.emailUTJ = ko.observable();
                self.phoneUTJ = ko.observable();
                self.extension = ko.observable();
                self.joinDate = ko.observable();

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

                self.messageSummary = GeneralViewModel.nls("forms.validation.messageSummary");
                self.emailPlaceHolder = GeneralViewModel.nls("forms.validation.email");
                self.phonePlaceHolder = GeneralViewModel.nls("forms.validation.phone");
                self.comboboxPlaceHolder = GeneralViewModel.nls("forms.combobox.placeholder");

                self.nextButtonLabel = GeneralViewModel.nls("forms.buttons.next");
                self.previousButtonLabel = GeneralViewModel.nls("forms.buttons.previous");
                self.saveButtonLabel = GeneralViewModel.nls("forms.buttons.save");

                self.startDate = ko.observable(oj.IntlConverterUtils.dateToLocalIso(new Date()));

                self.trackers = [ko.observable(), ko.observable()];

                self.selectionHandler = function (event, ui) {
                    if (ui.originalEvent) {
                        var currentTab = getCurrentTab.call(self);

                        return !validate(getTabTracker.call(self, currentTab));
                    }
                };

                self.relative = function (tabsNumber) {
                    var currentTab = getCurrentTab.call(self);

                    if (!validate(getTabTracker.call(self, currentTab))) {
                        $("#" + self.id).ojTabs("option", "selected", currentTab + tabsNumber);
                    }
                };

                function getCurrentTab() {
                    return  $("#" + this.id).ojTabs("option", "selected");
                }

                function getTabTracker(tabNumber) {
                    return this.trackers[tabNumber];
                }

                function validate(observableTracker) {
                    var tracker = ko.unwrap(observableTracker);
                    tracker.showMessages();
                    return tracker.focusOnFirstInvalid();
                }
            }

            return ProfileViewModel;
        }
);