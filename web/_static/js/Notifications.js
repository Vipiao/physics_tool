

function notifications(){}

notifications.prototype.init = function(){

    var body = document.getElementsByTagName("body")[0];
    console.log("init");

}

notifications.prototype.check = function(){

    console.log("check");
    
    var body = document.getElementsByTagName("body")[0],
    c = document.getElementById("notifications");

    if (!c){

        var container = document.createElement("ul");
        container.setAttribute("id","notifications")
        body.insertBefore(container,body.firstChild);
        
    }
}
var totalNumberOfNotifications = 0;
notifications.prototype.add = function(notification){
    
    console.log("add");
    // hotfix
    notification.id = "notif_" + totalNumberOfNotifications++;
    //
    mf_ajaxHandler.addLastChild(elementId="notifications", url = "/getTMPL?tmpl=notification", data=notification);
    
}

notifications.prototype.retrieve = function(notifications){

    console.log("retrieve");
    this.check();
    for (var i=0,len=notifications.length; i<len;i++){
        this.add(notifications[i]);
    }

}



var notifications = new notifications();
window.addEventListener("load", notifications.init.bind(notifications));
