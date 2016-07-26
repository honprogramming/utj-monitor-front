define([],
        function () {
            var theKey = {};

            function ControlPanel(dataProvider) {
                var self = this;

                var privateData = {
                    dataProvider: dataProvider,
                    planElementsArray: undefined
                };

                this.ControlPanel_ = function (key) {
                    if (theKey === key) {
                        return privateData;
                    }
                };

                privateData.planElementsArray = dataProvider.getDataArray();
            }

            var prototype = ControlPanel.prototype;

            prototype.getPlanElementsArray = function () {
                return this.ControlPanel_(theKey).planElementsArray;
            };

            return ControlPanel;
        }
);