import React, { useState } from "react";
import { Values } from "../../types/types";
import RenderCurrentValues from "./RenderCurrentValues";
import RenderAIProposals from "./AIProposals";

const ChangeValues: React.FC = () => {
  const [values, setValues] = useState<Values[]>([]); // Yrityksen arvot

  return (
    <div className="relative w-full max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">PÄIVITETÄÄN ARVOT</h1>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        <div className="w-full">
          <RenderCurrentValues values={values} setValues={setValues} />
        </div>
        <div className="w-full">
          <RenderAIProposals values={values} setValues={setValues} />
        </div>
      </div>
    </div>
  );
};

export default ChangeValues;
