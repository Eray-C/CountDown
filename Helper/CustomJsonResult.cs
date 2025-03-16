using Newtonsoft.Json.Converters;
using Newtonsoft.Json;
using System.Web.Mvc;
using System.Web;
using System;

public class CustomJsonResult : JsonResult
{
    private const string _dateFormat = "yyyy-MM-dd HH:mm:ss";
    private const int _maxJsonLength = int.MaxValue;

    // Ekstra parametreler ekleyelim
    public bool Success { get; set; }
    public string Message { get; set; }

    public JsonRequestBehavior JsonRequestBehavior { get; set; } = JsonRequestBehavior.AllowGet;

    public override void ExecuteResult(ControllerContext context)
    {
        if (context == null)
            throw new ArgumentNullException(nameof(context));

        if (JsonRequestBehavior == JsonRequestBehavior.DenyGet &&
            string.Equals(context.HttpContext.Request.HttpMethod, "GET", StringComparison.OrdinalIgnoreCase))
        {
            throw new InvalidOperationException("GET requests are not allowed. To allow GET, set JsonRequestBehavior to AllowGet.");
        }

        HttpResponseBase response = context.HttpContext.Response;
        response.ContentType = "application/json";

        if (ContentEncoding != null)
        {
            response.ContentEncoding = ContentEncoding;
        }

        try
        {
            var result = new
            {
                success = Success,  // Success değerini burada ekliyoruz
                message = Message,  // Mesajı da ekliyoruz
                data = Data         // Data'yı da ekliyoruz
            };

            var settings = new JsonSerializerSettings
            {
                Converters = { new IsoDateTimeConverter { DateTimeFormat = _dateFormat } },
                MaxDepth = 64,
                Formatting = Formatting.None
            };

            string json = JsonConvert.SerializeObject(result, settings);

            if (_maxJsonLength > 0 && json.Length > _maxJsonLength)
                throw new InvalidOperationException("JSON output exceeds the maximum length allowed.");

            response.Write(json);
        }
        catch (Exception ex)
        {
            response.Write(JsonConvert.SerializeObject(new { error = ex.Message }));
        }
    }
}
