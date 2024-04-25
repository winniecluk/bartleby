import React, { useEffect, useState, useCallback } from 'react';
import { getBranches } from './api/github.API';
import { getIssueDetails, getMyIssues, getMyself } from './api/jira.API';
import { PEER_REVIEW } from './const';
import { Template } from './components/Template';

/* General TODOs:
- loading icon
- install some kind of style system
  - make buttons look more professional
- how do we interact w/ the plugin once added?
- make template look more like actual template
*/

function App() {
  const [myself, setMyself] = useState();
  const [issueOptions, setIssueOptions] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState();

  const init = useCallback(async () => {
    try {
      const myself = await getMyself();
      setMyself(myself);
  
      // TODO list my issues as options for user to select
      const myIssues = await getMyIssues(myself.accountId, PEER_REVIEW);
      console.log('my issues');
      console.log(myIssues);
      const issueOptions = myIssues.issues.map((issue) => {
        return {
          issueKey: issue.key,
          title: issue?.fields?.summary
        }
      });
      setIssueOptions(issueOptions);
      console.log(issueOptions);
    } catch (error) {
      console.log('error displaying');
      console.log(error);
    }
  }, []);

  const onIssueClick = async (issue) => {
    setIssueOptions([]);
    setSelectedIssue(issue);
  };

  useEffect(() => {
    init();
  }, [init]);

  return (
    <div>
      { issueOptions.length !== 0 && issueOptions.map((issueOption) => {
        return (
          <button onClick={() => onIssueClick(issueOption)}>
            {issueOption.issueKey}: {issueOption.title}
          </button>
        );
      })}
      {selectedIssue && <Template selectedIssue={selectedIssue} />}
    </div>
  );
}

export default App;
