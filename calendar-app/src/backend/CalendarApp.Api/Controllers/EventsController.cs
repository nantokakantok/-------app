using CalendarApp.Api.DTOs;
using CalendarApp.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace CalendarApp.Api.Controllers
{
    /// <summary>
    /// カレンダーイベント（予定）のAPIコントローラー
    /// RESTful APIエンドポイントを提供します
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class EventsController : ControllerBase
    {
        private readonly ICalendarEventService _eventService;
        private readonly ILogger<EventsController> _logger;

        /// <summary>
        /// コンストラクター
        /// </summary>
        public EventsController(ICalendarEventService eventService, ILogger<EventsController> logger)
        {
            _eventService = eventService;
            _logger = logger;
        }

        /// <summary>
        /// 予定一覧を取得します
        /// </summary>
        /// <param name="startDate">検索開始日（オプション）</param>
        /// <param name="endDate">検索終了日（オプション）</param>
        /// <param name="category">カテゴリフィルタ（オプション）</param>
        /// <param name="createdBy">作成者フィルタ（オプション）</param>
        /// <param name="titleSearch">タイトル検索（オプション）</param>
        /// <returns>予定一覧</returns>
        /// <response code="200">予定一覧の取得に成功</response>
        /// <response code="400">リクエストパラメータが不正</response>
        /// <response code="500">サーバー内部エラー</response>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<CalendarEventResponseDto>), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(500)]
        public async Task<ActionResult<IEnumerable<CalendarEventResponseDto>>> GetEvents(
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null,
            [FromQuery] string? category = null,
            [FromQuery] string? createdBy = null,
            [FromQuery] string? titleSearch = null)
        {
            try
            {
                var searchDto = new CalendarEventSearchDto
                {
                    StartDate = startDate,
                    EndDate = endDate,
                    Category = category,
                    CreatedBy = createdBy,
                    TitleSearch = titleSearch
                };

                var events = await _eventService.GetEventsAsync(searchDto);
                
                _logger.LogInformation("予定一覧を取得しました。件数: {Count}", events.Count());
                return Ok(events);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "予定一覧の取得中にエラーが発生しました");
                return StatusCode(500, new { message = "予定一覧の取得中にエラーが発生しました" });
            }
        }

        /// <summary>
        /// 指定されたIDの予定を取得します
        /// </summary>
        /// <param name="id">予定ID</param>
        /// <returns>予定の詳細情報</returns>
        /// <response code="200">予定の取得に成功</response>
        /// <response code="404">指定された予定が見つからない</response>
        /// <response code="500">サーバー内部エラー</response>
        [HttpGet("{id:int}")]
        [ProducesResponseType(typeof(CalendarEventResponseDto), 200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(500)]
        public async Task<ActionResult<CalendarEventResponseDto>> GetEvent(int id)
        {
            try
            {
                var eventDto = await _eventService.GetEventByIdAsync(id);
                
                if (eventDto == null)
                {
                    _logger.LogWarning("予定が見つかりません: ID {EventId}", id);
                    return NotFound(new { message = $"ID {id} の予定が見つかりません" });
                }

                _logger.LogInformation("予定を取得しました: ID {EventId}", id);
                return Ok(eventDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "予定の取得中にエラーが発生しました: ID {EventId}", id);
                return StatusCode(500, new { message = "予定の取得中にエラーが発生しました" });
            }
        }

        /// <summary>
        /// 新しい予定を作成します
        /// </summary>
        /// <param name="createDto">作成する予定の情報</param>
        /// <returns>作成された予定の情報</returns>
        /// <response code="201">予定の作成に成功</response>
        /// <response code="400">リクエストデータが不正</response>
        /// <response code="500">サーバー内部エラー</response>
        [HttpPost]
        [ProducesResponseType(typeof(CalendarEventResponseDto), 201)]
        [ProducesResponseType(400)]
        [ProducesResponseType(500)]
        public async Task<ActionResult<CalendarEventResponseDto>> CreateEvent([FromBody] CalendarEventCreateDto createDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    _logger.LogWarning("予定作成のリクエストデータが不正です: {ModelState}", ModelState);
                    return BadRequest(ModelState);
                }

                if (!createDto.IsValidDateRange())
                {
                    _logger.LogWarning("予定作成で日付範囲が不正です: 開始 {StartTime}, 終了 {EndTime}", 
                        createDto.StartTime, createDto.EndTime);
                    return BadRequest(new { message = "終了日時は開始日時より後である必要があります" });
                }

                var createdEvent = await _eventService.CreateEventAsync(createDto);
                
                _logger.LogInformation("予定を作成しました: ID {EventId}, タイトル: {Title}", 
                    createdEvent.Id, createdEvent.Title);
                
                return CreatedAtAction(
                    nameof(GetEvent), 
                    new { id = createdEvent.Id }, 
                    createdEvent);
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "予定作成でバリデーションエラーが発生しました");
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "予定の作成中にエラーが発生しました");
                return StatusCode(500, new { message = "予定の作成中にエラーが発生しました" });
            }
        }

        /// <summary>
        /// 既存の予定を更新します
        /// </summary>
        /// <param name="id">更新する予定のID</param>
        /// <param name="updateDto">更新する予定の情報</param>
        /// <returns>更新された予定の情報</returns>
        /// <response code="200">予定の更新に成功</response>
        /// <response code="400">リクエストデータが不正</response>
        /// <response code="404">指定された予定が見つからない</response>
        /// <response code="500">サーバー内部エラー</response>
        [HttpPut("{id:int}")]
        [ProducesResponseType(typeof(CalendarEventResponseDto), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        [ProducesResponseType(500)]
        public async Task<ActionResult<CalendarEventResponseDto>> UpdateEvent(int id, [FromBody] CalendarEventUpdateDto updateDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    _logger.LogWarning("予定更新のリクエストデータが不正です: ID {EventId}, {ModelState}", id, ModelState);
                    return BadRequest(ModelState);
                }

                if (!updateDto.IsValidDateRange())
                {
                    _logger.LogWarning("予定更新で日付範囲が不正です: ID {EventId}, 開始 {StartTime}, 終了 {EndTime}", 
                        id, updateDto.StartTime, updateDto.EndTime);
                    return BadRequest(new { message = "終了日時は開始日時より後である必要があります" });
                }

                var updatedEvent = await _eventService.UpdateEventAsync(id, updateDto);
                
                if (updatedEvent == null)
                {
                    _logger.LogWarning("更新対象の予定が見つかりません: ID {EventId}", id);
                    return NotFound(new { message = $"ID {id} の予定が見つかりません" });
                }

                _logger.LogInformation("予定を更新しました: ID {EventId}, タイトル: {Title}", 
                    updatedEvent.Id, updatedEvent.Title);
                
                return Ok(updatedEvent);
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "予定更新でバリデーションエラーが発生しました: ID {EventId}", id);
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "予定の更新中にエラーが発生しました: ID {EventId}", id);
                return StatusCode(500, new { message = "予定の更新中にエラーが発生しました" });
            }
        }

        /// <summary>
        /// 指定されたIDの予定を削除します
        /// </summary>
        /// <param name="id">削除する予定のID</param>
        /// <returns>削除結果</returns>
        /// <response code="204">予定の削除に成功</response>
        /// <response code="404">指定された予定が見つからない</response>
        /// <response code="500">サーバー内部エラー</response>
        [HttpDelete("{id:int}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> DeleteEvent(int id)
        {
            try
            {
                var deleted = await _eventService.DeleteEventAsync(id);
                
                if (!deleted)
                {
                    _logger.LogWarning("削除対象の予定が見つかりません: ID {EventId}", id);
                    return NotFound(new { message = $"ID {id} の予定が見つかりません" });
                }

                _logger.LogInformation("予定を削除しました: ID {EventId}", id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "予定の削除中にエラーが発生しました: ID {EventId}", id);
                return StatusCode(500, new { message = "予定の削除中にエラーが発生しました" });
            }
        }

        /// <summary>
        /// 指定された日付の予定数を取得します
        /// </summary>
        /// <param name="date">対象日付</param>
        /// <returns>予定数</returns>
        /// <response code="200">予定数の取得に成功</response>
        /// <response code="400">日付が不正</response>
        /// <response code="500">サーバー内部エラー</response>
        [HttpGet("count/{date:datetime}")]
        [ProducesResponseType(typeof(int), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(500)]
        public async Task<ActionResult<int>> GetEventCount(DateTime date)
        {
            try
            {
                var count = await _eventService.GetEventCountByDateAsync(date);
                
                _logger.LogInformation("日付 {Date} の予定数を取得しました: {Count}件", date.Date, count);
                return Ok(count);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "予定数の取得中にエラーが発生しました: 日付 {Date}", date);
                return StatusCode(500, new { message = "予定数の取得中にエラーが発生しました" });
            }
        }

        /// <summary>
        /// カテゴリ別の予定統計を取得します
        /// </summary>
        /// <param name="startDate">開始日</param>
        /// <param name="endDate">終了日</param>
        /// <returns>カテゴリ別の予定数</returns>
        /// <response code="200">統計の取得に成功</response>
        /// <response code="400">日付範囲が不正</response>
        /// <response code="500">サーバー内部エラー</response>
        [HttpGet("stats/category")]
        [ProducesResponseType(typeof(Dictionary<string, int>), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(500)]
        public async Task<ActionResult<Dictionary<string, int>>> GetCategoryStats(
            [FromQuery] DateTime startDate,
            [FromQuery] DateTime endDate)
        {
            try
            {
                if (endDate <= startDate)
                {
                    _logger.LogWarning("統計取得で日付範囲が不正です: 開始 {StartDate}, 終了 {EndDate}", startDate, endDate);
                    return BadRequest(new { message = "終了日は開始日より後である必要があります" });
                }

                var stats = await _eventService.GetEventStatsByCategory(startDate, endDate);
                
                _logger.LogInformation("カテゴリ別統計を取得しました: 期間 {StartDate} - {EndDate}, カテゴリ数: {Count}", 
                    startDate.Date, endDate.Date, stats.Count);
                
                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "カテゴリ別統計の取得中にエラーが発生しました: 期間 {StartDate} - {EndDate}", 
                    startDate, endDate);
                return StatusCode(500, new { message = "統計の取得中にエラーが発生しました" });
            }
        }
    }
}
