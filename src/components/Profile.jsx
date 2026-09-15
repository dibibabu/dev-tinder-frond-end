import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";

const Profile = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    if (user) return;

    const fetchProfile = async () => {
      try {
        const res = await axios.get(BASE_URL + "/profile/view", {
          withCredentials: true,
        });
        dispatch(addUser(res.data));
      } catch (err) {
        setError(err?.response?.data?.message || "Please log in");
      }
    };

    fetchProfile();
  }, [user, dispatch]);

  // release the object URL so the blob is not held in memory
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const clearSelection = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleFileChange = (e) => {
    const picked = e.target.files[0];
    if (!picked) return;

    setError("");
    setSaved(false);
    if (preview) URL.revokeObjectURL(preview);
    setFile(picked);
    setPreview(URL.createObjectURL(picked));
  };

  const handleSave = async () => {
    if (!file) {
      setError("Choose an image first");
      return;
    }

    setError("");
    setUploading(true);

    const formData = new FormData();
    formData.append("photo", file);

    try {
      const res = await axios.post(BASE_URL + "/profile/photo", formData, {
        withCredentials: true,
      });
      // keep the navbar avatar in sync with the new photo
      dispatch(addUser({ ...user, photoUrl: res.data.photoUrl }));
      clearSelection();
      setSaved(true);
    } catch (err) {
      setError(err?.response?.data || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (!user) {
    return <p className="text-center my-10">{error || "Loading..."}</p>;
  }

  const shown = preview || (user.photoUrl && BASE_URL + user.photoUrl);

  return (
    <div className="flex justify-center my-10">
      <div className="card bg-base-100 w-96 shadow-xl">
        <div className="card-body items-center">
          <h2 className="card-title">
            {user.firstName} {user.lastName}
          </h2>

          <div className="avatar my-4">
            <div className="w-32 rounded-full ring ring-primary ring-offset-2">
              {shown ? (
                <img src={shown} alt="profile" />
              ) : (
                <div className="bg-base-300 w-full h-full flex items-center justify-center text-xs">
                  no photo
                </div>
              )}
            </div>
          </div>

          {preview && (
            <p className="text-xs text-warning">Preview - not saved yet</p>
          )}

          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            disabled={uploading}
            className="file-input file-input-bordered w-full mt-2"
          />

          <div className="flex gap-2 w-full mt-4">
            <button
              onClick={handleSave}
              disabled={uploading}
              className="btn btn-primary flex-1"
            >
              {uploading ? "Saving..." : "Save Photo"}
            </button>
            {file && (
              <button
                onClick={clearSelection}
                disabled={uploading}
                className="btn btn-ghost"
              >
                Cancel
              </button>
            )}
          </div>

          {saved && <p className="text-success text-sm mt-2">Photo saved</p>}
          {error && <p className="text-error text-sm mt-2">{error}</p>}

          <p className="text-xs opacity-60 mt-2">jpeg, png, webp or gif, max 2MB</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
