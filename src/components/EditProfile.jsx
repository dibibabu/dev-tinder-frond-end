import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";
import UserCard from "./UserCard";
import Field from "./Field";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about || "");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const dispatch = useDispatch();

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSaved(false);
    setSaving(true);
    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        { firstName, lastName, age: Number(age), gender, about },
        { withCredentials: true }
      );
      dispatch(addUser(res.data.data));
      setSaved(true);
    } catch (err) {
      setError(err?.response?.data || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_24rem]">
      <div className="card bg-base-100 shadow-xl">
        <form onSubmit={handleSave} className="card-body gap-4 p-8">
          <div>
            <h2 className="text-xl font-bold">About you</h2>
            <p className="text-sm text-base-content/60">
              This is what other developers see when they swipe.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="First name">
              <input
                type="text"
                value={firstName}
                maxLength={12}
                onChange={(e) => setFirstName(e.target.value)}
                className="input w-full"
              />
            </Field>
            <Field label="Last name">
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="input w-full"
              />
            </Field>
            <Field label="Age">
              <input
                type="number"
                min={1}
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="input w-full"
              />
            </Field>
            <Field label="Gender">
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="select w-full"
              >
                <option value="" disabled>
                  Select gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="others">Others</option>
              </select>
            </Field>
          </div>

          <Field label="Bio" hint={`${about.length}/300`}>
            <textarea
              value={about}
              maxLength={300}
              rows={4}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="Your stack, side projects, what you're looking for..."
              className="textarea w-full"
            />
          </Field>

          {error && (
            <div role="alert" className="alert alert-error alert-soft text-sm">
              {error}
            </div>
          )}
          {saved && (
            <div role="status" className="alert alert-success alert-soft text-sm">
              Profile saved
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="btn btn-brand mt-2 w-full rounded-full sm:w-auto sm:self-end sm:px-10"
          >
            {saving ? "Saving..." : "Save profile"}
          </button>
        </form>
      </div>

      <div className="lg:sticky lg:top-24">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-base-content/50">
          Live preview
        </p>
        <UserCard user={{ ...user, firstName, lastName, age, gender, about }} />
      </div>
    </div>
  );
};

export default EditProfile;
