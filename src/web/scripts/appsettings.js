/*exported directorySettings */
/* jshint -W097 */
'use strict';
var appSettings = (function(){

    var settingsTemplate = `<div id="settings" class="alert alert-info" role="alert" style='display:none'>
        <h2>Settings</h2>
        <form>
            <label>Phone Numbers</label>
            <br/>

            <input type="radio" id="settingCallInPureCloud"  name="phone">Place call through PureCloud</input>
            <br>
            <input type="radio" id="settingCreateTel" name="phone" >Create phone numbers as tel: links</input>

            <br/>
            <br/>
            <button id='settingsCloseButton' type="button" class="btn btn-primary">Close</button>
        </form>
    </div>`;

    $("body").append(settingsTemplate);

    $('#settings').hide();

    $('#settingsCloseButton').click(function() {
        $('#settings').hide();
    });

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
