# Tally Data Sync

A highly optimized, secure, and resilient synchronization gateway connecting local **Tally ERP 9 / TallyPrime** desktop installations with external cloud applications and databases.

This application is designed as a hybrid web-and-desktop app using **React (with Vite)** and **Electron** to safely bypass browser sandbox restrictions, enabling direct TCP communication with your local physical machine's Tally ODBC servers.

---

## 🚀 Key Features & Changes

Recent releases and features added specifically for robust offline-first synchronization:

### ⚙️ Enhanced Configuration Panel (Dynamic Sync Settings)
- **Local State & Input Buffering**: Implemented a local draft state to avoid interval restarts or configuration polling triggers on every keystroke.
- **Robust Field Validation**: Prevents syncing with host addresses or ports left blank, and validates intervals.
- **Complete Connection Options**: Standardized support for customized Server IP/Hostname addresses, ports, optional HTTP Basic authentication credentials (Username & Password with masking), dynamic intervals, and company tokens.
- **Persistent Preferences**: Localized configurations are secured in `localStorage` for immediate recall across reboots.

### 📊 Real-Time Activity Log Feed
- **Detailed Network Transmissions**: Displays beautiful, detailed, timestamped records mapping out precise execution phases (encryptions, payloads, handshaking, schemas, connection states).
- **History Retention**: Persists the last 100 log entries locally so users can track transaction history even after restarting the computer.
- **Demo & Sandbox Mode**: Auto-coordinates mock-datasets when unable to bind to native ports in standard browser mode.

### 🌐 Advanced Environment Detection & Cloud Gateway
- **Hybrid Context Handshake**: Detects if the app is hosted inside a sandboxed cloud/web preview frame vs. running under native Electron shell. Emits readable guides for setting up desktop binaries.
- **Resilient Fallback Pipelines**: Intelligently handles unreachable ports and network interruptions without crashing, falling back to simulated sandbox modes securely.
- **Header Status Indicators**: Clear-cut visual beacons in the main layout denoting both physical Tally ODBC connection states and Cloud synchronization status.

---

## 🛠️ How it Works & Local Setup

Because web browsers are blocked by the security sandbox from connecting to `localhost` web servers from remote HTTPS origins, local integration requires launching the **Desktop Mode** (powered by Electron).

### 1. Download and Extract
1. Export this project as a ZIP from the top-right Settings menu inside Chrome/your browser.
2. Unzip the contents onto your target Windows computer directory.

### 2. Quick-Start Commands (Command Prompt / Powershell)
```bash
# 1. Install Node.js dependencies
npm install

# 2. Build and compile the local TS files
npm run build

# 3. Start local developer preview with dev server + Electron wrapper
npm run electron:dev
```

### 3. Build an Offline Executable (.exe)
To compile a standalone, direct distributable application for your accounting teams:
```bash
npm run electron:build
```
A compiled `.exe` release will be generated under the local `release/` directory.

### 4. Tally ERP ODBC Configuration
1. Open Tally ERP 9 or TallyPrime.
2. Go to **F12: Configure** > **Advanced Configuration**.
3. Toggle **Enable ODBC Server** to `Yes`.
4. Set the ports (e.g. `9000`) and open the target company.
5. Launch the desktop loader, key in your host IP/port in the settings panel, and click **Initial Full Sync**.

---

*For custom powershell scripting errors, missing electron caches, or deep windows dependency issues, refer to the detailed **[README_DESKTOP.md](./README_DESKTOP.md)** included in this codebase.*
