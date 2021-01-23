import React, { useState, useEffect } from "react";

const axios = require('axios');

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = (day) => {
    setState(prev => ({ ...prev, day }));
  }

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
        // and check if the appointment exists when editing
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
  return { state, setDay, bookInterview, cancelInterview };
}