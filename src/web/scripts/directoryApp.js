/*global Office:false */
/*global Mustache:false */
/*global PureCloud:false */
/*global directorySettings:false */
/*global traceService:false */
/*exported startup */
/*exported call */
/*exported contactClicked */
/* jshint -W097 */
'use strict';

var userService = userService();
var settings = null;
var webSocket = null;
var channelId = null;

function generateTemplate(personData){
    var template = $('#personTpl').html();
    var html = Mustache.to_html(template, personData);
    return html;
}

function loadDirectoryInfo() {
    var userIds = [];

    var from = Office.context.mailbox.item.from ;
    var to = Office.context.mailbox.item.to.sort();
    var cc = Office.context.mailbox.item.cc.sort();

    if(from === null)
    {
        from = Office.context.mailbox.item.organizer;
    }

    if(to === null){
        to = Office.context.mailbox.item.requiredAttendees.sort();
    }

    if(cc === null)
    {
        cc= Office.context.mailbox.item.optionalAttendees;
    }

    var contactCount = 1 + to.length + cc.length;

    traceService.debug("from : " + JSON.stringify(from));

    userService.getUser(from, function (user) {
        userIds.push(user.id);
        var person = generateTemplate(user);
        $("#from").html(person);
        $("#fromLabel").show();
        subscribeToUserStatus(userIds);
    });

    function subscribeToUserStatus(userIds){
        if(contactCount > userIds.length){
            return;
        }

        var subscriptionList = [];

        for(var index=0; index < userIds.length; index++){
            subscriptionList.push ({"id": "users."+ userIds[index] +".primarypresence"});
        }
        PureCloud.notifications.channels.subscriptions.addSubscription(channelId, subscriptionList);

    }

    traceService.debug(to);

    function processToUser(user){
        userIds.push(user.id);
        subscribeToUserStatus(userIds);
        $("#to").html($("#to").html() + generateTemplate(user));
        $("#toLabel").show();
    }

    for(var t=0; t<to.length; t++){
        userService.getUser(to[t], processToUser);
    }

    function processCcUser(user){

        $("#cc").html($("#cc").html()  + generateTemplate(user));
        $("#ccLabel").show();
        userIds.push(user.id);
        subscribeToUserStatus(userIds);
    }

    for(var c=0; c<cc.length; c++){
        userService.getUser(cc[c],processCcUser);
    }
}

function startup(){

    settings = appSettings();

    traceService.log("starting");

    $("#content-main").show();
    $("#directoryView").show();

    loadDirectoryInfo();

    $('#settingsButton').show();

    PureCloud.notifications.channels.createChannel().done(function(data){
        channelId = data.id;
        //start a new web socket using the connect Uri of the channel
        webSocket = new WebSocket(data.connectUri);

        webSocket.onmessage = function(socketMessage) {
            var message =  JSON.parse(socketMessage.data);

            if(message.topicName.match(/users.*primarypresence/)){
                var userId =message.topicName.replace('users.','').replace('.primarypresence', '');
                var newStatus = message.eventBody.presenceDefinition.systemPresence;

                var spanSelector = "span[data-id='"+ userId +"']";
                var imageSelector = "div[data-id='"+ userId +"']," + spanSelector;

                $(imageSelector).removeClass (function (index, css) {
                    return (css.match (/status[A-Za-z]*/) || []).join(' ');
                });

                $(imageSelector).addClass("status" + newStatus);
                $(spanSelector).attr('data-status', newStatus);
            }

        };
    });

}

function call(user){
    PureCloud.conversations.createConversation(null, null, null, user);
}

function contactClicked(element){
    $('#personDetails').show();

    var template = $('#personDetailsTemplate').html();
    var html = Mustache.to_html(template, element.dataset);
    $("#personDetails").html(html);

    if(settings.shouldCreateMailto() === true){
        $('#detailEmailLink').show();
        $('#detailEmail').hide();
    }else{
        $('#detailEmail').show();
        $('#detailEmailLink').hide();
    }

    $( "#detailPhoneLink" ).unbind();

    if(settings.shouldCreateTel() === true){
        $('#detailPhoneLink').attr("href", "tel:" + element.dataset.phone);

    }else{
        $('#detailPhoneLink').click(function(){
            call(element.dataset.id);
        });
    }

    $('#people').addClass('paddedLists');
}
