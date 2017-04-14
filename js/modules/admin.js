define(
        [
            'view-models/admin/AdminItems',
            'ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojtabs'
        ],
        function (AdminItems) {
            function AdminViewModel() {
                var self = this;
                
                self.tabItems = Object.values(AdminItems);
            }

            return new AdminViewModel();
        }
);