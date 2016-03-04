/* global AccountsMeld */
const meldUserCallback = function(src_user, dst_user){
    console.log(src_user);
    console.log(dst_user);
    // create a melded user object here and return it
    let meldedUser = _.clone(dst_user);
    // meldedUser.createdAt = src_user.createdAt;
    // ...

    return meldedUser;
};

AccountsMeld.configure({
    meldUserCallback: meldUserCallback
});


