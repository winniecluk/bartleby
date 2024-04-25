import { requestJira } from '@forge/bridge';

export async function getMyself () {
  const results = await requestJira('/rest/api/3/myself');
  return results.json();
  // body.accountId
}

export async function getMyIssues (userId, status) {
  const results = await requestJira(`/rest/api/3/search?jql=assignee=${userId} AND status="${status}"`);
  return results.json();
  //userIssues.issues[0].key
}

export async function getIssueDetails (issueKey) {
  const results = await requestJira(`/rest/api/3/issue/${issueKey}`);
  return results.json();
}