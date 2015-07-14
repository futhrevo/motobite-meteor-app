Template.inflateReq.helpers({
    req:function(){
        return TransactColl.find({ $and: [ {requestee:Meteor.userId() },{status:null} ] });
    },
});

Template.inflateReq.events({
    'click .btnReject':function(event){
        event.preventDefault();
        if(confirm("Are you sure?")){
            TransactColl.update(this._id,{$set:{status:false}});
        }
    },
    'click .btnAccept':function(event){
        event.preventDefault();
        if(confirm("Are you sure?")){
            TransactColl.update(this._id,{$set:{status:true}});
        }
    },
    'click .list-group-item': function(event) {
		event.preventDefault();
    	$(event.currentTarget).addClass("active").siblings().removeClass('active');
    },
    'click .btnInfo':function(event){
        event.preventDefault();
        var _id = this._id;
        var obj = TransactColl.findOne({_id:_id});
        IonPopup.confirm({
            title: "Are you Sure?",
            template: popupAcceptScreen(obj),
            okText: 'Reject', // String (default: 'OK'). The text of the OK button.
            okType: 'button-assertive', // String (default: 'button-positive'). The type of the OK button.
            cancelText: 'Cancel', // String (default: 'Cancel'). The text of the Cancel button.
            onOk: function() {
                var unixTime = moment().format('X');
                if($("#decisionVal").is(':checked')){
                    console.log('Request Accepted');
                    TransactColl.update(_id,{$set:{status:true,accepted:unixTime}});
                    IonSideMenu.snapper.close();
                }else{
                    console.log('Request Rejected');
                    TransactColl.update(_id,{$set:{status:false,rejected:unixTime}});
                    IonSideMenu.snapper.close();
                }

            },
            onCancel: function() {

            }
        });
        $('#decisionVal').change(function() {
            if($("#decisionVal").is(':checked'))
                $('[data-index="0"]').html('Accept').addClass("button-balanced").removeClass("button-assertive");
            else
                $('[data-index="0"]').html('Reject').addClass("button-assertive").removeClass("button-balanced");
        });
    },

});

function popupAcceptScreen(obj){
	var myvar = '<div class="list card">'+
    '<div class="item item-toggle">'+
'     Accept ?'+
'     <label class="toggle toggle-balanced">'+
'       <input type="checkbox" id="decisionVal">'+
'       <div class="track">'+
'         <div class="handle"></div>'+
'       </div>'+
'     </label>'+
'  </div>'+
    '</div>';
    return myvar;
}
