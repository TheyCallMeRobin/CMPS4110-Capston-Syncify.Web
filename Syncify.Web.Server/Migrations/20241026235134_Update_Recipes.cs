using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Syncify.Web.Server.Migrations
{
    /// <inheritdoc />
    public partial class Update_Recipes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DELETE FROM [dbo].[Recipes]");
            
            migrationBuilder.DropForeignKey(
                name: "FK_Families_AspNetUsers_UserId",
                table: "Families");

            migrationBuilder.DropForeignKey(
                name: "FK_Recipes_AspNetUsers_UserId",
                table: "Recipes");

            migrationBuilder.DropIndex(
                name: "IX_Families_UserId",
                table: "Families");

            migrationBuilder.DropColumn(
                name: "CookTimeInMinutes",
                table: "Recipes");

            migrationBuilder.DropColumn(
                name: "PrepTimeInMinutes",
                table: "Recipes");

            migrationBuilder.DropColumn(
                name: "FamiyId",
                table: "FamilyRecipes");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Families");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Recipes",
                newName: "CreatedByUserId");

            migrationBuilder.RenameIndex(
                name: "IX_Recipes_UserId",
                table: "Recipes",
                newName: "IX_Recipes_CreatedByUserId");

            migrationBuilder.AlterColumn<int>(
                name: "Servings",
                table: "Recipes",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Recipes",
                type: "nvarchar(512)",
                maxLength: 512,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(256)",
                oldMaxLength: 256,
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CookTimeInSeconds",
                table: "Recipes",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Feeds",
                table: "Recipes",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PrepTimeInSeconds",
                table: "Recipes",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "FamilyId1",
                table: "FamilyShoppingLists",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FullName",
                table: "AspNetUsers",
                type: "nvarchar(450)",
                nullable: false,
                computedColumnSql: "[FirstName] + ' ' + [LastName]");

            migrationBuilder.CreateIndex(
                name: "IX_FamilyShoppingLists_FamilyId1",
                table: "FamilyShoppingLists",
                column: "FamilyId1");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_FullName",
                table: "AspNetUsers",
                column: "FullName");

            migrationBuilder.AddForeignKey(
                name: "FK_FamilyShoppingLists_Families_FamilyId1",
                table: "FamilyShoppingLists",
                column: "FamilyId1",
                principalTable: "Families",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Recipes_AspNetUsers_CreatedByUserId",
                table: "Recipes",
                column: "CreatedByUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FamilyShoppingLists_Families_FamilyId1",
                table: "FamilyShoppingLists");

            migrationBuilder.DropForeignKey(
                name: "FK_Recipes_AspNetUsers_CreatedByUserId",
                table: "Recipes");

            migrationBuilder.DropIndex(
                name: "IX_FamilyShoppingLists_FamilyId1",
                table: "FamilyShoppingLists");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_FullName",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "FullName",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "CookTimeInSeconds",
                table: "Recipes");

            migrationBuilder.DropColumn(
                name: "Feeds",
                table: "Recipes");

            migrationBuilder.DropColumn(
                name: "PrepTimeInSeconds",
                table: "Recipes");

            migrationBuilder.DropColumn(
                name: "FamilyId1",
                table: "FamilyShoppingLists");

            migrationBuilder.RenameColumn(
                name: "CreatedByUserId",
                table: "Recipes",
                newName: "UserId");

            migrationBuilder.RenameIndex(
                name: "IX_Recipes_CreatedByUserId",
                table: "Recipes",
                newName: "IX_Recipes_UserId");

            migrationBuilder.AlterColumn<int>(
                name: "Servings",
                table: "Recipes",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Recipes",
                type: "nvarchar(256)",
                maxLength: 256,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(512)",
                oldMaxLength: 512,
                oldNullable: true);

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
                name: "FamiyId",
                table: "FamilyRecipes",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "Families",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Families_UserId",
                table: "Families",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Families_AspNetUsers_UserId",
                table: "Families",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Recipes_AspNetUsers_UserId",
                table: "Recipes",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
