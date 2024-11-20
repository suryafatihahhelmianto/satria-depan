"use client";

import { useState } from "react";
import axios from "axios";

export default function MDSTestPage() {
  const [inputs, setInputs] = useState([]);
  const [result, setResult] = useState(null);

  const handleInputChange = (index, value) => {
    const newInputs = [...inputs];
    newInputs[index] = parseFloat(value);
    setInputs(newInputs);
  };

  const handleAddInputField = () => {
    setInputs([...inputs, 0]); // Tambahkan field input baru dengan nilai default 0
  };

  const handleSubmitMDS = async () => {
    try {
      const response = await axios.post("http://localhost:8000/mds", {
        data: inputs,
      });
      setResult(response.data);
    } catch (error) {
      console.error("Error calculating MDS:", error);
      alert("Error calculating MDS. Check the console for details.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Test MDS API</h1>
      <div>
        <h2>Input Array for MDS Calculation</h2>
        {inputs.map((value, index) => (
          <div key={index}>
            <label>Input {index + 1}: </label>
            <input
              type="number"
              value={value}
              onChange={(e) => handleInputChange(index, e.target.value)}
              placeholder={`Enter value for input ${index + 1}`}
            />
          </div>
        ))}
        <button onClick={handleAddInputField}>Add Input Field</button>
      </div>
      <button onClick={handleSubmitMDS}>Calculate MDS</button>

      {result && (
        <div>
          <h3>MDS Calculation Result:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
