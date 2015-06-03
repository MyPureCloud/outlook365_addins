
var directory = (function(){
    from = null;

    to = [];
    cc = [];
    person = null;

    function createPersonElement(person){

        if(person.phone == null){
            return "<div class='contact' style='margin-right:5px; white-space:nowrap'>" +
                        person.name + " &lt;" + person.email + "&gt;; " +
                        "</div> " ;
        }

        return "<span style='margin-right:5px; white-space:nowrap' class='contact directorycontact status"+ person.status +"' onclick='contactClicked(this)' " +
                        "data-name='"+ person.name  +"' data-phone='"+person.phone  +"' data-id='"+ person.id +"' data-department='"+person.department +"' data-title='"+ person.title +"' data-email='" + person.email +"' data-picture='" + person.largePicture +"' data-status='" + person.status+"'  >" +
            "<img src='" + person.picture + "' class='entity-image'></img><span style='position:relative'>" + person.name + '</span> '
        "  </span>";
    }

    return{
        loadDirectoryInfo:function() {

            var from = Office.context.mailbox.item.from ;
            if(from == null)
            {
                from = Office.context.mailbox.item.organizer;
            }

            traceService.debug("from : " + JSON.stringify(from))

            userService.getUser(from, function (user) {
                var person = createPersonElement(user);
                $("#from").html(person);
                $("#fromLabel").show();

            });

            var to = Office.context.mailbox.item.to.sort();;

            if(to == null){
                to = Office.context.mailbox.item.requiredAttendees.sort();;
            }

            traceService.debug(to);
            for(var t=0; t<to.length; t++){
                userService.getUser(to[t], function (user) {
                    var person = createPersonElement(user);
                    $("#to").html($("#to").html() + person);
                    $("#toLabel").show();
                });
            }

            var cc = Office.context.mailbox.item.cc;

            if(cc == null)
            {
                cc= Office.context.mailbox.item.optionalAttendees;
            }
            for(var c=0; c<cc.length; c++){
                userService.getUser(cc[c], function (user) {
                    var person = createPersonElement(user);
                    $("#cc").html($("#cc").html() + person);
                    $("#ccLabel").show();
                });
            }



        }
    }

});
