using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Syncify.Web.Server.Migrations
{
    /// <inheritdoc />
    public partial class Update_CalendarEvents : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DELETE FROM [dbo].[CalendarEvents]");
            
            migrationBuilder.DropColumn(
                name: "EndTime",
                table: "CalendarEvents");

            migrationBuilder.DropColumn(
                name: "StartDate",
                table: "CalendarEvents");

            migrationBuilder.DropColumn(
                name: "StartTime",
                table: "CalendarEvents");

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "EndsOn",
                table: "CalendarEvents",
                type: "datetimeoffset",
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "StartsOn",
                table: "CalendarEvents",
                type: "datetimeoffset",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EndsOn",
                table: "CalendarEvents");

            migrationBuilder.DropColumn(
                name: "StartsOn",
                table: "CalendarEvents");

            migrationBuilder.AddColumn<TimeOnly>(
                name: "EndTime",
                table: "CalendarEvents",
                type: "time",
                nullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "StartDate",
                table: "CalendarEvents",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<TimeOnly>(
                name: "StartTime",
                table: "CalendarEvents",
                type: "time",
                nullable: true);
        }
    }
}
