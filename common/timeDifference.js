export function calculateTimeDifference(date1, date2) {
  // Convert the input strings to Date objects
  const startDate = new Date(date1)
  const endDate = new Date(date2)

  // Ensure both dates are valid
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return "Invalid date format"
  }

  // Calculate the time difference in milliseconds
  const diffMilliseconds = endDate - startDate

  // Ensure the difference is not negative
  if (diffMilliseconds < 0) {
    return "End date must be after start date"
  }

  // // Convert the difference to seconds, minutes, and hours
  //   const diffSeconds = Math.floor(diffMilliseconds / 1000) % 60
  //   const diffMinutes = Math.floor(diffMilliseconds / (1000 * 60)) % 60
  //   const diffHours = Math.floor(diffMilliseconds / (1000 * 60 * 60))

  //   // Construct the result string
  //   const result = `${diffHours} hours, ${diffMinutes} minutes, ${diffSeconds} seconds`

  const Minutes = Math.floor(diffMilliseconds / (1000 * 60))
  return Minutes
}

// Example usage:
// const date1 = "2024-12-29T21:19:53.079Z"
// const date2 = "2024-12-29T22:22:53.079Z"
// console.log(calculateTimeDifference(date1, date2))
// Output: "1 hours, 3 minutes, 0 seconds"
