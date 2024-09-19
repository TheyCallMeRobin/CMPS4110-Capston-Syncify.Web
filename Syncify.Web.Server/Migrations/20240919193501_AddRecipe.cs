using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Syncify.Web.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddRecipe : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Recipes",
                type: "nvarchar(256)",
                maxLength: 256,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(128)",
                oldMaxLength: 128);

            migrationBuilder.AddColumn<int>(
                name: "CookTimeInMinutes",
                table: "Recipes",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "PrepTimeInMinutes",
                table: "Recipes",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Servings",
                table: "Recipes",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CookTimeInMinutes",
                table: "Recipes");

            migrationBuilder.DropColumn(
                name: "PrepTimeInMinutes",
                table: "Recipes");

            migrationBuilder.DropColumn(
                name: "Servings",
                table: "Recipes");

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Recipes",
                type: "nvarchar(128)",
                maxLength: 128,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(256)",
                oldMaxLength: 256,
                oldNullable: true);
        }
    }
}
