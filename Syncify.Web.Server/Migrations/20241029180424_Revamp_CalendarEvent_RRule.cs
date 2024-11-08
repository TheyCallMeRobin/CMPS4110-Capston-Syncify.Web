using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Syncify.Web.Server.Migrations
{
    /// <inheritdoc />
    public partial class Revamp_CalendarEvent_RRule : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DELETE FROM [dbo].[Calendars]");

            migrationBuilder.DropColumn(
                name: "RecurrenceEndDate",
                table: "CalendarEvents");

            migrationBuilder.DropColumn(
                name: "RecurrenceType",
                table: "CalendarEvents");

            migrationBuilder.RenameColumn(
                name: "RecurrenceWeekDays",
                table: "CalendarEvents",
                newName: "RecurrenceRule");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "RecurrenceRule",
                table: "CalendarEvents",
                newName: "RecurrenceWeekDays");

            migrationBuilder.AddColumn<DateOnly>(
                name: "RecurrenceEndDate",
                table: "CalendarEvents",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "RecurrenceType",
                table: "CalendarEvents",
                type: "int",
                nullable: true);
        }
    }
}
