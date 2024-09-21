/** @format */

import React, { useState, useEffect, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./css/aggregatedLogsHorizontal.css";
import TimeLogWebhookListener from "../../webhooks/timeLogWebhookListener"; // Import the WebSocket listener

interface AggregatedData {
  activityId: string;
  totalDuration: number;
  logIds: string[];
}

const HorizontalBarChart: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // JavaScript months are 0-indexed, so add 1

  // Calculate the first day of the current month
  const firstDayOfMonth = `${currentYear}-${String(currentMonth).padStart(
    2,
    "0"
  )}-01`;

  // Calculate the last day of the current month
  const lastDayOfMonth = new Date(currentYear, currentMonth, 0)
    .toISOString()
    .split("T")[0];

  const [aggregatedData, setAggregatedData] = useState<AggregatedData[]>([]);
  const [activityDetails, setActivityDetails] = useState<Map<string, string>>(
    new Map()
  );
  const [startDate, setStartDate] = useState<string>(firstDayOfMonth);
  const [endDate, setEndDate] = useState<string>(lastDayOfMonth);

  const selectedActivityIdsRef = useRef<string[]>([]); // useRef to maintain consistent access to selectedActivityIds

  // Fetch all activity IDs and then fetch aggregated data for all activities
  useEffect(() => {
    fetchActivities();
  }, [startDate, endDate]); // Re-run whenever dates change

  const fetchActivities = async () => {
    const jwtToken = sessionStorage.getItem("jwt");
    if (!jwtToken) {
      console.error("No JWT token found");
      return;
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwtToken}`,
    };

    const activityUrl =
      process.env.REACT_APP_TIMETRACKER_ACTIVITIES_URL ||
      "https://cscloud8-85.lnu.se/tuTea/timetracker-service/api/v1/activities";

    try {
      const response = await fetch(activityUrl, { headers });
      const activities = await response.json();

      // Extract all activity IDs
      const allActivityIds = activities.map(
        (activity: { id: string }) => activity.id
      );

      selectedActivityIdsRef.current = allActivityIds; // Update ref with the current activity IDs
      fetchAggregatedData(allActivityIds);
      fetchActivityDetails(allActivityIds);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  const fetchAggregatedData = async (activityIds: string[]) => {
    const jwtToken = sessionStorage.getItem("jwt");
    if (!jwtToken) {
      console.error("No JWT token found");
      return;
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwtToken}`,
    };

    const baseUrl =
      process.env.REACT_APP_TIMETRACKER_URL || "https://cscloud8-85.lnu.se/tuTea/timetracker-service/api/v1/";
    const aggregatedURL = `${baseUrl}timelogs/aggregate`;

    try {
      const aggregatedResults: AggregatedData[] = [];

      for (const activityId of activityIds) {
        const body = {
          activityId,
          startDate, // Use selected start date
          endDate, // Use selected end date
        };

        const response = await fetch(aggregatedURL, {
          method: "POST",
          headers,
          body: JSON.stringify(body),
        });

        const result = await response.json();

        if (response.ok && result.length > 0) {
          aggregatedResults.push({
            activityId,
            totalDuration: result[0].totalDuration || 0,
            logIds: result[0].logIds || [],
          });
        } else {
          aggregatedResults.push({
            activityId,
            totalDuration: 0,
            logIds: [],
          });
        }
      }

      setAggregatedData(aggregatedResults);
    } catch (error) {
      console.error("Error fetching aggregated data:", error);
    }
  };

  const fetchActivityDetails = async (activityIds: string[]) => {
    const jwtToken = sessionStorage.getItem("jwt");
    if (!jwtToken) {
      console.error("No JWT token found");
      return;
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwtToken}`,
    };

    const baseUrl =
      process.env.REACT_APP_TIMETRACKER_URL || "https://cscloud8-85.lnu.se/tuTea/timetracker-service/api/v1/";
    const activityDetailPromises = activityIds.map((activityId) =>
      fetch(`${baseUrl}activities/${activityId}`, { headers }).then((res) =>
        res.json()
      )
    );

    try {
      const activities = await Promise.all(activityDetailPromises);
      const activityMap = new Map<string, string>();
      activities.forEach((activity) => {
        if (activity.id && activity.name) {
          activityMap.set(activity.id, activity.name);
        } else {
          console.warn("Invalid activity data:", activity);
        }
      });
      setActivityDetails(activityMap);
    } catch (error) {
      console.error("Error fetching activity details:", error);
    }
  };

  // Handle WebSocket events
  const handleTimeLogWebhookEvent = async (event: any) => {
    console.log("Handling timelog webhook event:", event);
    // Check if the event is related to timelogs being created, updated, or deleted
    if (
      event &&
      (event.eventType === "timelogCreated" ||
        event.eventType === "timelogUpdated" ||
        event.eventType === "timelogDeleted")
    ) {
      console.log(
        "Triggering fetchAggregatedData due to WebSocket event with activity IDs:",
        selectedActivityIdsRef.current
      );
      await fetchAggregatedData(selectedActivityIdsRef.current); // Re-fetch aggregated data when an event occurs
    }
  };

  // Transform data for the chart with error handling
  const transformDataForChart = () => {
    if (!Array.isArray(aggregatedData)) {
      console.error("Invalid aggregated data:", aggregatedData);
      return [];
    }

    return aggregatedData
      .map((data) => {
        const activityName = data.activityId
          ? activityDetails.get(data.activityId) || "Unknown"
          : "Unknown Activity";
        return {
          name: activityName,
          totalDuration: data.totalDuration || 0,
        };
      })
      .sort((a, b) => a.totalDuration - b.totalDuration);
  };

  const dataForChart = transformDataForChart();

  // Custom Tooltip Component with white overlay
  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: any;
  }) => {
    if (active && payload && payload.length) {
      const { name, totalDuration } = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p style={{ margin: 0, fontWeight: "bold" }}>{name}</p>
          <p style={{ margin: 0 }}>{`Total time spent: ${totalDuration} mins`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="horizontalBarChartContainer">
      <h2 className="chartTitle">Total Duration by Activity</h2>

      {/* WebSocket listener for timelog events */}
      <TimeLogWebhookListener onEvent={handleTimeLogWebhookEvent} />

      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={dataForChart}
          layout="vertical"
          barSize={20}
          margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis type="category" dataKey="name" />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="totalDuration" fill="#6d6550" />
        </BarChart>
      </ResponsiveContainer>
      <div className="controlsContainer">
        <label>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="dateInput"
            required
          />
        </label>
        <label>
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="dateInput"
            required
          />
        </label>
      </div>
    </div>
  );
};

export default HorizontalBarChart;
