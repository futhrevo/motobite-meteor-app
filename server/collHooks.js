/**
 * Created by rakeshkalyankar on 06/08/15.
 */
DriversTTL = new Mongo.Collection('driversttl');

// build a ttl based on drivers _id and approximate end time, current ttl is 3hours
DriversAdvtColl.after.insert(function (userId, doc) {
    var post = {id:doc._id,ends:new Date((doc.startTime + doc.duration * 60)*1000)};
    DriversTTL.insert(post);
});

//create a before delete hook for driversttl and check for _id status if still running
    // if not running copy important data to archive and delete document

    // else create one more ttl with added duration of one hour