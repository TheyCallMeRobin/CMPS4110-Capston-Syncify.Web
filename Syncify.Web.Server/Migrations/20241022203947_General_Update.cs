using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Syncify.Web.Server.Migrations
{
    /// <inheritdoc />
    public partial class General_Update : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateOnly>(
                name: "StartDate",
                table: "CalendarEvents",
                type: "date",
                nullable: true,
                oldClrType: typeof(DateOnly),
                oldType: "date");

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "CalendarEvents",
                type: "nvarchar(2056)",
                maxLength: 2056,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(2056)",
                oldMaxLength: 2056);

            migrationBuilder.AddColumn<bool>(
                name: "IsCompleted",
                table: "CalendarEvents",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsCompleted",
                table: "CalendarEvents");

            migrationBuilder.AlterColumn<DateOnly>(
                name: "StartDate",
                table: "CalendarEvents",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1),
                oldClrType: typeof(DateOnly),
                oldType: "date",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "CalendarEvents",
                type: "nvarchar(2056)",
                maxLength: 2056,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(2056)",
                oldMaxLength: 2056,
                oldNullable: true);
        }
    }
}
