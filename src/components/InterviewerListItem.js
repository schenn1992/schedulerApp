import React from "react";
import "./InterviewerListItem.scss";

const classnames = require('classnames');

export default function InterviewerListItem(props) {
  const interviewersClass = classnames("interviewers__item", {
    "interviewers__item--selected": props.selected
  });
  
  return (
    <li className={interviewersClass} onClick = {props.setInterviewer}>
      <img
      className="interviewers__item-image"
      src={props.avatar}
      alt={props.name}
      />
      {props.selected && props.name}
    </li>
  );
}