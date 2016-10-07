define(
        [
            'jquery', 'knockout', 'view-models/GeneralViewModel',
            'models/data/DataProvider',
            'models/forms/FormsDataParser',
            'ojs/ojcore', 'ojs/ojknockout', 'ojs/ojtabs',
            'ojs/ojinputtext', 'ojs/ojselectcombobox', 'ojs/ojinputnumber',
            'ojs/ojdatetimepicker', 'ojs/ojknockout-validation'
        ],
        function ($, ko, GeneralViewModel, DataProvider, FormsDataParser) {
            function ProfileViewModel() {
                var self = this;
                var formsDataProvider =
                        new DataProvider("data/forms/profile.json",
                                FormsDataParser);
                                
                self.id = "profile-form";
                self.personalTabId = "ppi";
                self.utjTabId = "pui";
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
                self.startDate = ko.observable();
                self.dateConverter = GeneralViewModel.converters.date;

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
                
                self.emailUTJPlaceHolder = GeneralViewModel.nls("forms.validation.emailUTJ");
                self.extPlaceHolder = GeneralViewModel.nls("forms.validation.ext");
                self.datePlaceHolder = GeneralViewModel.nls("forms.validation.date");

                self.nextButtonLabel = GeneralViewModel.nls("forms.buttons.next");
                self.previousButtonLabel = GeneralViewModel.nls("forms.buttons.previous");
                self.saveButtonLabel = GeneralViewModel.nls("forms.buttons.save");
                
                self.phoneValidationMessage = GeneralViewModel.nls("forms.validation.phoneMessage");
                self.emailValidationMessage = GeneralViewModel.nls("forms.validation.emailMessage");
                self.extValidationMessage = GeneralViewModel.nls("forms.validation.extMessage");

                var trackers = {};
                var tabIds = [self.personalTabId, self.utjTabId];
                
                trackers[self.personalTabId] = ko.observable();
                trackers[self.utjTabId] = ko.observable();
                
                self.getTracker = function(tabId) {
                    return trackers[tabId];
                };
                
                self.selectionHandler = function (event) {
                    if (event.originalEvent) {
                        var currentTab = getCurrentTab.call(self);

                        return isTrackerClean(getTabTracker.call(self, currentTab));
                    }
                };

                self.relative = function (tabsNumber) {
                    var currentTab = getCurrentTab.call(self);
                    var tracker = getTabTracker.call(self, currentTab);
                    
                    if (isTrackerClean(tracker)) {
                        $("#" + self.id).ojTabs("option", "selected", currentTab + tabsNumber);
                    } else {
                        tracker.showMessages();
                        tracker.focusOnFirstInvalid();
                    }
                };
                
                self.saveDisabled = ko.pureComputed(
                        function() {
                            for (var trackerId in trackers) {
                                if(!isTrackerClean(ko.unwrap(trackers[trackerId]))) {
                                    return true;
                                }
                            }
                            
                            return false;
                        }
                );
        
                function getCurrentTab() {
                    return  $("#" + this.id).ojTabs("option", "selected");
                }

                function getTabTracker(tabNumber) {
                    return ko.unwrap(trackers[tabIds[tabNumber]]);
                }

                function isTrackerClean(tracker) {
                    return !(tracker.invalidHidden || tracker.invalidShown);
                }
            }

            return ProfileViewModel;
        }
);