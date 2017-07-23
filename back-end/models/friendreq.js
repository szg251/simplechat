const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;
const User      = require('./user');

const friendReqSchema = new Schema({
    _requester: {type: String, ref: 'User'},
    _requestee: {type: String, ref: 'User'},
    requestDate: {type: Date, default: Date.now}
});

const FriendReq = mongoose.model('friendreq', friendReqSchema);

module.exports = exports = FriendReq;
