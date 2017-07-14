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
    marketexchangeRate: '/api/v1/ethereum/price'
  }
};
