
var contentmanagement = contentmanagement();
var userService = userService();

var bodyHeight = 0;
Office.initialize = function () {
    $("#workspaces").prop('disabled', true);
    startup();
};

function workspacesLoaded(workspaceDefinitions){
    $("#workspaces").prop('disabled', false);

    traceService.log(workspaceDefinitions)

    var options = $("#workspaces")

    $.each(workspaceDefinitions, function() {
        options.append($("<option />").val(this.id).text(this.name));
    });

    $('#workspaces').change(function(){
        var workspaceId = $("#workspaces").val();

        contentmanagement.loadFiles($("#workspaces").val(), 0 , '', 0, function(pageCount, count, files){
            traceService.log(files)
            loadFiles(pageCount,count, files);
        });
    });


}

function loadFiles(pageCount, count, fileList){

    function getFileRow(file,index){

        var cls = (index %2 == 0) ? "fileDark" : "";

        return '<div class="file '+ cls +'"><div class="fileName">' + file.name + '</div><div class="fileSize"> ' +  getFileSizeString(file.contentLength) + '</div><div> ' + file.createdBy.name + "</div> <button id='"+ file.id + "' class='btn btn-primary btn-xs attachBtn'>Attach</button></div>"
    }

    $('#workspaceFiles').html('');
    var fileIndex = 0;

    $.each(fileList, function(){
        $('#workspaceFiles').html($('#workspaceFiles').html() + "<div style='clear: both;'></div>" + getFileRow(this.body, fileIndex));
        fileIndex++;
    });

    $('#fileCountLabel').html( "Showing " + fileList.length + ' of ' + count + ' files' );

    $('.attachBtn').click(function(e){
        var id = jQuery(e.currentTarget).id;

        attachFile(id, "test.xml");

    });

}

function attachFile(id, name){

    var request = '<?xml version="1.0" encoding="utf-8"?>'+
    '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"'+
'xmlns:t="http://schemas.microsoft.com/exchange/services/2006/types">'+
               '<soap:Body>'+
  '<FindItem xmlns="http://schemas.microsoft.com/exchange/services/2006/messages"'+
    'xmlns:t="http://schemas.microsoft.com/exchange/services/2006/types"'+
               'Traversal="Shallow">'+
              '<ItemShape>'+
      '<t:BaseShape>IdOnly</t:BaseShape>'+
        '</ItemShape>'+
      '<ParentFolderIds>'+
      '<t:DistinguishedFolderId Id="drafts"/>'+
        '</ParentFolderIds>'+
      '</FindItem>'+
    '  </soap:Body>'+
'</soap:Envelope>';
    Office.context.mailbox.makeEwsRequestAsync(request, function (result) {
        traceService.log(result)
    });

    return;

    var ewsUrl = Office.context.mailbox.ewsUrl;
    var mailId = Office.context.mailbox.item.itemId;

    Office.context.mailbox.getCallbackTokenAsync(function (ar) {
            var attachmentData = {
                AuthToken: ar.value,
                AttachmentName: name,
                EwsUrl: ewsUrl,
                PureCloudToken : login.sessionId(),
                MailId : mailId,
                DocumentId : id

            };

            $.ajax({
                method: 'POST',
                url: '/attachfile',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                timeout: 2000,
                data:JSON.stringify(attachmentData)
            }).success(function (data, status, headers, config) {

            });
        });
}

traceService.log("Initializing cm office addin")

function doLogin(){
    login.login($("#email").val(), $("#password").val(), function(data){
        if(login.isLoggedIn()){
            login.getSession(function(){
            $("#contentManagementView").show();
            $("#loginView").hide();
            contentmanagement.getWorkspaces(workspacesLoaded);

            $('#logoffButton').show();

            $('#errorView').hide();
            $('#settingsButton').show();});
        }else{
            $('#errorView').show();
            $('#errorView').text(data.message);
        }
    });
}



function startup(){

    loadHelpDialog();

    traceService.log("starting")
    $("#content-main").show();
    $("#loginView").hide();


    bodyHeight = $("body").height();
    $('#workspaceFiles').height(bodyHeight - 150)


    login.testConnection(function(){

        //already have valid cookie and session
        login.getSession(function(){
            $("#contentManagementView").show();
            $("#loginView").hide();
            contentmanagement.getWorkspaces(workspacesLoaded);
            $('#logoffButton').show();
            $('#settingsButton').show();

        });

    }, function(){
        //don't have a valid session, need to login
        $("#contentManagementView").hide();
        $("#loginView").show();
        $("#signIn").click(function(){
            doLogin();
        });
    });



}
