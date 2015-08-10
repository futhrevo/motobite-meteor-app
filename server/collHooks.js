/**
 * Created by rakeshkalyankar on 06/08/15.
 */


// build a ttl based on drivers _id and approximate end time, current ttl is 3hours
DriversAdvtColl.after.insert(function (userId, doc) {
    // var post = {id:doc._id,ends:new Date((doc.startTime + doc.duration * 60)*1000)};
    var post = {id:doc._id,ends:new Date()};
    console.log("drivers ttl inserted");
});

DriversAdvtColl.after.remove(function (userId, doc) {
    // copy important data to archive and delete document
    console.log("after drivers deleted");
    console.log(doc);
});

// create bson date key to indicate invalid after for drivers coll

// create bson date key to indicate invalid after for transacts coll

// create a pending riders collection

    // when new driver is added
        // get all riders in vicinity of this ride using box
        // try vectors to get angle
        // if positive angle alert users about a potential rider

