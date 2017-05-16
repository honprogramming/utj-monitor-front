/**
 * Header module
 */

/**
 * 
 * @param {type} ko
 * @param {type} oj
 * @returns {header_L9.HeaderViewModel}
 */
define(['ojs/ojcore', 'ojs/ojoffcanvas', 'knockout', 'ojs/ojnavigationlist', 'ojs/ojdatacollection-common'],
        function (oj) {

            function ToggleButtonViewModel() {
                var self = this;
// 
                // Button used for toggling off screen data.
                // 
                var offScreenDataButton = {
                    "label": "offscreen-toggle",
                    "iconClass": "oj-fwk-icon oj-fwk-icon-hamburger",
                    "url": "#"
                };

                self.offScreenButtonIconClass = offScreenDataButton.iconClass;
                self.offScreenButtonLabel = offScreenDataButton.label;
                self.toggleAppDrawer = function () {
                    return oj.OffcanvasUtils.toggle(self.appDrawer);
                };

                self.appDrawer = {
                    "edge": "start",
                    "displayMode": "push",
                    "selector": "#appDrawer",
                    "selection": "selectedItem"
                };

                //
                // Close off-screen content once window becomes larger.
                //
                var query = window.matchMedia("(min-width: 39.375rem)");
                var mqListener = function (event) {
                    oj.OffcanvasUtils.close(self.appDrawer);
                };

                query.addListener(mqListener);
            }

            return ToggleButtonViewModel;
        });