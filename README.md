# README #

Created using meteor in Mac
Authors:
Rakesh k.rakeshlal@gmail.com
Sandeep sandepkumr@gmail.com

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

#########trash can
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
