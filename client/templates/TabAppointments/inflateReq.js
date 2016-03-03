/* global IonSideMenu, TransactColl, IonPopup, moment, toastr*/
Template.listReq.helpers({
    totalReqs:function(){
        // return TransactColl.find({ $and: [ {requestee:Meteor.userId() },{status:null} ] }).count();
        return TransactColl.find({ $and: [{$or:[{requester:Meteor.userId()},{requestee:Meteor.userId()}]},{status:null}]}).count();
    },
    reqSent:function(){
        return TransactColl.find({ $and: [ {requestee:Meteor.userId() },{status:null} ] });
    },
    reqGot:function(){
        return TransactColl.find({ $and: [ {requester:Meteor.userId() },{status:null} ] });
    }
});

Template.listReq.events({
    'click .btnReject':function(event){
        event.preventDefault();
         IonPopup.confirm({
                title: 'Are you sure?',
                template: 'Are you <strong>really</strong> sure to reject ?',
                onOk: function() {
                    TransactColl.update(this._id,{$set:{status:false}});
                },
                onCancel: function() {
                    console.log('Cancelled');
                }
		});
    },
    'click .btnAccept':function(event){
        event.preventDefault();
        IonPopup.confirm({
                title: 'Are you sure?',
                onOk: function() {
                    TransactColl.update(this._id,{$set:{status:true}});
                },
                onCancel: function() {
                    console.log('Cancelled');
                }
		});
    },
    'click .list-group-item': function(event) {
		event.preventDefault();
        $(event.currentTarget).addClass("active").siblings().removeClass('active');
    },
    'click .gotInfo':function(event){
        event.preventDefault();
        // const _id = this._id;
        // const obj = TransactColl.findOne({_id:_id});
        IonPopup.confirm({
            title: 'Are you sure?',
            template: 'Are you <strong>really</strong> sure?',
            onOk: function() {
                console.log('Confirmed');
            },
            onCancel: function() {
                console.log('Cancelled');
            }
        });
    },
    'click .btnInfo':function(event){
        event.preventDefault();
        const _id = this._id;
        const obj = TransactColl.findOne({_id:_id});
        const post = {_id:_id};
        IonPopup.confirm({
            title: "Are you Sure?",
            template: popupAcceptScreen(obj),
            okText: 'Reject', // String (default: 'OK'). The text of the OK button.
            okType: 'button-assertive', // String (default: 'button-positive'). The type of the OK button.
            cancelText: 'Cancel', // String (default: 'Cancel'). The text of the Cancel button.
            onOk: function() {
                // const unixTime = moment().format('X');
                if($("#decisionVal").is(':checked')){
                    post.status = true;
                }else{
                    post.status = false;
                }
                console.log("Sending request to RiderActions");
                Meteor.call('RiderActions',post,function(err,res){
                    if(err){
                        console.log("Error in riderActions method");
                    }else{
                        toastr[res.type](res.message);
                    }
                });
                IonSideMenu.snapper.close();

            },
            onCancel: function() {

            }
        });
        $('#decisionVal').change(function() {
            if($("#decisionVal").is(':checked'))
                $('[data-index="1"]').html('Accept').addClass("button-balanced").removeClass("button-assertive");
            else
                $('[data-index="1"]').html('Reject').addClass("button-assertive").removeClass("button-balanced");
        });
    }

});

function popupAcceptScreen(obj){
	const myvar = '<div class="list card">'+
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
