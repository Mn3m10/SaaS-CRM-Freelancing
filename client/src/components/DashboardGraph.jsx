import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { day: "Mon", projects: 0 },
  { day: "Tue", projects: 0 },
  { day: "Wed", projects: 0 },
  { day: "Thu", projects: 0 },
  { day: "Fri", projects: 0 },
  { day: "Sat", projects: 0 },
  { day: "Sun", projects: 0 },
];

const DashboardGraph = () => {
  return (
    <div className="graph">
      <h2>Project Completion Velocity</h2>

      <div className="diagram" style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="day" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="projects"
              stroke="#004AC6"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardGraph;
