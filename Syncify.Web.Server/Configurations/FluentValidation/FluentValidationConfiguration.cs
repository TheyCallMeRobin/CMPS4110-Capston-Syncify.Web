using FluentValidation;
using SharpGrip.FluentValidation.AutoValidation.Mvc.Extensions;
using System.Reflection;

namespace Syncify.Web.Server.Configurations.FluentValidation;

public class FluentValidationConfiguration
{
    public static void ConfigureServices(IServiceCollection services)
    {
        SetOptions();

        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

        services.AddFluentValidationAutoValidation(options =>
        {
            options.DisableBuiltInModelValidation = true;
            options.OverrideDefaultResultFactoryWith<ValidationResultFactory>();
        });
    }

    private static void SetOptions()
    {
        ValidatorOptions.Global.DefaultClassLevelCascadeMode = CascadeMode.Stop;
        ValidatorOptions.Global.DefaultRuleLevelCascadeMode = CascadeMode.Stop;
    }
}