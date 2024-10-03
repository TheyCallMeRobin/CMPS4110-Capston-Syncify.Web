using System.Text.Json.Serialization;
using AutoMapper;
using FluentValidation;

namespace Syncify.Web.Server.Features.Groups;

public record GroupDto
{
    public string Name { get; set; } = string.Empty;
}

public record GroupGetDto(int Id, string Identifier, int CreatedByUserId) : GroupDto;

public record GroupCreateDto([property: JsonIgnore] int CreatedByUserId) : GroupDto;

public record GroupUpdateDto : GroupDto;

public class GroupMappingProfile : Profile
{
    public GroupMappingProfile()
    {
        CreateMap<Group, GroupGetDto>();
        CreateMap<GroupCreateDto, Group>();
        CreateMap<GroupUpdateDto, Group>();
    }
}

public class GroupDtoValidator : AbstractValidator<GroupDto>
{
    public GroupDtoValidator()
    {
        RuleFor(x => x.Name)
            .MaximumLength(GroupEntityConfiguration.NameMaxLength)
            .NotEmpty();
    }
}

public class GroupCreateDtoValidator : AbstractValidator<GroupCreateDto>
{
    public GroupCreateDtoValidator()
    {
        Include(new GroupDtoValidator());
    }
}

public class GroupUpdateDtoValidator : AbstractValidator<GroupUpdateDto>
{
    public GroupUpdateDtoValidator()
    {
        Include(new GroupDtoValidator());
    }
}