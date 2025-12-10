using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Data.Common;

namespace UberEats.WebApi.Middlewares;

public sealed class GlobalExceptionHandler(IProblemDetailsService problemDetailsService,
                                           ILogger<GlobalExceptionHandler> logger,
                                           IHostEnvironment env) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext,
                                                Exception exception,
                                                CancellationToken cancellationToken)
    {
        logger.LogError(exception, "Unhandled exception occurred");

        var status = exception switch
        {
            ApplicationException => StatusCodes.Status400BadRequest,
            UnauthorizedAccessException => StatusCodes.Status401Unauthorized,
            KeyNotFoundException => StatusCodes.Status404NotFound,
            DbUpdateConcurrencyException => StatusCodes.Status409Conflict,
            DbUpdateException => StatusCodes.Status503ServiceUnavailable,
            DbException => StatusCodes.Status503ServiceUnavailable,
            TimeoutException => StatusCodes.Status504GatewayTimeout,
            _ => StatusCodes.Status500InternalServerError
        };

        var problemDetails = new ProblemDetails
        {
            Type = exception.GetType().Name,
            Title = "An error occurred",
            Status = status,
            Detail = env.IsDevelopment()
                ? exception.Message
                : "Unexpected error. Try again Later.",
            Instance = httpContext.Request.Path

        };

        return await problemDetailsService.TryWriteAsync(new ProblemDetailsContext
        {
            HttpContext = httpContext,
            Exception = exception,
            ProblemDetails = problemDetails,
        });
    }
}
