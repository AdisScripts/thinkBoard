import mongoose from 'mongoose';

//1-create a schema for the note
//2-model based on the schema
const noteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  isPinned: {
  type: Boolean,
  default: false,
},
},

  {timestamps: true}
); 

const Note=mongoose.model("Note",noteSchema);

export default Note// Automatically add createdAt and updatedAt fields});