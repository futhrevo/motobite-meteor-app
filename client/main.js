/* global Tracker */
/* global markArray */
/* global ReactiveArray */
(function () {
    console.info("Immediate function fired up at "+ new Date().toTimeString());
    Session.set('map', false);
    Session.set('mode', null);

    //check for cordova and register for events
    if (Meteor.isCordova) {
        document.addEventListener("deviceready", onDeviceReady, false);
    }
    if (supports_html5_storage()) {
        // window.localStorage is available!
        console.info("window.localStorage is available!");
    } else {
        // no native support for HTML5 storage :(
        // maybe try dojox.storage or a third-party solution
        console.info("no native support for HTML5 storage :(");
        console.info("maybe try dojox.storage or a third-party solution");
    }


    if ("geolocation" in navigator) {
        /* geolocation is available */
        console.info("geolocation is available");
    } else {
        /* geolocation IS NOT available */
        console.info("geolocation is not available");
    }


    //initialize toastr
    toasterInit();
    //TODO implement Routeboxer into functions http://google-maps-utility-library-v3.googlecode.com/svn/tags/routeboxer/1.0/docs/examples.html
    //TODO create packed client codes
    //Use NoScript, a limited user account and a virtual machine and be safe(r)!

    //ReactiveArray to store polylines
    //http://reactivearray.meteor.com/
    polyArray = new ReactiveArray();
    markArray = new ReactiveArray();

    Tracker.autorun(function(){
        let user;
        if (!(user = Meteor.user())) {
            return;
        }
        if (!user.roles) {
            return;
        }
        // if (user.roles.indexOf('banned') >= 0) {
        //     alert("Login disabled! Contact adminstrator");
        //     return Meteor.logout();
        // }
    })
}());

function onDeviceReady() {
    window.motobite.location.configure();
    window.motobite.location.echo();
    //add back button event
    //http://stackoverflow.com/questions/28055836/back-button-in-cordova-phongap-meteor-build-for-android-wont-close-application
    document.addEventListener("backbutton", function (e) {
        if(Router.current().route.getName() == "index"){
            e.preventDefault();
            if($("body").hasClass("action-sheet-open")){
                IonActionSheet.close();
                return;
            }
            if($('#inputFormOuterId').hasClass("inpShowing")){
                $('#inputFormOuterId').removeClass("inpShowing").hide(100);
                return;
            }
            if($('[data-action=showInput]').is(":visible")){
                $('[data-action=showInput]').trigger('click');
                return;
            }
            if($('#outputDirectionDiv').is(":visible")){
                $('[data-action=showInput]').trigger('click');
                return;
            }
            navigator.app.exitApp();
        }else{
            navigator.app.backHistory()
        }
        // if (history.state && history.state.initial === true) {
        //     navigator.app.exitApp();
        // } else {
        //     history.go(-1);
        // }
    }, false);
    console.log("Cordova is running");

};

function supports_html5_storage() {
    if (Meteor.isCordova) {

        return true;
    } else {
        try {
            return 'localStorage' in window && window['localStorage'] !== null;
        } catch (e) {
            return false;
        }
    }
}

function toasterInit(){
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": true,
        "progressBar": false,
        "positionClass": "toast-bottom-center",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "100",
        "hideDuration": "1000",
        "timeOut": "2500",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }
}
