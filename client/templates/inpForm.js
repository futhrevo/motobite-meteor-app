Template.inpForm.rendered = function() {
  //http://weareoutman.github.io/clockpicker/
  $('.clockpicker').clockpicker({
    'default': 'now',
  });

  window.ParsleyValidator.addValidator('tomoValidator',
      function(value, requirement) {
        // console.log($('#select option:selected').val()+ "value = "+value);
        if ($('#polyDateSel').val() == "Tomorrow" && value == "")
          return false;
        if ($('#polyDateSel').val() === "Today" && value == "")
          return true;

        var patterN = /^((2[0-3])|[01][0-9]):([0-5]\d)$/;
        if (!patterN.test(value))
          return false;

        var parts = value.match(patterN);

        var partHour = parseInt(parts[1], 10);
        var time = new Date();

        if ($('#polyDateSel').val() == "Today" && partHour <= time.getHours())
          if (parseInt(parts[2], 10) <= time.getMinutes())
            return false;

        return true;
      }, 32)
    .addMessage('en', 'tomoValidator', 'enter valid time');


  $('#form').parsley({
    trigger: 'change',
    // define your custom validators here
    validators: {
      multiple: function(value, element) {
        // if requirements[0] value does not meet requirements[1] expectation, field is required
        console.log("multiple " + value);
        if (value == null || value == "")
          return false;

        return true;
      },


    }

  });
};

Template.inpForm.helpers({
    modeSelect : function(){
        var sel = Session.get('modeSel');
        if(sel == "rider")
            return "I am Riding at around ";
        else
            return "I need a ride at around ";
    }
});

Template.inpForm.events({
    'click #fabInpCancel':function(event){
        event.preventDefault();
        $('#inputFormOuterId').hide(200);
    },

    'click .inputCloseBtn' : function(event){
        event.preventDefault();
        $('#inputFormOuterId').hide(200);
    },

    'change #polycheckboxSrc':function(event){
        event.preventDefault();
        if(event.target.checked){
            $('#polyMapSrcSearch').val("").attr("disabled",true);
            gmap.geocode(Session.get('lat'),Session.get('lng'));
        }else{
            $('#polyMapSrcSearch').attr("disabled",false).val("");
        }
    },

    // 'submit form':function(event,template){
    'click #fabInpSubmit':function(event,template){
		event.preventDefault();
        var selectedOption = Session.get('modeSel');
		//http://diveintohtml5.info/storage.html
		//using local storage to store more permanently
		//TODO: add interface to clear/delete local storage data from above link

		localStorage["checked"] = selectedOption;
		console.info("selected element is : " + selectedOption);

		console.log("TODO input validation");

		// console.log(gmap.haversine(placesSrc[0].geometry.location, placesDest[0].geometry.location, "km"));
		// console.log("google calculated without distancematrix : "+gmap.sphericalD(placesSrc[0].geometry.location, placesDest[0].geometry.location));
		var search = getSearchBoxdata();
        //close for once submitted
        $('#inputFormOuterId').hide(200);
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
        Meteor.call('riderQuery',getSearchBoxdata(),function(err,data){
          if(err){
            console.log(err);
          }else{
            console.log(data);
            _.each(data,function(mark){
                gmap.markDraw(mark);
              });
            }
        });
        console.log('TODO show markers of rides from surrounding areas to destination');

			}else{
				Session.set('mode', 'ride');
				polyArray.clear();
				Meteor.call('rideQuery',getSearchBoxdata(),function(err,data){
					if(err){
            console.log(err);
          }else{
            console.log(data);
            _.each(data[1],function(poly){
              gmap.polyDraw(poly);
            });
          }
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


});
