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

                var aboutUs = 'http://www.utj.edu.mx/index.php/nosotros';
                var contactUs = 'http://www.utj.edu.mx/';
                var legalNotices = 'http://www.utj.edu.mx/index.php/noticias';
                var termsOfUse = 'http://www.utj.edu.mx/';
                var privacyRights = 'http://www.utj.edu.mx/';

                //Currently not used
                //TODO: add our version here
                self.ojVersion = ko.observable('v' + oj.version + ', rev: ' + oj.revision);
                self.copyright = GeneralViewModel.nls("footer.copyright");
                
                self.footerLinks = ko.observableArray([
                    new FooterNavModel('About Us', 'aboutOracle', aboutUs),
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