Template.dispMap.helpers({
  marker: function() {
    if (Session.get('map'))
      return MarkerColl.find({ valid: true });
    else
      return null;
  },
  mapState: function(){
	var currentRoute = Router.current();
	var route = currentRoute.lookupTemplate();
	if(route ==""){
		$('.mapState').show();
	}else{
		$('.mapState').hide("slow");
	}
  }
});

Template.dispMap.events({
	// 'submit form':function(event,template){
    'click #polySubmit':function(event,template){
		event.preventDefault();
        //console.log("submit clicked");
		// var element = template.find('input:radio[name=transit]:checked');
		// var selectedOption = $(element).val();
        var selectedOption = $('#polyInpMode').prop('selected');
		//http://diveintohtml5.info/storage.html
		//using local storage to store more permanently
		//TODO: add interface to clear/delete local storage data from above link

		localStorage["checked"] = selectedOption;
		console.info("selected element is : " + selectedOption);

		console.log("TODO input validation");

		// console.log(gmap.haversine(placesSrc[0].geometry.location, placesDest[0].geometry.location, "km"));
		// console.log("google calculated without distancematrix : "+gmap.sphericalD(placesSrc[0].geometry.location, placesDest[0].geometry.location));
		var search = getSearchBoxdata();
		var distance = gmap.haversine(search[0],search[1],"km","geo");
		var duration = 15 + (distance * 6);
		var validTime = validateTime(search[2], duration);
		if(validTime[0]){
			if(selectedOption == 'rider'){
				Session.set('mode', 'rider');
				if(!$('#directions-panel').length){
					$('#map-canvas').addClass('col-sm-9 col-md-9 col-lg-9').removeClass('col-sm-12 col-md-12 col-lg-12');
					$(".mapd").append('<div class="col-xs-12 col-sm-3 col-md-3" id="directions-panel"></div>');
				}
				// gmap.calcRoute(placesSrc[0].geometry.location,placesDest[0].geometry.location);
				gmap.calcRoute();

			}else{
				Session.set('mode', 'ride');
				polyArray.clear();
				Meteor.call('rideQuery',getSearchBoxdata(),function(err,data){
					if(err) console.log(err);
					console.log(data);
					_.each(data,function(poly){
						gmap.polyDraw(poly);
					});
					// gmap.polyDraw(data[0].overview);
				});
				console.log('TODO show markers of riders from surrounding areas to destination');
			}
		}else{
			var result;
			if(validTime[1] == "drives"){
				result = DrivesAdvtColl.find({_id:validTime[2]});
			}else{
				result = DriversAdvtColl.find({_id:validTime[2]});
			}
			if (confirm("Duplicate ride already exists. Do you want to edit it?")) {
				console.log("TODO go to edit page for the conflict ride");
			} else {
				// Do nothing!
			}


		}

	},

	//TODO delete the below event if paper checkbox is working fine
    'change .checkbox':function(event){
		event.preventDefault();
		if(event.target.checked){
			$('#map-src-search').val("").attr("disabled",true);
			gmap.geocode(Session.get('lat'),Session.get('lng'));
		}else{
			$('#map-src-search').attr("disabled",false).val("");
		}
	},

    'change #polycheckboxSrc':function(event){
        event.preventDefault();
        if(event.target.checked){
            $('#polyMapSrcSearch').val("").attr("disabled",true);
            gmap.geocode(Session.get('lat'),Session.get('lng'));
        }else{
            $('#polyMapSrcSearch').attr("disabled",false).val("");
        }
    }
});

Template.dispMap.destroyed = function(){
	Session.set('map', false);
}
