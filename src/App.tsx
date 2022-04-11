import { Button, Typography } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CreateRoute } from "./routes/create";
import { PollRoute } from "./routes/poll";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<CreateRoute />} />
        <Route path="/:pollId" element={<PollRoute />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
