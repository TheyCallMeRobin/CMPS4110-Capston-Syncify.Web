using AutoMapper;

namespace Syncify.Web.Server.Features.FamilyMembers;

public record FamilyMemberDto
{
    public int FamilyId { get; set; }
    public int UserId { get; set; }
}

public record FamilyMemberGetDto : FamilyMemberDto
{
    public int Id { get; set; }
    public string UserFirstName { get; set; } = string.Empty;
    public string UserLastName { get; set; } = string.Empty;
    public FamilyMemberRole Role { get; set; }
}

public record ChangeMemberRoleDto(int familyMemberId, FamilyMemberRole Role);

public class FamilyMemberMappingProfile : Profile
{
    public FamilyMemberMappingProfile()
    {
        CreateMap<FamilyMember, FamilyMemberGetDto>();
    }
}