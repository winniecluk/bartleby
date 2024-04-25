import api from "@forge/api";
import { Octokit } from "octokit";
import { invoke } from '@forge/bridge';

const headers = {
  'X-GitHub-Api-Version': '2022-11-28'
};
let octokit = await getOctokit();

async function getOctokit () {
  try {
    console.log('getting octokit ready...');
    const jwt = await invoke('getJwt');
    const installationId = await invoke('getInstallationId');
    const accessCall = await api.fetch(`https://api.github.com/app/installations/${installationId}/access_tokens`, {
      method: 'post',
      headers: {
        ...headers,
        'Accept': 'application/vnd.github+json',
        'Authorization': `Bearer ${jwt}`,
      }
    });
    const accessCallResults = await accessCall.json();
    return new Octokit({
      auth: accessCallResults.token
    });
  } catch (error) {
    console.log('error getting octokit');
    console.log(error);
  }

}

export async function getBranches (owner, repo) {
  try {
    const results = await octokit.request('GET /repos/NBBI-TEST/hello_world/branches', {
      owner: 'NBBI-TEST',
      repo: 'hello_world',
      headers
    });  
    return results;
  } catch (error) {
    console.log(error);
  }
}