if (Posts.find().count() === 0 ){
	Posts.insert({
		lat: 12.9525812,
		lng: 77.7034538,
		title: "Home",
		user: "Admin"
	});
}