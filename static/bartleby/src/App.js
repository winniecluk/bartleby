import React, { useEffect, useState, useCallback } from 'react';
import { getBranches } from './api/github.API';
import { getMyIssues, getMyself } from './api/jira.API';
import { PEER_REVIEW } from './const';

/* General TODOs:
- loading icon
*/

function App() {
  const [myself, setMyself] = useState();
  const [myIssues, setMyIssues] = useState();

  const init = useCallback(async () => {
    const myself = await getMyself();
    setMyself(myself);

    // TODO list my issues as options for user to select
    const myIssues = await getMyIssues(myself.accountId, PEER_REVIEW);
    setMyIssues(myIssues);
  }, []);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <div>
      Test 1
    </div>
  );
}

export default App;
