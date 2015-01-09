Template.inpForm.rendered = function() {
  //http://weareoutman.github.io/clockpicker/
  $('.clockpicker').clockpicker({
    'default': 'now',
  });

  window.ParsleyValidator.addValidator('tomoValidator',
      function(value, requirement) {
        // console.log($('#select option:selected').val()+ "value = "+value);
        if ($('#polyDateSel').prop('selected') == "tomorrow" && value == "")
          return false;
        if ($('#polyDateSel').prop('selected') == "today" && value == "")
          return true;

        var patterN = /^((2[0-3])|[01][0-9]):([0-5]\d)$/;
        if (!patterN.test(value))
          return false;

        var parts = value.match(patterN);

        var partHour = parseInt(parts[1], 10);
        var time = new Date();

        if ($('#polyDateSel').prop('selected') == "today" && partHour <= time.getHours())
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
        $('#directions-panel').hide();
        $('.inputForm').hide(200);
        $('.fabdiv').show(200);
    }
});
