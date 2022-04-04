![Motobite logo](https://github.com/futhrevo/motobite-meteor-app/blob/master/public/play_graphic.png?raw=true)

# Summary #
MotoBite is a free real-time personal carpooling app with social features. We want to take a new look at pooling cars and to solve problems in process. Riders just need to enter their trip details whenever they wish to start and we connect users going in the same way. We want to provide alternate means of transport to commuters where security is never compromised.

MotoBite is targeted for corporate employees to share their daily commute. MotoBite stands different from other apps in ease of use because there will be no sync ups on the phone and no need to explain directions for pickup. Once a user enters his destination he will be presented with riders who are currently going via his current location to his destination. Users can select the appropriate rider and request a ride. The rider then can either accept/ reject this request. Once accepted the user is presented with a circle in his map where he needs to checkin in order to be picked up by the rider. Once the user checks in at that circle he will be given vehicle number and color. Once the trip is complete the user can pay the rider with a wallet linked to his number.

MotoBite also has some social features like adding people as friends, chat with them and create groups specific to their company, interest, colony etc and pool within their group. MotoBite aims to benefit both the rider and user thereby making less congested roads and step towards Swachh Bharat.

Available currently from Play store 
<https://play.google.com/store/apps/details?id=in.hedera.motobite.reku>

## Features
* Option for Ladies only pooling
* Community based carpooling
* For Android and iOS or anything
* Record your own route and pool it

## Security
Security is multilayer. Users upon registering need to verify their work and personal email ID.
Periodic verification of work email through OTP. Each driver or rider is given ratings and feedback. Upon accepting a ride the rider is provided with a vehicle number which can be shared to anyone. Each user can become a rider by entering their vehicle registration number. Riders are requested to check vehicle number and description may be provided with photos. Panic button for both, once pressed tight tracking is enabled and user is contacted, if doesn't respond the issue will be escalated. Upon completing the trip each user needs to confirm it.

## Design Ideas
1. Light weight and less battery consuming

    We use fused location provider coupled with activity detection API to get user location only when the user is moving. Further geofences are added to user’s safe locations where there won't be any type of tracking.
2. Community based carpooling

    User will be added to communities based on his company, work location and residential location and opt to get riders or rides from closed user groups
3. Option for Ladies only pooling

    Ladies can opt for ladies only users as co-travellers from a preference input
4. Ability to record routes

    No need to use only gmaps given routes, users can record their routes and get suggestions based on it.


## FAQs
* Is it a commercial app or a free app?

    it is a free app but subscription based
* How is different from any other regular carpooling app?

    Up until  now carpooling is small scale and mostly pre-planned It involves lot of waiting and chances of not using it are more We on other hand make it realtime
* Who are eligible to use?

	Carpooling is limited to private vehicles (whiteboard) and users with corporate email id

## TODO
* [x] Accounts pages
* [x] Schedule tabs
* [ ] Server side filtering
* [x] input panel Today/tomorrow
* [x] better timepicker preferably polymer
* [ ] map heigth adjustement according to view port
    * [x] map terms and conditions minimize
    * [x] remove zoom icons and support pinching
    * [ ] limit map to india/bangalore
    * [x] hide map type on top of map
* [x] User profile page
* [ ] Fuel points management, billing and charging
* [ ] User input validation - remove or implement parsely input panel
* [x] Remove Insecure Package
* [x] Not Required - Remove geohash package
* [x] modify core tool-bar height according to ios specs
* [ ] Use north when showing map in realtime
* [ ] tabs doesnt show any accepted rides
* [ ] Wait button when rider is waiting
* [ ] edit delete disable after drive started
* [ ] driver renting
* [ ] fill outputDirectionDiv if only one route available
* [x] clear button to clear input panel
* [x] checkin function
    * [ ] CheckinHeap remove
TODO SERVER
* [x] Remove 1 day old records to archives
* [ ] Need ways to request clients to checkin in seamless way


Created using meteor in Mac
Authors:
Rakesh k.rakeshlal@gmail.com


### What is this repository for? ###

* Quick summary
* Version
* [Learn Markdown](https://bitbucket.org/tutorials/markdowndemo)

### How do I get set up? ###

* Summary of set up
* Configuration
* Dependencies
* Database configuration
* How to run tests
* Deployment instructions

### Contribution guidelines ###

* Writing tests
* Code review
* Other guidelines

### Who do I talk to? ###

* Repo owner or admin
* Other community or team contact

### Watch List ###
https://github.com/weareoutman/clockpicker
http://leaverou.github.io/prefixfree/

### update Node ###
http://theholmesoffice.com/node-js-fundamentals-how-to-upgrade-the-node-js-version/

### how to Install Cordova plugin? ###
http://stackoverflow.com/questions/26624649/how-to-add-cordova-plug-that-havent-registration-on-plugins-cordova-io

meteor add cordova:com.plugin.datepicker@https://github.com/VitaliiBlagodir/cordova-plugin-datepicker/tarball/0f8ea19848008afc38f856a15aeb238d3c469d58

meteor add cordova:cordova-plugin-vibration@https://github.com/apache/cordova-plugin-vibration/tarball/ef4af1e8a670456e54c1fcf4fc07f82dd84898f5

meteor add cordova:cordova-plugin-statusbar@https://github.com/futhrevo/cordova-plugin-statusbar/tarball/2cbe12a535e6945978224e43ac6e8c2a416c7b69

meteor add cordova:cordova-plugin-device-orientation@https://github.com/apache/cordova-plugin-device-orientation/tarball/d0c83f2cde672a77567195437db02d113438f3a6

### Cordova plugins ###
https://github.com/Initsogar/cordova-webintent

#########trash can
adb logcat | grep -E "cordova|LocationUpdateService"

publications in meteor
http://matthewfieger.com/posts/me/2014/06/18/pseudo-collections-in-meteor.html
http://stackoverflow.com/questions/28290523/where-does-meteor-subscribe-belong
http://stackoverflow.com/questions/28773111/meteor-subscription-not-ready
http://stackoverflow.com/questions/28505894/how-can-i-make-a-meteor-publish-method-reactive-to-a-server-side-parameter
http://stackoverflow.com/questions/27771318/in-meteor-how-can-i-publish-processed-results-of-a-find-query-as-a-cursor

Marker.find({ name: "David" }).fetch();

Meteor.user()._id

["tdr38nh", "tdr38nj", "tdr38nn", "tdr38jy", "tdr38jv", "tdr38ju", "tdr38jg", "tdr38je", "tdr38j6", "tdr38j4", "tdr38hf", "tdr38h3", "tdr38h1", "tdr385b", "tdr3858", "tdr1xgr", "tdr1xgq", "tdr1xgn", "tdr1xfv", "tdr1xfs", "tdr1xcc", "tdr1xcb", "tdr1x9x", "tdr1x9m", "tdr1x9k", "tdr1x95", "tdr1x94"]

["tdr38nh", "tdr38nj", "tdr38nn", "tdr38np", "tdr38nq", "tdr38nt", "tdr38ns", "tdr38ne", "tdr38ng", "tdr38nf", "tdr38nd", "tdr38n9", "tdr38n8", "tdr1xyx", "tdr1xyt", "tdr1xy7", "tdr1xy6", "tdr1xwq", "tdr1xwm", "tdr1xwk", "tdr1xw7", "tdr1xw9", "tdr1xwb", "tdr1xqz", "tdr1xqy", "tdr1xqv", "tdr1xqu", "tdr1xqg", "tdr1xqf", "tdr1xr1", "tdr1xr0", "tdr1xpp", "tdr1xpn", "tdr1xpj", "tdr1xph", "tdr1xp5", "tdr1xp4", "tdr1xp1", "tdr1xp0", "tdr1wzp", "tdr1wzn", "tdr1wzk", "tdr1wz3", "tdr1wz2", "tdr1wxr", "tdr1wxx", "tdr1wz8", "tdr1wzb", "tdr1yb0", "tdr1yb2", "tdr1yb8", "tdr1ybb", "tdr1yc0", "tdr1yc1", "tdr1yc4", "tdr1yc6"]


 db.drivers.find({locs: {$geoIntersects: {$geometry : {type : "Polygon", coordinates:[[[77.696493,12.942884],[77.697694,12.942413],[77.697104,12.94158],[77.696493,12.942884]]]}}}})

 db.drivers.find({locs: {$near: {$geometry : {type : "Point", coordinates:[77.696493,12.942884]},$maxDistance : 10}}})

  db.drives.find({"nodes.locs": {$near: {$geometry : {type : "Point", coordinates:[77.7033807,12.952593499999999]},$maxDistance : 10}}})

db.drives.find({"nodes.locs": {$near: {$geometry : {type : "Point", coordinates:[77.6762463,12.9260308]},$maxDistance : 10}}})

 db.drives.find({$and : [{"nodes.locs": {$near: {$geometry : {type : "Point", coordinates:[77.7033807,12.952593499999999]},$maxDistance : 10}}},{"nodes.addr" : "from"}]})

 db.drives.ensureIndex({"nodes.locs":"2dsphere"})

 db.drivers.ensureIndex({"locs":"2dsphere"})

 "s}`nA{agyMF_CLAFC\{KJ?@_CuDNuCXUDaD|B_DxBaAp@KlCCp@Cr@EnBEdAG`BOvCEv@Ar@HpBZzCfAnKj@pGtAzMbBzO|@lKpBra@JpGErAKz@eEjLgIzSeBrFWfASzBKzAQdGQbJA`CWdFQtBs@dGaAhH[bCSzBUhCA|@@\Dh@VnCL~@@r@EtBExAShEO`GGjEObLOlIEnBYpEGnAw@zM{AzXOxCAz@GzAY|EKXQNYHU@UEUMMOI]GsAIqBIYOOSKWAmBB_@EGCiBFw@@m@AuPXiOX{@MOC}CDIwBIkGcBFCsAU?"


 db.drivers.aggregate([{"$geoNear" : {near:{type : "Point", coordinates:[77.696493,12.942884]},distanceField:"dist.calculated",maxDistance:200,spherical:true}}])

 db.drivers.find({$and : [{locs: {$near: {$geometry : {type : "Point", coordinates:[77.696493,12.942884]},$maxDistance : 10}}},{locs: {$near: {$geometry : {type : "Point", coordinates:[77.696493,12.942884]},$maxDistance : 1}}}]})


////////
a = db.drivers.aggregate([{"$geoNear" : {near:{type : "Point", coordinates:[77.696493,12.942884]},distanceField:"dist.calculated",maxDistance:200,spherical:true}}])
b = db.drivers.aggregate([{"$geoNear" : {near:{type : "Point", coordinates:[77.696593,12.943884]},distanceField:"dist.calculated",maxDistance:200,spherical:true}}])

aid = a.result.map(function(p){return p._id})
bid = b.result.map(function(p){return p._id})
aid.concat(bid)
/////

a = db.drivers.aggregate([{"$geoNear" : {near:{type : "Point", coordinates:[77.697839,12.951040]},distanceField:"dist.calculated",maxDistance:250,spherical:true}},{$match:{startTime:{$gt:1410529121}}},{$match:{gh6:"tdr1zf"}},{ $project : { gh6 : 1 , dist : 1 } }])

query:{_id:{$in:['Lz3S2GvTuaF9uTsX8']}}
query:{_id:{$in:['Lz3S2GvTuaF9uTsX8','9CYpdaL3p2aSpmefj']}}

b =a.result.map(function(p){return p._id})

if(this.gh6.indexOf("tdr1xf") < this.gh6.indexOf("tdr1zv"))


var a = DriversAdvtColl.aggregate([{
    "$geoNear" : {near:{type : "Point", coordinates:post[0]},
    distanceField:"dist.calculated",
    maxDistance:250,
    spherical:true}},{
        $match:{startTime:{$gt:1410529121}}},{
            $match:{gh6:post[6]}}])
            .map( function(u) {
                if(u.gh6.indexOf(post[5]) < u.gh6.indexOf(post[6]))
                return {_id : u._id, dist : u.dist.calculated};
                else
                return null;
                } );

db.drives.find({"nodes.locs":{$geoWithin:{$box:[[77.676246,12.926031],[100,100]]}}});


### citations
http://mattbradley.github.io/livestampjs/

db.getCollection('drivers').find(
 {$and:[   {locs:
        {$near:
            {
                $geometry:{type:"Point", coordinates:[77.696686,12.942224]},
                $geometry:{type:"Point", coordinates:[77.797696,12.942224]},
                $maxDistance:250
            }
         }
     },{startTime: {
                                $gt: 1410529121
                            }}]

 }
)

db.getCollection('drivers').find(
    {locs:
        {$near:
            {
                $geometry:{type:"Point", coordinates:[77.70147599999996,12.968542]},
                $geometry:{type:"Point", coordinates:[77.64358960000004,12.9681318]},
                $maxDistance:250
            }
         }
     }
   )

   db.getCollection('transActs').find({$and:[
       { $or: [ {requestee:'vfPLxcoWiQyXMaZES' },{requester:'vfPLxcoWiQyXMaZES'} ] },
       {'request.starts':{$gt:1436079608}},
       {status:true}
   ]})

cordova-plugin-device-orientation@https://github.com/apache/cordova-plugin-device-orientation/tarball/d0c83f2cde672a77567195437db02d113438f3a6

427d49f61297f749b09b971c00dfeedc289c1809


// get mup recognised in server
sudo ln -s /usr/bin/nodejs /usr/bin/node
/etc/letsencrypt/live/app.motobite.in/fullchain.pem

meteor build ../meteorBuild --server=https://app.motobite.in:443 --mobile-settings=settings.json --verbose --debug
/home/reku/polo_meteor/.meteor/local/cordova-build/platforms/android/build/outputs/apk/android-debug.apk

cat privkey.pem fullchain.pem > ssl.pem


privkey.pem - private key
cert.pem - server cert only
chain.pem - intermediates
fullchain.pem - server cert + intermediates

Robomongo - mup
localhost 27017
 ----SSH
    104.155.196.199:22
    reku
    Private Key
    /home/reku/.ssh/google_compute_engine
    rakesh

./letsencrypt-auto certonly -a manual -d app.motobite.in --server https://acme-v01.api.letsencrypt.org/directory
// list all containers
docker ps

./letsencrypt-auto certonly -a manual -d app.motobite.in --server https://acme-v01.api.letsencrypt.org/directory
./letsencrypt-auto certonly -a standalone -d app.motobite.in --server https://acme-v01.api.letsencrypt.org/directory --agree-dev-preview
