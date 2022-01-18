const mongo = require('mongoose');

const f = new mongo.Schema({
    author: { type: String },
    id: { type: String },
});

module.exports = mongo.model('스레드', f);