import qs from 'qs';
import bodybuilder from 'bodybuilder';
import axios_cancelable from './util/axiosCancel';
import { getLocations } from './enumeration';

export const locations = getLocations();

export const collectionSearch = async (query) => {
  console.log(query);
  let filters = [];
  if (query.q) {
    filters.push({
      "query_string": {
        "query": query.q
      }
    })
  }
  if (query.location) {
    const l = await getLocationQuery(query.location);
    filters.push(l);
  }
  if (query.taxonKey) {
    const t = await getTaxonQuery(query.taxonKey);
    filters.push(t);
  }
  if (query.dateRange) {
    filters.push({
      "range": {
        "dateRange": query.dateRange
      }
    });
  }
  const postTest = {
    "size": 0,
    "query": {
      "script_score": {
        "query": filters.length === 0 ? { "query_string": { "query": "*" } } : { "bool": { "must": filters } },
        "script": {
          "source": "_score + doc['count'].value/10000"
        }
      }
    },
    "aggs": {
      "collections": {
        "terms": {
          "field": "collectionKey",
          "size": 500,
          "order": {
            "max_score": "desc"
          }
        },
        "aggs": {
          "sum": {
            "sum": {
              "field": "count"
            }
          },
          "descriptors": {
            "top_hits": {
              "size": 5
            }
          },
          "max_score": {
            "max": {
              "script": "_score"
            }
          }
        }
      }
    }
  };
  return axios_cancelable.post('http://localhost:9200/collections/_search', postTest);
};

export const getCollection = key => {
  return axios_cancelable.get(`/dataset/${key}`);
};

export const speciesSuggest = str => {
  return axios_cancelable.get(`http://api.gbif.org/v1/species/suggest?q=${str}`);
};


async function getLocationQuery(location) {
  //get higher from location
  let places = await locations;
  let higherLocations = places.higherLocations;

  const higher = [...higherLocations[location], location];
  return {
    "bool": {
      "should": [
        {
          "terms": {
            "location": higher,
            "boost": 1
          }
        },
        {
          "term": {
            "higherLocations": {
              "value": location,
              "boost": 100
            }
          }
        }
      ]
    }
  };
}

const majorRanks = ['kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species'];

async function getTaxonQuery(taxonKey) {
  //get higher from location
  let taxon = (await axios_cancelable.get(`http://api.gbif.org/v1/species/${taxonKey}`)).data;
  let higherTaxa = majorRanks.map(rank => taxon[rank + 'Key']).filter(key => typeof (key) !== 'undefined' && taxonKey !== key);
  const higher = [...higherTaxa, taxonKey];
  return {
    "bool": {
      "should": [
        {
          "terms": {
            "key": higher,
            "boost": 1
          }
        },
        {
          "term": {
            "higherTaxa": {
              "value": taxonKey,
              "boost": 10
            }
          }
        }
      ]
    }
  };
}

const aggs = {
  "group_by_collection": {
    "terms": {
      "field": "collectionKey",
      "size": 500,
      "order": {
        "max_score": "desc"
      }
    },
    "aggs": {
      "sum": {
        "sum": {
          "field": "count"
        }
      },
      "by_top_hit": {
        "top_hits": {
          "size": 1
        }
      },
      "max_score": {
        "max": {
          "script": "_score"
        }
      }
    }
  },
  "sum": {
    "sum": {
      "field": "count"
    }
  }
};