define(
    [],
    function () {
      const routesWrapper = {
        getPathName: function () {
          return window.location.pathname;
        },
        getParameters: function () {
          return window.location.search;
        },
        getParameter: function (name) {
          const parametersString = this.getParameters().replace("?", "");
          let parameters = parametersString.split("&");
          parameters = parameters.reduce(
              (hash, e) => {
              const keyValue = e.split("=");
              hash[keyValue[0]] = keyValue[1];
              return hash;
            },
            {}
          );

          return parameters[name];
        }
      };

      return routesWrapper;
    }
);
