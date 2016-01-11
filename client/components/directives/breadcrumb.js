// A simple directive to handle server side form validation
// http://codetunes.com/2013/server-form-validation-with-angular/
angular.module('directives.breadcrumb', ['ui.router'])
  .directive('breadcrumb', ['$interpolate', '$state',
function ($interpolate, $state) {
  return {
    restrict: 'AE',
    replace: true,
    templateUrl: function (elem, attrs) {
      return attrs.templateUrl || 'assets/tpl/breadcrumbs.tpl.html';
     },
     link:function(scope) {
        scope.breadcrumbs = [];
        if ($state.$current.name !== '') {
            updateBreadcrumbsArray();
        }
        scope.$on('$stateChangeSuccess', function() {
            updateBreadcrumbsArray();
        });

        function updateBreadcrumbsArray() {
            var workingState;
            var displayName;
            var breadcrumbs = [];
            var currentState = $state.$current;

            while(currentState && currentState.name !== '') {
                workingState = getWorkingState(currentState);
                if (workingState) {
                    displayName = getDisplayName(workingState);

                    if (displayName !== false && !stateAlreadyInBreadcrumbs(workingState, breadcrumbs)) {
                        breadcrumbs.push({
                            stateDescription : workingState.data.stateDescription,
                            displayName: displayName,
                            route: workingState.name
                        });
                    }
                }
                currentState = currentState.parent;
            }
            scope.stateDescription = breadcrumbs[0].stateDescription;
            breadcrumbs.push({
              stateDescription : 'Go home',
              displayName: '首页',
              route: 'main'
            });

            breadcrumbs.reverse();
            scope.breadcrumbs = breadcrumbs;
        }

        function getWorkingState(currentState) {
            var workingState = currentState;
            if (currentState.abstract === true) {
                if (typeof currentState.data.abstractProxy !== 'undefined') {
                  workingState = $state.get(currentState.data.abstractProxy);
                } else {
                    workingState = false;
                }
            }
            return workingState;
        }

        function getDisplayName(currentState) {
            var interpolationContext;
            var displayName;
            if (!currentState.data.displayName) {
                // if the displayname-property attribute was not specified, default to the state's name
                return currentState.name;
            }
          
            interpolationContext =  (typeof currentState.locals !== 'undefined') ? currentState.locals.globals : currentState;
            displayName = $interpolate(currentState.data.displayName)(interpolationContext);
            return displayName;
        }
       
        function stateAlreadyInBreadcrumbs(state, breadcrumbs) {
          var i;
          var alreadyUsed = false;
          for (i = 0; i < breadcrumbs.length; i++) {
            if (breadcrumbs[i].route === state.name) {
              alreadyUsed = true;
            }
          }
          return alreadyUsed;
        }
    }
  };
}]);