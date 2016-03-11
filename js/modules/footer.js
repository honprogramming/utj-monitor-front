/**
 * Footer module
 */
/**
 * 
 * @param {type} oj
 * @param {type} ko
 * @returns {footer_L8.FooterViewModel}
 */
define(['ojs/ojcore', 'knockout', 'view-models/GeneralViewModel'],
        function (oj, ko, GeneralViewModel) {
            /**
             * The view model for the footer module
             */
            function FooterViewModel() {
                var self = this;

                var aboutOracle = 'http://www.oracle.com/us/corporate/index.html#menu-about';
                var contactUs = 'http://www.oracle.com/us/corporate/contact/index.html';
                var legalNotices = 'http://www.oracle.com/us/legal/index.html';
                var termsOfUse = 'http://www.oracle.com/us/legal/terms/index.html';
                var privacyRights = 'http://www.oracle.com/us/legal/privacy/index.html';

                //Currently not used
                //TODO: add our version here
                self.ojVersion = ko.observable('v' + oj.version + ', rev: ' + oj.revision);
                self.copyright = GeneralViewModel.nls("footer.copyright");
                
                self.footerLinks = ko.observableArray([
                    new FooterNavModel('About Oracle', 'aboutOracle', aboutOracle),
                    new FooterNavModel('Contact Us', 'contactUs', contactUs),
                    new FooterNavModel('Legal Notices', 'legalNotices', legalNotices),
                    new FooterNavModel('Terms Of Use', 'termsOfUse', termsOfUse),
                    new FooterNavModel('Your Privacy Rights', 'yourPrivacyRights', privacyRights)
                ]);

            }

            function FooterNavModel(name, id, linkTarget) {

                this.name = name;
                this.linkId = id;
                this.linkTarget = linkTarget;
            }

            return FooterViewModel;
        }
);