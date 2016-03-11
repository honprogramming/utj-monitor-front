/**
 * 
 */

/**
 * 
 * @param {Object} $
 * @param {Object} ko
 * @param {Object} GeneralViewModel
 * @param {Object} google
 * @returns {HomeViewModel}
 */
define(['jquery', 'knockout', 'view-models/GeneralViewModel', 'google!', 'ojs/ojbutton'],
        function ($, ko, GeneralViewModel, google) {

            function HomeViewModel() {
                var self = this;
                self.appTitle = GeneralViewModel.nls("appTitle");
                self.description = GeneralViewModel.nls("home.description");
                self.demoTitle = GeneralViewModel.nls("home.demoTitle");
                self.contactTitle = GeneralViewModel.nls("home.contactTitle");
                self.contactDescription = GeneralViewModel.nls("home.contactDescription");
                self.crewTitle = GeneralViewModel.nls("home.crewTitle");
                self.crewTableSeeMoreLabel = GeneralViewModel.nls("home.crewTableSeeMore");
                self.membershipsTitle = GeneralViewModel.nls("home.membershipsTitle");
                self.membershipsTableSeeMoreLabel = GeneralViewModel.nls("home.membershipsTable.seeMore");
                self.memberships = ["freeMembership", "silverMembership", "goldMembership"];
                self.membershipsTableHeaders = [GeneralViewModel.nls("home.membershipsTable.headers.permissions")];
                for (var i = 0; i < self.memberships.length; i++) {
                    var membershipTitle = GeneralViewModel.nls("home.membershipsTable.headers." + self.memberships[i]);
                    self.membershipsTableHeaders.push(membershipTitle);
                }

                var permissions = [
                    "15DaysTest1Plan", "shareAndExportPlan",
                    "createUpTo5Plans", "acceptColaborators",
                    "acceptAdministrators", "createUpTo10Plans"
                ];
                var membershipsPermissionsMap = {}; //free silver gold
                membershipsPermissionsMap[permissions[0]] = [true, true, true];
                membershipsPermissionsMap[permissions[1]] = [true, true, true];
                membershipsPermissionsMap[permissions[2]] = [false, true, true];
                membershipsPermissionsMap[permissions[3]] = [false, true, true];
                membershipsPermissionsMap[permissions[4]] = [false, true, true];
                membershipsPermissionsMap[permissions[5]] = [false, false, true];
                self.memberhispsTableEntries = [];
                for (var i = 0; i < permissions.length; i++) {
                    var membershipsByPermission = {
                        description: GeneralViewModel.nls("home.membershipsTable.permissions." + permissions[i]),
                        permissions: membershipsPermissionsMap[permissions[i]]
                    };
                    self.memberhispsTableEntries.push(membershipsByPermission);
                }

                self.crewMembers = [
                    {
                        name: "Name",
                        profession: "Profesion",
                        about: "Acerca de"
                    },
                    {
                        name: "Name",
                        profession: "Profesion",
                        about: "Acerca de"
                    },
                    {
                        name: "Name",
                        profession: "Profesion",
                        about: "Acerca de"
                    },
                    {
                        name: "Name",
                        profession: "Profesion",
                        about: "Acerca de"
                    }
                ];

                self.mapId = "google-map";
                self.loadMap = ko.pureComputed(function () {
                    var coordinates = new google.maps.LatLng(20.700605, -103.338022);
                    
                    var mapProp = {
                        center: coordinates,
                        zoom: 15,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };
                    
                    var marker = new google.maps.Marker({
                        position: coordinates,
                        animation: google.maps.Animation.BOUNCE
                    });
                    
                    var map = new google.maps.Map($("#" + self.mapId).get(0), mapProp);
                    marker.setMap(map);
                    
                    return true;
                });
            }

            return HomeViewModel;
        }
);