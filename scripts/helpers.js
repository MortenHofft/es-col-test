const axios = require('axios');
const _ = require('lodash');
const countryMap = require('./countries');
const Chance = require('chance');
var chance = new Chance();

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

let agents = [
  {
    action: 'CURATED',
    identifier: '123',
    name: 'Benny'
  },
  {
    action: 'COLLECTED',
    identifier: '123',
    name: 'Benny'
  },
  {
    action: 'CURATED',
    identifier: '456',
    name: 'Beate'
  },
  {
    action: 'COLLECTED',
    identifier: '789',
    name: 'Carola'
  },
  {
    action: 'IDENTIFIED',
    identifier: '011',
    name: 'Jasper'
  }
];
function getRandomAgent() {
  return agents[_.random(0, agents.length - 1)];
}

function getRandomDescription() {
  return  chance.paragraph();
}

function getRandomCoordinates() {
  return chance.coordinates();
}

function getRandomAgents() {
  let a = [getRandomAgent()];
  if (Math.random() > 0.5) {
    a.push(getRandomAgent());
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
  getLocationFromCountryCode
}
