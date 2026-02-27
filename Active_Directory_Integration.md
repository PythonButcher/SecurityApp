# Active Directory Integration for Role-Based Access Control (RBAC)

In a production-level enterprise application, feature toggling and access control—such as restricting the "Updater Mechanism" purely to Management—are typically handled via **Active Directory (AD)** (or Azure Active Directory / Entra ID). 

Below is an overview of how this integration works across the application stack.

## 1. Active Directory Security Groups
In Active Directory, users are assigned to specific Security Groups based on their roles. 
For example:
- `SG_CourtroomSecurity_Officers` (Standard officers who create incidents)
- `SG_CourtroomSecurity_Management` (Managers who need the ability to edit/update incidents)

These groups act as the single source of truth for user permissions.

## 2. Authentication Flow (OAuth 2.0 / OpenID Connect)
When a user logs into the React frontend, they authenticate against the Identity Provider (e.g., Azure AD).
- Upon successful login, the provider issues a **JWT (JSON Web Token)** containing the user's identity and their assigned "roles" or "groups" as claims.
- The React application stores this token securely.

## 3. Frontend Enforcement (React)
The frontend extracts the roles from the JWT claims to determine what UI elements to render.
If the token contains the `SG_CourtroomSecurity_Management` group claim:
- The React app will render the **"Edit"** button on the `IncidentList` page for that specific user.
- If they do not have the claim, the "Edit" button is completely removed from the DOM.
- The routing component will evaluate the same claim. If a regular user manually navigates to `/incidents/edit/123`, the app directs them to an "Unauthorized" page.

## 4. Backend Enforcement (ASP.NET Core API)
UI hiding is not true security. The backend API is the final enforcer.
- The React app passes the JWT in the `Authorization: Bearer <token>` header of every API request.
- The ASP.NET Core API validates the token signature and expiration.
- The `IncidentsController` protects the `UpdateIncident` (PUT) endpoint using the `[Authorize]` attribute tied to a specific policy or role:

```csharp
[HttpPut("{id}")]
[Authorize(Roles = "SG_CourtroomSecurity_Management")] // Only users with this AD role can access this endpoint
public async Task<IActionResult> UpdateIncident(Guid id, [FromBody] UpdateIncidentDto dto)
{
    // ...
}
```

If an attacker manually bypasses the React frontend or attempts to trigger an update using Postman, the backend API will reject the request with a `403 Forbidden` response, ensuring that only users in the correct Active Directory group can modify records.
