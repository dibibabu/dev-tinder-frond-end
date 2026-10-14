import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";
import Field from "./Field";
import { FlameIcon, HeartIcon } from "./Icons";

const HIGHLIGHTS = [
  "Swipe through developer profiles",
  "It's a match when the interest is mutual",
  "Show off who you are and what you build",
];

const Login = () => {
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const login = async () => {
    const res = await axios.post(
      BASE_URL + "/login",
      {
        email: email,
        password: password,
      },
      { withCredentials: true }
    );
    dispatch(addUser(res.data));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login();
      navigate("/feed");
    } catch (error) {
      setError(error?.response?.data || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await axios.post(
        BASE_URL + "/signup",
        { firstName, lastName, email, age: Number(age), gender, password },
        { withCredentials: true }
      );
      // signup doesn't set a token cookie, so log in right after
      await login();
      navigate("/profile");
    } catch (error) {
      setError(error?.response?.data || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const showForm = (login) => {
    setIsLoginForm(login);
    setError("");
  };

  return (
    <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-10 lg:grid-cols-2 lg:py-20">
      <div className="hidden lg:block">
        <h1 className="text-5xl font-extrabold leading-tight tracking-tight">
          Find your <span className="text-brand">pair programmer</span>.
        </h1>
        <p className="mt-5 max-w-md text-lg text-base-content/70">
          Meet developers who get your stack, your side projects and your
          3am debugging sessions.
        </p>
        <ul className="mt-8 space-y-3">
          {HIGHLIGHTS.map((text) => (
            <li key={text} className="flex items-center gap-3 font-medium">
              <span className="grid size-8 place-items-center rounded-full bg-primary/10 text-primary">
                <HeartIcon className="size-4" />
              </span>
              {text}
            </li>
          ))}
        </ul>
      </div>

      <div className="card mx-auto w-full max-w-md bg-base-100 shadow-2xl">
        <div className="card-body gap-5 p-8">
          <div className="flex flex-col items-center text-center">
            <span className="grid size-14 place-items-center rounded-2xl bg-brand text-white shadow-lg">
              <FlameIcon className="size-8" />
            </span>
            <h2 className="mt-4 text-2xl font-bold">
              {isLoginForm ? "Welcome back" : "Create your account"}
            </h2>
            <p className="text-sm text-base-content/60">
              {isLoginForm
                ? "Log in to keep swiping"
                : "It takes less than a minute"}
            </p>
          </div>

          <div role="tablist" className="tabs tabs-box w-full">
            <button
              type="button"
              role="tab"
              onClick={() => showForm(true)}
              className={`tab flex-1 ${isLoginForm ? "tab-active" : ""}`}
            >
              Log in
            </button>
            <button
              type="button"
              role="tab"
              onClick={() => showForm(false)}
              className={`tab flex-1 ${!isLoginForm ? "tab-active" : ""}`}
            >
              Sign up
            </button>
          </div>

          <form
            onSubmit={isLoginForm ? handleLogin : handleSignup}
            className="flex flex-col gap-4"
          >
            {!isLoginForm && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="First name">
                    <input
                      type="text"
                      value={firstName}
                      maxLength={12}
                      required
                      onChange={(e) => setFirstName(e.target.value)}
                      className="input w-full"
                    />
                  </Field>
                  <Field label="Last name">
                    <input
                      type="text"
                      value={lastName}
                      required
                      onChange={(e) => setLastName(e.target.value)}
                      className="input w-full"
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Age">
                    <input
                      type="number"
                      value={age}
                      min={18}
                      required
                      onChange={(e) => setAge(e.target.value)}
                      className="input w-full"
                    />
                  </Field>
                  <Field label="Gender">
                    <select
                      value={gender}
                      required
                      onChange={(e) => setGender(e.target.value)}
                      className="select w-full"
                    >
                      <option value="" disabled>
                        Select
                      </option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="others">Others</option>
                    </select>
                  </Field>
                </div>
              </>
            )}

            <Field label={isLoginForm ? "Username or email" : "Email"}>
              <input
                type={isLoginForm ? "text" : "email"}
                value={email}
                required={!isLoginForm}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input w-full"
              />
            </Field>

            <Field
              label="Password"
              hint={
                !isLoginForm &&
                "8+ characters with upper, lower, number and symbol"
              }
            >
              <input
                type="password"
                value={password}
                required={!isLoginForm}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input w-full"
              />
            </Field>

            {error && (
              <div role="alert" className="alert alert-error alert-soft text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-brand btn-lg mt-2 w-full rounded-full"
              disabled={submitting}
            >
              {submitting && <span className="loading loading-spinner" />}
              {isLoginForm ? "Log in" : "Create account"}
            </button>
          </form>

          {isLoginForm && (
            <a href="#" className="link link-hover text-center text-sm text-base-content/60">
              Forgot password?
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
