// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  dataUrls: {
    locationArea: '/api/v1/location-area',
    houseSize: '/api/v1/house-size',
    plant: {
      root: '/api/v1/plant',
      prediction: 'production/predicted'
    },
    consumer: {
      root: '/api/v1/consumer',
      prediction: 'consumption/predicted'
    },
  }
};
