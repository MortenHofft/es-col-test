import qs from 'qs';
import bodybuilder from 'bodybuilder';
import axios_cancelable from '../../../api/util/axiosCancel';

export const apiUrl = '//localhost:9200/collections/';

export const getCollectionCount = query => {
  let body = {
    "size": 0,
    "query": query || undefined,
    "aggs": {
      "count": {
        "cardinality": {
          "field": "collectionKey"
        }
      }
    }
  };
  return axios_cancelable.post(`${apiUrl}_search`, body).then(response => response.data.aggregations.count.value);
}

export const getSpecimenCounts = query => {
  let body = {
    "size": 0,
    "query": query || undefined,
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
      "typeCount": {
        "sum": {
          "field": "typeCount"
        }
      },
    }
  };
  return axios_cancelable.post(`${apiUrl}_search`, body).then(response => {
    return {
      specimenCount: response.data.aggregations.specimenCount.value,
      digitizedCount: response.data.aggregations.digitizedCount.value,
      typeCount: response.data.aggregations.typeCount.value,
    };
  });
}

export const getCollectionCare = query => {
  let body = {
    "size": 0,
    "query": query || undefined,
    "aggs": {
      "physicalAccessibility": { "weighted_avg": { "value": { "field": "physicalAccessibility" }, "weight": { "field": "count" } } },
      "physicalCondition": { "weighted_avg": { "value": { "field": "physicalCondition" }, "weight": { "field": "count" } } },
      "housingMaterials": { "weighted_avg": { "value": { "field": "housingMaterials" }, "weight": { "field": "count" } } },
      "storageEquipment": { "weighted_avg": { "value": { "field": "storageEquipment" }, "weight": { "field": "count" } } }
    }
  };

  // let body = {
  //   "size": 0,
  //   "query": query || undefined,
  //   "aggs": {
  //     "physicalAccessibility": { "stats": { "field": "physicalAccessibility" } },
  //     "physicalCondition": { "stats": { "field": "physicalCondition" } },
  //     "housingMaterials": { "stats": { "field": "housingMaterials" } },
  //     "storageEquipment": { "stats": { "field": "storageEquipment" } },
  //     "physicalAccessibility_missing": {
  //       "missing": { "field": "physicalAccessibility" }
  //     },
  //     "physicalCondition_missing": {
  //       "missing": { "field": "physicalCondition" }
  //     },
  //     "housingMaterials_missing": {
  //       "missing": { "field": "housingMaterials" }
  //     },
  //     "storageEquipment_missing": {
  //       "missing": { "field": "storageEquipment" }
  //     }
  //   }
  // };
  return axios_cancelable.post(`${apiUrl}_search`, body).then(response => {
    const result = {
      physicalAccessibility: response.data.aggregations.physicalAccessibility,
      physicalCondition: response.data.aggregations.physicalCondition,
      housingMaterials: response.data.aggregations.housingMaterials,
      storageEquipment: response.data.aggregations.storageEquipment,
      // physicalAccessibility_missing: response.data.aggregations.physicalAccessibility_missing.doc_count,
      // physicalCondition_missing: response.data.aggregations.physicalAccessibility_missing.doc_count,
      // housingMaterials_missing: response.data.aggregations.physicalAccessibility_missing.doc_count,
      // storageEquipment_missing: response.data.aggregations.physicalAccessibility_missing.doc_count,
    };
    return result;
  });
}

export const getPresevationCounts = query => {
  let body = {
    "size": 0,
    "query": query || undefined,
    "aggs": {
      "noPreservationMentioned": {
        "missing": { "field": "preservation" },
        "aggs": {
          "specimens": {
            "sum": {
              "field": "count"
            }
          }
        }
      },
      "preservationTypes": {
        "terms": {
          "field": "preservation"
        },
        "aggs": {
          "specimens": {
            "sum": {
              "field": "count"
            }
          }
        }
      }
    }
  };
  return axios_cancelable.post(`${apiUrl}_search`, body).then(response => {
    const aggs = response.data.aggregations;
    const results = aggs.preservationTypes.buckets.map(b => {
      return {label: b.key, value: b.specimens.value}
    });
    if (aggs.noPreservationMentioned.specimens.value > 0) results.push({label: 'UNKNOWN', value: aggs.noPreservationMentioned.specimens.value});
    return results;
  });
}