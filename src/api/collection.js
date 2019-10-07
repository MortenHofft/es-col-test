import qs from 'qs';
import bodybuilder from 'bodybuilder';
import axios_cancelable from './util/axiosCancel';
import { getLocations } from './enumeration';

import config from './util/config';

export const apiUrl = config.esUrl + '/collections';

/*
Using ES
graphql seems a fair candidate for our registry APIs and porbably also for our ES endpoints.
Unclear how to secure ES while also making it flexible for us and the users. Enough to only allow
selected indices and only _search and _count? 
1.  We could set up a complete REST wrapper around ES that only allowed certain requests with a 
    small set of predefined options.
2.  We could allow all requests, but only to this index using _search or _count 
    (is that sufficient ? are there hacks to misuse aside from doing very heavy queries?)
3.  We could do 2, but build graphQl views on top of that to allow resolving a subset of fields.

I like the 2/3 version. But the graphQl parts seems tricky. 
Can the graphql schema but auto-generated from the ES mapping? https://github.com/graphql-compose/graphql-compose-elasticsearch
doing it for hits alone would be simple, but then what when starting to work with aggregations. 
E.g. unclear how to resolve aggregations of type userSelectedName: hits: [name, value]. 
How to resolve the name requires you know what field was aggregated on. 

Caching
A data cache will still work with varnish. Apollo can do server cache with e.g. Dataloader. 
There migth be varnish on top of that for requests coming in with GET (could be all requests smaller than x bytes) 
and all persistent (https://blog.apollographql.com/persisted-graphql-queries-with-apollo-client-119fd7e6bba5).
And then the client layer if using Apollo client. Then uniqu queries such as search often is, is probably only 
cached in the data layer, and standard queries (like say a dataset page) is cached with a hashID GET.

Errors
Makes sense to send partial data even if a particular field cannot be resolved. 
But that requires a strategy for telling the client that this operation failed, for some or all of x. 
But other parts of the result might well be perfectly useful and enough to provide a sensible UI in 
an environment with many unstable endpoints.
Instead log on server and inform user of missing data.

I like the idea of using remote schemas and stitching them together. 
So that we can wrap external services in a grapql API and stitch them all together. Possibly aligning naming.
APIs could be something along: 
  registry, occurrences, species, treatments, literature, col+, BOLD, wikidata, orcid, collectionDescriptors, Bloodhound, BHL, fundref, dataCite, ...etc.

Some of these, might be something we crawl and index if there is no API to use. 
Other we translate existing external REST/other APIs
Others have a GraphQL API already

Given that we will start to use ES more, an easy way to compose ES queries would be useful. 
Something akin to our v1 e.g.
*/

export const locations = getLocations();

export const getEsQuery = async (query) => {
  let filters = [];
  if (typeof query !== 'object') return { "query_string": { "query": "*" } };

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
  return filters.length === 0 ? { "query_string": { "query": "*" } } : { "bool": { "must": filters } };
};

export const collectionSearch = async (query) => {
  const postTest = {
    "size": 0,
    // "query": {
    //   "script_score": {
    //     "query": query.body,
    //     "script": {
    //       "source": "_score + doc['count'].value/10000"
    //     }
    //   }
    // },
    // query: query.body,
    query: {
      "function_score": {
        "query": query.body,
        "script_score": {
          "script": {
            "source": "_score + doc['count'].value/10000"
          }
        }
      }
    },
    "aggs": {
      "collections": {
        "terms": {
          "field": "collectionKey", // version specific
          "size": query.limit || 500,
          "order": {
            "max_score": "desc"
          }
        },
        "aggs": {
          "specimenCount": {
            "sum": {
              "field": "count"
            }
          },
          "digitizedCount": {
            "sum": {
              "field": "digitizedCount"
            }
          },
          "descriptors": {
            "top_hits": {
              "size": query.descriptorLimit || 2
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
  return axios_cancelable.post(apiUrl + '/_search', postTest, {headers: {'Content-Type': 'application/json'}});
};

export const getCollection = key => {
  return axios_cancelable.get(`/dataset/${key}`);
};

export const speciesSuggest = str => {
  return axios_cancelable.get(`http://api.gbif.org/v1/species/suggest?datasetKey=d7dddbf4-2cf0-4f39-9b2a-bb099caae36c&q=${str}`);
};

export const speciesFromKey = key => {
  return axios_cancelable.get(`http://api.gbif.org/v1/species/${key}`);
};

export const institutionFromKey = key => {
  return axios_cancelable.get(`http://api.gbif.org/v1/grscicoll/institution/${key}`);
};


async function getLocationQuery(location) {
  //get higher from location
  let places = await locations;
  let higherLocations = places.higherLocations;

  const higher = [...higherLocations[location], location];
  return {
    "bool": {
      "should": [
        // {
        //   "terms": {
        //     "location": higher,
        //     "boost": 1
        //   }
        // },
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
        // {
        //   "terms": {
        //     "key": higher,
        //     "boost": 1
        //   }
        // },
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


export const peopleSearch = async (query) => {
  const postTest = {
    "size": 0,
    // "query": {
    //   "script_score": {
    //     "query": query.body,
    //     "script": {
    //       "source": "_score + doc['count'].value/10000"
    //     }
    //   }
    // },
    query: query.body,
    "aggs": {
      "agents": {
        "nested": {
          "path": "agents"
        },
        "aggs": {
          "topAgents": {
            "terms": {
              "field": "agents.identifier",
              size: query.limit || 20
            },
            "aggs": {
              "agentToDescriptor": {
                "reverse_nested": {},
                "aggs": {
                  "topTaxa": {
                    "terms": {
                      "field": "key",
                      "size": 5
                    }
                  }
                }
              },
              "exampleAgents": {
                "top_hits": {
                  "size": 2
                }
              }
            }
          }
        }
      }
    }
  };
  return axios_cancelable.post(apiUrl + '/_search', postTest, {headers: {'Content-Type': 'application/json'}});
};