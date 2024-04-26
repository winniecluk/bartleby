import React, { useEffect, useState, useCallback } from 'react';
import { compareCommits, getBranches, getCommit, getOrganizationRepositoryNames } from './api/github.API';
import { getIssueDetails, getMyIssues, getMyself } from './api/jira.API';
import { MASTER_BRANCH_NAME, PEER_REVIEW } from './const';
import { Template } from './components/Template';

/* General TODOs:
- loading icon
- install some kind of style system
  - make buttons look more professional
- how do we interact w/ the plugin once added?
- make template look more like actual template
- can we open these links outside of the Confluence app? Without right-clicking?
  - answer so far seems like no: https://community.atlassian.com/t5/Confluence-questions/how-to-make-a-URL-link-to-open-in-new-tab/qaq-p/1342448
  - can we pull in work from other macros?
*/

function App() {
  const [myself, setMyself] = useState();
  const [issueOptions, setIssueOptions] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState();
  const [diffs, setDiffs] = useState([]);

  const init = useCallback(async () => {
    try {
      const myself = await getMyself();
      setMyself(myself);
  
      const myIssues = await getMyIssues(myself.accountId, PEER_REVIEW);
      const issueOptions = myIssues.issues.map((issue) => {
        return {
          issueKey: issue.key,
          title: issue?.fields?.summary
        }
      });
      setIssueOptions(issueOptions);
    } catch (error) {
      console.log('error displaying');
      console.log(error);
    }
  }, []);

  const onIssueClick = (issue) => {
    setIssueOptions([]);
    setSelectedIssue(issue);
  };

  const getDiffs = useCallback(async (issue) => {
    try {
      console.log('getting branches');
      const repositoryNames = await getOrganizationRepositoryNames();  
      const commits = (await Promise.all(repositoryNames.map(async (repoName) => {
        const branches = await getBranches(repoName);
        const masterCommit = branches.find((branch) => branch.name === MASTER_BRANCH_NAME);
        const issueBranches = branches.filter((branch) => branch.name.includes(issue.issueKey) && (branch.commit.sha !== masterCommit.commit.sha));
        return issueBranches.map((branch) => {
          return {
            repoName,
            branchName: branch.name,
            masterName: MASTER_BRANCH_NAME,
            head: branch.commit.sha,
            base: masterCommit.commit.sha
          };
        });
      }))).flat();

      // console.log('commits');
      // console.log(commits);

      const diffs = await Promise.all(
        commits.map(async (commit) => {
          const basehead = `${commit.masterName}...${commit.branchName}`;
          const results = await compareCommits(commit.repoName, basehead);
          // console.log('what are the compare results?');
          // console.log(results);

          const issueCommits = await Promise.all(results.commits.map(async (c) => {
            return getCommit(commit.repoName, c.sha);
          }));

          // console.log('issueCommits');
          // console.log(issueCommits);

          const messagesByFileName = issueCommits.reduce((acc, c) => {
            c.files.forEach((file) => {
              acc[file.filename] = acc[file.filename] || [];
              acc[file.filename].push(c.commit.message);
            });
            return acc;
          }, {});

          // console.log('messagesByFileName');
          // console.log(messagesByFileName);

          return {
            repoName: commit.repoName,
            messagesByFileName,
            files: results.files.map((file) => {
              return {
                filename: file.filename,
                status: file.status,
              };
            })
          };
        })
      );
      setDiffs(diffs);
    } catch (error) {
      console.log('error getting repos');
      console.log(error);
    }
  }, []);

  const getPullRequests = async (issue) => {

  };

  useEffect(() => {
    init();
  }, [init]);

// deployed site: find a way to query Github for branches related to issueKey
// pull requests: query for pull requests and display them
// front end changes: query for diffs, list files w/ changes

  useEffect(() => {
    console.log('selected issue change');
    if (selectedIssue) {
      getDiffs(selectedIssue);
      getPullRequests(selectedIssue);
    }
  }, [selectedIssue]);

  return (
    <div>
      { issueOptions.length !== 0 && issueOptions.map((issueOption) => {
        return (
          <button onClick={() => onIssueClick(issueOption)}>
            {issueOption.issueKey}: {issueOption.title}
          </button>
        );
      })}
      {selectedIssue && <Template selectedIssue={selectedIssue} diffs={diffs}/>}
    </div>
  );
}

export default App;
