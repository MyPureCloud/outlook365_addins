var directorySettings = (function(){


    $('#settingCreateTel').change(function() {
        localStorage.createTel =  this.checked;
    });

    $('#settingCallInPureCloud').change(function() {
        localStorage.createTel =  !this.checked;
    });


    $('#settingCreateMailto').change(function() {
        localStorage.createMailto =  this.checked;
    });


    if(localStorage.createTel === 'true'){
        $('#settingCreateTel').prop('checked', true);
    }else{
        $('#settingCallInPureCloud').prop('checked', true);
    }

    if(localStorage.createMailto === 'true'){
        $('#settingCreateMailto').prop('checked', true);
    }


    return{
        shouldCreateTel: function(){
            if(localStorage.createTel){
                return localStorage.createTel == "true";
            }

            return false;
        },
        shouldCreateMailto: function(){
            if(localStorage.createMailto){
                return localStorage.createMailto == "true";
            }

            return false;
        }
    }

});
