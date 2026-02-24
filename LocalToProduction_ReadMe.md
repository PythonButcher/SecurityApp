# Local vs. Production Architecture Variance

The Courtroom Incident Reporting & Security Database is currently implemented as a "Production-like Local Instance." This means the architecture, naming conventions, layering (Clean Architecture), and framework choices (React/Vite, .NET 8) mimic exactly how an enterprise application is built.

However, because this instance is purely for local practice and data-generation without deploying or incurring cloud costs, certain components have been intentionally swapped or stubbed out. 

To deploy this application to a true Enterprise Production environment (e.g., Azure), the following pivots must be executed:

## 1. Authentication & Identity
* **Local State:** Currently, the `CurrentUserService.cs` is simply returning a hard-coded mock user (`"system-admin-mock"`). The React UI does not have a real login screen.
* **Production Pivot:**
  * **Frontend:** Integrate `@azure/msal-react` to redirect unauthenticated users to the Microsoft Entra ID (formerly Azure AD) login portal. The acquired JWT access token must then be attached as a `Bearer` token to all Axious/Fetch requests.
  * **Backend:** Add NuGet packages for `Microsoft.Identity.Web`. In `Program.cs`, replace the mock service by configuring `AddMicrosoftIdentityWebApi(...)` so the .NET API validates the Entra JWT signature on every incoming request. Update `CurrentUserService` to read `ClaimsPrincipal.Current.Identity.Name`.

## 2. File Attachment Storage
* **Local State:** Attachments are written natively to the backend server's local file system (e.g., inside an `Uploads/` directory).
* **Production Pivot:**
  * Removing local disk persistence is required because modern cloud hosting (Azure App Service containers) are ephemeral—if the server restarts, local files are wiped out.
  * **Implementation:** Swap the `AttachmentRepository` logic from `File.WriteAllBytes` to utilizing the `Azure.Storage.Blobs` SDK. The database will stop storing physical file paths and instead store the Azure Blob URI.
  * Implement **Shared Access Signatures (SAS Tokens)**: Instead of the .NET API piping the file bytes back to React, the API should generate a secure, 5-minute SAS token URL that React uses to download the file directly from Azure Storage.

## 3. Database & Secret Management
* **Local State:** EF Core uses a hardcoded PostgreSQL connection string in `appsettings.Development.json`. Auto-migrations (`dbContext.Database.Migrate()`) execute automatically on startup.
* **Production Pivot:**
  * **Secrets:** The database credentials and Entra ID Client Secrets must never exist in code. They must be moved into **Azure Key Vault**. The app should authenticate to the Key Vault using a Managed Identity.
  * **Migrations:** Auto-migrating on API startup is dangerous in production. Migrations should be generated as idempotent SQL scripts during the CI/CD pipeline (e.g., GitHub Actions or Azure DevOps) and applied to the database before the new code is deployed.
  * **Persistence:** The local PostgreSQL docker instance must be swapped for **Azure Database for PostgreSQL - Flexible Server**.

## 4. Frontend Delivery
* **Local State:** The React application is served by the Vite development server (`npm run dev`) on `localhost`.
* **Production Pivot:**
  * The React app must be built into static HTML/JS/CSS assets (`npm run build`).
  * Those static assets are then deployed to a CDN-backed hosting service, such as **Azure Static Web Apps** or **AWS S3/CloudFront**, for global distribution and caching.
