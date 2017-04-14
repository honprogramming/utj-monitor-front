define(
        function () {
            var adminItems = {
                strategic: {
                    id: "strategic",
                    label: "Apartado Estratégico",
                    module: {
                        name: "strategic/strategic"
                    }
                },
                indicators: {
                    id: "indicators",
                    label: "Indicadores estratégicos",
                    module: {
                        viewName: "empty"
                    }
                },
                pe: {
                    id: "pe",
                    label: "Programas Educativos",
                    module: {
                        viewName: "empty"
                    }
                },
                poa: {
                    id: "poa",
                    label: "Ficha POA",
                    module: {
                        viewName: "empty"
                    }
                }
            };
            
            return adminItems;
        }
);