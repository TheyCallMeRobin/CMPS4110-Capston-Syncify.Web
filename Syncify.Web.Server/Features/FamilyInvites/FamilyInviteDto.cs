using System.Text.Json.Serialization;
using AutoMapper;
using FluentValidation;

namespace Syncify.Web.Server.Features.FamilyInvites;

public record FamilyInviteDto
{
    public int FamilyId { get; set; }
    public DateTime? ExpiresOn { get; set; }
}

public record FamilyInviteCreateDto : FamilyInviteDto
{
    [JsonIgnore]
    public int SentByUserId { get; set; }
}

public record FamilyInviteGetDto : FamilyInviteDto
{
    public int Id { get; set; }
    public int SentByUserId { get; set; }
    public int UserId { get; set; }
    public string SentByUserFirstName { get; set; } = string.Empty;
    public string SentByUserLastName { get; set; } = string.Empty;
    public string FamilyName { get; set; } = string.Empty;
    public string UserFirstName { get; set; } = string.Empty;
    public string UserLastName { get; set; } = string.Empty;
    public InviteStatus Status { get; set; } = InviteStatus.Pending;
}

public record ChangeInviteStatusDto(int Id, InviteStatus Status);

public record CreateFamilyInviteQuery(string? Email, string? MemberIdentifier, string? PhoneNumber);


public class FamilyInviteMappingProfile : Profile
{
    public FamilyInviteMappingProfile()
    {
        CreateMap<FamilyInvite, FamilyInviteGetDto>();
        CreateMap<FamilyInviteCreateDto, FamilyInvite>();
    }
}

public class FamilyInviteDtoValidator : AbstractValidator<FamilyInviteDto>
{
    public FamilyInviteDtoValidator()
    {
        RuleFor(x => x.ExpiresOn)
            .GreaterThan(DateTime.UtcNow)
            .When(x => x.ExpiresOn.HasValue);
    }
}

public class FamilyInviteCreateDtoValidator : AbstractValidator<FamilyInviteCreateDto>
{
    public FamilyInviteCreateDtoValidator()
    {
        Include(new FamilyInviteDtoValidator());
        
    }
}