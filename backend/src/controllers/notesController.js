import Note from "../models/Note.js";
export async function getAllNotes (req,res) {
    try{
        const notes = await Note.find({ userId: req.user.userId }).sort({ isPinned: -1, createdAt: -1 });
 // Sort by createdAt in descending order
        res.status(200).json(notes);
    }catch(error){
        console.error("Error in getAllNotes controller", error);
        res.status(500).json({message:"Internal server error"})
}
}

export async function getNoteById (req,res) {
    try{
        const note= await Note.findById(req.params.id);
        if(!note){
            return res.status(404).json({message:"Note not found"});
        }
        res.status(200).json(note);
    }catch(error){
       console.error("Error in getNoteById controller", error);
        res.status(500).json({message:"Internal server error"})
    }
}

export async function createNote (req,res) {
    try {
        const { title, content } = req.body;

        const note = new Note({
            title,
            content,
            userId: req.user.userId //logged-in user ID
        });

        const savedNote = await note.save();
        res.status(201).json(savedNote);
    } catch (error) {
        console.error("Error in createNote controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}



export async function updateNote(req, res) {
  try {
    const { title, content, isPinned } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (isPinned !== undefined) updateData.isPinned = isPinned;

    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json(updatedNote);
  } catch (error) {
    console.error("Error in updateNote controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteNote (req, res) {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);
    if (!deletedNote) {
      return res.status(404).json({ message: "Note not found" });
    }
    return res.status(200).json({ message: "Note deleted successfully" }); // ✅ send only once
  } catch (error) {
    console.error("Error in deleteNote controller", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
