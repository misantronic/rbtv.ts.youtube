const mongoose = require('mongoose');

mongoose.Promise = Promise;

const mongoURI = process.env.MONGOLAB_URI;
const { connection } = mongoose;

if (!connection.readyState) {
    mongoose.connect(mongoURI, { useMongoClient: true }).then(() => console.log('Mongo: Connected to: ' + mongoURI));

    connection.on('error', error => {
        console.error('Mongo: Error: ' + error);
        mongoose.disconnect();
    });

    connection.once('open', () => console.log('Mongo: Connection opened...'));
    connection.on('reconnected', () => console.log('Mongo: Reconnected...'));
    connection.on('disconnected', () => console.log('Mongo: Disconnected.'));
}

module.exports = mongoose;
