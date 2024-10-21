using AutoMapper;
using FluentValidation;
using Syncify.Web.Server.Extensions;

namespace Syncify.Web.Server.Features.Authorization;

public record UserDto
{
    public int Id { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string[] Roles { get; set; } = [];
    public string ProfileColor { get; set; } = string.Empty;
}

public record UserGetDto : UserDto
{
}

public record CreateUserDto
{
    public required string UserName { get; set; }
    public required string Password { get; set; }
    public required string Email { get; set; }
    public required string PhoneNumber { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }

    public IEnumerable<string> Roles { get; set; } = [];
}

public class UserMappingProfile : Profile
{
    public UserMappingProfile()
    {
        CreateMap<User, UserGetDto>()
            .ForMember(x => x.Roles, opts => opts.MapFrom(src => src.UserRoles.Select(x => x.Role.Name)));
        CreateMap<CreateUserDto, User>();
    }
}

public class CreateUserDtoValidator : AbstractValidator<CreateUserDto>
{
    public CreateUserDtoValidator()
    {
        RuleFor(x => x.FirstName).NotEmpty();
        RuleFor(x => x.LastName).NotEmpty();
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.PhoneNumber).NotEmpty();
        RuleFor(x => x.Password).NotEmpty().MinimumLength(8).HasSpecialCharacters();
        RuleFor(x => x.UserName).NotEmpty();
    }
}

