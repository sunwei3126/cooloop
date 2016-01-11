// A simple directive to handle server side form validation
// http://codetunes.com/2013/server-form-validation-with-angular/
angular.module('directives.fileuploader', [])
 .directive('campusLoader', [function () {
   return {
     restrict: 'AE',
     replace: true,
     transclude: true,
     template:'<input type="file" name="files"/>',
     link:function(scope, element, attrs) {
       var id = scope.site._id;
       element.fileupload({ 
         dataType: 'json', 
         acceptFileTypes: /(\.|\/)(json|json|txt)$/i,
         url: 'api/sites/' + id + '/campusfile',
         done:function(e,result){  
           alert('Upload campus file succeeded.');
         },
        fail: function (e, data) {
           alert('Error uploading campus file failed!');
        },
        add: function (e, data) {
          if (e.isDefaultPrevented()) {
              return false;
          }
          
          var acceptFileTypes = /^json\/(json|txt)$/i;
          if(data.originalFiles[0]['type'].length && !acceptFileTypes.test(data.originalFiles[0]['type'])) {
            return alert('Only accept json and txt file.');
          }
          data.submit();
        }
       });    
     }
   };
 }])
 .directive('imgUploader', [function () {
   return {
     restrict: 'AE',
     replace: true,
     transclude: true,
     template:'<input type="file" name="files"/>',
     link:function(scope, element, attrs) {
       var id = scope.site._id;
       element.fileupload({ 
         dataType: 'json', 
         acceptFileTypes: /(\.|\/)(png)$/i,
         url: 'api/sites/' + id + '/img',
         done:function(e,result){  
           alert('Upload site image file succeeded.');
         },
        fail: function (e, data) {
           alert('Error uploading image file failed!');
        },
        add: function (e, data) {
          if (e.isDefaultPrevented()) {
              return false;
          }
          
          data.submit();
        }
       });    
     }
   };
 }]);