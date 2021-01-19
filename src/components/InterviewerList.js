import React from "react";
import InterviewerListItem from "./InterviewerListItem";
import PropTypes from 'prop-types';
import "./InterviewerList.scss";

export default function InterviewerList(props) {
  const interviewersArray = props.interviewers;
  const parsedArray = interviewersArray.map((interviewer) => {
    return <InterviewerListItem 
      key={interviewer.id} 
      name={interviewer.name}
      avatar={interviewer.avatar}
      selected={interviewer.id === props.value}
      setInterviewer={() => props.onChange(interviewer.id)} 
      />
  })
  
  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewers</h4>
      <ul className="interviewers__list">
        {parsedArray}
      </ul>
    </section>
  );
}

InterviewerList.propTypes = {
  interviewers: PropTypes.array.isRequired
};

