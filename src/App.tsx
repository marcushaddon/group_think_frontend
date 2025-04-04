import { useCallback, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CreateRoute } from "./routes/create/create";
import { PollRoute } from "./routes/poll";
import { VoteRoute } from "./routes/vote";
import { InviteRoute } from "./routes/invite";
import * as logger from "./common/logging";
import { RankingRoute } from "./routes/ranking";


function App() {
  const [logsTimeout, setLogsTimeout] = useState<number>(0);
  useEffect(() => {
    window.onerror = function (message, source, lineno, colno, error) {
      logger.error(`UNCAUGHT EXCEPTION: ${message}`, {
        source,
        lineno,
        colno,
        error,
      });
      alert("uncaught error, please export logs");
    };
  }, []);

  const maybeExportLogs = useCallback(() => {
    const timeout = window.setTimeout(() => logger.saveLogs(), 5000);
    setLogsTimeout(timeout);
  }, []);

  const cancelLogsExport = useCallback(() => {
    window.clearTimeout(logsTimeout);
  }, [logsTimeout]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        // overflowY: "scroll",
        // WebkitOverflowScrolling: "touch",
      }}
      onTouchStart={maybeExportLogs}
      onTouchEnd={cancelLogsExport}
    >
      <BrowserRouter>
        <Routes>
          <Route index element={<CreateRoute />} />
          <Route path="/:pollId/invite" element={<InviteRoute />} />
          <Route path="/:pollId" element={<PollRoute />} />
          <Route path="/vote/:pollId" element={<VoteRoute />} />
          <Route path="/:pollId/ranking/:email" element={<RankingRoute />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
