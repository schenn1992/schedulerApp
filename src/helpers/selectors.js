export function getAppointmentsForDay(state, day) {
  const currentDay = state.days.find(currentDay => currentDay.name === day);
  if (!currentDay) {
    return [];
  }
  const appointmentArray = currentDay.appointments.map((appointmentId) => state.appointments[appointmentId])
  return appointmentArray;
}


