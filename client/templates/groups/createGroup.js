Template.createGroup.helpers({
  groupSchema: function () {
    return Schema.group;
  }
});
// TODO: Update the object after updating to latest autoform
var hooksObject = {
  // before: {
  //   createGroup:function(doc){
  //     console.log("Before hook is called");
  //     return doc;
  //   }
  // },
  after: {
    createGroup: function(error, result){
      if(error)
        console.log("result is error");
      if(result){
        toastr[result.type](result.message);
        if(result.type == "success"){
          Router.go('groups');
        }
      }
        
    }
  }
}

AutoForm.hooks({
  myGroupForm: hooksObject
});