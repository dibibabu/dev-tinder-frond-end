import React from "react";
import { BASE_URL } from "../utils/constants";
import { HeartIcon, XIcon } from "./Icons";

const DEFAULT_PHOTO =
  "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";

const SWIPE_CLASS = { left: "swipe-left", right: "swipe-right" };

const UserCard = ({ user, onIgnore, onInterested, swipe, disabled }) => {
  const { firstName, lastName, photoUrl, age, gender, about } = user;

  return (
    <div className="relative w-full max-w-sm">
      <div
        className={`card-in relative aspect-[3/4] overflow-hidden rounded-box bg-base-300 shadow-2xl ${SWIPE_CLASS[swipe] || ""}`}
      >
        <img
          src={photoUrl ? BASE_URL + photoUrl : DEFAULT_PHOTO}
          alt={`${firstName} photo`}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/15 to-transparent" />

        {swipe === "right" && (
          <span className="absolute left-6 top-8 -rotate-12 rounded-lg border-4 border-success px-3 py-1 text-3xl font-extrabold tracking-widest text-success">
            LIKE
          </span>
        )}
        {swipe === "left" && (
          <span className="absolute right-6 top-8 rotate-12 rounded-lg border-4 border-error px-3 py-1 text-3xl font-extrabold tracking-widest text-error">
            NOPE
          </span>
        )}

        <div className="absolute inset-x-0 bottom-0 p-6 pb-12 text-white">
          <h2 className="text-3xl font-bold leading-tight break-words">
            {firstName} {lastName}
            {age ? <span className="ml-2 font-light">{age}</span> : null}
          </h2>
          {gender && (
            <span className="badge badge-sm mt-2 border-white/30 bg-white/20 capitalize text-white backdrop-blur">
              {gender}
            </span>
          )}
          {about && <p className="mt-3 line-clamp-3 text-sm text-white/85">{about}</p>}
        </div>
      </div>

      {(onIgnore || onInterested) && (
        <div className="relative z-10 -mt-8 flex justify-center gap-6">
          <button
            aria-label="Pass"
            onClick={onIgnore}
            disabled={disabled}
            className="btn btn-circle size-16 border-0 bg-base-100 text-error shadow-lg transition hover:scale-110"
          >
            <XIcon className="size-7" />
          </button>
          <button
            aria-label="Like"
            onClick={onInterested}
            disabled={disabled}
            className="btn btn-circle btn-brand size-16 transition hover:scale-110"
          >
            <HeartIcon className="size-7" />
          </button>
        </div>
      )}
    </div>
  );
};

export default UserCard;
