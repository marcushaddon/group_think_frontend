
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CreateRoute } from "./routes/create/create";
import { PollRoute } from "./routes/poll";
import { VoteRoute } from './routes/vote';


function App() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        // overflowY: "scroll",
        // WebkitOverflowScrolling: "touch",
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route index element={<CreateRoute />} />
          <Route path="/:pollId" element={<PollRoute />} />
          <Route path="/vote/:pollId" element={<VoteRoute />} />
        </Routes>
      </BrowserRouter>
    </div>
    
  )
}

export default App;
