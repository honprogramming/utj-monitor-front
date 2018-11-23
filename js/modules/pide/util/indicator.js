define(
    [
        'jquery',
        'data/RESTConfig',
        'modules/pide/model/PIDEDataParser',
        'data/DataProvider',
        'modules/pide/model/PIDEModel',
        'data/RESTConfig'
    ],
    function($, RESTConfig, PIDEDataParser, DataProvider, PIDEModel, RESTConfig) {
        const controlPanelDataProvider =
                    new DataProvider(
                            RESTConfig.admin.strategic.path,
                            PIDEDataParser);

        const dataPromise = controlPanelDataProvider.fetchData();
        let pideModel = undefined;
        
        dataPromise.then(
            () => {
                pideModel = new PIDEModel(controlPanelDataProvider);
            }
        );
        
        const indicatorUtils = {
            getCardData: (axeId, objectiveId,indicatorId) =>
                $.getJSON(`${RESTConfig.indicators.pide.path}/${indicatorId}`)
                .then(
                    indicator => {
                        return {
                            axe: {text: pideModel.getData()[axeId].getLabel()},
                            objective: {text: pideModel.getData()[objectiveId].getLabel()}, 
                            ...indicator
                        };
                    }
                )
        };
        
        return indicatorUtils;
    }
);