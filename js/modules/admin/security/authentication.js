define(
  [
    'modules/admin/security/authorization'
  ],
  function (Authorization) {
    class Authentication {
      static get commonAttributes () {
        return {
          domain: 'handsonprogramming.auth0.com',
          clientID: 'zDfbAMSrZj1D3B4EucaCMN72Hen7ny5b',
          responseType: 'token id_token',
          redirectUri: `${window.location.href}`
        };
      }

      static get managementAPIAttributes () {
        return {
          ...Authentication.commonAttributes,
          audience: 'https://handsonprogramming.auth0.com/api/v2/',
          scope: 'read:current_user',
          nonce: 'CRYPTOGRAPHIC_NONCE',
          state: 'OPAQUE_VALUE'
        };
      }

//        static get authenticationAPIAttributes() {
//          return {
//            ...Authentication.commonAttributes,
//            audience: 'https://handsonprogramming.auth0.com/userinfo',
//            scope: 'openid profile'
//          };
//        }

      static get profile() { return this._profile }
      static set profile(profile) { this._profile = profile }
      static get webAuth() { return this._webAuth }
      static set webAuth(attributes) { this._webAuth = new auth0.WebAuth(attributes) }
      static get logoutListeners() { return this._logoutListeners }
      static set logoutListeners(listeners) { this._logoutListeners = listeners }
      
      static authenticate() {
        Authentication.webAuth = Authentication.managementAPIAttributes;
        Authentication.webAuth.authorize();
      }

      static handleAuthentication() {
        return new Promise(
          (resolve, reject) => {
            if (!Authentication.webAuth) {
              Authentication.webAuth = Authentication.managementAPIAttributes;
            }
            Authentication.webAuth.parseHash(
              (err, authResult) => {
                if (authResult && authResult.accessToken && authResult.idToken) {
                  window.location.hash = '';
                  Authentication.setSession(authResult);
                  resolve(authResult);
                } else if (err) {
                  reject(err);
                } else {
                  reject("No error or data found.");
                }
              }
            );
          }
        );
      }

      static setSession(authResult) {
        // Set the time that the Access Token will expire at
        const expiresAt = JSON.stringify(
            authResult.expiresIn * 1000 + new Date().getTime()
        );

        localStorage.setItem('access_token', authResult.accessToken);
        localStorage.setItem('user_id', authResult.idTokenPayload.sub);
        localStorage.setItem('expires_at', expiresAt);
      }

      static logout(skipListeners) {
        // Remove tokens and expiry time from localStorage
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_id');
        localStorage.removeItem('expires_at');
        localStorage.removeItem('profile');
        
        if (skipListeners) {
          return;
        }
        
        Authentication.logoutListeners.forEach(listener => listener());
      }
      
      static addLogoutListener(listener) {
        if(!Authentication.logoutListeners) {
          Authentication.logoutListeners = [];
        }
        
        Authentication.logoutListeners.push(listener);
      }
      
      static isAuthenticated() {
        // Check whether the current time is past the
//          // Access Token's expiry time
        const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
        return new Date().getTime() < expiresAt;
      }

      static getProfile() {
        if (!localStorage.getItem('profile')) {
          return Authorization.getUserData()
            .then(
              profile => {
                localStorage.setItem('profile', JSON.stringify(profile));
                return profile;
              }
            );
        }

        return Promise.resolve(JSON.parse(localStorage.getItem('profile')));
      }
    }

    return Authentication;
  }
);