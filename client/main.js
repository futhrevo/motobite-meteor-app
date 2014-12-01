(function(){
	console.info("Immediate function fired up");
	Session.set('map', false);
	if (supports_html5_storage()) {
	  // window.localStorage is available!
	  console.info("window.localStorage is available!");
	} else {
	  // no native support for HTML5 storage :(
	  // maybe try dojox.storage or a third-party solution
	  console.info("no native support for HTML5 storage :(");
	  console.info("maybe try dojox.storage or a third-party solution");
	}
	function supports_html5_storage() {
	  try {
	    return 'localStorage' in window && window['localStorage'] !== null;
	  } catch (e) {
	    return false;
	  }
	}
}());
