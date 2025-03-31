import { useEffect, useRef } from "react";

function useDailyTrigger(callback) {
  const lastDate = useRef(new Date().toDateString());

  useEffect(() => {
    const interval = setInterval(() => {
      const nowDate = new Date().toDateString();
      if (nowDate !== lastDate.current) {
        lastDate.current = nowDate;
        callback();
      }
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [callback]);
}

export default useDailyTrigger;
