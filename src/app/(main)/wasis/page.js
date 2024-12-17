"use client";

import { motion } from "framer-motion";

export default function GratitudePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="bg-white bg-opacity-90 rounded-lg shadow-2xl p-8 max-w-2xl w-full"
      >
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          A Heartfelt Thank You
        </h1>
        <div className="space-y-4 text-center text-gray-700">
          <p>In lines of code and pixels bright,</p>
          <p>We've woven dreams from day to night.</p>
          <p>Your trust, a canvas for our art,</p>
          <p>Has touched each developer's heart.</p>
          <br />
          <p>Through challenges, we've grown and learned,</p>
          <p>Each problem solved, each function turned.</p>
          <p>Your vision guided every click,</p>
          <p>As we built your site, brick by brick.</p>
          <br />
          <p>For this chance to create and build,</p>
          <p>Our gratitude cannot be stilled.</p>
          <p>We thank you for this journey shared,</p>
          <p>And all the moments that we've cared.</p>
          <br />
          <p>As your website stands tall and proud,</p>
          <p>We hope its success rings out loud.</p>
          <p>Our thanks, forever and a day,</p>
          <p>For letting us light up your way.</p>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-8 text-right text-xl font-semibold text-gray-800"
        >
          - TIM DEVELOPER (Lebih banyak mas wasis)
        </motion.div>
      </motion.div>
    </div>
  );
}
