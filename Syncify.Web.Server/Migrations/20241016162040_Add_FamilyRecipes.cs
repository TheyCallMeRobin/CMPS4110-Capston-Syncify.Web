using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Syncify.Web.Server.Migrations
{
    /// <inheritdoc />
    public partial class Add_FamilyRecipes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.CreateTable(
                name: "FamilyRecipes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FamiyId = table.Column<int>(type: "int", nullable: false),
                    RecipeId = table.Column<int>(type: "int", nullable: false),
                    CreatedByUserId = table.Column<int>(type: "int", nullable: false),
                    FamilyId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FamilyRecipes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FamilyRecipes_AspNetUsers_CreatedByUserId",
                        column: x => x.CreatedByUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_FamilyRecipes_Families_FamilyId",
                        column: x => x.FamilyId,
                        principalTable: "Families",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FamilyRecipes_Recipes_RecipeId",
                        column: x => x.RecipeId,
                        principalTable: "Recipes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FamilyRecipes_CreatedByUserId",
                table: "FamilyRecipes",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_FamilyRecipes_FamilyId",
                table: "FamilyRecipes",
                column: "FamilyId");

            migrationBuilder.CreateIndex(
                name: "IX_FamilyRecipes_RecipeId",
                table: "FamilyRecipes",
                column: "RecipeId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FamilyRecipes");
        }
    }
}
