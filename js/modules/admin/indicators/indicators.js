define(
    [
        'knockout'
    ],
    function(ko) {
        function IndicatorsViewModel() {
            let self = this;
            
            function switchModule() {
                let index = self.currentModule() === modules[0] ? 1 : 0;
                
                self.currentModule(modules[index]);
            }
            
            let listModule = {
                    id: 'indicators-list',
                    module: {
                        name: 'admin/indicators/indicators-list',
                        params: {
                            switchFunction: switchModule
                        }
                    }
                };
                
            let formModule = {
                id: 'indicators-form',
                module: {
                    name: 'admin/indicators/indicators-form',
                    params: {
                        switchFunction: switchModule
                    }
                }
            };
            
            let modules = [listModule, formModule];
            
            self.currentModule = ko.observable(listModule);
            
        }
        
        return IndicatorsViewModel;
    }
);