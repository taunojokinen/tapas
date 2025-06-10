import React from "react";

interface TestPageProps {
  viewMode: any; // Replace 'any' with the correct type if available
  title: string;
  mission: any; // Replace 'any' with the correct type if available
  setMission: React.Dispatch<React.SetStateAction<any>>; // Replace 'any' if you have a type
}

const TestPage: React.FC<TestPageProps> = (props) => {
  return (
    <div className="flex items-start gap-3 mb-4">
      <p> MyCoachAiAnswer Testpage </p>
    </div>
  );
};

export default TestPage;
