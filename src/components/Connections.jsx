import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import { addRequests, removeRequest } from "../utils/requestSlice";
import { BASE_URL } from "../utils/constants";
import { HeartIcon, XIcon } from "./Icons";

const DEFAULT_PHOTO =
  "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";

const photoSrc = (photoUrl) => (photoUrl ? BASE_URL + photoUrl : DEFAULT_PHOTO);

const EmptyState = ({ title, text }) => (
  <div className="rounded-box border border-dashed border-base-300 bg-base-100 p-8 text-center">
    <p className="font-semibold">{title}</p>
    <p className="mt-1 text-sm text-base-content/60">{text}</p>
  </div>
);

const RequestRow = ({ person, onAccept, onReject }) => {
  const { firstName, lastName, photoUrl, age, gender, about } = person;

  return (
    <div className="flex items-center gap-4 rounded-box bg-base-100 p-3 shadow-sm">
      <img
        src={photoSrc(photoUrl)}
        alt={`${firstName} photo`}
        className="size-16 shrink-0 rounded-full object-cover ring-2 ring-primary/30"
      />
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-bold">
          {firstName} {lastName}
        </h3>
        {(age || gender) && (
          <p className="text-sm capitalize text-base-content/60">
            {[age, gender].filter(Boolean).join(" · ")}
          </p>
        )}
        {about && <p className="truncate text-sm">{about}</p>}
      </div>
      <div className="flex gap-2">
        <button
          aria-label={`Reject ${firstName}`}
          onClick={onReject}
          className="btn btn-circle border-base-300 bg-base-100 text-error"
        >
          <XIcon className="size-5" />
        </button>
        <button
          aria-label={`Accept ${firstName}`}
          onClick={onAccept}
          className="btn btn-circle btn-brand"
        >
          <HeartIcon className="size-5" />
        </button>
      </div>
    </div>
  );
};

const MatchTile = ({ person }) => {
  const { firstName, lastName, photoUrl, age } = person;

  return (
    <div className="group relative aspect-[3/4] overflow-hidden rounded-box bg-base-300 shadow-md">
      <img
        src={photoSrc(photoUrl)}
        alt={`${firstName} photo`}
        className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
      <p className="absolute inset-x-0 bottom-0 truncate p-3 font-semibold text-white">
        {firstName} {lastName}
        {age ? <span className="ml-1 font-light">{age}</span> : null}
      </p>
    </div>
  );
};

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();

  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res.data.data));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });
      dispatch(addRequests(res.data.data));
    } catch (error) {
      console.error(error);
    }
  };

  const reviewRequest = async (status, requestId) => {
    try {
      await axios.post(
        BASE_URL + "/request/review/" + status + "/" + requestId,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(requestId));
      // an accepted request becomes a connection
      if (status === "accepted") fetchConnections();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRequests();
    fetchConnections();
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <section>
        <div className="mb-4 flex items-center gap-2">
          <h2 className="text-2xl font-bold">Likes you</h2>
          {requests?.length > 0 && (
            <span className="badge badge-primary">{requests.length}</span>
          )}
        </div>
        {!requests ? null : requests.length === 0 ? (
          <EmptyState
            title="No new likes yet"
            text="When someone likes your profile, they'll show up here."
          />
        ) : (
          <div className="flex flex-col gap-3">
            {requests.map((req) => (
              <RequestRow
                key={req._id}
                person={req.fromUserId}
                onReject={() => reviewRequest("rejected", req._id)}
                onAccept={() => reviewRequest("accepted", req._id)}
              />
            ))}
          </div>
        )}
      </section>

      <section className="mt-12">
        <h2 className="mb-4 text-2xl font-bold">Your matches</h2>
        {!connections ? null : connections.length === 0 ? (
          <EmptyState
            title="No matches yet"
            text="Keep swiping. It's a match when the interest is mutual."
          />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {connections.map((person) => (
              <MatchTile key={person._id} person={person} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Connections;
