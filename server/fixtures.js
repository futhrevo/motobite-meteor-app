/* global AvatarOpsColl */
/* global ULogsColl */
/* global SafeHouseColl */
/* global EJSON */
/* global Match */
/* global process */
/* global Messages */
/* global MarkerColl */
/* global SmsOtpColl */
/* global EmailOtpColl */
/* global DriversAdvtColl */
/* global DrivesAdvtColl */
Meteor.startup(function () {
    Modules.server.configureDBs();
    Modules.server.configureServices();
    Modules.server.configureEmail();
    Modules.server.configureCron();

    // Email.send({
    //    from: "admin@motobite.com",
    //    to: "k.rakeshlal@gmail.com",
    //    subject: "Meteor Can Send Emails via Sendgrid without gmail",
    //    text: "Meteors sends emails via Sendgrid without gmail."
    // });
});


Meteor.methods({
    //Entry for location
    postLocation: function (postAttributes) {
        if(! this.userId){
            return;
        }
        check(this.userId, String);
        console.log(postAttributes.loc.coordinates[0]);
        check(postAttributes, {
            gh: String,
            heading: Match.OneOf(Number,null),
            loc:{
                type:String,
                coordinates: Match.OneOf([Number],null)
            }
        });
        var userid = Meteor.user()._id;
        var qw = MarkerColl.findOne({id: userid});
        var post;
        if (!qw) {
            console.log("new user");
            post = _.extend(postAttributes, {
                id: userid,
                type: "user",
                at: Date.now(),
                valid: true
            });
            MarkerColl.insert(post);
        } else {
            console.log('user entry present at ' + qw._id);
            ULogsColl.update({_id: userid}, {$push: {logs: EJSON.stringify(qw)}}, {upsert: true});
            post = _.extend(postAttributes, {
                at: new Date(),
                valid: true
            });
            MarkerColl.update(qw._id, {$set: post});
        }

    },

    rideQueryBeta: function (post) {
        if(! this.userId){
            return;
        }
        check(this.userId, String);
        check(post,{
            fromCoord : [Number] ,
            toCoord : [Number],
            time : Number,
            src : [String],
            dst : [String],
            fromHashObj : Object,
            toHashObj : Object,
            initialBearing : Number,
            finalBearing : Number
        });
        var docs = DriversAdvtColl.find(
            {
                $and: [
                    {
                        locs: {
                            $near: {
                                $geometry: {type: "Point", coordinates: post.fromCoord},
                                // $geometry: {type: "Point", coordinates: post.toCoord},
                                $maxDistance: 250
                            }
                        }
                    },
                    {
                        startTime: {
                            $gt: 1410529121
                        }
                    }
                ]

            }
        );
    },

    //Query for drivers for a rider
    rideQuery: function (post) {
        if(! this.userId){
            return;
        }
        check(this.userId, String);
        check(post,{
            fromCoord : [Number] ,
            toCoord : [Number],
            time : Number,
            src : [String],
            dst : [String],
            fromHashObj : Object,
            toHashObj : Object,
            initialBearing : Number,
            finalBearing : Number
        });
        //TODO use $and to query from and to which is not working in current mongodb < 2.55
        //TODO mongo aggregation http://joshowens.me/using-mongodb-aggregations-to-power-a-meteor-js-publication/
        //TODO if DriversAdvtColl is empty, bypass the procedure to escape server error
        // var result = DriversAdvtColl.find({"locs": {$near: {$geometry : {type : "Point", coordinates:post[0]},$maxDistance : 200}}},{fields: {"locs":0}});
        var ids = [];
        //all keys present as neighbours for a geohash
        var dKeys = ["c", "e", "w", "n", "s", "se", "sw", "ne", "nw"];
        // Find all the _ids near to source coordinates
        var nearSrc = DriversAdvtColl.aggregate([{
            "$geoNear": {
                near: {
                    type: "Point",
                    coordinates: post.fromCoord
                },
                distanceField: "srcDist",
                maxDistance: 250,
                spherical: true
            }
        }, {
            $match: {
                startTime: {
                    $gt: 1410529121
                }
            }
        }, {
            $project: {
                srcDist: 1
            }
        }]);
        if (nearSrc.length < 1) {
            return null;
        }
        // get the list of _ids from the cursor
        for (var i = 0; i < nearSrc.length; i++) {
            ids[i] = nearSrc[i]._id;
        }
        console.log(nearSrc);
        // take the list of _ids and search those for destination proximity
        var nearDst = DriversAdvtColl.aggregate([{
            "$geoNear": {
                near: {
                    type: "Point",
                    coordinates: post.toCoord
                },
                distanceField: "dstDist",
                maxDistance: 250,
                spherical: true,
                query: {_id: {$in: ids}}
            }
        }]).map(function (u) {
            var srcIndex = u.gh6.indexOf(post.fromHashObj.c);
            var dstIndex = u.gh6.indexOf(post.toHashObj.c);
            var i = 1;
            while (srcIndex == -1 && i < 9) {
                srcIndex = u.gh6.indexOf(post["fromHashObj"][dKeys[i]]);
                i++;
            }
            i = 1;
            while (dstIndex == -1 && i < 9) {
                dstIndex = u.gh6.indexOf(post["toHashObj"][dKeys[i]]);
                i++;
            }
            console.log("srcIndex " + srcIndex);
            console.log("dstIndex " + dstIndex);
            if (srcIndex < dstIndex)
                for (var i = 0; i < nearSrc.length; i++) {
                    if (u._id == nearSrc[i]._id) {
                        var ret = {
                            _id: u._id,
                            srcDist: nearSrc[i].srcDist,
                            dstDist: u.dstDist,
                            srcIndex: srcIndex,
                            dstIndex: dstIndex
                        };
                        nearSrc.splice(i, 1);
                        return ret;
                    }
                }
            else
                return null;
        });

        //Filter nulls inserted after map function

        var nearDst = nearDst.filter(function (element) {
            return element != null;
        });

        // get the list of _ids from the cursor
        ids = [];
        for (var i = 0; i < nearDst.length; i++) {
            ids[i] = nearDst[i]._id;
        }


        console.log(nearDst);
        console.log("TODO limit the number of results for performance");
        console.log(ids);
        var driverpool = DriversAdvtColl.find({
            _id: {$in: ids}
        }, {
            fields: {
                "bounds": 1,
                "overview": 1,
                "gh6": 1,
                "startTime": 1,
                "summary": 1

            }
        }).fetch();

        // var result = a;

        // console.log("found "+ result.count()+" drivers");
        // return result.fetch();
        return [nearDst, driverpool];

    },

    //Query for riders for a ride
    riderQuery: function (post) {
        if(! this.userId){
            return;
        }
        check(this.userId, String);
        check(post,{
            fromCoord : [Number] ,
            toCoord : [Number],
            time : Number,
            src : [String],
            dst : [String],
            fromHashObj : Object,
            toHashObj : Object,
            initialBearing : Number,
            finalBearing : Number
        });
        console.log("TODO riderquery buildup");
        console.log("Querying markers for " + this.userId);
        var drivepool = DrivesAdvtColl.find({"nodes.locs": {$geoWithin: {$box: [[77.676245, 12.926030], [100, 100]]}}});
        return drivepool.fetch();
    },
    postDriveReq: function(postAttributes){
        if(! this.userId){
            return;
        }
        check(this.userId, String);
        check(postAttributes,{
            summary: String,
            overview: String,
            driverAdvt: String,
            bounds: Object,
            distance: Number,
            dst: [String],
            dstDist: Number,
            dstloc: [Number],
            duration: Number,
            src: [String],
            srcDist: Number,
            srcloc: [Number],
            startTime: Number
        });
        postAttributes.id = this.userId;
        var insertId = DrivesAdvtColl.insert(postAttributes);
        
    },
    //Entry for drive advertisement
    postDriveAdvt: function (postAttributes) {
        if(! this.userId){
            return;
        }
        check(this.userId, String);
        check(postAttributes,{
            fromCoord : [Number] ,
            toCoord : [Number],
            time : Number,
            src : [String],
            dst : [String],
            fromHashObj : Object,
            toHashObj : Object,
            initialBearing : Number,
            finalBearing : Number,
            duration : Number
        });
        var userid = this.userId;
        var post = {
            id: userid,
            at: new Date(),
            mapid: null,
            duration: postAttributes.duration,
            origin: postAttributes.src,
            destination: postAttributes.dst,
            startTime: postAttributes.time,
            bearingInitial: postAttributes.finalBearing,
            bearingFinal: postAttributes.initialBearing,
            nodes: [{
                addr: "from",
                locs: {
                    type: "Point",
                    coordinates: postAttributes.fromCoord
                }
            }, {
                addr: "to",
                locs: {
                    type: "Point",
                    coordinates: postAttributes.toCoord
                }
            }]
        };
        DrivesAdvtColl.insert(post);
        return "Inserted drive advertisement";
    },
    //postDriverAdvt implemented at client side in riderDiv.js
//
    //function to let communication between clients to ask for ride
    /**
     * @return {string}
     */
    AskRider: function (obj) {
        check(this.userId, String);
        check(obj, {
            _id: String,
            locs:{type:String,coordinates: [[Number]]},
            startTime : Number,
            summary: String,
            overview: String,
            bounds: Object,
            distance: Number,
            dst: [String],
            dstDist: Number,
            duration: Number,
            src: [String],
            srcDist: Number,
        });
        var requestee = DriversAdvtColl.findOne({_id: obj._id},{fields: {id: 1,ends:1}});
        var requester = this.userId;
        if (requestee.id === requester) {
            return {type:"info",message:'You can not send request to yourself'};
        }
        console.log("rider " + requestee.id + " is being requested by " + requester);
        if (DriversAdvtColl.findOne({ _id: obj._id, "pending.requester": requester })) {
            return {type:"info",message:'You already sent a request for this rider'};
        }

        var post = {
            requester: requester,
            requestee: requestee.id,
            advtRequest: obj._id,
            request: {
                at: new Date(),
                locs: obj.locs,
                starts: obj.startTime,
                overview: obj.overview,
                summary: obj.summary,
                bounds: obj.bounds,
                distance: obj.distance,
                dst: obj.dst,
                dstDist: obj.dstDist,
                duration: obj.duration,
                src: obj.src,
                srcDist: obj.srcDist,
            },
            ends: requestee.ends,
            status: null

        };
        var requestId = TransactColl.insert(post);
        DriversAdvtColl.update({_id: obj._id}, {$push: {pending: {requestId:requestId,requester:requester}}}, {upsert: true});
    },
    // function to set rider actions
    /**
     * @return {string}
     */
    RiderActions:function(obj){
        console.log("Rider Actions Executing");
        check(this.userId, String);
        check(obj, {
            _id: String,
            status: Boolean
        });
        // first check if advt exists
        var advt = TransactColl.findOne({_id:obj._id},{fields:{advtRequest:1,requester:1}});
        console.log(advt);
        // check if user is in pending state and pull
        var state = DriversAdvtColl.update({_id:advt.advtRequest,"pending.requester":advt.requester}, {$pull: {"pending":{"requester":advt.requester}}});
        console.log(state);
        if(state > 0){
            if(obj.status){
                DriversAdvtColl.update({_id: advt.advtRequest}, {$push: {accepted: {requestId:obj._id,requester:advt.requester}}}, {upsert: true});
                var send = {type:"success",message:"Request Accepted"};
            }else{
                DriversAdvtColl.update({_id: advt.advtRequest}, {$push: {rejected: {requestId:obj._id,requester:advt.requester}}}, {upsert: true});
                var send = {type:"success",message:"Request Rejected"};
            }
            // change status to boolean sent
            TransactColl.update(obj._id,{$set:{status:obj.status,time:new Date()}});
            return send;
        }else{
            TransactColl.remove({_id:obj._id});
            return {type:"info",message:"the requester is unavailable"};
        }
    },
    // function to delete a ride scheduled by user
    deleteRide:function(obj){
        check(this.userId, String);
        check(obj, {
            _id: String
        });
        // fetch all pending, accepted and rejected requests for this _id
        var data = DriversAdvtColl.findOne({_id:obj._id,id:this.userId},{fields:{pending:1,accepted:1,rejected:1}});
        var pendReq = [],accReq = [],rejReq = [];
        if(data.pending){
            pendReq = _.pluck(data.pending, 'requestId');
            console.log(pendReq);
        }
        if(data.accepted){
            accReq = _.pluck(data.accepted, 'requestId');
            console.log(accReq);
        }
        if(data.rejected){
            rejReq = _.pluck(data.rejected, 'requestId');
            console.log(rejReq);
        }
        // send notification to accepted users about cancellation
        if(accReq.length > 0){
            var accUsers = _.pluck(data.accepted, 'requester');
            var senderName = "MotoBite Traffic";
            var title = senderName;
            var text = "One of your scheduled rider cancelled his ride";
            var query = {userId: {$in: accUsers}};
            var payload = {sender: senderName};
            //SendNotification(title, text, query, payload);

        }
        // delete from transacts pending and rejected
        var total = pendReq.concat(accReq,rejReq);
        TransactColl.remove({_id:{$in: total}});
        DriversAdvtColl.remove({_id:obj._id});
        return {type:"info",message:"successfully deleted ride"};
    },
    //function to add user's safe House
    addSafeHouse: function (obj) {
        check(this.userId, String);
        check(obj, {
            coordinates: [Number],
            radius: Number,
            name: String,
            address: String
        });
        var user = this.userId;
        if (SafeHouseColl.find({ id: user }).count() > 5) {
            return {type:"info",message:"only 5 safe houses are allowed at this time, please delete any"};
        }
        var post = {
            id: user,
            radius: obj.radius,
            name: obj.name,
            address: obj.address,
            loc:{
                type:"Point",
                coordinates: obj.coordinates
            }
        };
        SafeHouseColl.insert(post);
        return {type:"success",message:"added safehouse"};
    },
    deleteSafeHouse: function (_id) {
        check(this.userId, String);
        var user = this.userId;
        SafeHouseColl.remove({ _id: _id, id: user });
        return {type:"success",message:"removed the selected safehouse"};
    },
    setIdleTracking: function(status){
        check(status, Boolean);

        if (!this.userId) {
            return false;
        }

        var me = this.userId;
        Meteor.users.update({_id:me}, {$set: {'settings.idleTracking': status}});   
    }
});




