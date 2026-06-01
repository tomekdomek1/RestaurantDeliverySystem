using System;

namespace UberEats.Domain.Constants;

public static class ReviewConstants
{
    public const int RatingCutoffMonths = 3;
    
    public static DateTime GetReviewCutoffDate() => DateTime.UtcNow.AddMonths(-RatingCutoffMonths);
}
