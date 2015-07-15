/**
 * Created by rakeshkalyankar on 15/07/15.
 */

//Helper functions that work on server and client
createRoom = function(id1, id2) {
    return id1 < id2 ? id1 + '-' + id2 : id2 + '-' +id1;
};