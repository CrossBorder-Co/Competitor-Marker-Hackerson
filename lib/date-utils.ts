export function format(date: Date, formatStr: string): string {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  if (formatStr === "PPP") {
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
  }

  if (formatStr === "MMM dd, yyyy") {
    return `${shortMonths[date.getMonth()]} ${date.getDate().toString().padStart(2, "0")}, ${date.getFullYear()}`
  }

  if (formatStr === "MMM dd") {
    return `${shortMonths[date.getMonth()]} ${date.getDate().toString().padStart(2, "0")}`
  }

  if (formatStr === "HH:mm") {
    return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`
  }

  return date.toLocaleDateString()
}
