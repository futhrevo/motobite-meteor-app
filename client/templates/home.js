Template.home.helpers({
    countNotifications: function(){
        return TransactColl.find({status:null}).count();
    },
});

Template.home.rendered = function(){
    $( ".badgeNotif" ).click(function() {
      var val = this.dataset.val;
      if(val < 1){
          // Display a success toast, with a title
          toastr.success("hooh no requests", "Hurray !");
      }else{
          IonSideMenu.snapper.expand('right');
      }
    });
};
