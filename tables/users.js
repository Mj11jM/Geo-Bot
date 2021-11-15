const {model, Schema} = require('mongoose')

module.exports = model('Users', new Schema({
    user_id:            { type: String, index: true },
    username:           { type: String },


}))
