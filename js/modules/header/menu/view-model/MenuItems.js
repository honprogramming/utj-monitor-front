define(
        [
            'view-models/GeneralViewModel'
        ],
        function (GeneralViewModel) {
            var items = {
                pide: {
                    id: "pide",
                    label: GeneralViewModel.nls("pide.label"),
                    module: {
                        name: "pide/pide",
                        viewName: "pide/pide"
                    }
                },
                mecasut: {
                    id: "mecasut",
                    label: GeneralViewModel.nls("mecasut.label"),
                    module: {
                        name: "mecasut/mecasut",
                        viewName: "mecasut/mecasut"
                    }
                },
                pe: {
                    id: "pe",
                    label: GeneralViewModel.nls("pe.label"),
                    module: {
                        name: "pe/pe",
                        viewName: "pe/pe"
                    }
                },/*,
                poa: {
                    id: "poa",
                    label: GeneralViewModel.nls("poa.label"),
                    module: {
                        viewName: "empty"
                    }
                },
                performance: {
                    id: "performance",
                    label: GeneralViewModel.nls("performance.label"),
                    module: {
                        viewName: "empty"
                    }
                },
                */
                admin: {
                    id: "admin",
                    label: "ADMINISTRADOR",
                    module: {
                        name: "admin/admin"
                    }
                }
            };

            return items;
        }
);