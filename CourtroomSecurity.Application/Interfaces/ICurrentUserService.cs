using System;

namespace CourtroomSecurity.Application.Interfaces;

public interface ICurrentUserService
{
    string UserId { get; }
    string UserEmail { get; }
    bool IsAuthenticated { get; }
    bool HasClaim(string claimType, string claimValue);
}
