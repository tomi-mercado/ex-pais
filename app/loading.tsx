import React from "react";

const Loading: React.FC = () => {
  return (
    <div className="w-full h-full items-center flex justify-center">
      <span className="loading loading-spinner loading-lg"></span>;
    </div>
  );
};

export default Loading;
