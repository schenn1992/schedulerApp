import React from "react";
import { render, cleanup, prettyDOM, getByText, waitForElement, fireEvent, getAllByTestId, getByPlaceholderText, getByAltText, queryByText, queryByAltText } from "@testing-library/react";
import axios from "axios";
import Application from "components/Application";

afterEach(cleanup);

describe("Application", () => {
  it("changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);
    
    await waitForElement(() => getByText("Monday"));
    
    fireEvent.click(getByText("Tuesday"));
    
    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });
  
  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    // Render the Application.
    const { container } = render(<Application />);
    
    // Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    
    //target appointments in the DOM nodes
    const appointments = getAllByTestId(container, "appointment");

    //target first appointment = empty
    const appointment = appointments[0];
    
    // Click the "Add" button on the first empty appointment.
    fireEvent.click(getByAltText(appointment, "Add"));
    
    // Enter the name "Lydia Miller-Jones" into the input with the placeholder "Enter Student Name".
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    
    // Click the first interviewer in the list.
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    
    // Click the "Save" button on that same appointment.
    fireEvent.click(getByText(appointment, "Save"));
    
    // Check that the element with the text "Saving" is displayed.
    expect(getByText(appointment, "Saving")).toBeInTheDocument();
    
    // Wait until the element with the text "Lydia Miller-Jones" is displayed.
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    //target days and extract Monday
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    // Check that the DayListItem with the text "Monday" also has the text "no spots remaining".
    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
    
  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {

    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Click the "Delete" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(queryByAltText(appointment, "Delete"));

    // 4. Check that the confirmation message is shown.
    expect(getByText(appointment, "Are you sure you want to delete this appointment?")).toBeInTheDocument();

    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(queryByText(appointment, "Confirm"));

    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();

    // 7. Wait until the element with the "Add" button is displayed.
    await waitForElement(() => getByAltText(appointment, "Add"));

    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    // 1. Render the Application
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Click the "Edit" button on the booked appointment

    //target booked appointment
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(getByAltText(appointment, "Edit"));

    // 4. Check that the input is displaying the student name
    expect(getByPlaceholderText(appointment, "Enter Student Name")).toHaveValue("Archie Cohen");

    // 5. Check that the interviewer is preselected
    expect(getByAltText(appointment, "Tori Malcolm")).toBeInTheDocument();

    // 6. Enter new student name - "Lydia Miller-Jones"
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    // 7. Click "Save" button
    fireEvent.click(getByText(appointment, "Save"));

    // 8. Check that the element with the text "Saving..." is displayed
    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    // 9. Wait until the element with the text "Lydia Miller-Jones" is displayed
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    //target Monday in the navbar
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    // 10. Check that the DayListItem with the text "Monday" still has the text "1 spot remaining"
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  });

  it("shows the save error when failing to save an appointment", () => {
    axios.put.mockRejectedValueOnce();
  });

  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce();
  });

});