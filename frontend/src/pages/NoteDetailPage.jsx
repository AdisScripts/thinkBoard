import { useState, useEffect, use } from 'react'
import toast from 'react-hot-toast';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/axios'; // Adjust the import path as necessary
import { LoaderIcon } from 'lucide-react';
import { Link } from 'react-router'
import { ArrowLeftIcon, Trash2Icon } from 'lucide-react';

const NoteDetailPage = () => {
  const [note, setNote] = useState(null);
  const[loading, setLoading] = useState(true);
  const [saving,setSaving]=useState(false);

  const navigate= useNavigate();

  const {id}=useParams()

  useEffect(()=>{
    const fetchNote=async()=>{
       try{
        const res=await api.get(`/notes/${id}`);
        setNote(res.data);
       }catch(error){
        console.log("Error in fetching note",error)
        toast.error("Failed to fetch the note")

       }finally{
        setLoading(false);
       }
      }

    fetchNote();
  },[id])

 const handleDelete=async() =>{
     if(!window.confirm("Are you sure you want to delete this note?")) return;

     try{
        await api.delete(`/notes/${id}`);
        toast.success("Note Deleted");
        navigate("/",{ replace: true })
     }catch(error){
       console.log("Error deleting the note:",error)
       toast.error("Failed to delete note")
     }
 }
 const handleSave=async () => {
     if(!note.title.trim() || !note.content.trim()){
        toast.error("Please add a title or content");
        return;
     }
     setSaving(true)

     try{
      await api.put(`/notes/${id}`,note)
      toast.success("Note updated successfully")
      navigate("/",{ replace: true });
     }catch(error){
      console.log("Error saving the note: ",error)
      toast.error("Failed to update note")
      
     }finally{
      setSaving(false)
     }
 }
 
if(loading){
  return (
    <div className='min-h-screen bg-base-200 flex items-center justify-center'>
      <LoaderIcon className="animate-spin size-10" />
    </div>
  )
}
return (
  <div className="min-h-screen bg-base-200">
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button
         className="btn btn-ghost"
          onClick={() => navigate("/", { replace: true })}
          >
          <ArrowLeftIcon className="h-5 w-5" />
            Back to Notes
          </button>

        <button onClick={handleDelete} className="btn btn-error btn-outline">
          <Trash2Icon className="h-5 w-5" />
          Delete Note
        </button>
        </div>
        <div className="card bg-base-100">
          <div className="card-body">
            <div className="form-control mb-4">
              <label className="label">
              <span className="label-text">Title</span>
              </label>
              <input
               type="text"
               placeholder="Note title"
                className="input input-bordered"
                value={note.title}
                onChange={(e) => setNote({ ...note, title: e.target.value })}
  />
               </div>

            <div className="form-control mb-4">
            <label className="label">
            <span className="label-text">Content</span>
            </label>
            <textarea
             placeholder="Write your note here..."
               className="textarea textarea-bordered h-32"
               value={note.content}
                onChange={(e) => setNote({ ...note, content: e.target.value })}
                 />
                 <div className="form-control mt-4">
                  <label className="cursor-pointer label justify-start gap-2">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    checked={note.isPinned || false}
                    onChange={(e) =>
                    setNote((prev) => ({ ...prev, isPinned: e.target.checked }))
                    }
                    />
                   <span className="label-text">Pin comment</span>
                   </label>
                    </div>

            </div>

            <div className='card-actions justify-end'>
              <button className='btn btn-primary' disabled={saving} onClick={handleSave}>
              {saving ? "Saving...":"Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);


}

export default NoteDetailPage