import React, { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { storage, db} from '../../App'


type ImageUploadProps = {
  onUpload: (url: string) => void;
};

const FileUploader: React.FC<ImageUploadProps> = ({ onUpload }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;
    
    setLoading(true);
    setError(null);

    try {
      // Create a reference to the Firebase storage
      const fileRef = ref(storage, `files/${file.name}-${Date.now()}`);

      // Upload the file to Firebase storage
      const snapshot = await uploadBytes(fileRef, file);
      const url = await getDownloadURL(snapshot.ref);

      setLoading(false);

      // Pass the uploaded image URL to the parent component
      onUpload(url);
    } catch (error) {
      console.error("Error uploading file:", error);
      setLoading(false);
      setError("Error uploading file. Please try again.");
    }
  };

  return (
    <div>
      <label>
        <div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
            </svg>
        </div> 
        <input
          type="file"
          onChange={handleImageChange}
          style={{ display: "none" }}
          disabled={loading}
        />
      </label>
      {loading && <p>Uploading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default FileUploader;
