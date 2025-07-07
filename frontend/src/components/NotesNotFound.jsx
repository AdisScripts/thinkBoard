import { NotebookIcon } from "lucide-react";
import { Link } from "react-router"; // Corrected import from react-router to react-router-dom

const NotesNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-6 max-w-md mx-auto text-center">
      <div className="bg-primary/10 rounded-full p-8">
        <NotebookIcon className="size-10 text-primary" />
      </div>
      <h3 className="text-2xl font-bold">No notes yet</h3>
      <p className="text-base-content/70">
        Turn an empty page into possibility — create your first note and start your story today!
      </p>
      <Link to="/create" className="btn btn-primary">
        Create Your First Note
      </Link>
    </div>
  );
};

export default NotesNotFound;
