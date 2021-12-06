import './App.css';
import Planner from './Planner';

import { Routes, Route, BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <BrowserRouter basename="/sailwind-companion">
        <Routes>
          <Route index path="*" element={<Planner />} />
        </Routes>
      </BrowserRouter >
    </div>
  );
}

export default App;
