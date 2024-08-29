import {
  IconAlertCircle,
  IconCircleDashedCheck,
  IconFolder,
  IconHourglassHigh,
  IconUserScan,
} from "@tabler/icons-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MatricsCard from "./MatricsCard";

const DisplayInfo = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState({
    totalFolders: 0,
    aiPersonalizedTreatment: 0,
    totalScreening: 0,
    complectedScreening: 0,
    pendingScreenings: 0,
    overdueScreenings: 0,
  });

  const metricsData = [
    {
      title: "Specialist Appointments Pending",
      subTitle: "View",
      value: metrics.pendingScreenings,
      icon: IconHourglassHigh,
      onClick: () => navigate("/appointments/pending"),
    },

    {
      title: "Treatment Progress Update",
      subTitle: "View",
      value: `${metrics.complectedScreening} of ${metrics.totalFolders}`,
      icon: IconCircleDashedCheck,
      onClick: () => navigate("/appointments/progress"),
    },

    {
      title: "Total Folders",
      subTitle: "View",
      value: metrics.totalFolders,
      icon: IconFolder,
      onClick: () => navigate("/folders"),
    },

    {
      title: "Total Screenings",
      subTitle: "View",
      value: metrics.totalScreening,
      icon: IconUserScan,
      onClick: () => navigate("/screenings"),
    },

    {
      title: "Complected Screenings",
      subTitle: "View",
      value: metrics.complectedScreening,
      icon: IconHourglassHigh,
      onClick: () => navigate("/screenings/complected"),
    },

    {
      title: "Pending Screenings",
      subTitle: "View",
      value: metrics.pendingScreenings,
      icon: IconHourglassHigh,
      onClick: () => navigate("/screenings/pending"),
    },

    {
      title: "Overdue Screenings",
      subTitle: "View",
      value: metrics.overdueScreenings,
      icon: IconAlertCircle,
      onClick: () => navigate("/screenings/overdue"),
    },
  ];

  return (
    <div className="flex flex-wrap gap-[26px]">
      <div className="mt-7 grid w-full grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
        {metricsData.slice(0, 2).map((metric) => (
          <MatricsCard key={metric.title} {...metric} />
        ))}
      </div>
      <div className="mt-[9px] grid w-full gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        {metricsData.slice(2).map((metric) => (
          <MatricsCard key={metric.title} {...metric} />
        ))}
      </div>
    </div>
  );
};

export default DisplayInfo;
