using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using TaskManagerMvc.Models;

namespace TaskManagerMvc.Controllers
{
    public class TasksController : Controller
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;

        public TasksController(IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _httpClientFactory = httpClientFactory;
            _configuration     = configuration;
        }

        // GET: /Tasks  — reads Bearer token from session, fetches user's tasks from API
        public async Task<IActionResult> Index()
        {
            var token = HttpContext.Session.GetString("JwtToken");
            if (string.IsNullOrEmpty(token))
                return RedirectToAction("Login");

            var client = _httpClientFactory.CreateClient("TaskApi");
            client.DefaultRequestHeaders.Authorization =
                new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);

            var response = await client.GetAsync("api/tasks");
            if (!response.IsSuccessStatusCode)
            {
                ViewBag.Error = "Failed to load tasks. Please log in again.";
                return RedirectToAction("Login");
            }

            var json  = await response.Content.ReadAsStringAsync();
            var tasks = JsonSerializer.Deserialize<List<TaskViewModel>>(json,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true })
                ?? new List<TaskViewModel>();

            ViewBag.UserName = HttpContext.Session.GetString("UserName");
            return View(tasks);
        }

        // GET: /Tasks/Login
        public IActionResult Login() => View();

        // POST: /Tasks/Login
        [HttpPost]
        public async Task<IActionResult> Login(string email, string password)
        {
            var client  = _httpClientFactory.CreateClient("TaskApi");
            var payload = new { email, password };
            var content = new StringContent(
                JsonSerializer.Serialize(payload),
                System.Text.Encoding.UTF8,
                "application/json");

            var response = await client.PostAsync("api/auth/login", content);

            if (!response.IsSuccessStatusCode)
            {
                ViewBag.Error = "Invalid email or password.";
                return View();
            }

            var json   = await response.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<JsonElement>(json);

            HttpContext.Session.SetString("JwtToken",  result.GetProperty("token").GetString()!);
            HttpContext.Session.SetString("UserName",  result.GetProperty("name").GetString()!);

            return RedirectToAction("Index");
        }

        // GET: /Tasks/Logout
        public IActionResult Logout()
        {
            HttpContext.Session.Clear();
            return RedirectToAction("Login");
        }
    }
}
