/*global PureCloud:false */
/*global loadHelpDialog:false */
/*global directorySettings:false */
/*global traceService:false */
/*exported startup */
/*exported call */
/*exported contactClicked */
/* jshint -W097 */
'use strict';

var userService = userService();
var settings = null;

function generateTemplate(personData){
    var template = $('#personTpl').html();
    var html = Mustache.to_html(template, personData);
    return html;
}

function loadDirectoryInfo() {

    var from = Office.context.mailbox.item.from ;
    if(from === null)
    {
        from = Office.context.mailbox.item.organizer;
    }

    traceService.debug("from : " + JSON.stringify(from));

    userService.getUser(from, function (user) {
        var person = generateTemplate(user);
        $("#from").html(person);
        $("#fromLabel").show();
    });

    var to = Office.context.mailbox.item.to.sort();

    if(to === null){
        to = Office.context.mailbox.item.requiredAttendees.sort();
    }

    traceService.debug(to);

    function processToUser(user){
        $("#to").html($("#to").html() + generateTemplate(user));
        $("#toLabel").show();
    }

    for(var t=0; t<to.length; t++){
        userService.getUser(to[t], processToUser);
    }

    var cc = Office.context.mailbox.item.cc;

    if(cc === null)
    {
        cc= Office.context.mailbox.item.optionalAttendees;
    }

    function processCcUser(user){
        var person = createPersonElement(user);
        $("#cc").html($("#cc").html()  + generateTemplate(user));
        $("#ccLabel").show();
    }

    for(var c=0; c<cc.length; c++){
        userService.getUser(cc[c],processCcUser);
    }
}

function startup(){

    loadHelpDialog();

    settings = directorySettings();

    traceService.log("starting");
    $("#content-main").show();

    $("#directoryView").show();
    loadDirectoryInfo();
    $('#settingsButton').show();

}

function call(user){
    PureCloud.conversations.createConversation(null, null, null, user);
}

function contactClicked(element){
    $('#personDetails').show();

    var template = $('#personDetailsTemplate').html();
    var html = Mustache.to_html(template, element.dataset);
    $("#personDetails").html(html);
    
    //$('#largeImage').attr("src", element.dataset.picture);
    //$('#detailName').text(element.dataset.name);
    //$('#detailTitle').text(element.dataset.title);
    //$('#detailDepartment').text(element.dataset.department);

    if(settings.shouldCreateMailto() === true){
        //$('#detailEmailLink').attr("href", "mailto:" + element.dataset.email);
        //$('#detailEmailLink').text(element.dataset.email);
        $('#detailEmailLink').show();
        $('#detailEmail').hide();
    }else{
        //$('#detailEmail').text(element.dataset.email);
        $('#detailEmail').show();
        $('#detailEmailLink').hide();
    }

    //$('#detailPhoneLink').text(element.dataset.phone);
    //$('#detailPhoneLink').show();
    //$('#detailPhone').hide();

    $( "#detailPhoneLink" ).unbind();

    if(settings.shouldCreateTel() === true){
        $('#detailPhoneLink').attr("href", "tel:" + element.dataset.phone);

    }else{
        $('#detailPhoneLink').click(function(){
            call(element.dataset.id);
        });
    }

    $('#people').addClass('paddedLists');
    //$("#detailImageContainer").removeClass();
    //$("#detailImageContainer").addClass("personDetailsField");
    //$('#detailImageContainer').addClass('status' + element.dataset.status);
}
