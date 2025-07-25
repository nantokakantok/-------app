using CalendarApp.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace CalendarApp.Api.Data
{
    /// <summary>
    /// カレンダーアプリケーション用のデータベースコンテキスト
    /// Entity Framework Coreを使用してデータベースとの接続を管理します
    /// </summary>
    public class CalendarDbContext : DbContext
    {
        /// <summary>
        /// コンストラクター - DbContextOptionsを受け取ります
        /// DI（依存性注入）によってオプションが注入されます
        /// </summary>
        public CalendarDbContext(DbContextOptions<CalendarDbContext> options) : base(options)
        {
        }

        /// <summary>
        /// カレンダーイベント（予定）のDbSet
        /// データベースのEventsテーブルにマッピングされます
        /// </summary>
        public DbSet<CalendarEvent> Events { get; set; }

        /// <summary>
        /// モデル作成時の設定を行います
        /// データベーステーブルの構造やインデックス、制約を定義します
        /// </summary>
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // CalendarEventエンティティの設定
            modelBuilder.Entity<CalendarEvent>(entity =>
            {
                // テーブル名の設定
                entity.ToTable("Events");

                // プライマリキーの設定
                entity.HasKey(e => e.Id);

                // プロパティの設定
                entity.Property(e => e.Title)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.Property(e => e.Description)
                    .HasMaxLength(1000);

                entity.Property(e => e.Location)
                    .HasMaxLength(200);

                entity.Property(e => e.Category)
                    .HasMaxLength(50);

                entity.Property(e => e.Color)
                    .HasMaxLength(7)
                    .HasDefaultValue("#2196F3");

                entity.Property(e => e.CreatedBy)
                    .HasMaxLength(100);

                entity.Property(e => e.CreatedAt)
                    .HasDefaultValueSql("CURRENT_TIMESTAMP"); // PostgreSQL用

                entity.Property(e => e.UpdatedAt)
                    .HasDefaultValueSql("CURRENT_TIMESTAMP"); // PostgreSQL用

                // インデックスの設定（検索パフォーマンス向上のため）
                entity.HasIndex(e => e.StartTime)
                    .HasDatabaseName("IX_Events_StartTime");

                entity.HasIndex(e => e.EndTime)
                    .HasDatabaseName("IX_Events_EndTime");

                entity.HasIndex(e => e.CreatedBy)
                    .HasDatabaseName("IX_Events_CreatedBy");

                entity.HasIndex(e => e.IsDeleted)
                    .HasDatabaseName("IX_Events_IsDeleted");

                // 複合インデックス（日付範囲検索用）
                entity.HasIndex(e => new { e.StartTime, e.EndTime })
                    .HasDatabaseName("IX_Events_DateRange");
            });
        }

        /// <summary>
        /// エンティティの保存前処理
        /// UpdatedAtの自動更新を行います
        /// </summary>
        public override int SaveChanges()
        {
            UpdateTimestamps();
            return base.SaveChanges();
        }

        /// <summary>
        /// エンティティの非同期保存前処理
        /// UpdatedAtの自動更新を行います
        /// </summary>
        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            UpdateTimestamps();
            return await base.SaveChangesAsync(cancellationToken);
        }

        /// <summary>
        /// タイムスタンプの更新処理
        /// 新規作成時はCreatedAt、更新時はUpdatedAtを現在時刻に設定
        /// </summary>
        private void UpdateTimestamps()
        {
            var entries = ChangeTracker.Entries<CalendarEvent>();

            foreach (var entry in entries)
            {
                switch (entry.State)
                {
                    case EntityState.Added:
                        entry.Entity.CreatedAt = DateTime.UtcNow;
                        entry.Entity.UpdatedAt = DateTime.UtcNow;
                        break;

                    case EntityState.Modified:
                        entry.Entity.UpdatedAt = DateTime.UtcNow;
                        // CreatedAtは変更しない
                        entry.Property(e => e.CreatedAt).IsModified = false;
                        break;
                }
            }
        }
    }
}
