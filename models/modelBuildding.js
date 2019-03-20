const mongoose = require('mongoose')

const Schema = mongoose.Schema;

var User = new Schema({
    buildingName: {
        type: String
    }, floor: {
        type: String
    }
}, {
        collection: 'building'
    })

module.exports = mongoose.model('modelBuildding', User);