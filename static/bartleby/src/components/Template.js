import React, { useEffect, useState, useCallback } from 'react';
import { BASE_URL } from '../const';

export const Template = ({ selectedIssue }) => {
  const text = `${selectedIssue.issueKey}: ${selectedIssue.title}`
  return (
    <div>
      <h1>{selectedIssue.issueKey} - Impact Analysis</h1>
      <div>
        <h2>Jira Links</h2>
        <span><a href={`${BASE_URL}${selectedIssue.issueKey}`}>{text}</a></span>
        <br />
        <h2>Deployed Site</h2>
        <br />

        <h2>Pull Requests</h2>
        <br />

        <h2>Front End Changes</h2>

      </div>
    </div>
  );
};