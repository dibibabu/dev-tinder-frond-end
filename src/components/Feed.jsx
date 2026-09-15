import React from "react";
import { useSelector } from "react-redux";

const Feed = () => {
  const user = useSelector((store) => store.user);

  return (
    <div className="flex justify-center my-10">
      <div className="card bg-base-100 w-96 shadow-xl">
        <div className="card-body items-center text-center">
          <h2 className="card-title">Feed</h2>
          <p className="opacity-70">
            {user
              ? `Welcome back, ${user.firstName}. No profiles to show yet.`
              : "No profiles to show yet."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Feed;
