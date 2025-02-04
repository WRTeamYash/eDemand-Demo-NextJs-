import React from "react";
import Lottie from "react-lottie";
import animationData from "../../assets/lottie/mini_loader.json";

const MiniLoader = ({ chatPage }) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return <Lottie options={defaultOptions} height={16} width={chatPage ? 30 : 108} />;
};

export default MiniLoader;
