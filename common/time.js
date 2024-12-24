export const utcToLocal = (utcTimestamp) => {
  //   const date = new Date(utcTimestamp)
  //   const localTime = date.toLocaleString()
  //   return localTime

  // Convert to a Date object
  const date = new Date(utcTimestamp)

  // Format the local time, ignoring seconds
  const options = {
    year: "numeric",
    month: "long", // Full month name (e.g., "December")
    day: "numeric", // Day of the month
    hour: "2-digit", // Hour
    minute: "2-digit", // Minutes
    hour12: true, // Use 12-hour clock
  }

  const formattedTime = date.toLocaleString(undefined, options)

  return formattedTime
}
