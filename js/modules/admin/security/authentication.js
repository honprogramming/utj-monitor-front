define(
    [],
    function () {
        const Authorization = {
            userProfile: undefined,
            sessionObservers: [],
            addObserver: (observer) => {
                Authorization.sessionObservers.push(observer);
            },
            webAuth: new auth0.WebAuth(
                    {
                        domain: 'handsonprogramming.auth0.com',
                        clientID: 'zDfbAMSrZj1D3B4EucaCMN72Hen7ny5b',
                        responseType: 'token id_token',
                        audience: 'https://handsonprogramming.auth0.com/userinfo',
                        scope: 'openid profile',
                        redirectUri: `${window.location.href}`
                    }
            ),
            authorize: () => {
                Authorization.webAuth.authorize();
            },
            handleAuthentication: () => 
                new Promise(
                    (resolve, reject) => {
                        Authorization.webAuth.parseHash(
                            (err, authResult) => {
                                if (authResult && authResult.accessToken && authResult.idToken) {
                                    window.location.hash = '';
                                    Authorization.setSession(authResult);
                                    resolve(authResult);
                                } else if (err) {
                                    reject(err);
                                }
                            }
                        );
                    }
                ),
            setSession: (authResult) => {
                // Set the time that the Access Token will expire at
                const expiresAt = JSON.stringify(
                  authResult.expiresIn * 1000 + new Date().getTime()
                );
        
                localStorage.setItem('access_token', authResult.accessToken);
                localStorage.setItem('id_token', authResult.idToken);
                localStorage.setItem('expires_at', expiresAt);
            },
            logout: () => {
                // Remove tokens and expiry time from localStorage
                localStorage.removeItem('access_token');
                localStorage.removeItem('id_token');
                localStorage.removeItem('expires_at');
                
                Authorization.sessionObservers.forEach(
                    observer => observer('logout')
                );
            },
            isAuthenticated() {
                // Check whether the current time is past the
                // Access Token's expiry time
                const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
                return new Date().getTime() < expiresAt;
            },
            getProfile: () => {
                if (!Authorization.userProfile) {
                    return new Promise(
                        (resolve, reject) => {
                            const accessToken = localStorage.getItem('access_token');

                            if (accessToken) {
                                Authorization.webAuth.client.userInfo(accessToken, 
                                    (error, profile) => {
                                        if (profile) {
                                            Authorization.userProfile = profile;
                                            resolve(Authorization.userProfile);
                                        }
                                    }
                                );
                            } else {
                                reject(`Error: ${error.message}`);
                            }
                        }
                    );
                } else {
                  return Promise.resolve(Authorization.userProfile);
                }
            }
        };

        return Authorization;
    }
);