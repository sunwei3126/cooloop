'use strict';

angular.module('site.equipments', ['firebase', 'services.siteResource', 'services.utility', 'ui.bootstrap'])
.controller('SiteEquipmentsCtrl', ['$scope', '$firebaseObject', '$firebaseArray', '$location', '$log', "$firebase", 'utility', 'siteResource', 
  function ($scope, $firebaseObject, $firebaseArray, $location, $log, $firebase, utility, siteResource) {
    var fetchCampusFromFirebase = function (site) {
      $scope.loading = true;
      var ref = new Firebase("https://iecmon.firebaseio.com/Campus/HVACs");
      $scope.HVACs = $firebaseArray(ref);
      $scope.HVACs.$loaded()
        .then(function(data) {
          if($scope.HVACs.length > 0)
          {
            $scope.ActiveHVAC = $scope.HVACs[0];
            $scope.ActiveHVAC.isOpen = true;
            if($scope.ActiveHVAC.Equipments.length > 0)
              $scope.showEquipment($scope.ActiveHVAC.Equipments[0]);
          }
          $scope.loading = false;
        })
        .catch(function(error) {
          console.error("Error:", error);
          $scope.loading = false;
        });    
    };
    
    var fetchProperties = function(equipment) {
      var path = '/Model/' + $scope.ActiveHVAC.Name + '/' + equipment.Name + '/properties';
      $scope.rootRef.child(path).on("value", function(dataSnapshot) {
        $scope.dataSnapshot = dataSnapshot.val();
      });       
    }

    $scope.isRunning = function (equipment) {
      return equipment.state == 1;
    };
    
    $scope.isActive = function (item) {
      return item == $scope.ActiveEquipment || item == $scope.ActiveHVAC;
    };
    
    $scope.getImage = function (equipment) {
      if(!equipment)
        return;
      
      var result = 'assets/images/iec/' +  equipment.NodeType + '.png';
      return result;
    };
    
    $scope.showEquipment = function (equipment, $event) {
      $scope.ActiveEquipment = equipment;
      fetchProperties(equipment);
    };
    

    //firebase
    $scope.loading = true;
    $scope.HVACs = [];

    $scope.dataSnapshot = {};
    $scope.rootRef = new Firebase("https://iecmon.firebaseio.com/Campus");
   
    
    // model def
    $scope.alerts = [];
    $scope.errfor = {};
    
    // method def
    $scope.hasError = utility.hasError;
    $scope.showError = utility.showError;
    $scope.canSave = utility.canSave;
    $scope.closeAlert = function (ind) {
      $scope.alerts.splice(ind, 1);
    };    
    
    fetchCampusFromFirebase($scope.site);
  }
]);


