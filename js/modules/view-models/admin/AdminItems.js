define(
        [
            'view-models/GeneralViewModel'
        ],
        function (GeneralViewModel) {
            var adminItems = {
                strategic: {
                    id: "strategic",
                    label: GeneralViewModel.nls("admin.strategic.label"),
                    module: {
                        name: "strategic/strategic"
                    }
                },
                indicators: {
                    id: "indicators",
                    label: GeneralViewModel.nls("admin.indicators.label"),
                    module: {
                        viewName: "empty"
                    }
                },
                pe: {
                    id: "pe",
                    label: GeneralViewModel.nls("admin.pe.label"),
                    module: {
                        viewName: "empty"
                    }
                },
                poa: {
                    id: "poa",
                    label: GeneralViewModel.nls("admin.poa.label"),
                    module: {
                        viewName: "empty"
                    }
                }
            };
            
            return adminItems;
        }
);