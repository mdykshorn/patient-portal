import React from "react";
import { usePromiseTracker } from "react-promise-tracker";
import Loader from "react-loader-spinner";

const LoadingIndicator = (props) => {
  const { promiseInProgress } = usePromiseTracker();

  return (
    promiseInProgress && (
      <div
        style={{
          marginLeft: "50%",
          width: "100%",
          height: "100%",
          alignItems: "center",
        }}
      >
        <Loader type="ThreeDots" color="#0A1DDC" height={100} width={100} />
      </div>
    )
  );
};

export default LoadingIndicator;
