import { useState, useEffect } from "react";

const CurrentTime = () => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
  const month = date.toLocaleDateString("en-US", { month: "long" });
  const day = date.toLocaleDateString("en-US", { day: "numeric" });
  const year = date.toLocaleDateString("en-US", { year: "numeric" });
  const hours = date.getHours() % 12 || 12;
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  const amPm = date.getHours() >= 12 ? "PM" : "AM";
  const timeString = `${hours}:${minutes}:${seconds} ${amPm}`;

  return (
    <div className="text-[10px] font-black text-v-red uppercase tracking-[0.2em] bg-v-red/5 border border-v-red/20 px-4 py-2 rounded-xl">
      {`${weekday}, ${month} ${day}, ${year} | ${timeString}`}
    </div>
  );
};

export default CurrentTime;
