import { useState } from 'react';
import BassEngine from './audio/BassEngine';
import Oscilloscope from './components/Oscilloscope';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [started, setStarted] = useState(false);

  const handleStart = async () => {
    await BassEngine.initialize();
    console.log("Audio Context Initialized");
    setStarted(true);
  };

  if (!started) {
    return (
      <div className="start-screen">
        <button onClick={handleStart} className="start-btn">
          [ INITIALIZE SYSTEM ]
        </button>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="visual-layer">
        <Oscilloscope />
      </div>
      <div className="ui-layer">
        <Dashboard />
      </div>
    </div>
  );
}

export default App;
