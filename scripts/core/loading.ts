import {values} from 'lodash';
import {addInternalEventListener} from './internal-events';

function waitForExtensionsToLoad(): Promise<void> {
    return new Promise((resolve) => {
        const removeListener = addInternalEventListener('extensionsHaveLoaded', () => {
            removeListener();
            resolve();
        });
    });
}

angular.module('superdesk.core.loading', [])
    // prevent routing before there is auth token
    .run(['$rootScope', '$route', '$location', '$http', 'session', 'preferencesService',
        function($rootScope, $route, $location, $http, session, preferencesService) {
            var stopListener = angular.noop;

            $rootScope.loading = true;

            Promise.all([
                preferencesService.get(), // fetch preferences on load

                // wait for extensions so menu is only rendered after all extensions
                // have registered their custom pages.
                waitForExtensionsToLoad(),

            ]).then(() => {
                stopListener();
                $http.defaults.headers.common.Authorization = session.token;
                $rootScope.loading = false;
                // do this in next $digest so that beta service can setup route redirects
                // for features that should not be available
                $rootScope.$applyAsync($route.reload);
            });

            // prevent routing when there is no token
            stopListener = $rootScope.$on('$locationChangeStart', (e) => {
                $rootScope.requiredLogin = requiresLogin($location.path());
                if ($rootScope.loading && $rootScope.requiredLogin) {
                    e.preventDefault();
                }
            });

            /**
         * Finds out if there is a route matching given url that requires a login
         *
         * @param {string} url
         */
            function requiresLogin(url) {
                var routes = values($route.routes);

                for (var i = routes.length - 1; i >= 0; i--) {
                    if (routes[i].regexp.test(url)) {
                        return routes[i].auth;
                    }
                }
                return false;
            }
        }]);
