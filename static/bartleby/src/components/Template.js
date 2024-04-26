import React from "react";
import { BASE_URL } from "../const";

export const Template = (props) => {
  const { selectedIssue, diffs, pullRequests, frontendDiff, frontendRequest, deployedSiteUrls } = props;
  const title = `${selectedIssue.issueKey}: ${selectedIssue.title}`;
  return (
    <div>
      <h1 style={{ marginBottom: 10}}>{selectedIssue.issueKey} - Impact Analysis</h1>
      <div>

        {/* Jira Links */}
        <div>
          <h2 style={{ marginBottom: 10}}>Jira Links</h2>
          <div>
            <a href={`${BASE_URL}${selectedIssue.issueKey}`}>{title}</a>
          </div>
        </div>
        <br />
        <hr />

        {/* Deployed Site */}
        <div>
          <h2>Deployed Site</h2>
          <ul>
            { deployedSiteUrls.dev ?
              (
                <span>
                  <li>Dev</li>
                  <ul>
                    <li><a href={deployedSiteUrls.dev}>{deployedSiteUrls.dev}</a></li>
                  </ul>
                  <li>QA</li>
                  <ul>
                    <li><a href={deployedSiteUrls.qa}>{deployedSiteUrls.qa}</a></li>
                  </ul>
                </span>
              ) : <li>None</li>
            }
          </ul>
        </div>
        <br />
        <hr />

        {/* Pull Requests */}
        <div>
          <h2>Pull Requests</h2>
          <ul>
            <li><strong>Frontend</strong></li>
            <ul>
              {
                frontendRequest?.url ?
                (
                  <li>
                    <a href={frontendRequest.url}>{frontendRequest.url}</a>
                  </li>
                ) : <li>None</li>
              }
            </ul>
            <li><strong>Microservices</strong></li>
            {
              pullRequests.map((pr) => {
                return (
                  <ul>
                    <li>
                      <strong>{pr.repoName}</strong>
                      <ul>
                        <li>
                          <a href={pr.url}>{pr.url}</a>
                        </li>
                      </ul>
                    </li>
                  </ul>
                )
              })
            }
          </ul>
        </div>
        <br />
        <hr />

        {/* Changes */}
        <div>
          <div>
            <h2>Front End Changes</h2>
            <ul>
            {
              frontendDiff?.repoName ?
              (
                <span>
                  <li><strong>{frontendDiff.repoName}</strong></li>
                  <ul>
                    {
                      frontendDiff.files.map((file) => {
                        return (
                          <span>
                            <li><strong>{file.status} - {file.filename}</strong></li>
                            <ul>
                                {
                                  frontendDiff.messagesByFileName[file.filename]?.map((commitMessage) => {
                                    return (
                                      <li>
                                        {commitMessage}
                                      </li>
                                    )
                                  })
                                }
                            </ul>
                          </span>
                        );
                      })
                    }
                  </ul>
                </span>
              ) : <li>None</li>
            }
            </ul>
          </div>
          <br />

          <div>
            <h2>Microservice Changes</h2>
            <ul>

            </ul>
            {
              diffs.map(({ repoName, files, messagesByFileName }) => {
                return (
                  <ul>
                    <li><strong>{repoName}</strong></li>
                    <ul>
                      {
                        files.map((file) => {
                          return (
                            <span>
                              <li><strong>{file.status} - {file.filename}</strong></li>
                              <ul>
                                  {
                                    messagesByFileName[file.filename]?.map((commitMessage) => {
                                      return (
                                        <li>
                                          {commitMessage}
                                        </li>
                                      )
                                    })
                                  }
                              </ul>
                            </span>
                          );
                        })
                      }
                    </ul>
                  </ul>
                );
              })
            }
          </div>
          <br />
        </div>
      </div>
    </div>
  );
};
