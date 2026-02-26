# External Incident Intake Architecture

In a real-world enterprise scenario, the primary `CourtroomSecurity.App` (the React SPA we are building) is considered a **High-Privilege Internal Application**. It contains sensitive analytics, dashboards, and historical records that should strictly be isolated from the general employee population. 

However, non-security personnel (e.g., clerks, janitorial staff, general administration) often need the ability to *report* incidents. 

You correctly identified that **Entra ID (Active Directory) and architectural boundaries** are how this is solved. Here are the three best-practice ways organizations handle this requirement, ranked from easiest to most robust.

---

## Pattern 1: Role-Based Access Control (RBAC) within the Same App (The Efficient Route)

This is the most common approach for medium-sized organizations. You do **not** build a separate application; instead, you use Entra ID Roles to aggressively restrict what a user sees when they log in to the current React app.

### How it works:
1. **Entra ID Roles Setup:** In the Azure Portal, you define two App Roles: `Security.Admin` and `General.Reporter`.
2. **The Login Experience:** When a user logs in, Entra ID includes their Role in the JWT Access Token.
3. **Frontend Routing:** Our React `MainLayout.tsx` reads that token. 
   - If the user is `Security.Admin`, they see the Sidebar, Dashboards, and full Incident Logs.
   - If the user is `General.Reporter`, the React Router *hides the entire sidebar and dashboard* and immediately redirects them to `http://localhost/incidents/new` (a standalone layout with only the form and a "Thank you" success page).
4. **Backend Security:** The C# API controller for `GET /api/incidents` is marked with `[Authorize(Roles = "Security.Admin")]`. Even if the `General.Reporter` tries to hack the React app to see the dashboard, the API will reject the request with a **403 Forbidden**. The `POST /api/incidents` endpoint is marked `[Authorize(Roles = "General.Reporter, Security.Admin")]` so both can save records.

**Pros:** One codebase to maintain. One API to deploy.
**Cons:** General staff are still technically accessing a "highly classified" domain URL, which some strict compliance boards dislike.

---

## Pattern 2: Dedicated "Intake" SPA & Backend-For-Frontend (The Enterprise Route)

If compliance requires strict physical separation (e.g., the security database runs on a private internal network, but the intake form needs to be on the public internet so police officers on iPads can submit it), you build two separate apps.

### How it works:
1. **App 1 (Security Core):** The current React App + .NET API, locked behind a VPN/Firewall and restricted to `Security.Admin` Entra ID users.
2. **App 2 (Public Intake):** A tiny, separate React App hosted on Azure Static Web Apps. It contains **only** the `NewIncident.tsx` form. It does not contain any code for charts or viewing data. 
3. **The API Gateway / BFF:** The Public Intake app does not talk directly to the `CourtroomSecurity.Api`. Instead, it talks to an Azure API Management gateway (or an Azure Function). This gateway accepts the form data, validates the Entra ID token, and then securely forwards the data to the hidden internal `CourtroomSecurity.Api` via a private Azure VNET.

**Pros:** mathematically impossible for a reporter to access historical data because the code/routes literally don't exist in their app.
**Cons:** You now have two frontend codebases and complex API gateways to deploy and maintain.

---

## Pattern 3: Microsoft Power Apps / Forms (The Low-Code Route)

Many organizations realize that building and maintaining a custom React app just for a "Contact Us" style form is overkill, especially when they already pay for Microsoft 365.

### How it works:
1. **The Form:** An IT admin builds the "New Incident" form using **Microsoft Power Apps** or **Microsoft Forms**. This takes 30 minutes with drag-and-drop tools.
2. **The Logic:** A **Power Automate (Logic App)** workflow is attached to the form submission. 
3. **The Integration:** When a user submits the Power App form, the Power Automate workflow receives the JSON data, automatically attaches an Entra ID Service Principal token, and makes a secure HTTP POST request directly into our C# `.NET` API (`POST /api/incidents`).

**Pros:** Zero custom code required for the public form. It integrates natively into Microsoft Teams, SharePoint, and Entra ID. It's trivially easy to update form fields later.
**Cons:** You are restricted to Microsoft's UI styling for the form rather than your custom dark-mode "glass" theme.

---

## Summary Recommendation
For the `CourtroomSecurity` app, **Pattern 1** is the modern standard. By utilizing Entra ID Claims, the application securely acts as two entirely different experiences depending on who logged in, utilizing the same unified `.NET` backend without risking data exposure.
