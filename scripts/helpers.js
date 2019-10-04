const axios = require('axios');
const _ = require('lodash');
const countryMap = require('./countries');
const Chance = require('chance');
var chance = new Chance(1234);

async function getHigherTaxa(key, actualCount) {
  var response = await axios.get(`https://api.gbif.org/v1/species/${key}`);
  var result = response.data;
  var taxa = _.compact([result.kingdomKey, result.phylumKey, result.classKey, result.orderKey, result.familyKey, result.genusKey]);
  return {
    higherTaxa: taxa,
    scientificName: result.scientificName,
    key: Number(key)
  }
}

function getPrettyNumber(nr) {
  let size = Math.pow(10, Math.floor(nr).toString().length - 1);
  return Math.min(Math.max(0, Math.ceil(nr / size) * size), 1000000);
}

function random(m, s, max, min) {
  m = m || 50;
  s = s || m/5;
  let r = m + 2.0 * s * (Math.random() + Math.random() + Math.random() - 1.5);
  if (max) r = Math.min(max, r);
  if (min) r = Math.max(min, r);
  return r;
}

function getCounts(count) {
  return {
    count: getPrettyNumber(count),
    typeCount: getPrettyNumber(count * _.random(0, 0.1)),
    digitizedCount: getPrettyNumber(count * _.random(0, 0.2)),
    uncertainty: 5 * _.random(1, 5) / 100,
    numberCatalogued: getPrettyNumber(count * _.random(0, 0.25)),
    StorageVolume: _.random(2, 100)
  }
}

function getCareCounts(m, s) {
  return {
    physicalAccessibility: random(m, s, 98, 5),
    physicalCondition: random(m, s, 98, 5),
    housingMaterials: random(m, s, 98, 5),
    storageEquipment: random(m, s, 98, 5)
  }
}

function getLocationFromCountryCode(countryCode) {
  let c = countryMap[countryCode];
  if (c) {
    return {
      location: c.enumName,
      higherLocations: ['WORLD', c.gbifRegion, c.enumName]
    };
  }
  return {
    location: 'WORLD',
    higherLocations: ['WORLD']
  };
}

function getRandomDateRange() {
  let start = _.random(1900, 1980);
  let interval = _.random(1, 5);
  return { gte: start, lte: start + interval * 5 };
}

function getRandomPreservation() {
  let i = _.random(0, preservationTypes.length - 1);
  return preservationTypes[i];
}

function getRandomLocation() {
  let locs = Object.keys(locations);
  let i = _.random(0, locs.length - 1);
  return {
    location: locs[i],
    higherLocations: locations[locs[i]].concat(locs[i])
  }
}

function getRandomCollection() {
  return ['COL_A', 'COL_B', 'COL_C'][_.random(0, 2)];
}

function getRandomInstitution() {
  return ['8dcaa17b-eaf0-4017-a064-90587700aa4e', '07558d80-dea0-41f8-a1b7-b147e9515605', '1d808a7c-1f9e-4379-9616-edb749ecf10e'][_.random(0, 2)];
}

let hash = function (str) {
  var hash = 0, i, chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

let agents = [];
let actions = ['CURATED', 'CURATED', 'CURATED', 'CURATED', 'COLLECTED', 'IDENTIFIED'];

//create agents
for (var i = 0; i < 200; i++ ) {
  agents.push({
    name: chance.name({ middle: true }),
    identifier: chance.integer()
  });
}

function getRandomAgent(localChance) {
  let a = agents[_.random(0, agents.length - 1)];
  a.action = localChance.weighted(['CURATED', 'COLLECTED', 'IDENTIFIED'], [4, 2, 1])
  return a;
}

function getRandomDescription() {
  return  chance.paragraph();
}

function getRandomCoordinates() {
  return chance.coordinates();
}

function getRandomAgents(seed) {
  var localChance = new Chance(hash(seed));
  let a = [getRandomAgent(localChance)];
  if (localChance.bool({ likelihood: 50 })) {
    a.push(getRandomAgent(localChance));
  }
  return a;
}

let locations = {
  Denmark: ['Europe', 'World'],
  Norway: ['Europe', 'World'],
  Sweden: ['Europe', 'World'],
  China: ['Asia', 'World'],
  Japan: ['Asia', 'World'],
  Korea: ['Asia', 'World'],
  Vietnam: ['Asia', 'World'],
  Europe: ['World'],
  Asia: ['World'],
  World: [],
  Chile: ['South America', 'World'],
  Equador: ['South America', 'World'],
  Brazil: ['South America', 'World'],
  Zealand: ['Denmark', 'Europe', 'World'],
  Fyn: ['Denmark', 'Europe', 'World'],
  Copenhagen: ['Zealand', 'Denmark', 'Europe', 'World'],
  Aarhus: ['Jutland', 'Denmark', 'Europe', 'World'],
  Skåne: ['Sweden', 'Europe', 'World'],
};

let preservationTypes = ['SPIRIT_JAR', 'DRIED', 'FOSSIL'];

module.exports = {
  getHigherTaxa,
  getRandomDateRange,
  getRandomPreservation,
  getRandomLocation,
  getRandomCollection,
  locations,
  preservationTypes,
  getRandomInstitution,
  getRandomCoordinates,
  getRandomAgent,
  getRandomAgents,
  getRandomDescription,
  getCounts,
  getLocationFromCountryCode,
  getCareCounts
}
