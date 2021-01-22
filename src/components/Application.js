import React, { useState, useEffect } from "react";
import DayList from "./DayList";
import Appointment from "components/Appointment";
import "components/Application.scss";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "../helpers/selectors"; 

const axios = require('axios');

export default function Application(props) {
  
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
  });
  
  const dailyAppointments = getAppointmentsForDay(state, state.day);
  const interviewers = getInterviewersForDay(state, state.day);
  const setDay = (day) => {
    setState(prev => ({ ...prev, day }));
  }

  //bookInterview allow app to change local state
  function bookInterview(id, interview) {
    
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const days = [...state.days];
    // check if there is no appointment for each time slot
    days.map(day => {
      day.appointments.map(appointment => {
        // change the state of spots if new appointment is equal to id
        // also check if the appointment exists when editing
        if (id === appointment && !state.appointments[id].interview) {
          const newDaySpots = day.spots - 1;
          day.spots = newDaySpots;
        }
      })
    });
  
    return axios({
      method: "put",
      url: `/api/appointments/${id}`,
      data: appointment
    })
    .then((response) => {
      setState((prev) => (
        {
          ...prev,
          appointments,
          days
        }
      ))
    })
  }

  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const days = [...state.days];
    // check if there is no appointment for each time slot
    days.map(day => {
      day.appointments.map(appointment => {
        //change the state of spots if the new appointment is equal to the id
        if (id === appointment) {
          const newDaySpots = day.spots + 1;
          day.spots = newDaySpots;
        }
      })
    });
  
    return axios({
      method: "delete",
      url: `/api/appointments/${id}`,
      data: appointment
    })
    .then((response) => {
      setState((prev) => (
        {
          ...prev,
          appointments,
          days
        }
      ))
    })
  }
  
  const parseAppointments = dailyAppointments.map((appointment) => {
    const interview = getInterview(state, appointment.interview);
    
    return (
      <Appointment 
        key={appointment.id} 
        id={appointment.id}  
        time={appointment.time}  
        interview={interview}
        interviewers={interviewers}
        bookInterview={bookInterview}
        cancelInterview={cancelInterview}
      />
    );
  });

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ]).then((response) => {
      setState((prev) => (
        {
          ...prev, 
          days: response[0].data, 
          appointments: response[1].data, 
          interviewers: response[2].data
        }
      ))
    });
  }, [])

  return (
    <main className="layout">
      <section className="sidebar">
        <img
            className="sidebar--centered"
            src="images/logo.png"
            alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            day={state.day}
            setDay={setDay}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {parseAppointments}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
