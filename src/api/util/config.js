const environments = {
  uat: {
    gbifUrl: 'https://www.gbif-uat.org',
    dataApi: 'https://registry-api.gbif-uat.org',
    dataApi_v1: 'https://api.gbif-uat.org/v1',
    secretariatNode: '02c40d2a-1cba-4633-90b7-e36e5e97aba8',
    languages: [{ key: 'en', code: '🇬🇧', name: 'English' }],
    // esUrl: '//localhost:7011'
    esUrl: '//labs.gbif.org:7011'
  }
};

const domain = window.location.hostname;

let env = environments.uat;
// if (domain.endsWith('gbif.org')) {
//   env = environments.prod;
// } else if (domain.endsWith('gbif-uat.org')) {
//   env = environments.uat;
// } else if (domain.endsWith('gbif-dev.org')) {
//   env = process.env.REACT_APP_URL || environments.dev;
// }

export default env;