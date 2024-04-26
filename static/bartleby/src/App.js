import React, { useEffect, useState, useCallback } from 'react';
import { compareCommits, getBranchDetails, getCommit, getOrganizationRepositoryNames, getPRs } from './api/github.API';
import { getMyIssues, getMyself } from './api/jira.API';
import { DEV_DEPLOYMENT_BASE_URL, FRONTEND, MASTER_BRANCH_NAME, PEER_REVIEW, PR_OPEN_STATE, QA_DEPLOYMENT_BASE_URL } from './const';
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
  - if no branches, display message
  - includes - issue number
*/

function App() {
  const [myself, setMyself] = useState();
  const [issueOptions, setIssueOptions] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState();
  const [repoNames, setRepoNames] = useState([]);
  const [diffs, setDiffs] = useState([]);
  const [frontendDiff, setFrontendDiff] = useState({});
  const [pullRequests, setPullRequests] = useState([]);
  const [frontendRequest, setFrontendRequest] = useState({});
  const [deployedSiteUrls, setDeployedSiteUrls] = useState({});

  const getIssueOptions = async (accountId) => {
    const myIssues = await getMyIssues(accountId, PEER_REVIEW);
    return myIssues.issues.map((issue) => {
      return {
        issueKey: issue.key,
        title: issue?.fields?.summary
      }
    });
  };

  const init = useCallback(async () => {
    try {
      const myself = await getMyself();
      setMyself(myself);
      
      const issueOptions = await getIssueOptions(myself.accountId);
      setIssueOptions(issueOptions);

      const repositoryNames = await getOrganizationRepositoryNames();
      setRepoNames(repositoryNames);
    } catch (error) {
      console.log('error in init');
      console.log(error);
    }
  }, []);

  const onIssueClick = (issue) => {
    setIssueOptions([]);
    setSelectedIssue(issue);
  };

  const getBranchesForRepo = async (repoName, issue) => {
    const branches = await getBranchDetails(repoName);
    const masterCommit = branches.find((branch) => branch.name === MASTER_BRANCH_NAME);
    const issueBranches = branches.filter((branch) => branch.name.toLowerCase().includes(issue.issueKey.toLowerCase()) && (branch.commit.sha !== masterCommit.commit.sha));
    return issueBranches.map((branch) => {
      return {
        repoName,
        branchName: branch.name,
        masterName: MASTER_BRANCH_NAME,
        // head: branch.commit.sha,
        // base: masterCommit.commit.sha
      };
    });
  };

  const getBranches = async (issue, repoNames) => {
    const branches = (await Promise.all(repoNames.map(async (repoName) => getBranchesForRepo(repoName, issue)))).flat();
    return branches;
  };

  const getDiffs = useCallback(async (issue, repos) => {
    try {
      const branches = await getBranches(issue, repos);
      const diffs = await Promise.all(
        branches.map(async (branch) => {
          const basehead = `${branch.masterName}...${branch.branchName}`;
          const results = await compareCommits(branch.repoName, basehead);
          const issueCommits = await Promise.all(results.commits.map(async (c) => {
            return getCommit(branch.repoName, c.sha);
          }));
          const messagesByFileName = issueCommits.reduce((acc, c) => {
            c.files.forEach((file) => {
              acc[file.filename] = acc[file.filename] || [];
              acc[file.filename].push(c.commit.message.replace(new RegExp(issue.issueKey + '(:)?'), ''));
            });
            return acc;
          }, {});
          return {
            repoName: branch.repoName,
            branchName: branch.branchName,
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
      const frontendDiffIdx = diffs.findIndex((diff) => diff.repoName === FRONTEND);
      if (frontendDiffIdx !== -1) {
        const diff = diffs.splice(frontendDiffIdx, 1)[0];
        setFrontendDiff(diff);

        // TODO
        setDeployedSiteUrls({
          dev: DEV_DEPLOYMENT_BASE_URL + diff.branchName.replace('/', '-'),
          qa: QA_DEPLOYMENT_BASE_URL + diff.branchName.replace('/', '-')
        });
      }
  
      setDiffs(diffs);
    } catch (error) {
      console.log('error getting diffs');
      console.log(error);
    }
  }, []);

  const getPullRequests = async (issue, repos) => {
    const pullRequests = (await Promise.all(repos.map(async (repoName) => {
      const prs = await getPRs(repoName);
      console.log('prs');
      console.log(prs);
      return prs.filter((pr) => pr.head.ref.toLowerCase().includes(issue.issueKey.toLowerCase()) && pr.state === PR_OPEN_STATE).map((pr) => {
        return {
          repoName,
          url: pr.html_url
        };
      });
    }))).flat();
    const frontendRequestIdx = pullRequests.findIndex((diff) => diff.repoName === FRONTEND);
    if (frontendRequestIdx !== -1) {
      const request = pullRequests.splice(frontendRequestIdx, 1)[0];
      setFrontendRequest(request);
    }
    setPullRequests(pullRequests);
  };

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (selectedIssue && repoNames.length) {
      getDiffs(selectedIssue, repoNames);
      getPullRequests(selectedIssue, repoNames);
    }
  }, [selectedIssue]);

  return (
    <div>
      { issueOptions.length !== 0 && 
        (
          <div>
            Hi {myself?.displayName}, congratulations on completing your ticket, hurray! Please select from one of your tickets in review:
            {
              issueOptions.map((issueOption) => {
                return (
                  <div style={{ margin: 10 }}>
                    <button onClick={() => onIssueClick(issueOption)}>
                      {issueOption.issueKey}: {issueOption.title}
                    </button>
                  </div>
                );
              })
            }
          </div>
        )
      }
      {selectedIssue && <Template 
        selectedIssue={selectedIssue}
        diffs={diffs}
        pullRequests={pullRequests}
        frontendDiff={frontendDiff}
        frontendRequest={frontendRequest}
        deployedSiteUrls={deployedSiteUrls}
      />}
    </div>
  );
}

export default App;
