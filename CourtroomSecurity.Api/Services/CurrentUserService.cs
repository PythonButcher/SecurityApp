using CourtroomSecurity.Application.Interfaces;

namespace CourtroomSecurity.Api.Services;

public class CurrentUserService : ICurrentUserService
{
    // For now, this is a mock implementation until Entra ID is fully wired up
    public string UserId => "system-admin-mock";
    public string UserEmail => "admin@courtroom.local";
    public bool IsAuthenticated => true;

    public bool HasClaim(string claimType, string claimValue)
    {
        return true; 
    }
}
