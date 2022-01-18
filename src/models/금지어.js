const mongo = require('mongoose');

const f = new mongo.Schema({
    serverid: { type: String },
    금지어: { type: String },
    온오프: { type: String }
});

module.exports = mongo.model('금지어', f);