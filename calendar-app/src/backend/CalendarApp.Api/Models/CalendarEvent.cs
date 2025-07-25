using System.ComponentModel.DataAnnotations;

namespace CalendarApp.Api.Models
{
    /// <summary>
    /// カレンダーイベント（予定）を表すエンティティクラス
    /// 各予定の基本情報を格納します
    /// </summary>
    public class CalendarEvent
    {
        /// <summary>
        /// 予定の一意識別子（プライマリキー）
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// 予定のタイトル（必須項目）
        /// 例: "会議", "プレゼンテーション"
        /// </summary>
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        /// <summary>
        /// 予定の詳細説明（オプション）
        /// </summary>
        [StringLength(1000)]
        public string? Description { get; set; }

        /// <summary>
        /// 予定の開始日時（必須）
        /// </summary>
        [Required]
        public DateTime StartTime { get; set; }

        /// <summary>
        /// 予定の終了日時（必須）
        /// </summary>
        [Required]
        public DateTime EndTime { get; set; }

        /// <summary>
        /// 予定の場所（オプション）
        /// 例: "会議室A", "オンライン", "東京オフィス"
        /// </summary>
        [StringLength(200)]
        public string? Location { get; set; }

        /// <summary>
        /// 終日予定かどうかのフラグ
        /// true: 終日予定, false: 時間指定予定
        /// </summary>
        public bool IsAllDay { get; set; }

        /// <summary>
        /// 予定のカテゴリ（将来の拡張用）
        /// 例: "会議", "個人用", "プロジェクト"
        /// </summary>
        [StringLength(50)]
        public string? Category { get; set; }

        /// <summary>
        /// 予定の色（UI表示用）
        /// 16進数カラーコード形式: #FF0000
        /// </summary>
        [StringLength(7)]
        public string Color { get; set; } = "#2196F3"; // デフォルトは青色

        /// <summary>
        /// 予定作成者のメールアドレス（将来の認証機能用）
        /// </summary>
        [StringLength(100)]
        public string? CreatedBy { get; set; }

        /// <summary>
        /// 予定作成日時（自動設定）
        /// </summary>
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// 予定更新日時（自動更新）
        /// </summary>
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// 予定が削除されているかのフラグ（論理削除用）
        /// true: 削除済み, false: 有効
        /// </summary>
        public bool IsDeleted { get; set; } = false;
    }
}
