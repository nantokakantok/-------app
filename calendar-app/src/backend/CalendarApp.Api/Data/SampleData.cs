using CalendarApp.Api.Models;

namespace CalendarApp.Api.Data
{
    /// <summary>
    /// サンプルデータの提供クラス
    /// データベースが利用できない場合やデモ用途で使用します
    /// </summary>
    public static class SampleData
    {
        /// <summary>
        /// サンプルの予定データを生成します
        /// 開発・テスト・デモ用途で使用するダミーデータです
        /// </summary>
        /// <returns>サンプルの予定一覧</returns>
        public static List<CalendarEvent> GetSampleEvents()
        {
            var baseDate = DateTime.Today; // 今日を基準日とする
            var events = new List<CalendarEvent>();

            // 今日の予定
            events.Add(new CalendarEvent
            {
                Id = 1,
                Title = "チーム定例会議",
                Description = "週次の進捗確認とタスク振り分けを行います。参加者：開発チーム全員",
                StartTime = baseDate.AddHours(10), // 今日の10:00
                EndTime = baseDate.AddHours(11),   // 今日の11:00
                Location = "会議室A",
                Category = "会議",
                Color = "#FF5722", // 赤色
                CreatedBy = "manager@example.com",
                CreatedAt = DateTime.UtcNow.AddDays(-3),
                UpdatedAt = DateTime.UtcNow.AddDays(-1)
            });

            events.Add(new CalendarEvent
            {
                Id = 2,
                Title = "コードレビュー",
                Description = "新機能のプルリクエストレビューとディスカッション",
                StartTime = baseDate.AddHours(14), // 今日の14:00
                EndTime = baseDate.AddHours(15),   // 今日の15:00
                Location = "オンライン（Teams）",
                Category = "開発",
                Color = "#4CAF50", // 緑色
                CreatedBy = "developer@example.com",
                CreatedAt = DateTime.UtcNow.AddDays(-2),
                UpdatedAt = DateTime.UtcNow.AddDays(-2)
            });

            // 明日の予定
            events.Add(new CalendarEvent
            {
                Id = 3,
                Title = "プロジェクト企画会議",
                Description = "新プロジェクトの要件定義と工数見積もりについて議論します",
                StartTime = baseDate.AddDays(1).AddHours(9),  // 明日の9:00
                EndTime = baseDate.AddDays(1).AddHours(10.5), // 明日の10:30
                Location = "会議室B",
                Category = "企画",
                Color = "#9C27B0", // 紫色
                CreatedBy = "planner@example.com",
                CreatedAt = DateTime.UtcNow.AddDays(-1),
                UpdatedAt = DateTime.UtcNow.AddDays(-1)
            });

            events.Add(new CalendarEvent
            {
                Id = 4,
                Title = "研修参加",
                Description = "最新技術トレンドに関するオンライン研修に参加",
                StartTime = baseDate.AddDays(1).AddHours(13), // 明日の13:00
                EndTime = baseDate.AddDays(1).AddHours(17),   // 明日の17:00
                Location = "各自デスク",
                Category = "研修",
                Color = "#FF9800", // オレンジ色
                CreatedBy = "hr@example.com",
                CreatedAt = DateTime.UtcNow.AddDays(-5),
                UpdatedAt = DateTime.UtcNow.AddDays(-5)
            });

            // 来週の予定
            events.Add(new CalendarEvent
            {
                Id = 5,
                Title = "クライアント打ち合わせ",
                Description = "プロジェクトの進捗報告と次フェーズの要件確認",
                StartTime = baseDate.AddDays(7).AddHours(10), // 来週の10:00
                EndTime = baseDate.AddDays(7).AddHours(12),   // 来週の12:00
                Location = "クライアント事務所",
                Category = "商談",
                Color = "#2196F3", // 青色
                CreatedBy = "sales@example.com",
                CreatedAt = DateTime.UtcNow.AddDays(-10),
                UpdatedAt = DateTime.UtcNow.AddDays(-3)
            });

            // 終日予定のサンプル
            events.Add(new CalendarEvent
            {
                Id = 6,
                Title = "会社設立記念日",
                Description = "全社的な記念イベント。特別な作業は予定されていません。",
                StartTime = baseDate.AddDays(14), // 2週間後
                EndTime = baseDate.AddDays(14).AddHours(23).AddMinutes(59), // 2週間後の終日
                IsAllDay = true,
                Location = "全社",
                Category = "イベント",
                Color = "#795548", // 茶色
                CreatedBy = "admin@example.com",
                CreatedAt = DateTime.UtcNow.AddDays(-30),
                UpdatedAt = DateTime.UtcNow.AddDays(-30)
            });

            // 過去の予定（履歴として）
            events.Add(new CalendarEvent
            {
                Id = 7,
                Title = "月次レポート作成",
                Description = "先月の業績レポートを作成し、上長に提出しました",
                StartTime = baseDate.AddDays(-3).AddHours(15), // 3日前の15:00
                EndTime = baseDate.AddDays(-3).AddHours(17),   // 3日前の17:00
                Location = "自席",
                Category = "作業",
                Color = "#607D8B", // グレー
                CreatedBy = "analyst@example.com",
                CreatedAt = DateTime.UtcNow.AddDays(-7),
                UpdatedAt = DateTime.UtcNow.AddDays(-4)
            });

            // 長期プロジェクト
            events.Add(new CalendarEvent
            {
                Id = 8,
                Title = "システム移行作業",
                Description = "レガシーシステムから新システムへの移行作業を実施",
                StartTime = baseDate.AddDays(21).AddHours(9), // 3週間後の9:00
                EndTime = baseDate.AddDays(21).AddHours(18),  // 3週間後の18:00
                Location = "データセンター",
                Category = "システム",
                Color = "#3F51B5", // インディゴ
                CreatedBy = "system@example.com",
                CreatedAt = DateTime.UtcNow.AddDays(-15),
                UpdatedAt = DateTime.UtcNow.AddDays(-5)
            });

            return events;
        }

        /// <summary>
        /// 指定された期間のサンプルイベントを取得します
        /// </summary>
        /// <param name="startDate">開始日</param>
        /// <param name="endDate">終了日</param>
        /// <returns>指定期間内の予定一覧</returns>
        public static List<CalendarEvent> GetSampleEventsInRange(DateTime startDate, DateTime endDate)
        {
            var allEvents = GetSampleEvents();
            
            // 指定された期間内のイベントをフィルタリング
            return allEvents.Where(e => 
                e.StartTime.Date >= startDate.Date && 
                e.StartTime.Date <= endDate.Date &&
                !e.IsDeleted
            ).ToList();
        }

        /// <summary>
        /// カテゴリ別の色設定を取得します
        /// </summary>
        /// <returns>カテゴリ名と色のマッピング</returns>
        public static Dictionary<string, string> GetCategoryColors()
        {
            return new Dictionary<string, string>
            {
                { "会議", "#FF5722" },    // 赤色
                { "開発", "#4CAF50" },    // 緑色
                { "企画", "#9C27B0" },    // 紫色
                { "研修", "#FF9800" },    // オレンジ色
                { "商談", "#2196F3" },    // 青色
                { "イベント", "#795548" }, // 茶色
                { "作業", "#607D8B" },    // グレー
                { "システム", "#3F51B5" }, // インディゴ
                { "個人", "#E91E63" },    // ピンク色
                { "その他", "#9E9E9E" }   // グレー
            };
        }
    }
}
