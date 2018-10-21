import * as React from 'react'

interface IProps {
  mentions: string[]
  message: string
}

export const NotificationBody: React.SFC<IProps> = ({ mentions, message }) => (
  <React.Fragment>
    <div>{message}</div>
    {mentions.map((mention, index) => (
      <React.Fragment key={index}>
        <b>{mention}</b>
        <br />
      </React.Fragment>
    ))}
  </React.Fragment>
)
