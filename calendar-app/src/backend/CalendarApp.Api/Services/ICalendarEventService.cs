using CalendarApp.Api.DTOs;
using CalendarApp.Api.Models;

namespace CalendarApp.Api.Services
{
    /// <summary>
    /// カレンダーイベントサービスのインターフェース
    /// ビジネスロジックの抽象化を行い、テスタビリティを向上させます
    /// </summary>
    public interface ICalendarEventService
    {
        /// <summary>
        /// 指定された期間内の予定を取得します
        /// </summary>
        /// <param name="searchDto">検索条件</param>
        /// <returns>予定のリスト</returns>
        Task<IEnumerable<CalendarEventResponseDto>> GetEventsAsync(CalendarEventSearchDto searchDto);

        /// <summary>
        /// 指定されたIDの予定を取得します
        /// </summary>
        /// <param name="id">予定ID</param>
        /// <returns>予定の詳細情報、見つからない場合はnull</returns>
        Task<CalendarEventResponseDto?> GetEventByIdAsync(int id);

        /// <summary>
        /// 新しい予定を作成します
        /// </summary>
        /// <param name="createDto">作成する予定の情報</param>
        /// <returns>作成された予定の情報</returns>
        Task<CalendarEventResponseDto> CreateEventAsync(CalendarEventCreateDto createDto);

        /// <summary>
        /// 既存の予定を更新します
        /// </summary>
        /// <param name="id">更新する予定のID</param>
        /// <param name="updateDto">更新する予定の情報</param>
        /// <returns>更新された予定の情報、見つからない場合はnull</returns>
        Task<CalendarEventResponseDto?> UpdateEventAsync(int id, CalendarEventUpdateDto updateDto);

        /// <summary>
        /// 指定されたIDの予定を削除します（論理削除）
        /// </summary>
        /// <param name="id">削除する予定のID</param>
        /// <returns>削除に成功した場合はtrue、見つからない場合はfalse</returns>
        Task<bool> DeleteEventAsync(int id);

        /// <summary>
        /// 指定された日付の予定数を取得します
        /// </summary>
        /// <param name="date">対象日付</param>
        /// <returns>予定数</returns>
        Task<int> GetEventCountByDateAsync(DateTime date);

        /// <summary>
        /// カテゴリ別の予定統計を取得します
        /// </summary>
        /// <param name="startDate">開始日</param>
        /// <param name="endDate">終了日</param>
        /// <returns>カテゴリ別の予定数</returns>
        Task<Dictionary<string, int>> GetEventStatsByCategory(DateTime startDate, DateTime endDate);
    }
}
