define(
    [
        'knockout'
    ],
    function(ko) {
        function IndicatorsViewModel() {
            let self = this;
            let commonParams = {switchFunction: switchModule};
            
            function switchModule(params) {
                let index = self.currentModule() === modules[0] ? 1 : 0;
                let moduleData = modules[index];
                
                if (!params) {
                    delete moduleData.module.params;
                    params = commonParams;
                    moduleData.module.params = {};
                }
 
                Object.assign(moduleData.module.params, params);
                
                self.currentModule(moduleData);
            }
            
            let listModule = {
                    id: 'indicators-list',
                    module: {
                        name: 'admin/indicators/indicators-list',
                        params: commonParams
                    }
                };
                
            let formModule = {
                id: 'indicators-form',
                module: {
                    name: 'admin/indicators/indicators-form',
                    params: commonParams
                }
            };
            
            let modules = [listModule, formModule];
            
            self.currentModule = ko.observable(listModule);
            
        }
        
        return IndicatorsViewModel;
    }
);