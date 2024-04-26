import api from "@forge/api";
import { Octokit } from "octokit";
import { invoke } from '@forge/bridge';
import { ORGANIZATION_NAME } from "../const";

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

export async function getOrganizationRepositoryNames () {
  try {
    const results = await octokit.request(`GET /orgs/${ORGANIZATION_NAME}/repos`, {
      org: ORGANIZATION_NAME,
      headers
    });
    return results.data.map((repo) => {
      return repo.name;
    });
  } catch (error) {
    console.log(error);
  }
}

export async function getBranches (repo) {
  try {
    const results = await octokit.request(`GET /repos/${ORGANIZATION_NAME}/${repo}/branches`, {
      owner: ORGANIZATION_NAME,
      repo,
      headers
    });  
    return results.data;
  } catch (error) {
    console.log('error getting branches');
    console.log(error);
  }
}

export async function compareCommits (repo, basehead) {
  try {
    const results = await octokit.request(`GET /repos/${ORGANIZATION_NAME}/${repo}/compare/${basehead}`, {
      basehead,
      owner: ORGANIZATION_NAME,
      repo,
      headers
    });  
    return results.data;
  } catch (error) {
    console.log(error);
  }
}

export async function getCommit (repo, ref) {
  try {
    const results = await octokit.request(`GET /repos/${ORGANIZATION_NAME}/${repo}/commits/${ref}`, {
      owner: ORGANIZATION_NAME,
      repo,
      ref
    });
    return results.data;
  } catch (error) {
    console.log(error);
  }
}