define(
        [
            'jquery'
        ],
        function ($) {
            var ajaxUtils = {
                ajax: function (path, method, data, successFunction, errorFunction, completeFunction) {
                    return $.ajax(path,
                            {
                                data: JSON.stringify(data),
                                method: method,
                                dataType: 'json',
                                contentType: "application/json",
                                success: successFunction,
                                error: errorFunction,
                                complete: completeFunction
                            }
                    );
                }
            };

            return ajaxUtils;
        }
);