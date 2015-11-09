Meteor.methods({
	createGroup: function(doc){
		if(! this.userId){
            return;
        }
        check(this.userId, String);
		check(doc, Schema.group);
		var dup = CommColl.findOne({id:doc.id});
		if(dup != null){
			return {type:"error",message:"Group with this id already exists, please choose another"}
		}
		_.extend(doc, {owner:this.userId});
		CommColl.insert(doc);
		return {type:"success",message:"Success"}
	}
});