import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]); 

  //move to new mode
  function transition(newMode, replace = false) {
    if (replace) {
      setHistory([...history.slice(0, history.length - 1), newMode]);
      setMode(newMode);
    } else {
      setMode(newMode);
      setHistory([...history, newMode]);
    }
  }
  //return to previous mode
  function back() {
    if (history.length > 1) {
      setHistory(history.slice(0, history.length - 1));
      setMode(history[history.length - 2]);
    }
  }
  
  return { mode, transition, back };
}