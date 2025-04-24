import { useCallback, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CreateRoute } from "./routes/create/create";
import { PollView } from "./routes/poll/view";
import { PollRoute } from "./routes/poll";
import { VoteView } from "./routes/vote/view";
import { InviteView } from "./routes/invite/view";
import * as logger from "./common/logging";
import { RankingRoute } from "./routes/ranking";
import { InviteRoute } from "./routes/invite";
import { pollWithTie, pollWithWinner } from "./models/mocks";
import { VoteRoute } from "./routes/vote";


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
          {/* DESIGN PREWIEWS */}
          <Route path="/design/invite" element={<InviteView poll={pollWithWinner} />} />
          <Route path="/poll/design" element={<PollView poll={pollWithTie} />} />
          <Route path="/vote/design" element={<VoteView election={pollWithWinner} submitRanking={(r) => {console.log({ ranking: r }); alert("done"); }} />} />

          {/* APP */}
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
