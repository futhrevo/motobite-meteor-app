var query = TransactColl.find({status:true});
var handle = query.observeChanges({
    added: function(id, user) {
        console.log(user.requester.id +" requested at "+user.requester.at);
    },
    removed: function(id) {
        console.log(id +" status changed");
    }
});
