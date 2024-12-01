import React, { useState, useEffect, useRef } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';
import {
  Atom,
  Brain,
  Gem,
  Flower,
  Pyramid,
  Tornado,
  Globe,
  Rocket,
} from 'lucide-react';

// Define the complexity levels and their corresponding visualizations
const COMPLEXITY_MAPPINGS = [
  {
    range: [1, 12],
    name: 'Nascent Complexity',
    Icon: Atom,
    color: 'bg-blue-100',
    description: 'Emerging patterns, simple yet promising',
    renderVisualization: (number) => (
      <ResponsiveContainer width="100%" height={200}>
        <LineChart
          data={Array.from({ length: number }, (_, i) => ({
            x: i,
            y: Math.sin(i * 0.5),
          }))}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x" />
          <YAxis />
          <Line type="monotone" dataKey="y" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    ),
  },
  // ... rest of the COMPLEXITY_MAPPINGS remain the same
];

const RandomNumberVisualizer = () => {
  const [randomNumber, setRandomNumber] = useState(null);
  const [complexity, setComplexity] = useState(null);
  const [history, setHistory] = useState([]);
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchRandomNumber = async () => {
      try {
        const response = await fetch('http://localhost:8000/randomstate');
        const data = await response.json();
        const number = data.random_number;

        setRandomNumber(number);
        setHistory((prev) => [...prev, number].slice(-10));

        const matchedComplexity = COMPLEXITY_MAPPINGS.find(
          (comp) => number >= comp.range[0] && number <= comp.range[1]
        );
        setComplexity(matchedComplexity);
      } catch (error) {
        console.error('Failed to fetch random number:', error);
      }
    };

    // Initial fetch
    fetchRandomNumber();

    // Poll every 5 seconds
    intervalRef.current = setInterval(fetchRandomNumber, 5000);

    // Cleanup interval on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  if (!randomNumber || !complexity) return <div>Loading...</div>;

  return (
    <div
      className={`p-8 ${complexity.color} min-h-screen flex flex-col items-center justify-center`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-2xl rounded-2xl p-6 max-w-2xl w-full"
      >
        <div className="flex items-center space-x-4 mb-6">
          <complexity.Icon size={48} className="text-gray-700" />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {complexity.name}
            </h1>
            <p className="text-gray-600">{complexity.description}</p>
          </div>
        </div>

        <div className="mb-6">
          {complexity.renderVisualization(randomNumber)}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="font-bold mb-2">Current Number</h2>
            <p className="text-4xl font-mono text-center">{randomNumber}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="font-bold mb-2">Recent History</h2>
            <div className="flex space-x-2 justify-center">
              {history.map((num, idx) => (
                <span
                  key={idx}
                  className="bg-gray-300 px-2 py-1 rounded-full text-sm"
                >
                  {num}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RandomNumberVisualizer;
