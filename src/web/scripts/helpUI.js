/*exported helpDialog */
/*exported loadHelpDialog */
/* jshint -W097 */

'use strict';

var helpDialog =
'<div id="help" class="alert alert-info " role="alert" style="display:none">'+
'   <button type="button" class="close"aria-label="Close" ><span aria-hidden="true" id="closeHelpButton">&times;</span></button>'+
'    The Add Ins for Microsoft office are as-is open source applications and can be found on GitHub https://github.com/MyPureCloud/outlook365addins'+
'    <br/>'+
'    <br/>'+
'    <br/>'+
'    For help or questions, see the PureCloud chat room "Open Source"'+
'    <br/>'+
'    User images not currently supported by Outlook for Mac'+
'    <br/>'+
'    User Agent: <div id="useragent"></div>'+
'</div>';


function loadHelpDialog(){
    $('body').append(helpDialog);

    $('#help').hide();
    $('#helpButton').click(function(){
        $('#help').show();
    });

    $('#closeHelpButton').click(function(){
        $('#help').hide();
    });

}
