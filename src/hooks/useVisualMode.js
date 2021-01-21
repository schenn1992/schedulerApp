import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]); 

  const transition = function(newMode, replace = false) {
    
    if (replace) {
      if (history.length <= 1) {
        return;
      }
      setHistory((previousHistory) => {
        const newHistory = previousHistory.slice(0, previousHistory.length - 1)
        setMode(newMode);
        
        return [...newHistory, newMode];
      
      })
    } else {
      setHistory((history) => {
        setMode(newMode);
        
        return [...history, newMode]
      });
    }
  }

  const back = function() {
    if (history.length <= 1) {
      return;
    }
    
    setHistory((previousHistory) => {
      let newHistory = previousHistory.slice(0, -1);
      setMode(newHistory[newHistory.length - 1]);
      
      return newHistory;
    });
  }


  return { mode, transition, back };
}