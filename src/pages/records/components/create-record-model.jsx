import { useState } from "react";
import Modal from "./Model";

const CreateRecordModel = ({ isOpen, onClose, onCreate }) => {
  const [error, setError] = useState(null)
  const [folderName, setFolderName] = useState("");

  const handleCreate = () => {
    if(!folderName.trim()){
      return setError('this field is required');
    }
    onCreate(folderName);
    setFolderName("");
    setError('')
  };

  return (
    <Modal
      title="Create Record"
      isOpen={isOpen}
      onClose={onClose}
      onAction={handleCreate}
      actionLabel="Create Folder"
      error={error}
    >

      <div className="grid gap-y-4">
        
        <div className="">
          <label
            htmlFor="folder-name"
            className="mb-2 block text-sm text-white"
          >
            Record Name
          </label>
          <div className="relative">
            <input
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              id="folder-name"
              className="block w-full rounded-lg border-2 px-4 py-3 text-sm focus:border-2 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500"
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CreateRecordModel;
