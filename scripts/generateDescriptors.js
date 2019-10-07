const axios = require('axios');
const apiUrl = 'http://api.gbif-uat.org/v1/';
const helpers = require('./helpers');
const _ = require('lodash');
const Chance = require('chance');
var chance = new Chance();

// given a es index, a datasetKey, and a resolution, then generate a bunch of descriptors
async function generateDescriptors(esUrl, datasetKey, resolution, facetSize, countryFacetLimit) {
  facetSize = facetSize || 20;
  countryFacetLimit = countryFacetLimit || 1;
  resolution = resolution || 'orderKey';
  let collectionLocation = helpers.getRandomCoordinates();
  let elvisSupport = Math.random() > 0.66;

  //get dataset description
  let dataset = (await axios.get(apiUrl + 'dataset/' + datasetKey)).data;
  let descriptors = [];
  let institution = helpers.getRandomInstitution();
  let coordinate_point = chance.coordinates();

  let result = (await axios.get(apiUrl + `occurrence/search?facet=${resolution}&limit=0&datasetKey=${datasetKey}`)).data;
  let taxa = result.facets[0].counts;
  for (var i = 0; i < taxa.length; i++) {
    if (taxa[i].count < 100) break;
    let taxon = await helpers.getHigherTaxa(taxa[i].name);
    //for each key, breakdown per top 1 country vs world
    let countriesResult = (await axios.get(apiUrl + `occurrence/search?facet=country&limit=0&facetLimit=${countryFacetLimit}&${resolution}=${taxa[i].name}&datasetKey=${datasetKey}`)).data;

    let preservation = Math.random() > 0.2 ? helpers.getRandomPreservation() : undefined;
    let dateRange = helpers.getRandomDateRange();

    let hasCareStats = Math.random() > 0.5;
    let careMean = Math.floor(50 + 25 * Math.random());
    let careStd = Math.floor(1 + 2 * Math.random());
    let countries = countriesResult.facets[0].counts
    if (countries.length > 0) {
      countries.forEach(countryFacet => {
        let location = helpers.getLocationFromCountryCode(countryFacet.name);
        let counts = helpers.getCounts(countryFacet.count);

        let careStats = {};
        if (hasCareStats) careStats = helpers.getCareCounts(careMean, careStd);

        descriptors.push({
          ...taxon,
          ...location,
          ...counts,
          ...careStats,
          preservation,
          dateRange,
          collectionKey: datasetKey,
          collectionTitle: dataset.title,
          institution,
          description: dataset.description,
          agents: helpers.getRandomAgents(dataset.key),
          coordinate_point,
          collectionLocation,
          thematicFocus: helpers.getRandomDescription(),
          doi: dataset.doi,
          elvisSupport
        });
      });

      let diffCount = countriesResult.count - _.sumBy(countries, 'count')
      if (diffCount > 10) {
        let location2 = helpers.getLocationFromCountryCode();//world
        let counts2 = helpers.getCounts(diffCount);
        let careStats2 = {};
        if (hasCareStats) careStats2 = helpers.getCareCounts(careMean, careStd);

        descriptors.push({
          ...taxon,
          ...location2,
          ...counts2,
          ...careStats2,
          preservation,
          dateRange,
          collectionKey: datasetKey,
          collectionTitle: dataset.title,
          institution: helpers.getRandomInstitution(),
          description: dataset.description,
          agents: helpers.getRandomAgents(dataset.key),
          coordinate_point,
          collectionLocation,
          thematicFocus: helpers.getRandomDescription(),
          doi: dataset.doi,
          elvisSupport
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
    await axios.post(esUrl, descriptors[i]).catch(function (err) {
      console.log(Object.keys(err));
      console.log(err.response);
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
  // {
  //   datasetKey: '5a455e8a-51b2-4ecd-9247-cfd89f9cb768',
  //   resolution: 'orderKey'
  // },
  // {
  //   datasetKey: '5d283bb6-64dd-4626-8b3b-a4e8db5415c3',
  //   resolution: 'classKey'
  // },
  // {
  //   datasetKey: '15b04450-0c60-11dd-84cd-b8a03c50a862',
  //   resolution: 'phylumKey'
  // },
  // {
  //   datasetKey: '1ebf1564-949e-49ca-9f8b-e11ef68238db',
  //   resolution: 'kingdomKey',
  //   countryFacetLimit: 10
  // },
  {
    datasetKey: '83ae84cf-88e4-4b5c-80b2-271a15a3e0fc',
    resolution: 'familyKey',
    facetSize: 100
  },
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
  // {
  //   datasetKey: '84d26682-f762-11e1-a439-00145eb45e9a',
  //   resolution: 'familyKey',
  //   facetSize: 300,
  //   countryFacetLimit: 5
  // }

  {
    "datasetKey": "821cc27a-e3bb-4bc5-ac34-89ada245069d",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "b5cdf794-8fa4-4a85-8b26-755d087bf531",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "4ce8e3f9-2546-4af1-b28d-e2eadf05dfd4",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "15f819bd-6612-4447-854b-14d12ee1022d",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "7bd65a7a-f762-11e1-a439-00145eb45e9a",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "7e380070-f762-11e1-a439-00145eb45e9a",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "d415c253-4d61-4459-9d25-4015b9084fb0",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "3e9817c1-8302-4955-87e3-a408db0ea379",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "ad43e954-dd79-4986-ae34-9ccdbd8bf568",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "4bfac3ea-8763-4f4b-a71a-76a6f5f243d3",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "b740eaa0-0679-41dc-acb7-990d562dfa37",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "f9a70dab-004b-45ad-90cb-24d8ff645b44",
    "resolution": "familyKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "dce8feb0-6c89-11de-8225-b8a03c50a862",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "aae308f4-9f9c-4cdd-b4ef-c026f48be551",
    "resolution": "familyKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "861e6afe-f762-11e1-a439-00145eb45e9a",
    "resolution": "familyKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "1881d048-04f9-4bc2-b7c8-931d1659a354",
    "resolution": "familyKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "aab0cf80-0c64-11dd-84d1-b8a03c50a862",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "0943f690-fde5-11dd-83f4-b8a03c50a862",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "9aa00786-772a-46d4-8fe1-ac6d8926a040",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "902c8fe7-8f38-45b0-854e-c324fed36303",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "865df020-f762-11e1-a439-00145eb45e9a",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "c8d12f8a-7e39-4e2c-92d7-825d590ad15b",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "cd6e21c8-9e8a-493a-8a76-fbf7862069e5",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "cb9beff3-a185-486f-975a-732251444158",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "bf2a4bf0-5f31-11de-b67e-b8a03c50a862",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "e45c7d91-81c6-4455-86e3-2965a5739b1f",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "a79c2b50-6c8a-11de-8226-b8a03c50a862",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "b929f23d-290f-4e85-8f17-764c55b3b284",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "39905320-6c8a-11de-8226-b8a03c50a862",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "96c93a1e-f762-11e1-a439-00145eb45e9a",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "7c93d290-6c8b-11de-8226-b8a03c50a862",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "834c9918-f762-11e1-a439-00145eb45e9a",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "4300f8d5-1ae5-49e5-a101-63894b005868",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "13b70480-bd69-11dd-b15f-b8a03c50a862",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "d962a7dc-2183-4824-bb88-5e0ba14ec62d",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "c1a13bf0-0c71-11dd-84d4-b8a03c50a862",
    "resolution": "familyKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "68513375-3aa5-4f6f-9975-d97d56c21d61",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "85b1cfb6-f762-11e1-a439-00145eb45e9a",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "90c853e6-56bd-480b-8e8f-6285c3f8d42b",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "961a5ce1-f843-4e75-86a6-51aa959fc12c",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "7a25f7aa-03fb-4322-aaeb-66719e1a9527",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "262f8270-f9c2-4bc6-a562-8ed71c0790e6",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "f934f8e2-32ca-46a7-b2f8-b032a4740454",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "10e44c48-0839-4a20-86d5-f0e23ae2e366",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "5c2a93e4-4578-496c-9b61-edb9d72e8cbc",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "5d7f5915-0561-4107-aa20-20a4267c203f",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "36f15a36-6b45-442e-9c31-cd633423aee0",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "8138eb72-f762-11e1-a439-00145eb45e9a",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "3942a8dc-9f01-420d-a829-01675dc01c73",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "84ab7b76-f762-11e1-a439-00145eb45e9a",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "9d7fc836-8588-408a-bcc0-c22360bf4a24",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "fea77396-7b26-44cb-8580-aefadc8db276",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "5d26c04c-d269-4e1a-9c54-0fc678fae56a",
    "resolution": "orderKey",
    "countryFacetLimit": 10,
    facetSize: 100
  },
  {
    "datasetKey": "8f7e3c45-4d76-4982-9478-651439e0cd4b",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "197908d0-5565-11d8-b290-b8a03c50a862",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "f2e389da-39c3-4f21-8d72-b7d574d924a9",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "6b8e4fd5-d300-4f9c-a176-5685f136ecef",
    "resolution": "familyKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "871bbe1d-c45f-45cc-b5cd-b79f4eb37485",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "27b4ff4b-29c3-4017-9c48-3750861392f7",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "f3130a8a-4508-42b4-9737-fbda77748438",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "86b50d88-f762-11e1-a439-00145eb45e9a",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "eb7681c5-5c9c-4e28-954f-f328991c7004",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "96193ea2-f762-11e1-a439-00145eb45e9a",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "82ea2cf6-f762-11e1-a439-00145eb45e9a",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "26f5b360-8770-4d54-9c2d-397798a5e513",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "85714c48-f762-11e1-a439-00145eb45e9a",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "848f7570-f762-11e1-a439-00145eb45e9a",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "fa375330-6c8a-11de-8226-b8a03c50a862",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "7931dcab-94f1-46ce-8092-56e4335423de",
    "resolution": "orderKey",
    "countryFacetLimit": 10,
    facetSize: 100
  },
  {
    "datasetKey": "9a5ffc6a-27fc-11e2-85e3-00145eb45e9a",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "3717f916-d983-4a81-bb13-5f91200871a6",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "dce00a1f-f6b4-4e11-9771-92c62c40ad80",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "71d0dff0-f762-11e1-a439-00145eb45e9a",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "3b301884-51b9-443f-b63c-47feeccfb89f",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "246ad1f8-e75c-419d-b97e-16dde697ae30",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "0645ccdb-e001-4ab0-9729-51f1755e007e",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "18da9e5d-8966-4893-bf70-b3911152d991",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "8971dfba-f762-11e1-a439-00145eb45e9a",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "96404cc2-f762-11e1-a439-00145eb45e9a",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "b15d4952-7d20-46f1-8a3e-556a512b04c5",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "f519367d-6b9d-411c-b319-99424741e7de",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "fe35d6a0-0c6e-11dd-84d2-b8a03c50a862",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "03f2256a-e548-43d7-a731-253302f4aa34",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "8044ee43-c5fe-44da-ad96-cc1a9cfb91ba",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "f5de707d-eba1-4f1a-b1df-1a7fa27b1bc7",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "cece4fc2-1fec-4bb5-a335-7252548e3f0b",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "1e61b812-b2ec-43d0-bdbb-8534a761f74c",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "96ca66b4-f762-11e1-a439-00145eb45e9a",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "5d283bb6-64dd-4626-8b3b-a4e8db5415c3",
    "resolution": "classKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "13e7869e-0c76-473a-a227-53d6e3d6fbf2",
    "resolution": "familyKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "3b8e9d83-b2d4-4a97-973c-31d98b67b1e9",
    "resolution": "familyKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "e48d6c49-34a3-4df6-8206-121c061f190d",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "df582950-3b58-11dc-8c19-b8a03c50a862",
    "resolution": "familyKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "09c4287e-e6d5-4552-a07f-bff8a00833d8",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "889c91a3-614f-4355-8df8-b6d0260a118c",
    "resolution": "familyKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "95c938a8-f762-11e1-a439-00145eb45e9a",
    "resolution": "familyKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "7f5260c2-f762-11e1-a439-00145eb45e9a",
    "resolution": "familyKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "95eebc5e-f762-11e1-a439-00145eb45e9a",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "8d7c4dd0-c75e-11dd-87ef-b8a03c50a862",
    "resolution": "orderKey",
    "countryFacetLimit": 10
  },
  {
    "datasetKey": "68c30283-d2a7-4742-96cb-52e249598ff9",
    "resolution": "familyKey",
    "countryFacetLimit": 10,
    facetSize: 100
  }

];

let esUrl = 'http://es1.gbif-dev.org/collections/col/';

createDescriptors().catch(function (err) {
  console.log(err)
});

// descriptors: include rank(s) (e.g. [kingdom, phylum, class]) as it is useful for search (must be specific to at least order to be intersting for me)