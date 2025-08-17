import { useState, useMemo } from "react"
import { Chart, registerables } from "chart.js"
import { Pie } from "react-chartjs-2"

Chart.register(...registerables)

export default function InstructorChart({ courses }) {
  const [currChart, setCurrChart] = useState("students")

  // Generate consistent random colors (memoized)
  const colors = useMemo(() => {
    return courses.map(() => {
      return `rgb(${Math.floor(Math.random() * 200)}, ${Math.floor(
        Math.random() * 200
      )}, ${Math.floor(Math.random() * 200)})`
    })
  }, [courses])

  const chartDataStudents = {
    labels: courses.map((course) => course.courseName),
    datasets: [
      {
        data: courses.map((course) => course.totalStudentsEnrolled),
        backgroundColor: colors,
        borderColor: "#1f2937", // dark border for contrast
        borderWidth: 2,
      },
    ],
  }

  const chartIncomeData = {
    labels: courses.map((course) => course.courseName),
    datasets: [
      {
        data: courses.map((course) => course.totalAmountGenerated),
        backgroundColor: colors,
        borderColor: "#1f2937",
        borderWidth: 2,
      },
    ],
  }

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#fff", // white legend text for dark mode
        },
      },
    },
  }

  return (
    <div className="flex flex-1 flex-col rounded-md bg-richblack-800 p-6">
      <p className="text-lg font-bold text-richblack-5">Visualize</p>
      <div className="space-x-4 font-semibold">
        <button
          onClick={() => setCurrChart("students")}
          className={`rounded-sm p-1 px-3 transition-all duration-200 ${
            currChart === "students"
              ? "bg-richblack-700 text-yellow-50"
              : "text-yellow-400"
          }`}
        >
          Students
        </button>
        <button
          onClick={() => setCurrChart("income")}
          className={`rounded-sm p-1 px-3 transition-all duration-200 ${
            currChart === "income"
              ? "bg-richblack-700 text-yellow-50"
              : "text-yellow-400"
          }`}
        >
          Income
        </button>
      </div>
     <div className="relative mx-auto aspect-square h-80 w-80">
  <Pie
    data={currChart === "students" ? chartDataStudents : chartIncomeData}
    options={options}
  />
</div>

    </div>
  )
}
