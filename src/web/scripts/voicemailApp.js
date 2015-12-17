/*global Office:false */
/*global traceService:false */
/*global appSettings:false */
/*global PureCloud:false */
/*global statusService:false */
/*global Mustache:false */
/*exported startup */
/* jshint -W097 */
/*jshint loopfunc: true */
'use strict';

$("#content-main").hide();
$("#notLoggedIn").hide();

var statusServiceInstance = null;
var settings = null;

function setError(message, data){
    traceService.error(message +": " + JSON.stringify(data));
    $("#errorView").text(message);
    $("#errorView").show();
    $("#loading").hide();
}

function handleStatusChanged(userid, status){
    $("#fromImage").removeClass (function (index, css) {
        return (css.match (/status[A-Za-z]*/) || []).join(' ');
    });

    $("#fromImage").addClass("status" + status);
}

function getSessionAndVoicemail(){

    $("#content-main").hide();
    $("#loading").show();

    var mailId = Office.context.mailbox.item.itemId;
    var ewsUrl = Office.context.mailbox.ewsUrl;

    Office.context.mailbox.getCallbackTokenAsync(function (ar) {
            var attachmentData = {
                AuthToken: ar.value,
                EwsUrl: ewsUrl,
                MailId : mailId
            };

            $.ajax({
                method: 'POST',
                url: 'https://jbnweocqy1.execute-api.us-east-1.amazonaws.com/prod/outlook365_GetEmailBody',
                //url: '/lambda',
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 5000,
                data: JSON.stringify(attachmentData)
            }).success(function (data) {
                traceService.log(data);

                $("#player").show();
                $("#content-main").hide();

                function showRecordingUrlError(data){
                    setError("Unable to get recording url" , data);
                }

                function showRecording(templateData, phoneNumber, contactId){
                    traceService.log("got recording, showing player");

                    $("#content-main").show();
                    $("#loading").hide();
                    $('#audioPlayer').show();

                    var template = $('#recordingTemplate').html();
                    var html = Mustache.to_html(template, templateData);
                    $("#recordingContent").html(html);

                    $('#detailPhoneLink').click(function(){
                        PureCloud.conversations.createConversation(phoneNumber, null, null, contactId);
                    });
                }

                traceService.log('message: ' + data.phone + ' ' + data.time + ' ' + data.duration );

                function handleVoiceMailPage(data){
                    for(var i=0; i< data.entities.length; i++){
                        var message = data.entities[i];
                        traceService.log('message: ' + message.audioRecordingDurationSeconds + ' ' + message.callerAddress.replace(/\+/, '') + ' ' + message.createdDate.replace(/\.\d\d\dZ/, '') );

                        if(message.audioRecordingDurationSeconds == data.duration &&
                            message.callerAddress.replace(/\+/, '') == data.phone &&
                            message.createdDate.replace(/\.\d\d\dZ/, '') == data.time){


                            var templateData = {
                                fromName: message.callerName,
                                fromNumber: message.callerAddress,
                            };

                            PureCloud.voicemail.messages.media.getMessageMedia(message.id)
                                .done(function(messageDetails){
                                    templateData.voicemailUri = messageDetails.mediaFileUri;
                                })
                                .error(showRecordingUrlError)
                                .then(function(){
                                    if(message.callerUser){
                                        statusServiceInstance.subscribeToUserStatus([message.callerUser.id], handleStatusChanged);
                                        templateData.fromId = message.callerUser.id;

                                        PureCloud.get(message.callerUser.selfUri)
                                            .done(function(userDetails){
                                                if(userDetails.userImages !== null && userDetails.userImages.length >= 2){
                                                    templateData.picture = userDetails.userImages[1].imageUri;
                                                }
                                                templateData.fromTitle = userDetails.title;
                                                templateData.fromDepartment = userDetails.department;
                                            }).then(function(){
                                                statusServiceInstance.getUserStatus(message.callerUser.id, function(status){
                                                    templateData.fromStatus = status;
                                                    showRecording(templateData, null, message.callerUser.id);
                                                });
                                            });
                                    }

                                    showRecording(templateData, message.callerAddress, null);
                                });

                            return;
                        }
                    }

                    if(data.nextUri == null){
                        setError("Unable to find voicemail messages", {});
                    }

                    PureCloud.get(data.nextUri).done(handleVoiceMailPage);
                    
                }

                PureCloud.voicemail.messages.getVoicemailMessages().done(handleVoiceMailPage).error(function(data){
                    setError("Unable to get voicemail message", data);
                });

            }).error(function(data){
                setError("Unable to find recording details", data);
            });
        });


}

function startup(){
    settings = appSettings();

    statusServiceInstance = statusService();
    statusServiceInstance.setContactCount(1);
    getSessionAndVoicemail();

}
