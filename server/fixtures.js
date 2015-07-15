Meteor.startup(function () {

    if (MarkerColl.find().count() === 0) {
        MarkerColl.insert({
            gh: 'tdr38juym8ns',
            _id: 'tEsTdAtA',
            type: "taxi",
            at: new Date(),
            valid: true
        });
    }
    // to enable indexing based on 2d sphere for DrivesAdvtColl
    DrivesAdvtColl._ensureIndex({
        "nodes.locs": "2dsphere"
    });


    DriversAdvtColl._ensureIndex({
        "locs": "2dsphere"
    });

    //Messages.find({room: room, users: this.userId}, {sort: {time: -1}, limit: 1})
    Messages._ensureIndex({"room": 1, "users": 1, "time": -1});

    //start process in later to handle old records deletions
    var Later = Meteor.npmRequire('later');
    var wrapLater = Later;
    // will fire every 5 minutes
    var textSched = wrapLater.parse.text('every 1 min');
    var smtp = {
        username: 'mailer.motobite@gmail.com',
        password: 'I0Hd723TJFq7-u2wKBCyRA',
        server:   'smtp.mandrillapp.com',
        port: 587
    };
    process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;

    // execute logTime one time on the next occurrence of the text schedule
    var timer = wrapLater.setInterval(Meteor.bindEnvironment(logTime), textSched);
    // function to execute
    function logTime() {
        console.log(new Date());
        //3 hour old time stamp
        var epochTime = (Date.now() / 1000 | 0) - (3600 * 3);

        DriversAdvtColl.remove({startTime: {$lt: epochTime}});
        DrivesAdvtColl.remove({startTime: {$lt: epochTime}});
    }
    //Email.send({
    //    from: "admin@motobite.com",
    //    to: "k.rakeshlal@gmail.com",
    //    subject: "Meteor Can Send Emails via Mandrill without gmail",
    //    text: "Meteors sends emails via Mandrill without gmail."
    //});
});


Meteor.methods({
    //Entry for location
    postLocation: function (postAttributes) {
        check(this.userId, String);
        check(postAttributes, {
            gh: String,
            heading: Match.OneOf(Number,null)
        });
        var userid = Meteor.user()._id;
        var qw = MarkerColl.findOne({_id: userid});
        var post;
        if (!qw) {
            console.log("new user");
            post = _.extend(postAttributes, {
                _id: userid,
                type: "user",
                at: new Date(),
                valid: true
            });
            MarkerColl.insert(post);
        } else {
            console.log('user entry present at ' + userid);
            ULogsColl.update({_id: userid}, {$push: {logs: EJSON.stringify(qw)}}, {upsert: true});
            post = _.extend(postAttributes, {
                at: new Date(),
                valid: true
            });
            MarkerColl.update(userid, {$set: post});
        }

    },

    rideQueryBeta: function (post) {
        var docs = DriversAdvtColl.find(
            {
                $and: [
                    {
                        locs: {
                            $near: {
                                $geometry: {type: "Point", coordinates: post[0]},
                                $geometry: {type: "Point", coordinates: post[1]},
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
                    coordinates: post[0]
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
                    coordinates: post[1]
                },
                distanceField: "dstDist",
                maxDistance: 250,
                spherical: true,
                query: {_id: {$in: ids}}
            }
        }]).map(function (u) {
            var srcIndex = u.gh6.indexOf(post[5].c);
            var dstIndex = u.gh6.indexOf(post[6].c);

            var i = 1;
            while (srcIndex == -1 && i < 9) {
                srcIndex = u.gh6.indexOf(post[5][dKeys[i]]);
                console.log(i);
                i++;
            }
            i = 1;
            while (dstIndex == -1 && i < 9) {
                dstIndex = u.gh6.indexOf(post[6][dKeys[i]]);
                console.log(i);
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
        console.log("Querying markers for " + this.userId);
        var drivepool = DrivesAdvtColl.find({"nodes.locs": {$geoWithin: {$box: [[77.676245, 12.926030], [100, 100]]}}});
        return drivepool.fetch();
    },

    //Entry for drive advertisement
    postDriveAdvt: function (postAttributes) {
        check(this.userId, String);
        //TODO find a better way to check for array of numbers
        check(postAttributes, [Match.Any]);
        // console.log(postAttributes[2]);
        var userid = this.userId;
        var post = {
            id: userid,
            at: new Date(),
            mapid: null,
            duration: postAttributes[postAttributes.length - 1],
            origin: postAttributes[3],
            destination: postAttributes[4],
            startTime: postAttributes[2],
            bearingInitial: postAttributes[7],
            bearingFinal: postAttributes[8],
            nodes: [{
                addr: "from",
                locs: {
                    type: "Point",
                    coordinates: postAttributes[0]
                }
            }, {
                addr: "to",
                locs: {
                    type: "Point",
                    coordinates: postAttributes[1]
                }
            }]
        };
        DrivesAdvtColl.insert(post);
        return "Inserted drive advertisement";
    },
    //postDriverAdvt implemented at client side in riderDiv.js
//
    //function to let communication between clients to ask for ride
    AskRider: function (obj) {
        check(this.userId, String);
        check(obj._id, String);
        var requestee = DriversAdvtColl.findOne({_id: obj._id}, {id: 1});
        var requester = this.userId;
        console.log("rider " + requestee.id + " is being requested by " + requester);
        var post = {
            requester: requester,
            requestee: requestee.id,
            advtRequest: obj._id,
            request: {
                at: new Date(),
                srcloc: obj.srcloc,
                dstloc: obj.dstloc,
                starts: obj.startTime,
                overview: obj.overview
            },
            status: null

        };
        TransactColl.insert(post);
    }
});




