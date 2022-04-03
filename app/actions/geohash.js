/* eslint camelcase: 0*/

// FROM https://github.com/MiCHiLU/geohash-js/blob/master/geohash.js
// https://github.com/grigio/meteor-geohash/blob/master/lib/geohash.js


let BORDERS;
let NEIGHBORS;
let geohash;


const north = 0;
const east = 1;
const south = 2;
const west = 3;
const even = 0;
const odd = 1;


const BITS = [16, 8, 4, 2, 1];
const BASE32 = '0123456789bcdefghjkmnpqrstuvwxyz';
NEIGHBORS = {
  0: {},
  1: {},
  2: {},
  3: {},
};
BORDERS = {
  0: {},
  1: {},
  2: {},
  3: {},
};
NEIGHBORS[south][odd] = NEIGHBORS[west][even] = '238967debc01fg45kmstqrwxuvhjyznp';
NEIGHBORS[north][odd] = NEIGHBORS[east][even] = 'bc01fg45238967deuvhjyznpkmstqrwx';
NEIGHBORS[west][odd] = NEIGHBORS[south][even] = '14365h7k9dcfesgujnmqp0r2twvyx8zb';
NEIGHBORS[east][odd] = NEIGHBORS[north][even] = 'p0r21436x8zb9dcf5h7kjnmqesgutwvy';
BORDERS[south][odd] = BORDERS[west][even] = '0145hjnp';
BORDERS[north][odd] = BORDERS[east][even] = 'bcfguvyz';
BORDERS[west][odd] = BORDERS[south][even] = '028b';
BORDERS[east][odd] = BORDERS[north][even] = 'prxz';

const refine_interval = function (interval, cd, mask) {
  if (cd && mask) {
    interval[0] = (interval[0] + interval[1]) / 2;
  } else {
    interval[1] = (interval[0] + interval[1]) / 2;
  }
};
const calculateAdjacent = function (srcHash, dir) {
  let base;
  let lastChr;
  let type;
  srcHash = srcHash.toLowerCase();
  lastChr = srcHash.charAt(srcHash.length - 1);
  type = (srcHash.length % 2 ? odd : even);
  base = srcHash.substring(0, srcHash.length - 1);
  if (BORDERS[dir][type].indexOf(lastChr) !== -1) {
    base = calculateAdjacent(base, dir);
  }
  return base + BASE32[NEIGHBORS[dir][type].indexOf(lastChr)];
};
const calculateAdjacents = function (srcHash) {
  let result;
  result = {
    c: srcHash,
    n: calculateAdjacent(srcHash, north),
    e: calculateAdjacent(srcHash, east),
    s: calculateAdjacent(srcHash, south),
    w: calculateAdjacent(srcHash, west),
  };
  result.ne = calculateAdjacent(result.n, east);
  result.se = calculateAdjacent(result.s, east);
  result.sw = calculateAdjacent(result.s, west);
  result.nw = calculateAdjacent(result.n, west);
  return result;
};
const decodeGeoHash = function (geohash) {
  let c;
  let cd;
  let i;
  let j;
  let mask;
  let is_even = 1;
  const lat = [-90.0, 90.0];
  const lon = [-180.0, 180.0];
  let lat_err = 90.0;
  let lon_err = 180.0;
  i = 0;
  while (i < geohash.length) {
    c = geohash[i];
    cd = BASE32.indexOf(c);
    j = 0;
    while (j < 5) {
      mask = BITS[j];
      if (is_even) {
        lon_err /= 2;
        refine_interval(lon, cd, mask);
      } else {
        lat_err /= 2;
        refine_interval(lat, cd, mask);
      }
      is_even = !is_even;
      j += 1;
    }
    i += 1;
  }
  return [Math.round((lat[0] + lat[1]) / 2 * 10000000000000) / 10000000000000,
    Math.round((lon[0] + lon[1]) / 2 * 10000000000000) / 10000000000000];
};
const encodeGeoHash = function (latitude, longitude, precision) {
  let bit;
  let ch;
  let geohash;
  let i;
  let is_even;
  let mid;

  is_even = 1;
  i = 0;
  const lat = [-90.0, 90.0];
  const lon = [-180.0, 180.0];
  bit = 0;
  ch = 0;
  if (typeof precision === 'undefined') { precision = 12; }
  geohash = '';
  while (geohash.length < precision) {
    if (is_even) {
      mid = (lon[0] + lon[1]) / 2;
      if (longitude > mid) {
        ch |= BITS[bit];
        lon[0] = mid;
      } else {
        lon[1] = mid;
      }
    } else {
      mid = (lat[0] + lat[1]) / 2;
      if (latitude > mid) {
        ch |= BITS[bit];
        lat[0] = mid;
      } else {
        lat[1] = mid;
      }
    }
    is_even = !is_even;
    if (bit < 4) {
      bit += 1;
    } else {
      geohash += BASE32[ch];
      bit = 0;
      ch = 0;
    }
  }
  return geohash;
};

module.exports = { calculateAdjacent, calculateAdjacents, encodeGeoHash, decodeGeoHash };
