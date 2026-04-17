import React, { use, useContext, useEffect } from "react";
import { CaptainDataContext } from "../context/CaptainContext";
import { useNavigate } from "react-router-dom";

function CaptainProtectwrapper({ children }) {
  const { captain, setCaptain } = useContext(CaptainDataContext);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  useEffect(() => {
    if (!token) {
      navigate("/captain-login");
    }
  }, [token]);

  return <div>{children}</div>;
}

export default CaptainProtectwrapper;
