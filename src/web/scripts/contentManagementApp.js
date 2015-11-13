function handleWorkspaces(data){
    if(data != null){
        var options = $("#workspaces")

        $.each(data.body.entities, function() {
            options.append($("<option />").val(this.id).text(this.name));
        });

        pureCloud.paging.nextPage(data.body).then(handleWorkspaces);
    }
}

traceService.log("Initializing contentmanagement office addin")

function startup(){

    loadHelpDialog();

    $("#cancelSaveAttachment").click(function(){
        $('#saveDialog').hide();
    });


    $("#closeDuplicateFileDialogButton").click(function(){
        $('#duplicateFileDialog').hide();
    });

    $("#confirmDuplicateButton").click(function(){
        $('#duplicateFileDialog').hide();
        completeSave();
    });

    traceService.log("starting")
    $("#content-main").show();
    $("#loginView").hide();

    $("#contentManagementView").show();
    $("#loginView").hide();

    pureCloud.contentManagement.workspaces.getWorkspaces().then(handleWorkspaces);

    $('#logoffButton').show();
    $('#settingsButton').show();

    $('#saveAttachment').click(function(){

        if($("#workspaces").val().length == 0){
            showError("Workspace not set.");
            return;
        }

        if($("#workspaceFilename").val().length == 0){
            showError("Filename not set.");
            return;
        }

        var searchBody = {
              "pageNumber": page,
              "pageSize": 50,
              "queryPhrase": "",
              "facetNameRequests": ["tags","createdByDisplayName","contentType","name", "contentLength", "dateModified"],
              "sort": [
                {
                  "name": "name",
                  "ascending": false
                }
              ],
              "filters": [
                  {
                    "systemFilter": false,
                    "id": "workspaceId",
                    "type": "STRING",
                    "name": "workspaceId",
                    "operator": "EQUALS",
                    "values": [workspaceId]
                }
              ],
              "queryPhrase":searchString

          };

        pureCloud.contentManagement.query(searchBody).then(response){
            var data = response.body;

            if(data.results.entities.length > 0){
                $('#duplicateFileDialog').show();
            }
            else{
                completeSave();
            }
        }
    });

    loadAttachments();

}

function showError(message){
    $('#errorDialog').show();
    $('#errorMessage').text(message);
}

function completeSave(){

    var attachmentId = $('#saveFileId').text();
    var ewsUrl = Office.context.mailbox.ewsUrl;

    Office.context.mailbox.getCallbackTokenAsync(function (ar) {
            var attachmentData = {
                AuthToken: ar.value,
                AttachmentId: attachmentId,
                EwsUrl: ewsUrl,
                WorkspaceId: $("#workspaces").val(),
                FileName: $('#workspaceFilename').val(),
                MailId : mailId,
                ContentType:$('#saveFileType').text(),
            };

            $.ajax({
                method: 'POST',
                url: '/saveattachment',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                timeout: 2000,
                data:JSON.stringify(attachmentData)
            }).success(function (data, status, headers, config) {
                $("#saveSuccess").show();
                $("#saveDialog").hide();

                setTimeout(function(){
                    $("#saveSuccess").hide();
                }, 1500);
            });
        });
}

function loadAttachments(){

    mailId = Office.context.mailbox.item.itemId;

    traceService.log(Office.context.mailbox.item.attachments);

    $.each(Office.context.mailbox.item.attachments, function(index, value) {
        if(!this.isInline){
            //$('#attachments').append("<div  class='file'><div class='attachmentcolumn'>" + this.name + '</div><span id="helpButton" title="Help" class="glyphicon glyphicon-floppy-disk  saveattachmentbtn attachmentcolumn" aria-hidden="true" data-index="' + index + '" data-type="'+ this.contentType +'" id="'+ this.id + '" ></span></div>');
            $('#attachments').append('<tr>><td><div class="filename saveattachmentbtn"  data-index="' + index + '" data-type="'+ this.contentType +'" id="'+ this.id + '">' + this.name + '</div></td></tr>');
        }
    });

    traceService.log(attachments.length + " attachments");

    $('.saveattachmentbtn').click(function(e){
        var data = jQuery(e.currentTarget).data();
        traceService.log(data);

        var attachment = Office.context.mailbox.item.attachments[data.index];
        showSaveDialog(attachment.id, attachment.name, attachment.size, attachment.contentType);

    });

}

function showSaveDialog(id, name, size, type){
    $('#saveFileId').text(id);
    $('#saveFileName').text(name);
    $('#saveFileSize').text(size);
    $('#saveFileType').text(type);
    $('#workspaceFilename').val(name);

    $('#saveDialog').show();
}

$( document ).ready(function() {
    $('#saveDialog').hide();
});
