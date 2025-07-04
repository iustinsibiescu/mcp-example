import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import dotenv from "dotenv";
import { google } from "googleapis";
import { z } from "zod";

dotenv.config();

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REFRESH_TOKEN,
  CALENDAR_ID,
} = process.env;

async function getMyCalendarDataByDate(date) {
  const oauth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET
  );

  oauth2Client.setCredentials({
    refresh_token: GOOGLE_REFRESH_TOKEN,
  });

  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  const start = new Date(date);
  start.setUTCHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);

  try {
    const res = await calendar.events.list({
      calendarId: CALENDAR_ID,
      timeMin: start.toISOString(),
      timeMax: end.toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = res.data.items || [];
    const meetings = events.map((event) => {
      const start = event.start?.dateTime || event.start?.date;
      return `${event.summary} at ${start}`;
    });

    if (meetings.length > 0) {
      return { meetings };
    } else {
      return { meetings: [] };
    }
  } catch (err) {
    return {
      error: err.message,
    };
  }
}

// Create an MCP server
const server = new McpServer({
  name: "Calendar",
  version: "1.0.0",
});

server.tool(
  "getMyCalendarByDate",
  {
    date: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format. Please Provide a valid date string.",
    }),
  },

  async ({ date }) => {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(await getMyCalendarDataByDate(date)),
        },
      ],
    };
  }
);

async function init() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

init();
