import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { removeUser } from '../utils/userSlice'
import { removeFeed } from '../utils/feedSlice'
import { removeConnections } from '../utils/connectionSlice'
import { removeRequests } from '../utils/requestSlice'
import { BASE_URL } from '../utils/constants'
import { FlameIcon } from './Icons'

const DEFAULT_PHOTO =
  "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";

const navLinkClass = ({ isActive }) =>
  `btn btn-ghost btn-sm rounded-full font-semibold ${isActive ? "bg-primary/10 text-primary" : ""}`;

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        BASE_URL + "/logout",
        {},
        { withCredentials: true }
      );
      dispatch(removeUser());
      dispatch(removeFeed());
      dispatch(removeConnections());
      dispatch(removeRequests());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-base-300/60 bg-base-100/80 backdrop-blur">
      <div className="navbar mx-auto max-w-6xl px-4">
        <div className="flex-1">
          <Link
            to={user ? "/feed" : "/login"}
            className="flex w-fit items-center gap-2 text-xl font-extrabold tracking-tight"
          >
            <span className="grid size-9 place-items-center rounded-xl bg-brand text-white shadow-md">
              <FlameIcon className="size-5" />
            </span>
            <span className="text-brand">devtinder</span>
          </Link>
        </div>

        {user && (
          <div className="flex items-center gap-2">
            <nav className="hidden gap-1 sm:flex">
              <NavLink to="/feed" className={navLinkClass}>Discover</NavLink>
              <NavLink to="/connections" className={navLinkClass}>Matches</NavLink>
            </nav>

            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="avatar cursor-pointer">
                <div className="w-10 rounded-full ring-2 ring-primary ring-offset-2 ring-offset-base-100">
                  <img
                    alt="user photo"
                    src={user.photoUrl ? BASE_URL + user.photoUrl : DEFAULT_PHOTO}
                  />
                </div>
              </div>
              <ul
                tabIndex="-1"
                className="menu dropdown-content z-10 mt-3 w-56 rounded-box bg-base-100 p-2 shadow-xl"
              >
                <li className="menu-title">Hi, {user.firstName}</li>
                <li><Link to="/profile">Profile</Link></li>
                <li className="sm:hidden"><Link to="/feed">Discover</Link></li>
                <li className="sm:hidden"><Link to="/connections">Matches</Link></li>
                <li><a onClick={handleLogout} className="text-error">Logout</a></li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default NavBar
