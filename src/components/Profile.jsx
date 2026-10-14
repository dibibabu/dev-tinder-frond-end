import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";
import EditProfile from "./EditProfile";

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
    return <p className="my-10 text-center">{error || "Loading..."}</p>;
  }

  const shown = preview || (user.photoUrl && BASE_URL + user.photoUrl);

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10">
      <div className="card overflow-hidden bg-base-100 shadow-xl">
        <div className="h-32 bg-brand" />
        <div className="card-body pt-0">
          <div className="-mt-16 flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="avatar">
              <div className="w-32 rounded-full ring-4 ring-base-100">
                {shown ? (
                  <img src={shown} alt="profile" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-base-300 text-xs">
                    no photo
                  </div>
                )}
              </div>
            </div>
            <div className="min-w-0 flex-1 pb-2">
              <h1 className="truncate text-2xl font-bold">
                {user.firstName} {user.lastName}
              </h1>
              {user.email && (
                <p className="truncate text-sm text-base-content/60">{user.email}</p>
              )}
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleFileChange}
              disabled={uploading}
              className="file-input w-full sm:max-w-xs"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={uploading}
                className="btn btn-brand rounded-full px-6"
              >
                {uploading ? "Saving..." : "Save photo"}
              </button>
              {file && (
                <button
                  onClick={clearSelection}
                  disabled={uploading}
                  className="btn btn-ghost rounded-full"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          <div className="text-sm">
            {preview && <p className="text-warning">Preview - not saved yet</p>}
            {saved && <p className="text-success">Photo saved</p>}
            {error && <p className="text-error">{error}</p>}
            <p className="text-xs text-base-content/60">
              jpeg, png, webp or gif, max 2MB
            </p>
          </div>
        </div>
      </div>

      <EditProfile user={user} />
    </div>
  );
};

export default Profile;
