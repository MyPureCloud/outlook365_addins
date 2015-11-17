/*exported directorySettings */
/* jshint -W097 */
'use strict';
var directorySettings = (function(){
    $('#settingCreateTel').change(function() {
        localStorage.createTel =  this.checked;
    });

    $('#settingCallInPureCloud').change(function() {
        localStorage.createTel =  !this.checked;
    });

    if(localStorage.createTel === 'true'){
        $('#settingCreateTel').prop('checked', true);
    }else{
        $('#settingCallInPureCloud').prop('checked', true);
    }

    return{
        shouldCreateTel: function(){
            if(localStorage.createTel){
                return localStorage.createTel === "true";
            }

            return false;
        },
        shouldCreateMailto: function(){
            return false;
        }
    };

});
