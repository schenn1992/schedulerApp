import { useState, useEffect } from "react";
import getSpotsForDay from "../helpers/selectors";
import axios from "axios";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  //handle selected day
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

    const spots = getSpotsForDay(state.day, state.days, appointments);
    
    const days = state.days.map(day => {
      if (day.name === state.day) {
        return { ...day, spots }
      }

      return day;
    });

    return new Promise((resolve, reject) => { 
      axios.put(`/api/appointments/${id}`, appointment)
      .then(() => {
        setState((prev) => (
          {
            ...prev,
            appointments,
            days
          }
        ))
        resolve();
      })
      .catch(() => {
        reject()
      })
    }); 
  };

  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const spots = getSpotsForDay(state.day, state.days, appointments);

    const days = state.days.map(day => {
      if (day.name === state.day) {
        return { ...day, spots }
      }

      return day;
    });

    return new Promise((resolve, reject) => {
      axios.delete(`/api/appointments/${id}`, appointment)
      .then(() => {
        setState((prev) => (
          {
            ...prev,
            appointments,
            days
          }
        ))
        resolve();
      })
      .catch(() => {
        reject();
      })
    }); 
  }
  return { state, setDay, bookInterview, cancelInterview };
}