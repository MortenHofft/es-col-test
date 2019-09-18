import axiosInstance from './util/axiosInstance';
import _ from 'lodash';

export const getCountries = () => {
  return axiosInstance.get('/enumeration/basic/Country').then(response => response.data);
};

export const getContactTypes = () => {
  return axiosInstance.get('/enumeration/basic/ContactType').then(response => response.data);
};

export const getLicenses = () => {
  return axiosInstance.get('/enumeration/license').then(response => response.data);
};

export const getInstallationTypes = () => {
  return axiosInstance.get('/enumeration/basic/InstallationType').then(response => response.data);
};

export const getLanguages = () => {
  return axiosInstance.get('/enumeration/basic/Language').then(response => response.data);
};

export const getEndpointTypes = () => {
  return axiosInstance.get('/enumeration/basic/EndpointType').then(response => response.data);
};

export const getDatasetTypes = () => {
  return axiosInstance.get('/enumeration/basic/DatasetType').then(response => response.data);
};

export const getDatasetSubtypes = () => {
  return axiosInstance.get('/enumeration/basic/DatasetSubtype').then(response => response.data);
};

export const getMaintenanceUpdateFrequencies = () => {
  return axiosInstance.get('/enumeration/basic/MaintenanceUpdateFrequency').then(response => response.data);
};

export const getIdentifierTypes = () => {
  return axiosInstance.get('/enumeration/basic/IdentifierType').then(response => response.data);
};

export const getPreservationMethodType = () => {
  return axiosInstance.get('/enumeration/basic/PreservationMethodType').then(response => response.data);
};

export const getAccessionStatus = () => {
  return axiosInstance.get('/enumeration/basic/AccessionStatus').then(response => response.data);
};

export const getCollectionContentType = () => {
  return axiosInstance.get('/enumeration/basic/CollectionContentType').then(response => response.data);
};

export const getInstitutionType = () => {
  return axiosInstance.get('/enumeration/basic/InstitutionType').then(response => response.data);
};

export const getInstitutionGovernance = () => {
  return axiosInstance.get('/enumeration/basic/InstitutionGovernance').then(response => response.data);
};

export const getDiscipline = () => {
  return axiosInstance.get('/enumeration/basic/Discipline').then(response => response.data);
};

export const getCitesAppendix = () => {
  return axiosInstance.get('/enumeration/basic/CitesAppendix').then(response => response.data);
};

export const getLocations = () => {
  return axiosInstance.get('/enumeration/country')
    .then(response => response.data)
    .then(data => {
      // get all possible options
      let locations = new Set(data.map(x => x.enumName));
      data.forEach(x => {
        locations.add(x.gbifRegion);
      });
      locations.add('WORLD');

      //create a mapping between locations and their higher parts
      let higherLocations = {};
      data.forEach(x => {
        higherLocations[x.enumName] = ['WORLD', x.gbifRegion];
        higherLocations[x.gbifRegion] = ['WORLD'];
      });

      return {locations: Array.from(locations), higherLocations};
    });
};
