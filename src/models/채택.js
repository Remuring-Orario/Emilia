const mongoose = require("mongoose")

const f = new mongoose.Schema({
    count: { type: Number },
    userid: String,
})

const Model = module.exports = mongoose.model("채택", f)