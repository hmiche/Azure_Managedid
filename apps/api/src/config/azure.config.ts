export const azureConfig = () => ({
  cosmos: {
    endpoint: process.env.COSMOS_ENDPOINT,
    database: process.env.COSMOS_DATABASE,
  },
});
