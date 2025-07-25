using CalendarApp.Api.Data;
using CalendarApp.Api.DTOs;
using CalendarApp.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace CalendarApp.Api.Services
{
    /// <summary>
    /// カレンダーイベントサービスの実装クラス
    /// データベースアクセスとビジネスロジックを処理します
    /// </summary>
    public class CalendarEventService : ICalendarEventService
    {
        private readonly CalendarDbContext? _context;
        private readonly ILogger<CalendarEventService> _logger;
        private readonly bool _useSampleData;

        /// <summary>
        /// コンストラクター
        /// データベースが利用できない場合は自動的にサンプルデータモードに切り替わります
        /// </summary>
        public CalendarEventService(CalendarDbContext? context, ILogger<CalendarEventService> logger)
        {
            _context = context;
            _logger = logger;
            _useSampleData = context == null || !CanConnectToDatabase();
            
            if (_useSampleData)
            {
                _logger.LogWarning("データベースに接続できません。サンプルデータモードで動作します。");
            }
        }

        /// <summary>
        /// データベース接続可能性をチェックします
        /// </summary>
        private bool CanConnectToDatabase()
        {
            try
            {
                _context?.Database.CanConnect();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "データベース接続チェックに失敗しました");
                return false;
            }
        }

        /// <summary>
        /// 指定された期間内の予定を取得します
        /// </summary>
        public async Task<IEnumerable<CalendarEventResponseDto>> GetEventsAsync(CalendarEventSearchDto searchDto)
        {
            try
            {
                searchDto.SetDefaultDateRange();

                if (_useSampleData)
                {
                    return GetSampleEventsInRange(searchDto);
                }

                var query = _context!.Events.AsQueryable()
                    .Where(e => !e.IsDeleted);

                // 日付範囲でフィルタリング
                if (searchDto.StartDate.HasValue)
                {
                    query = query.Where(e => e.StartTime.Date >= searchDto.StartDate.Value.Date);
                }

                if (searchDto.EndDate.HasValue)
                {
                    query = query.Where(e => e.StartTime.Date <= searchDto.EndDate.Value.Date);
                }

                // カテゴリでフィルタリング
                if (!string.IsNullOrEmpty(searchDto.Category))
                {
                    query = query.Where(e => e.Category == searchDto.Category);
                }

                // 作成者でフィルタリング
                if (!string.IsNullOrEmpty(searchDto.CreatedBy))
                {
                    query = query.Where(e => e.CreatedBy == searchDto.CreatedBy);
                }

                // タイトル検索
                if (!string.IsNullOrEmpty(searchDto.TitleSearch))
                {
                    query = query.Where(e => e.Title.Contains(searchDto.TitleSearch));
                }

                var events = await query
                    .OrderBy(e => e.StartTime)
                    .ToListAsync();

                return events.Select(MapToResponseDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "予定の取得中にエラーが発生しました");
                throw;
            }
        }

        /// <summary>
        /// サンプルデータから指定範囲の予定を取得
        /// </summary>
        private IEnumerable<CalendarEventResponseDto> GetSampleEventsInRange(CalendarEventSearchDto searchDto)
        {
            var sampleEvents = SampleData.GetSampleEventsInRange(
                searchDto.StartDate ?? DateTime.Today.AddMonths(-1),
                searchDto.EndDate ?? DateTime.Today.AddMonths(1)
            );

            var filteredEvents = sampleEvents.AsEnumerable();

            // カテゴリフィルタ
            if (!string.IsNullOrEmpty(searchDto.Category))
            {
                filteredEvents = filteredEvents.Where(e => e.Category == searchDto.Category);
            }

            // 作成者フィルタ
            if (!string.IsNullOrEmpty(searchDto.CreatedBy))
            {
                filteredEvents = filteredEvents.Where(e => e.CreatedBy == searchDto.CreatedBy);
            }

            // タイトル検索
            if (!string.IsNullOrEmpty(searchDto.TitleSearch))
            {
                filteredEvents = filteredEvents.Where(e => 
                    e.Title.Contains(searchDto.TitleSearch, StringComparison.OrdinalIgnoreCase));
            }

            return filteredEvents
                .OrderBy(e => e.StartTime)
                .Select(MapToResponseDto);
        }

        /// <summary>
        /// 指定されたIDの予定を取得します
        /// </summary>
        public async Task<CalendarEventResponseDto?> GetEventByIdAsync(int id)
        {
            try
            {
                if (_useSampleData)
                {
                    var sampleEvent = SampleData.GetSampleEvents().FirstOrDefault(e => e.Id == id && !e.IsDeleted);
                    return sampleEvent != null ? MapToResponseDto(sampleEvent) : null;
                }

                var eventEntity = await _context!.Events
                    .FirstOrDefaultAsync(e => e.Id == id && !e.IsDeleted);

                return eventEntity != null ? MapToResponseDto(eventEntity) : null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "ID {EventId} の予定取得中にエラーが発生しました", id);
                throw;
            }
        }

        /// <summary>
        /// 新しい予定を作成します
        /// </summary>
        public async Task<CalendarEventResponseDto> CreateEventAsync(CalendarEventCreateDto createDto)
        {
            try
            {
                // バリデーション
                if (!createDto.IsValidDateRange())
                {
                    throw new ArgumentException("終了日時は開始日時より後である必要があります");
                }

                if (_useSampleData)
                {
                    // サンプルデータモードでは実際の作成は行わず、ダミーレスポンスを返す
                    var newEvent = new CalendarEvent
                    {
                        Id = new Random().Next(1000, 9999), // ダミーID
                        Title = createDto.Title,
                        Description = createDto.Description,
                        StartTime = createDto.StartTime,
                        EndTime = createDto.EndTime,
                        Location = createDto.Location,
                        IsAllDay = createDto.IsAllDay,
                        Category = createDto.Category,
                        Color = createDto.Color,
                        CreatedBy = createDto.CreatedBy,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };

                    _logger.LogInformation("サンプルデータモード: 予定を作成しました（実際のデータベースへの保存は行われません）");
                    return MapToResponseDto(newEvent);
                }

                var eventEntity = new CalendarEvent
                {
                    Title = createDto.Title,
                    Description = createDto.Description,
                    StartTime = createDto.StartTime,
                    EndTime = createDto.EndTime,
                    Location = createDto.Location,
                    IsAllDay = createDto.IsAllDay,
                    Category = createDto.Category,
                    Color = createDto.Color,
                    CreatedBy = createDto.CreatedBy
                };

                _context!.Events.Add(eventEntity);
                await _context.SaveChangesAsync();

                _logger.LogInformation("予定を作成しました: ID {EventId}, タイトル: {Title}", eventEntity.Id, eventEntity.Title);
                return MapToResponseDto(eventEntity);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "予定の作成中にエラーが発生しました");
                throw;
            }
        }

        /// <summary>
        /// 既存の予定を更新します
        /// </summary>
        public async Task<CalendarEventResponseDto?> UpdateEventAsync(int id, CalendarEventUpdateDto updateDto)
        {
            try
            {
                // バリデーション
                if (!updateDto.IsValidDateRange())
                {
                    throw new ArgumentException("終了日時は開始日時より後である必要があります");
                }

                if (_useSampleData)
                {
                    // サンプルデータモードでは実際の更新は行わず、ダミーレスポンスを返す
                    var existingEvent = SampleData.GetSampleEvents().FirstOrDefault(e => e.Id == id && !e.IsDeleted);
                    if (existingEvent == null)
                    {
                        return null;
                    }

                    existingEvent.Title = updateDto.Title;
                    existingEvent.Description = updateDto.Description;
                    existingEvent.StartTime = updateDto.StartTime;
                    existingEvent.EndTime = updateDto.EndTime;
                    existingEvent.Location = updateDto.Location;
                    existingEvent.IsAllDay = updateDto.IsAllDay;
                    existingEvent.Category = updateDto.Category;
                    existingEvent.Color = updateDto.Color;
                    existingEvent.UpdatedAt = DateTime.UtcNow;

                    _logger.LogInformation("サンプルデータモード: 予定を更新しました（実際のデータベースへの保存は行われません）");
                    return MapToResponseDto(existingEvent);
                }

                var eventEntity = await _context!.Events
                    .FirstOrDefaultAsync(e => e.Id == id && !e.IsDeleted);

                if (eventEntity == null)
                {
                    return null;
                }

                eventEntity.Title = updateDto.Title;
                eventEntity.Description = updateDto.Description;
                eventEntity.StartTime = updateDto.StartTime;
                eventEntity.EndTime = updateDto.EndTime;
                eventEntity.Location = updateDto.Location;
                eventEntity.IsAllDay = updateDto.IsAllDay;
                eventEntity.Category = updateDto.Category;
                eventEntity.Color = updateDto.Color;

                await _context.SaveChangesAsync();

                _logger.LogInformation("予定を更新しました: ID {EventId}, タイトル: {Title}", eventEntity.Id, eventEntity.Title);
                return MapToResponseDto(eventEntity);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "ID {EventId} の予定更新中にエラーが発生しました", id);
                throw;
            }
        }

        /// <summary>
        /// 指定されたIDの予定を削除します（論理削除）
        /// </summary>
        public async Task<bool> DeleteEventAsync(int id)
        {
            try
            {
                if (_useSampleData)
                {
                    // サンプルデータモードでは実際の削除は行わない
                    var existingEvent = SampleData.GetSampleEvents().FirstOrDefault(e => e.Id == id && !e.IsDeleted);
                    if (existingEvent != null)
                    {
                        _logger.LogInformation("サンプルデータモード: 予定を削除しました（実際のデータベースからの削除は行われません）");
                        return true;
                    }
                    return false;
                }

                var eventEntity = await _context!.Events
                    .FirstOrDefaultAsync(e => e.Id == id && !e.IsDeleted);

                if (eventEntity == null)
                {
                    return false;
                }

                eventEntity.IsDeleted = true;
                await _context.SaveChangesAsync();

                _logger.LogInformation("予定を削除しました: ID {EventId}, タイトル: {Title}", eventEntity.Id, eventEntity.Title);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "ID {EventId} の予定削除中にエラーが発生しました", id);
                throw;
            }
        }

        /// <summary>
        /// 指定された日付の予定数を取得します
        /// </summary>
        public async Task<int> GetEventCountByDateAsync(DateTime date)
        {
            try
            {
                if (_useSampleData)
                {
                    return SampleData.GetSampleEvents()
                        .Count(e => e.StartTime.Date == date.Date && !e.IsDeleted);
                }

                return await _context!.Events
                    .CountAsync(e => e.StartTime.Date == date.Date && !e.IsDeleted);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "日付 {Date} の予定数取得中にエラーが発生しました", date);
                throw;
            }
        }

        /// <summary>
        /// カテゴリ別の予定統計を取得します
        /// </summary>
        public async Task<Dictionary<string, int>> GetEventStatsByCategory(DateTime startDate, DateTime endDate)
        {
            try
            {
                if (_useSampleData)
                {
                    return SampleData.GetSampleEvents()
                        .Where(e => e.StartTime.Date >= startDate.Date && 
                                   e.StartTime.Date <= endDate.Date && 
                                   !e.IsDeleted)
                        .GroupBy(e => e.Category ?? "未分類")
                        .ToDictionary(g => g.Key, g => g.Count());
                }

                return await _context!.Events
                    .Where(e => e.StartTime.Date >= startDate.Date && 
                               e.StartTime.Date <= endDate.Date && 
                               !e.IsDeleted)
                    .GroupBy(e => e.Category ?? "未分類")
                    .ToDictionaryAsync(g => g.Key, g => g.Count());
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "期間 {StartDate} - {EndDate} のカテゴリ別統計取得中にエラーが発生しました", startDate, endDate);
                throw;
            }
        }

        /// <summary>
        /// CalendarEventエンティティをCalendarEventResponseDtoにマッピングします
        /// </summary>
        private static CalendarEventResponseDto MapToResponseDto(CalendarEvent eventEntity)
        {
            return new CalendarEventResponseDto
            {
                Id = eventEntity.Id,
                Title = eventEntity.Title,
                Description = eventEntity.Description,
                StartTime = eventEntity.StartTime,
                EndTime = eventEntity.EndTime,
                Location = eventEntity.Location,
                IsAllDay = eventEntity.IsAllDay,
                Category = eventEntity.Category,
                Color = eventEntity.Color,
                CreatedBy = eventEntity.CreatedBy,
                CreatedAt = eventEntity.CreatedAt,
                UpdatedAt = eventEntity.UpdatedAt
            };
        }
    }
}
