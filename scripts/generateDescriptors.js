const axios = require('axios');
const apiUrl = 'http://api.gbif-uat.org/v1/';
const helpers = require('./helpers');
const _ = require('lodash');
const Chance = require('chance');
var chance = new Chance();

// given a es index, a datasetKey, and a resolution, then generate a bunch of descriptors
async function generateDescriptors(esUrl, datasetKey, resolution, facetSize, countryFacetLimit) {
  facetSize = facetSize || 10;
  countryFacetLimit = countryFacetLimit || 1;
  resolution = resolution || 'orderKey';
  let collectionLocation = helpers.getRandomCoordinates();

  //get dataset description
  let dataset = (await axios.get(apiUrl + 'dataset/' + datasetKey)).data;
  let descriptors = [];
  let institution = helpers.getRandomInstitution();

  let result = (await axios.get(apiUrl + `occurrence/search?facet=${resolution}&limit=0&datasetKey=${datasetKey}`)).data;
  let taxa = result.facets[0].counts;
  for (var i = 0; i < taxa.length; i++) {
    if (taxa[i].count < 100) break;
    let taxon = await helpers.getHigherTaxa(taxa[i].name);
    //for each key, breakdown per top 1 country vs world
    let countriesResult = (await axios.get(apiUrl + `occurrence/search?facet=country&limit=0&facetLimit=${countryFacetLimit}&${resolution}=${taxa[i].name}&datasetKey=${datasetKey}`)).data;
    
    let preservation = helpers.getRandomPreservation();
    let dateRange = helpers.getRandomDateRange();

    let countries = countriesResult.facets[0].counts
    if (countries.length > 0) {
      countries.forEach(countryFacet => {
        let location = helpers.getLocationFromCountryCode(countryFacet.name);
        let counts = helpers.getCounts(countryFacet.count);
        descriptors.push({
          ...taxon,
          ...location,
          ...counts,
          preservation,
          dateRange,
          collectionKey: datasetKey,
          collectionTitle: dataset.title,
          institution,
          description: dataset.description,
          agents: helpers.getRandomAgents(),
          collectionLocation,
          thematicFocus: helpers.getRandomDescription()
        });
      });

      let diffCount = _.sumBy(countries, 'count')
      if (diffCount > 10) {
        let location2 = helpers.getLocationFromCountryCode();//world
        let counts2 = helpers.getCounts(diffCount);
        descriptors.push({
          ...taxon,
          ...location2,
          ...counts2,
          preservation,
          dateRange,
          collectionKey: datasetKey,
          collectionTitle: dataset.title,
          institution: helpers.getRandomInstitution(),
          description: dataset.description,
          agents: helpers.getRandomAgents(),
          collectionLocation,
          thematicFocus: helpers.getRandomDescription()
        });
      }
    }
  }

  //get diff
  // let facetSum = _.sumBy(result.facets[0].counts, 'count');
  // let totalDiff = result.count - facetSum;
  // if (totalDiff > 10) {
  //   let location2 = helpers.getLocationFromCountryCode();//world
  //   let counts2 = helpers.getCounts(totalDiff);
  //   let taxon = await helpers.getHigherTaxa(taxa[0].name);//remainder the same as the largest facet name
  //   descriptors.push({
  //     ...taxon,
  //     ...location2,
  //     ...counts2,
  //     preservation: helpers.getRandomPreservation(),
  //     dateRange: { gte: 1800, lte: 2000 },
  //     collectionKey: datasetKey,
  //     collectionTitle: dataset.title,
  //     institution: helpers.getRandomInstitution(),
  //     description: dataset.description
  //   });
  // }

  //add descriptors
  for (var i = 0; i < descriptors.length; i++) {
    axios.post(esUrl, descriptors[i]).catch(function (err) {
      console.log(err);
    });
  }
}

async function createDescriptors() {
  for (var i = 0; i < datasets.length; i++) {
    await generateDescriptors(esUrl, datasets[i].datasetKey, datasets[i].resolution, datasets[i].facetSize, datasets[i].countryFacetLimit)
  }
}

