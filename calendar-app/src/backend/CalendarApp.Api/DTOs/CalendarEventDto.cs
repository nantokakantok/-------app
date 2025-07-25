using System.ComponentModel.DataAnnotations;

namespace CalendarApp.Api.DTOs
{
    /// <summary>
    /// カレンダーイベントのレスポンス用DTO
    /// APIからクライアントに返すデータの形式を定義します
    /// </summary>
    public class CalendarEventResponseDto
    {
        /// <summary>
        /// 予定の一意識別子
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// 予定のタイトル
        /// </summary>
        public string Title { get; set; } = string.Empty;

        /// <summary>
        /// 予定の詳細説明
        /// </summary>
        public string? Description { get; set; }

        /// <summary>
        /// 予定の開始日時（ISO 8601形式）
        /// </summary>
        public DateTime StartTime { get; set; }

        /// <summary>
        /// 予定の終了日時（ISO 8601形式）
        /// </summary>
        public DateTime EndTime { get; set; }

        /// <summary>
        /// 予定の場所
        /// </summary>
        public string? Location { get; set; }

        /// <summary>
        /// 終日予定かどうかのフラグ
        /// </summary>
        public bool IsAllDay { get; set; }

        /// <summary>
        /// 予定のカテゴリ
        /// </summary>
        public string? Category { get; set; }

        /// <summary>
        /// 予定の表示色（16進数カラーコード）
        /// </summary>
        public string Color { get; set; } = "#2196F3";

        /// <summary>
        /// 予定作成者のメールアドレス
        /// </summary>
        public string? CreatedBy { get; set; }

        /// <summary>
        /// 予定作成日時
        /// </summary>
        public DateTime CreatedAt { get; set; }

        /// <summary>
        /// 予定更新日時
        /// </summary>
        public DateTime UpdatedAt { get; set; }
    }

    /// <summary>
    /// カレンダーイベント作成用のリクエストDTO
    /// 新しい予定を作成する際にクライアントから送信されるデータ
    /// </summary>
    public class CalendarEventCreateDto
    {
        /// <summary>
        /// 予定のタイトル（必須）
        /// </summary>
        [Required(ErrorMessage = "タイトルは必須です")]
        [StringLength(200, ErrorMessage = "タイトルは200文字以内で入力してください")]
        public string Title { get; set; } = string.Empty;

        /// <summary>
        /// 予定の詳細説明（オプション）
        /// </summary>
        [StringLength(1000, ErrorMessage = "説明は1000文字以内で入力してください")]
        public string? Description { get; set; }

        /// <summary>
        /// 予定の開始日時（必須）
        /// </summary>
        [Required(ErrorMessage = "開始日時は必須です")]
        public DateTime StartTime { get; set; }

        /// <summary>
        /// 予定の終了日時（必須）
        /// </summary>
        [Required(ErrorMessage = "終了日時は必須です")]
        public DateTime EndTime { get; set; }

        /// <summary>
        /// 予定の場所（オプション）
        /// </summary>
        [StringLength(200, ErrorMessage = "場所は200文字以内で入力してください")]
        public string? Location { get; set; }

        /// <summary>
        /// 終日予定かどうかのフラグ
        /// デフォルトはfalse（時間指定予定）
        /// </summary>
        public bool IsAllDay { get; set; } = false;

        /// <summary>
        /// 予定のカテゴリ（オプション）
        /// </summary>
        [StringLength(50, ErrorMessage = "カテゴリは50文字以内で入力してください")]
        public string? Category { get; set; }

        /// <summary>
        /// 予定の表示色（16進数カラーコード）
        /// デフォルトは青色
        /// </summary>
        [StringLength(7, ErrorMessage = "色は#ffffffの形式で入力してください")]
        [RegularExpression(@"^#[0-9A-Fa-f]{6}$", ErrorMessage = "色は#ffffffの形式で入力してください")]
        public string Color { get; set; } = "#2196F3";

