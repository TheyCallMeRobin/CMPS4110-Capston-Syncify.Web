using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Syncify.Web.Server.Migrations
{
    /// <inheritdoc />
    public partial class Add_Recurrence_Rule_Fields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "RecurrenceException",
                table: "CalendarEvents",
                type: "nvarchar(max)",
                maxLength: 100000,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "RecurrenceId",
                table: "CalendarEvents",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RecurrenceException",
                table: "CalendarEvents");

            migrationBuilder.DropColumn(
                name: "RecurrenceId",
                table: "CalendarEvents");
        }
    }
}
