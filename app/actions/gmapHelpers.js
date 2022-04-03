
function haversine(src, dest) {
  const srclat = src.latitude;
  const srclng = src.longitude;
  const destlat = dest.latitude;
  const destlng = dest.longitude;
  const R = 6373;

  const dLat = (Math.PI / 180) * (destlat - srclat);
  const dLon = (Math.PI / 180) * (destlng - srclng);
  const lat1 = (Math.PI / 180) * srclat;
  const lat2 = (Math.PI / 180) * destlat;

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  console.log(`haversine distance in km : ${d}`);
  return (d);
}

module.exports = { haversine };