let datasets = [
  // {
  //   datasetKey: '42843f95-6fe3-47e4-bd0c-f4fcadca232f',
  //   resolution: 'familyKey'
  // },
  // {
  //   datasetKey: 'eb521f93-d62d-4332-a5f0-989ed94d9cc4',
  //   resolution: 'familyKey'
  // },
  // {
  //   datasetKey: 'aa7a8abb-a329-4d0c-88c3-e46065bef558',
  //   resolution: 'classKey'
  // },
  // {
  //   datasetKey: '7adf9745-c840-484d-b4b6-fdf097d96f77',
  //   resolution: 'kingdomKey'
  // },
  {
    datasetKey: '5a455e8a-51b2-4ecd-9247-cfd89f9cb768',
    resolution: 'orderKey'
  },
  {
    datasetKey: '5d283bb6-64dd-4626-8b3b-a4e8db5415c3',
    resolution: 'classKey'
  },
  {
    datasetKey: '15b04450-0c60-11dd-84cd-b8a03c50a862',
    resolution: 'phylumKey'
  },
  // {
  //   datasetKey: '1ebf1564-949e-49ca-9f8b-e11ef68238db',
  //   resolution: 'kingdomKey',
  //   countryFacetLimit: 10
  // },
  // {
  //   datasetKey: '83ae84cf-88e4-4b5c-80b2-271a15a3e0fc',
  //   resolution: 'familyKey',
  //   facetSize: 100
  // },
  // {
  //   datasetKey: '1e61b812-b2ec-43d0-bdbb-8534a761f74c',
  //   resolution: 'kingdomKey'
  // },
  // {
  //   datasetKey: 'aae308f4-9f9c-4cdd-b4ef-c026f48be551',
  //   resolution: 'orderKey',
  //   facetSize: 100
  // },
  // {
  //   datasetKey: '7c93d290-6c8b-11de-8226-b8a03c50a862',
  //   resolution: 'classKey',
  //   facetSize: 100
  // },
  // {
  //   datasetKey: '0645ccdb-e001-4ab0-9729-51f1755e007e',
  //   resolution: 'orderKey',
  //   countryFacetLimit: 10
  // },
  // {
  //   datasetKey: 'fa375330-6c8a-11de-8226-b8a03c50a862',
  //   resolution: 'orderKey',
  //   countryFacetLimit: 10
  // },
  // {
  //   datasetKey: '4bfac3ea-8763-4f4b-a71a-76a6f5f243d3',
  //   resolution: 'orderKey',
  //   countryFacetLimit: 10
  // },
  // {
  //   datasetKey: '40c0f670-ee87-4576-be9d-2725e0b47035',
  //   resolution: 'orderKey'
  // },
  // {
  //   datasetKey: '358fbd61-739f-4102-afc9-9d468f571e4d',
  //   resolution: 'orderKey',
  //   countryFacetLimit: 10
  // },
  // {
  //   datasetKey: '37beb6ea-e591-41e3-b781-e384250dc42c',
  //   resolution: 'orderKey'
  // },
  // {
  //   datasetKey: 'cece4fc2-1fec-4bb5-a335-7252548e3f0b',
  //   resolution: 'orderKey',
  //   countryFacetLimit: 10
  // },
  // {
  //   datasetKey: '821cc27a-e3bb-4bc5-ac34-89ada245069d',
  //   resolution: 'orderKey',
  //   facetSize: 100,
  //   countryFacetLimit: 10
  // },
  {
    datasetKey: '84d26682-f762-11e1-a439-00145eb45e9a',
    resolution: 'familyKey',
    facetSize: 300,
    countryFacetLimit: 5
  }
];

let esUrl = 'http://localhost:9200/collections/_doc/';

createDescriptors().catch(function(err){
  console.log(err)
});

// descriptors: include rank(s) (e.g. [kingdom, phylum, class]) as it is useful for search (must be specific to at least order to be intersting for me)