import React from 'react'

const REPO = 'https://github.com/satirrdev/drapp/issues/new'

const actions = [
  {
    label: 'Submit App',
    title: 'App Submission',
    body: '## App Submission\n\n' +
      '**App Name:** \n' +
      '**Package ID:** \n' +
      '**Version:** \n' +
      '**Developer:** \n' +
      '**Repository URL:** \n' +
      '**Description:** \n' +
      '**App Icon (URL):** \n' +
      '**APK Direct Link:** \n' +
      '**Reason for inclusion:** \n' +
      '**Additional Info:** ',
  },
  {
    label: 'Request Update',
    title: 'Update Request',
    body: '## Update Request\n\n' +
      '**App Name:** \n' +
      '**Package ID:** \n' +
      '**Current Version:** \n' +
      '**Requested Version:** \n' +
      '**Developer:** \n' +
      '**Description:** \n' +
      '**App Icon (URL):** \n' +
      '**APK Direct Link:** \n' +
      '**Reason:** ',
  },
  {
    label: 'Feature Request',
    title: 'Feature Request',
    body: `## Feature Request\n\n**Describe the feature:** \n**Why is it useful?:** \n**Additional context:** `,
  },
  {
    label: 'Report Bug',
    title: 'Bug Report',
    body: `## Bug Report\n\n**Describe the bug:** \n**Steps to reproduce:** \n**Expected behavior:** \n**Screenshots:** \n**Device/OS:** \n**Additional context:** `,
  },
]

export default function ActionBar() {
  return (
    <div className="action-bar">
      {actions.map((a) => (
        <a
          key={a.label}
          href={`${REPO}?title=${encodeURIComponent(a.title)}&body=${encodeURIComponent(a.body)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="action-btn"
        >
          {a.label}
        </a>
      ))}
    </div>
  )
}
