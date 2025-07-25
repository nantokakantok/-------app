using CalendarApp.Api.Data;
using CalendarApp.Api.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// CORS設定（フロントエンドからのAPIアクセスを許可）
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:5173") // React開発サーバーのポート
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// データベース接続設定
// PostgreSQLが利用できない場合はサンプルデータモードで動作
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (!string.IsNullOrEmpty(connectionString))
{
    try
    {
        builder.Services.AddDbContext<CalendarDbContext>(options =>
            options.UseNpgsql(connectionString));
    }
    catch (Exception ex)
    {
        // データベース接続に失敗した場合のログ出力
        Console.WriteLine($"データベース接続に失敗しました: {ex.Message}");
        Console.WriteLine("サンプルデータモードで動作します。");
    }
}

// サービスの依存性注入
builder.Services.AddScoped<ICalendarEventService, CalendarEventService>();

// コントローラーとSwagger設定
builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// ログ設定
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();

var app = builder.Build();

// データベース初期化（開発環境のみ）
if (app.Environment.IsDevelopment())
{
    try
    {
        using var scope = app.Services.CreateScope();
        var context = scope.ServiceProvider.GetService<CalendarDbContext>();
        if (context != null)
        {
            // データベースが存在しない場合は作成
            context.Database.EnsureCreated();
            Console.WriteLine("データベースの初期化が完了しました。");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"データベース初期化中にエラーが発生しました: {ex.Message}");
        Console.WriteLine("サンプルデータモードで動作します。");
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    // Swagger UIも追加
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/openapi/v1.json", "Calendar API v1");
        c.RoutePrefix = "swagger"; // Swagger UIのパスを /swagger に設定
    });
}

// CORS を有効化（認証より前に配置）
app.UseCors("AllowReactApp");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

// アプリケーション起動ログ
app.Logger.LogInformation("カレンダーAPIアプリケーションが起動しました");
app.Logger.LogInformation("Swagger UI: {SwaggerUrl}", app.Environment.IsDevelopment() ? "https://localhost:7000/swagger" : "未使用");

app.Run();
