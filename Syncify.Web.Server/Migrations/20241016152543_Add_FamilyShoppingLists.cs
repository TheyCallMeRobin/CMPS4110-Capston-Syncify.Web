using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Syncify.Web.Server.Migrations
{
    /// <inheritdoc />
    public partial class Add_FamilyShoppingLists : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "FamilyShoppingLists",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FamilyId = table.Column<int>(type: "int", nullable: false),
                    ShoppingListId = table.Column<int>(type: "int", nullable: false),
                    CreatedByUserId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FamilyShoppingLists", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FamilyShoppingLists_AspNetUsers_CreatedByUserId",
                        column: x => x.CreatedByUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_FamilyShoppingLists_Families_FamilyId",
                        column: x => x.FamilyId,
                        principalTable: "Families",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FamilyShoppingLists_ShoppingLists_ShoppingListId",
                        column: x => x.ShoppingListId,
                        principalTable: "ShoppingLists",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FamilyShoppingLists_CreatedByUserId",
                table: "FamilyShoppingLists",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_FamilyShoppingLists_FamilyId",
                table: "FamilyShoppingLists",
                column: "FamilyId");

            migrationBuilder.CreateIndex(
                name: "IX_FamilyShoppingLists_ShoppingListId",
                table: "FamilyShoppingLists",
                column: "ShoppingListId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FamilyShoppingLists");
        }
    }
}
