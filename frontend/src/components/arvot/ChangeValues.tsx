import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Values, Proposal } from "../../types/types";
//import { fetchValueProposals } from "./AIProposals";
import RenderCurrentValues from "./RenderCurrentValues";
import RenderAIProposals from "./AIProposals";

const ChangeValues: React.FC = () => {
  const [values, setValues] = useState<Values[]>([]); // Yrityksen arvot
  const [roleIndex, setRoleIndex] = useState(0); // Index for rolesForAI
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate(); // Initialize useNavigate

 
  return (
    <div className="relative">
      <h1 className="text-2xl font-bold mb-4">PÄIVITETÄÄN ARVOT</h1>
      <RenderCurrentValues values={values} setValues={setValues} />
      <RenderAIProposals values={values} setValues={setValues} />
      </div>
  );
} 

export default ChangeValues;
