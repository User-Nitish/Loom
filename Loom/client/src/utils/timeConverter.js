const formatCreatedAt = (createdAt) => {
  if (!createdAt) return "Unknown";
  
  // If it's already a relative time string (contains "ago"), return it as is
  if (typeof createdAt === 'string' && createdAt.includes('ago')) {
    return createdAt;
  }

  const date = new Date(createdAt);
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return typeof createdAt === 'string' ? createdAt : "Unknown date";
  }

  const options = { month: "long", day: "numeric" };
  const dateString = date.toLocaleDateString("en-US", options);
  const day = date.getDate();
  
  let suffix;
  if (day % 10 === 1 && day !== 11) {
    suffix = "st";
  } else if (day % 10 === 2 && day !== 12) {
    suffix = "nd";
  } else if (day % 10 === 3 && day !== 13) {
    suffix = "rd";
  } else {
    suffix = "th";
  }

  const timeString = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
  });

  return `${dateString}${suffix}, ${date.getFullYear()} ${timeString}`;
};

export default formatCreatedAt;
