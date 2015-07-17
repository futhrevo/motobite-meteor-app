/**
 * Created by rakeshkalyankar on 15/07/15.
 */

//Helper functions that work on server and client
createRoom = function(id1, id2) {
    return id1 < id2 ? id1 + '-' + id2 : id2 + '-' +id1;
};

roomToUsers = function(room, userId1) {
    //return users[0] = userId1
    //return users[1] = userId2
    var users = [];

    var ids = room.split('-');

    if (ids[0] === userId1) {
        users[0] = ids[0];
        users[1] = ids[1];
    } else {
        users[0] = ids[1];
        users[1] = ids[0];
    }

    return users;
};