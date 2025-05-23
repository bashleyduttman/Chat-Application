
const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  senderName:{type:String},
  text: { type: String },
  media: { type: String }, 
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);
