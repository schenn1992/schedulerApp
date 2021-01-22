export function getAppointmentsForDay(state, day) {
  const currentDay = state.days.find(eachDay => eachDay.name === day);
  if (!currentDay) {
    return [];
  }
  const appointmentsArray = currentDay.appointments.map((appointmentId) => state.appointments[appointmentId])
  return appointmentsArray;
};

export function getInterview(state, interview) {
  if (!interview) {
    return null;
  }
  const interviewId = interview.interviewer;
  
  return {  
    "student": interview.student,
    "interviewer": state.interviewers[interviewId]
  }; 
}

export function getInterviewersForDay(state, day) {
  const filteredDays = state.days.find((currentDay) => currentDay.name === day);
  
  if (!filteredDays) {
    return [];
  }
  
  const interviewers = filteredDays.interviewers.map(
    (interviewerId) => state.interviewers[interviewerId]
  );
  
  return interviewers;
}