import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { CaptainDataContext } from "../context/CaptainContext";

const CaptainLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { captain, setCaptain } = React.useContext(CaptainDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log(email, password);
    setEmail("");
    setPassword("");
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}captains/login`,
      {
        email,
        password,
      },
    );
    if (response.status === 200) {
      const data = response.data;
      console.log(response);
      setCaptain(data.captain);
      localStorage.setItem("token", data.token);
    } else {
      alert("Login failed");
    }
    navigate("/captain-home");
  };

  return (
    <div className="p-7 flex flex-col items-center justify-between h-screen w-full bg-white">
      <div>
        <img
          className="w-16 ml-8 mb-10"
          src="data:image/png;base64,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"
          alt="Uber Logo"
        />
        <form
          onSubmit={(e) => {
            submitHandler(e);
          }}
        >
          <h3 className="text-lg mb-2">Whats your email address</h3>
          <input
            className="bg-gray-100 rounded mb-7 px-4 py-2 border w-full  text-lg placeholder:text-base"
            required
            type="email"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <h3>Password</h3>
          <input
            className="bg-gray-100 rounded mb-7 px-4 py-2 border w-full  text-lg placeholder:text-base"
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button className="bg-[#111] text-white py-2 px-4 rounded w-full hover:bg-black">
            Login
          </button>

          <p>
            New here?{" "}
            <Link
              to="/captain-signup"
              className="text-blue-500 mt-4 hover:underline text-center"
            >
              Register as captain
            </Link>
          </p>
        </form>
      </div>
      <div>
        <Link
          to="/signup"
          className="bg-[#111]  flex item-center justify-center text-white py-2 px-4 mt-8 rounded w-full bg-orange-600"
        >
          Sign in as User
        </Link>
      </div>
    </div>
  );
};

export default CaptainLogin;
