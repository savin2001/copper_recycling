# Kubernetes Log Monitoring Script

## How the Solution Works

To ensure the stability of the Kubernetes environment without impacting the performance of the live application logs, this solution utilizes a **snapshot-based monitoring approach**. 

The script is scheduled to run every 5 minutes on the RHEL host server and executes the following logical flow:

### 1. Snapshot Creation (Non-Blocking)
Instead of reading the live Kubernetes log file directly—which could cause file locking issues or performance degradation—the script copies the current log contents to a secondary buffer file:
`../kube_full.log`

*   **Benefit:** This isolates the heavy text processing from the active application runtime.

### 2. Pattern Analysis & Context Extraction
The script scans the buffered `../kube_full.log` for the specific keyword `"ERROR"`. If the phrase is found, it extracts a 3-line window for every occurrence:
1.  The line **immediately preceding** the error.
2.  The line **containing** the error.
3.  The line **immediately following** the error.

### 3. Error Archival
These extracted lines are appended to a persistent log file:
`kube_error.log`

*   **Benefit:** This creates a concise, historical record of issues without the noise of successful operation logs.

### 4. Buffer Cleanup
Once the analysis and extraction are complete, the contents of `../kube_full.log` are cleared.
*   **Benefit:** This prevents duplicate processing of the same errors during the next 5-minute interval and manages disk space efficiently.

---

### Workflow Visual
```mermaid
graph TD
    A[Start: Cron Job (Every 5 mins)] -->|Copy| B[Live Kube Log -> ../kube_full.log]
    B --> C{Scan for 'ERROR'}
    C -- Found --> D[Extract: Previous Line + Error Line + Next Line]
    D --> E[Append to kube_error.log]
    C -- Not Found --> F[Proceed]
    E --> G[Clear contents of ../kube_full.log]
    F --> G
    G --> H[End]
```
