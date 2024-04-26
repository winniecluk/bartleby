import React, { useEffect, useState, useCallback } from "react";
import { BASE_URL } from "../const";

export const Template = ({ selectedIssue, diffs }) => {
  const title = `${selectedIssue.issueKey}: ${selectedIssue.title}`;
  return (
    <div>
      <h1>{selectedIssue.issueKey} - Impact Analysis</h1>
      <div>
        <h2>Jira Links</h2>
        <span>
          <a href={`${BASE_URL}${selectedIssue.issueKey}`}>{title}</a>
        </span>
        <br />
        <h2>Deployed Site</h2>
        <br />

        <div>
          <h2>Pull Requests</h2>

        </div>
        <br />

        <h2>Front End Changes</h2>
        {
          diffs.map(({ repoName, files, messagesByFileName }) => {
            return (
              <ul>
                <li>{repoName}</li>
                <ul>
                  {
                    files.map((file) => {
                      return (
                        <span>
                          <li>{file.status} - {file.filename}</li>
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
    </div>
  );
};
