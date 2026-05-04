using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UberEats.Infrastructure.Databases.Migrations
{
    /// <inheritdoc />
    public partial class AddRestaurantReviewsListingIndex : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_RestaurantReviews_RestaurantId_CreatedAt",
                table: "RestaurantReviews",
                columns: new[] { "RestaurantId", "CreatedAt" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_RestaurantReviews_RestaurantId_CreatedAt",
                table: "RestaurantReviews");
        }
    }
}
