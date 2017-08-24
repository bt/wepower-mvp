export const environment = {
    production: true,
    exchangeAddress: '0x58f60234540cdc29e961474533a469f4975af1c6',
    dataUrls: {
        locationArea: '/api/v1/location-area',
        houseSize: '/api/v1/house-size',
        plant: {
            root: '/api/v1/plant',
            activate: 'activate',
            blockchainData: 'blockchain/data',
            predictionData: 'production/predicted',
            predictionPeriod: 'production/predicted/period',
            predictionTotal: 'production/predicted/total',
            productionReview: 'production/predicted/review'
        },
        consumer: {
            root: '/api/v1/consumer',
            activate: 'activate',
            prediction: 'consumption/predicted',
            predictionPeriod: 'consumption/predicted/period',
            predictionTotal: 'consumption/predicted/total',
            consumptionReview: 'consumption/predicted/review'
        },
        market: {
            ethereumPrice: '/api/v1/market/ethereum/price',
            electricityPrice: '/api/v1/market/electricity/price',
        },
        wallet: {
            root: '/api/v1/wallet'
        },
        transactions: {
            root: '/api/v1/transaction/log',
            consumer: '/api/v1/transaction/log/consumer',
            plant: '/api/v1/transaction/log/plant'
        },
        prices: {
            root: '/api/v1/price/log',
            period: '/api/v1/price/log/period',
            date: '/api/v1/price/log/date'
        }
    }
};