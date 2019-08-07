define(
  [
    'data/AjaxUtils',
    'data/RESTConfig'
  ],
  function (AjaxUtils, RESTConfig) {
    class Authorization {
      static hasRole(role) {
        return Authorization.authorize(role)
            .catch(
              () => false
            );
      }
      
      static authorize(roles) {
        const accessToken = localStorage.getItem('access_token');
        const userId = localStorage.getItem('user_id');
        
        if (roles && !Array.isArray(roles)) {
          roles = [roles];
        }
        
        const params = {
          access_token: accessToken,
          user_id: userId
        };
        
        if (roles) {
          params['roles'] = roles;
        }
        
        return new Promise(
            (resolve, reject) => {
              AjaxUtils.ajax(
                RESTConfig.security.authorize.path,
                'POST',
                params,
                null,
                null,
                (jqXHR, textStatus) => {
                  if (jqXHR.status === 200) {
                    resolve(true);
                  } else if (jqXHR.status === 401) {
                    reject("Usuario no autorizado para realizar esta operación.");
                  } else {
                    reject(textStatus);
                  }
                }
              );
            }
        );
      }
      
      static getUserData() {
        const accessToken = localStorage.getItem('access_token');
        const userId = localStorage.getItem('user_id');
        
        return new Promise(
            (resolve, reject) => {
              AjaxUtils.ajax(
                RESTConfig.security.profile.path,
                'POST',
                {
                  access_token: accessToken,
                  user_id: userId
                },
                data => {
                  resolve(data);
                },
                (jqXHR, textStatus, error) => {
                  reject(error);
                }
              );
            }
        );
      }
    }
    
    return Authorization;
  }
);