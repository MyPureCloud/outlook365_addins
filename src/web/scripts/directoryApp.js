
var directory = directory();
var userService = userService();
var settings = null;

function startup(){

    loadHelpDialog();

    settings = directorySettings();

    traceService.log("starting")
    $("#content-main").show();

    $("#directoryView").show();
    directory.loadDirectoryInfo();
    $('#settingsButton').show();

}

function call(user){
    pureCloud.conversations.placeCall({callUserId:user}).then(function (response) {

    });
}


function contactClicked(element){
    $('#personDetails').show();
    $('#largeImage').attr("src", element.dataset.picture);
    $('#detailName').text(element.dataset.name);
    $('#detailTitle').text(element.dataset.title);
    $('#detailDepartment').text(element.dataset.department);

    if(settings.shouldCreateMailto() === true){
        $('#detailEmailLink').attr("href", "mailto:" + element.dataset.email);
        $('#detailEmailLink').text(element.dataset.email);
        $('#detailEmailLink').show();
        $('#detailEmail').hide();
    }else{
        $('#detailEmail').text(element.dataset.email);
        $('#detailEmail').show();
        $('#detailEmailLink').hide();
    }

    $('#detailPhoneLink').text(element.dataset.phone);
    $('#detailPhoneLink').show();
    $('#detailPhone').hide();

    $( "#detailPhoneLink" ).unbind();

    if(settings.shouldCreateTel() === true){
        $('#detailPhoneLink').attr("href", "tel:" + element.dataset.phone);

    }else{
        $('#detailPhoneLink').click(function(elem){
            call(element.dataset.id);
        });
    }

    $('#people').addClass('paddedLists');
    $("#detailImageContainer").removeClass();
    $("#detailImageContainer").addClass("personDetailsField");
    $('#detailImageContainer').addClass('status' + element.dataset.status);
}
