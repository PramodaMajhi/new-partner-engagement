

module.exports = {
    db: {
        connector: 'mongodb',
        url: process.env.DATABASE_URL || 'mongodb://localhost:27017/vendor-db',
        useNewUrlParser: true
    }
};
