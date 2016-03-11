/**
 * 
 */

/**
 * 
 * @param {type} $
 * @param {type} ko
 * @param {type} oj
 * @returns {MenuViewModel_L5.MenuViewModel}
 */
define(['jquery', 'ojs/ojcore', 'ojs/ojnavigationlist', 'ojs/ojdatacollection-common'],
        function ($, oj) {

            function MenuViewModel() {
                var self = this;
                // 
                // Data for application navigation
                // 
                var appNavData = [
                    {
                        name: 'Inicio',
                        id: 'homeDescription',
                        iconClass: 'home-icon-24 icon-font-24 oj-navigationlist-item-icon'
                    },
                    {
                        name: 'Demo',
                        id: 'homeDemo',
                        iconClass: 'education-icon-24 icon-font-24 oj-navigationlist-item-icon'
                    },
                    {
                        name: 'Membresias',
                        id: 'homeMembership',
                        iconClass: 'library-icon-24 icon-font-24 oj-navigationlist-item-icon'
                    },
                    {
                        name: 'Equipo',
                        id: 'homeCrew',
                        iconClass: 'palette-icon-24  icon-font-24 oj-navigationlist-item-icon'
                    },
                    {
                        name: 'Registro',
                        id: 'register',
                        iconClass: 'palette-icon-24  icon-font-24 oj-navigationlist-item-icon'
                    },
                    {
                        name: 'Login',
                        id: 'login',
                        iconClass: 'grid-icon-16 icon-font-24 oj-navigationlist-item-icon'
                    },
                ];
                
                self.dataSource = new oj.ArrayTableDataSource(appNavData, {idAttribute: 'id'});
                self.optionChangeHandler = function (event, ui) {
                    if (ui.option === "selection") {
                        $('html, body').animate({scrollTop: $('#' + ui.value).offset().top - $('header').height()}, 'slow');
                    }
                };
            }

            return MenuViewModel;
        }
);