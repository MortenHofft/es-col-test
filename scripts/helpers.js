const axios = require('axios');
const _ = require('lodash');
const countryMap = require('./countries');

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
  let size = Math.pow(10, Math.floor(nr).toString().length-1);
  return Math.min(Math.max(0, Math.ceil(nr/size)*size), 1000000);
}
function getCounts(count) {
  return {
    count: getPrettyNumber(count),
    typeCount: getPrettyNumber(count * _.random(0, 0.1)),
    digitizedCount: getPrettyNumber(count * _.random(0, 0.2)),
    uncertainty: 5 * _.random(1, 5) / 100
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
  return ['COL_A', 'COL_B', 'COL_C'][_.random(0,2)];
}

function getRandomInstitution() {
  return ['Inst_A', 'Inst_B', 'Inst_C'][_.random(0,2)];
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
  getCounts,
  getLocationFromCountryCode
}