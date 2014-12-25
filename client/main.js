(function(){
	console.info("Immediate function fired up");
	Session.set('map', false);
	Session.set('mode', null);
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
	  	console.log("geolocation is not available");
	}

	function supports_html5_storage() {
	  	try {
	  		return 'localStorage' in window && window['localStorage'] !== null;
	  	} catch (e) {
	  		return false;
	  	}
	}
	//Subscriptions goes here
	Meteor.subscribe('theMarkers');
	// Meteor.subscribe('theDrivers');
	// Meteor.subscribe('theDrives');
	Meteor.subscribe('theLogs');

	//TODO implement Routeboxer into functions http://google-maps-utility-library-v3.googlecode.com/svn/tags/routeboxer/1.0/docs/examples.html
	//TODO create packed client codes
	//Use NoScript, a limited user account and a virtual machine and be safe(r)!

	//ReactiveArray to store polylines
	//http://reactivearray.meteor.com/
	polyArray =  new ReactiveArray();
	}());
