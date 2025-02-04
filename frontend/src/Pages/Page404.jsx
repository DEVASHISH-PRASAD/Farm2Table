import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Page404 = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const bounceAnimation = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="h-screen w-full bg-gradient-to-r from-purple-500 to-pink-500 flex flex-col items-center justify-center text-white">
      <motion.div
        className="text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-9xl font-extrabold drop-shadow-lg"
          variants={itemVariants}
        >
          404
        </motion.h1>
        <motion.p className="text-2xl mt-4 mb-8" variants={itemVariants}>
          Oops! The page you're looking for doesn't exist.
        </motion.p>
        <motion.div {...bounceAnimation}>
          <button
            className="bg-white text-purple-600 px-6 py-3 rounded-2xl shadow-xl hover:bg-purple-600 hover:text-white transition duration-300"
            onClick={() => navigate("/")}
          >
            Go Home
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Page404;
