import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addFeed, removeUserFromFeed } from "../utils/feedSlice";
import { BASE_URL } from "../utils/constants";
import UserCard from "./UserCard";
import { FlameIcon } from "./Icons";

// matches the swipe animation length in index.css
const SWIPE_MS = 350;

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const [swipe, setSwipe] = useState(null);

  const getFeed = async () => {
    if (feed) return;
    try {
      const res = await axios.get(BASE_URL + "/user/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(res.data.data));
    } catch (error) {
      console.error(error);
    }
  };

  const handleSendRequest = async (status, userId) => {
    setSwipe(status === "interested" ? "right" : "left");
    try {
      await Promise.all([
        axios.post(
          BASE_URL + "/request/send/" + status + "/" + userId,
          {},
          { withCredentials: true }
        ),
        new Promise((resolve) => setTimeout(resolve, SWIPE_MS)),
      ]);
      dispatch(removeUserFromFeed(userId));
    } catch (error) {
      console.error(error);
    } finally {
      setSwipe(null);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  if (!feed) {
    return (
      <div className="flex justify-center px-4 py-10">
        <div className="skeleton aspect-[3/4] w-full max-w-sm rounded-box" />
      </div>
    );
  }

  if (feed.length === 0) {
    return (
      <div className="flex flex-col items-center px-4 py-24 text-center">
        <span className="grid size-20 place-items-center rounded-full bg-brand text-white shadow-lg">
          <FlameIcon className="size-10" />
        </span>
        <h2 className="mt-6 text-2xl font-bold">You're all caught up</h2>
        <p className="mt-2 text-base-content/60">
          No new developers right now. Check back soon.
        </p>
      </div>
    );
  }

  const user = feed[0];

  return (
    <div className="flex justify-center overflow-x-hidden px-4 py-10">
      <div className="relative w-full max-w-sm">
        {feed.length > 1 && (
          <div className="absolute inset-x-4 top-4 aspect-[3/4] rotate-3 rounded-box bg-base-300 shadow-lg" />
        )}
        <UserCard
          key={user._id}
          user={user}
          swipe={swipe}
          disabled={!!swipe}
          onIgnore={() => handleSendRequest("ignored", user._id)}
          onInterested={() => handleSendRequest("interested", user._id)}
        />
      </div>
    </div>
  );
};

export default Feed;
