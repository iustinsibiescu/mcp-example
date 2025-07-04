# 🗓️ Google Calendar MCP Server

A lightweight MCP server that connects to your Google Calendar and retrieves your meetings for today.

---

## ✅ Setup Instructions

### 1. Create OAuth Credentials in Google Cloud

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Enable the **Google Calendar API**.
3. Navigate to **APIs & Services > Credentials**.
4. Click **"Create Credentials" > "OAuth client ID"**.
5. Choose **"Desktop App"** as the application type.
6. Copy your **Client ID** and **Client Secret**.

---

### 2. Generate a Refresh Token

1. In the root of this repo, run:

   ```bash
   node quick-refresh-token.js
   ```

2. This will open a browser window to authorize the app.

3. After authorizing, paste the code into the terminal.

4. The script will print your Refresh Token.

---

### 3. Add Your Environment Variables

Create a ```.env``` file in the project root with:

```bash
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REFRESH_TOKEN=your-refresh-token
CALENDAR_ID=primary
```

Replace primary with a specific calendar ID if needed.

---

### 4. Connect MCP Server in Cursor

1. Open Cursor.

2. Go to Settings > Tools & Integrations > Add New MCP Server.

3. Paste the following config:
``` bash
{
  "mcpServers": {
    "calendar-data": {
      "command": "node",
      "args": ["path_to_server.js"],
      "env": {
        "GOOGLE_CLIENT_ID": "your-client-id",
        "GOOGLE_CLIENT_SECRET": "your-client-secret",
        "GOOGLE_REFRESH_TOKEN": "your-refresh-token",
        "CALENDAR_ID": "primary"
      }
    }
  }
}
```

Replace ```path_to_server.js``` with the actual path to your ```server.js``` file.

---

### 5. Usage

Once set up, you can chat with Cursor AI and ask:

``` bash
"Do I have any meetings today?"
```

Cursor will call the MCP server, which will fetch today's events from your Google Calendar.
