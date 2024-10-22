// AccessDenied.jsx
import React from "react";
import { useSpring, animated } from "react-spring";

const AccessDenied = () => {
  const fade = useSpring({ opacity: 1, from: { opacity: 0 }, config: { duration: 1000 } });

  return (
    <animated.div style={fade} className="flex flex-col items-center justify-center h-screen bg-red-100 text-red-800">
      <h1 className="text-8xl font-bold animate-bounce">403</h1>
      <h2 className="text-4xl font-semibold mt-4">Access Denied</h2>
      <p className="text-lg mt-2">You do not have permission to view this page.</p>
      <a
        href="/"
        className="mt-6 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
      >
        Go Back Home
      </a>
    </animated.div>
  );
};

export default AccessDenied;
