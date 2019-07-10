define(
  [
    'jquery'
  ],
  function ($) {
    return {
      ajax: function (path, method = 'GET', data, successFunction, errorFunction, completeFunction) {
        const options = {
              method: method,
              dataType: 'json',
              contentType: "application/json",
              success: successFunction,
              error: errorFunction,
              complete: completeFunction
            };
            
        if (data) {
          options["data"] = JSON.stringify(data);
        }
        
        return $.ajax(path, options);
      }
    };
  }
);