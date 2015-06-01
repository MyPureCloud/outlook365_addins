
var directory = directory();
var traceService = traceService();
var userService = userService();
var settings = null;

traceService.log("Initializing office addin")

function startup(){

    loadHelpDialog();

    settings = directorySettings();

    traceService.log("starting")
    $("#content-main").show();

    $("#directoryView").show();
    directory.loadDirectoryInfo();
    $('#settingsButton').show();

}
