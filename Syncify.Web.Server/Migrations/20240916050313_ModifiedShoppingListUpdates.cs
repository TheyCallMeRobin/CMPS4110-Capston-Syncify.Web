using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Syncify.Web.Server.Migrations
{
    /// <inheritdoc />
    public partial class ModifiedShoppingListUpdates : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Drop the foreign key constraint between ShoppingItems and AspNetUsers
            migrationBuilder.DropForeignKey(
                name: "FK_ShoppingItems_AspNetUsers_UserId",
                table: "ShoppingItems");

            // Drop the UserId column entirely
            migrationBuilder.DropColumn(
                name: "UserId",
                table: "ShoppingItems");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Re-add the UserId column if needed when rolling back the migration
            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "ShoppingItems",
                type: "int",
                nullable: false,
                defaultValue: 0);

            // Restore the foreign key relationship between ShoppingItems and AspNetUsers
            migrationBuilder.AddForeignKey(
                name: "FK_ShoppingItems_AspNetUsers_UserId",
                table: "ShoppingItems",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