        /// <summary>
        /// 予定作成者のメールアドレス（オプション、将来の認証機能用）
        /// </summary>
        [StringLength(100, ErrorMessage = "作成者は100文字以内で入力してください")]
        [EmailAddress(ErrorMessage = "有効なメールアドレスを入力してください")]
        public string? CreatedBy { get; set; }

        /// <summary>
        /// バリデーション：終了日時が開始日時より後であることを確認
        /// </summary>
        public bool IsValidDateRange()
        {
            return EndTime > StartTime;
        }
    }

    /// <summary>
    /// カレンダーイベント更新用のリクエストDTO
    /// 既存の予定を更新する際にクライアントから送信されるデータ
    /// </summary>
    public class CalendarEventUpdateDto
    {
        /// <summary>
        /// 予定のタイトル（必須）
        /// </summary>
        [Required(ErrorMessage = "タイトルは必須です")]
        [StringLength(200, ErrorMessage = "タイトルは200文字以内で入力してください")]
        public string Title { get; set; } = string.Empty;

        /// <summary>
        /// 予定の詳細説明（オプション）
        /// </summary>
        [StringLength(1000, ErrorMessage = "説明は1000文字以内で入力してください")]
        public string? Description { get; set; }

        /// <summary>
        /// 予定の開始日時（必須）
        /// </summary>
        [Required(ErrorMessage = "開始日時は必須です")]
        public DateTime StartTime { get; set; }

        /// <summary>
        /// 予定の終了日時（必須）
        /// </summary>
        [Required(ErrorMessage = "終了日時は必須です")]
        public DateTime EndTime { get; set; }

        /// <summary>
        /// 予定の場所（オプション）
        /// </summary>
        [StringLength(200, ErrorMessage = "場所は200文字以内で入力してください")]
        public string? Location { get; set; }

        /// <summary>
        /// 終日予定かどうかのフラグ
        /// </summary>
        public bool IsAllDay { get; set; }

        /// <summary>
        /// 予定のカテゴリ（オプション）
        /// </summary>
        [StringLength(50, ErrorMessage = "カテゴリは50文字以内で入力してください")]
        public string? Category { get; set; }

        /// <summary>
        /// 予定の表示色（16進数カラーコード）
        /// </summary>
        [StringLength(7, ErrorMessage = "色は#ffffffの形式で入力してください")]
        [RegularExpression(@"^#[0-9A-Fa-f]{6}$", ErrorMessage = "色は#ffffffの形式で入力してください")]
        public string Color { get; set; } = "#2196F3";

        /// <summary>
        /// バリデーション：終了日時が開始日時より後であることを確認
        /// </summary>
        public bool IsValidDateRange()
        {
            return EndTime > StartTime;
        }
    }

    /// <summary>
    /// カレンダーイベント検索用のクエリパラメータDTO
    /// 特定の期間や条件で予定を検索する際に使用
    /// </summary>
    public class CalendarEventSearchDto
    {
        /// <summary>
        /// 検索開始日（オプション）
        /// 指定しない場合は今日から1ヶ月前
        /// </summary>
        public DateTime? StartDate { get; set; }

        /// <summary>
        /// 検索終了日（オプション）
        /// 指定しない場合は今日から1ヶ月後
        /// </summary>
        public DateTime? EndDate { get; set; }

        /// <summary>
        /// カテゴリでのフィルタリング（オプション）
        /// </summary>
        public string? Category { get; set; }

        /// <summary>
        /// 作成者でのフィルタリング（オプション）
        /// </summary>
        public string? CreatedBy { get; set; }

        /// <summary>
        /// タイトルでの部分検索（オプション）
        /// </summary>
        public string? TitleSearch { get; set; }

        /// <summary>
        /// デフォルトの検索期間を設定
        /// </summary>
        public void SetDefaultDateRange()
        {
            if (!StartDate.HasValue)
            {
                StartDate = DateTime.Today.AddMonths(-1);
            }

            if (!EndDate.HasValue)
            {
                EndDate = DateTime.Today.AddMonths(1);
            }
        }
    }
}
