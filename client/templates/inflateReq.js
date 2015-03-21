Template.inflateReq.helpers({
    req:function(){
        return TransactColl.find({status:null});
    },
});

Template.inflateReq.events({
    'click .btnReject':function(event){
        event.preventDefault();
        if(confirm("Are you sure?")){
            TransactColl.update(this._id,{$set:{status:false}});
        }
    },
    'click .btnInfo':function(event){
        event.preventDefault();
        console.log("TODO get info of the current entry to edit");
    },
    'click .btnAccept':function(event){
        event.preventDefault();
        if(confirm("Are you sure?")){
            TransactColl.update(this._id,{$set:{status:true}});
        }
    },
});
