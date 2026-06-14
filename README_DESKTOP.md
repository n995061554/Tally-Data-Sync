# Tally Data Sync - Desktop Installation Guide

This guide explains how to package this application as a Windows Executable (.exe) and how to configure it to sync with your Tally ERP desktop software.

## 1. Prerequisites
- **Node.js** (v18 or higher) installed on your computer.
- **Tally ERP 9 / TallyPrime** running on the same computer or network.

## 2. How to Build the .exe File
Since this is a development environment, you need to build the executable on your local machine:

1. **Download the Source Code**: Export the project as a ZIP from the AI Studio settings menu and extract it on your computer.
2. **Open Terminal**: Navigate to the project folder in your terminal (Command Prompt or PowerShell).
3. **Install Dependencies**:
   ```bash
   npm install
   ```
4. **Build the Executable**:
   ```bash
   npm run electron:build
   ```
5. **Locate the File**: Once the build finishes, you will find the `.exe` file in the `release/` folder.

## 3. Configuring Tally for Sync
To allow this application to read data from Tally, you must enable the Tally ODBC/XML server:

1. Open **Tally ERP 9** or **TallyPrime**.
2. Go to **F12: Configure** > **Advanced Configuration**.
3. Set **Enable ODBC Server** to `Yes`.
4. Set **Port** to `9000` (or your preferred port).
5. Ensure **Tally is running** and a **Company is open** before starting the sync.

## 4. Using the App
1. Run the `Tally Data Sync.exe`.
2. In the **Configuration** panel:
   - Set **Tally Port** to `9000` (matching Tally's config).
   - Enter your **Company ID** as shown in Tally.
3. Click **Initial Full Sync** to fetch all data for the first time.
4. The app will then automatically perform **Incremental Syncs** based on your configured interval.

## 5. Troubleshooting Windows-Specific Issues

### ❌ PowerShell Error: "ScriptName.ps1 cannot be loaded because running scripts is disabled on this system"
By default, Windows restricts powershell scripts from running. You can solve this in three ways:

* **Solution 1 (Recommended & Easiest)**: Switch your VS Code terminal to **Command Prompt (cmd)** instead of PowerShell.
  1. In the VS Code terminal window, look at the top right of the terminal panel.
  2. Click the `v` dropdown arrow next to the `+` icon.
  3. Select **Command Prompt** (or `cmd`).
  4. Now run `npm install` and it will run perfectly!

* **Solution 2 (One-Time PowerShell Bypass)**:
  Run this command specifically in PowerShell to temporarily bypass the execution policy check:
  ```powershell
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
  ```
  Then run your `npm install` command.

* **Solution 3 (Change System-wide Policy)**:
  1. Open PowerShell as **Administrator** (Right-click -> Run as Administrator).
  2. Run the following command:
     ```powershell
     Set-ExecutionPolicy RemoteSigned -Force
     ```
  3. Go back to your VS Code terminal and try running `npm install` again.

### ❌ ZIP Extraction Error: "0x80070057: The parameter is incorrect"
This happens on older Windows systems if a file inside the zip contains colon (`:`) characters in its name (e.g. in history logs).
* **Fix**: We have fully fixed this on our server by renaming the history log files to replace colons with hyphens (`-`).
* **Action**: Simply download a fresh ZIP from the **Settings** menu of the application, and it will extract instantly without any errors!

### ❌ Electron Error: "Electron failed to install correctly, please delete node_modules/electron and try installing again"
This is a common issue on Windows when the download of the Electron binary gets interrupted, blocked by your firewall/antivirus, or fails during `npm install`.

**How to Fix This Step-by-Step:**

* **Solution 1 (The 100% Bulletproof Manual Extraction - BEST WORKAROUND)**:
  If the installer downloads successfully but fails to extract due to spaces/parentheses in your path (`tally-data-sync-1 (1)`), or antivirus blocks:
  
  1. **Download the Zip**: Download the matching Electron binary zip directly via your browser:
     [Download from Mirror (Fastest)](https://npmmirror.com/mirrors/electron/v41.7.1/electron-v41.7.1-win32-x64.zip) or [Download from GitHub](https://github.com/electron/electron/releases/download/v41.7.1/electron-v41.7.1-win32-x64.zip)
  2. **Create the `dist` Folder**: Navigate to `node_modules\electron\` inside your file explorer, and create a new folder named **`dist`** (so you have `node_modules\electron\dist\`).
  3. **Extract Contents**: Extract all files from the downloaded zip directly into `node_modules\electron\dist\`.
     
     *⚠️ **CRITICAL NESTED FOLDER WARNING**: When extracting, zip extractors often create extra nested folders like `dist\dist\` or `dist\electron-v41.7.1-win32-x64\`. This causes a `spawn ENOENT (File Not Found)` error when launching.*
     
     **How to Diagnose and Fix This instantly via your Command Prompt (cmd)**:
     - Run this diagnostics command to search and find where `electron.exe` got extracted:
       ```cmd
       dir /s node_modules\electron\electron.exe
       ```
     - Look at the output of the command:
       - **If it's inside `node_modules\electron\dist\dist\electron.exe`**:
         Run these commands to flatten the folder and write the correct configuration:
         ```cmd
         move node_modules\electron\dist\dist\* node_modules\electron\dist\
         echo dist\electron.exe > node_modules\electron\path.txt
         ```
       - **If it's inside `node_modules\electron\dist\electron-v41.7.1-win32-x64\electron.exe`**:
         Run these commands to path it correctly:
         ```cmd
         move node_modules\electron\dist\electron-v41.7.1-win32-x64\* node_modules\electron\dist\
         echo dist\electron.exe > node_modules\electron\path.txt
         ```
       - **If it's directly inside `node_modules\electron\dist\electron.exe`**:
         Make sure `node_modules\electron\path.txt` has exactly `dist\electron.exe` inside:
         ```cmd
         echo dist\electron.exe > node_modules\electron\path.txt
         ```
  
  4. Run `npm run electron:dev` and it will start instantly!

* **Solution 2 (Bypass corrupt cache)**:
  Sometimes the downloaded Electron file in your central Windows cache is corrupted, causing it to skip the download in 2 seconds. You can force Electron to download a fresh copy by setting a temporary project cache folder:
  1. In your **Command Prompt (cmd)** terminal, run:
     ```cmd
     set ELECTRON_CACHE=%cd%\.electron-temp-cache
     node node_modules/electron/install.js
     ```
  2. Once this completes, run your start command again:
     ```cmd
     npm run electron:dev
     ```

* **Solution 2 (Re-run the Electron Download Script)**:
  If files are corrupt, delete the electron folder and reinstall it cleanly:
  1. **For Command Prompt (cmd)**:
     ```cmd
     rmdir /s /q node_modules\electron
     npm install --foreground-scripts
     ```
  2. **For PowerShell**:
     ```powershell
     Remove-Item -Recurse -Force node_modules/electron
     npm install --foreground-scripts
     ```
  *Note: The `--foreground-scripts` flag forces npm to show you the progress of the Electron binary download directly in your terminal so you can see if it succeeds.*

* **Solution 3 (Network/Firewall Block)**:
  If your internet provider or connection blocks GitHub releases (where Electron pulls its binary), try:
  1. Temporarily disabling your antivirus or firewall.
  2. Connecting your computer to a mobile hotspot or alternative network, then running `node node_modules/electron/install.js` again.

