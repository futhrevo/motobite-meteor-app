    const configure = () => {
    // to enable indexing based on 2d sphere for DrivesAdvtColl
    DrivesAdvtColl._ensureIndex({
        "nodes.locs": "2dsphere"
    },{ background: true });


    DriversAdvtColl._ensureIndex({
        "locs": "2dsphere"
    },{ background: true });
    DriversAdvtColl._ensureIndex({ "ends": 1 }, { expireAfterSeconds: 300 });
    EmailOtpColl._ensureIndex({"id":1});
    EmailOtpColl._ensureIndex({ "at": 1 }, { expireAfterSeconds: 3600 });
    SmsOtpColl._ensureIndex({"id":1});
    SmsOtpColl._ensureIndex({ "at": 1 }, { expireAfterSeconds: 900 });
    SafeHouseColl._ensureIndex({"id":1});
    MarkerColl._ensureIndex({"id":1});
    MarkerColl._ensureIndex({"loc" : "2dsphere","at":-1},{ background: true });
    //Messages.find({room: room, users: this.userId}, {sort: {time: -1}, limit: 1})
    Messages._ensureIndex({"room": 1, "users": 1, "time": -1});
    CommColl._ensureIndex({ "owner": 1 });
    CommColl._ensureIndex({ "id": 1 });
    CommColl._ensureIndex({ "members": 1 });
    CommColl._ensureIndex({ "name": "text" });
    TransactColl._ensureIndex({ requestee: 1, requester: 1, 'advtRequest': 1 });
    TransactColl._ensureIndex({ "ends": 1 }, { expireAfterSeconds: 300 });
    //DriversTTL._ensureIndex({ "ends": 1 }, { expireAfterSeconds: 10800 });

    if (MarkerColl.find().count() === 0) {
        MarkerColl.insert({
            gh: 'tdr38juym8ns',
            type: "taxi",
            at: Date.now(),
            valid: true,
            heading:null,
            loc:{
                type:"Point",
                coordinates:[77,12]
            },
            id:"tEsTdAtA"
        });
    }
    if(AvatarOpsColl.find().count() === 0){
        AvatarOpsColl.insert({
            _id: "deleteOps1",
            ops:[]  
        })
    }
}

Modules.server.configureDBs = configure;