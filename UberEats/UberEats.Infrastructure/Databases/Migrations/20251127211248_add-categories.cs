using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UberEats.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class addcategories : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "CategoryId",
                table: "Dishes",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Dishes_CategoryId",
                table: "Dishes",
                column: "CategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Dishes_Categories_CategoryId",
                table: "Dishes",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Dishes_Categories_CategoryId",
                table: "Dishes");

            migrationBuilder.DropTable(
                name: "Categories");

            migrationBuilder.DropIndex(
                name: "IX_Dishes_CategoryId",
                table: "Dishes");

            migrationBuilder.DropColumn(
                name: "CategoryId",
                table: "Dishes");
        }
    }
}
