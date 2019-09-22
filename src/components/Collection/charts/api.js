import qs from 'qs';
import bodybuilder from 'bodybuilder';
import axios_cancelable from '../../../api/util/axiosCancel';

export const apiUrl = '//localhost:9200/collections/';

export const getCollectionCount = query => {
  let body = {
    "size": 0,
    "query": query || undefined,
    "aggs" : {
        "count" : {
            "cardinality" : {
                "field" : "collectionKey.keyword"
            }
        }
    }
};
  return axios_cancelable.post(`${apiUrl}_search`, body).then(response => response.data.aggregations.count.value);
}