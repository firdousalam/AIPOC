export default () => ({
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/enterprise-sales-ai',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
});

