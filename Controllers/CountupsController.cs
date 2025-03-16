using CountDown.Entities;
using System;
using System.Linq;
using System.Web.Mvc;

namespace CountDown.Controllers
{
    public class CountupsController : Controller
    {

        private ApplicationDbContext _context = new ApplicationDbContext();

        public ActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public ActionResult SaveCountup(string title)
        {
            var countdown = new Countup
            {
                Title = title,
                StartDate = DateTime.Now 
            };

            _context.Countups.Add(countdown);
            _context.SaveChanges();


            return new CustomJsonResult
            {
                Success = true,
                Message = "Countup found",
                Data = countdown
            };
        }
        [HttpGet]
        public ActionResult GetCountup(int id)
        {
            var countdown = _context.Countups.FirstOrDefault(c => c.Id == id);
            if (countdown == null)
            {
                return new CustomJsonResult
                {
                    Success = false,
                    Message = "Countup not found",
                    Data = null 
                };
            }

            return new CustomJsonResult
            {
                Success = true,
                Message = "Countup found",
                Data = countdown
            };
        }
        [HttpGet]
        public JsonResult GetAllCountups()
        {
            var countdowns = _context.Countups.ToList();
            return new CustomJsonResult
            {
                Success = true,
                Message = "Countups found",
                Data = countdowns
            };
        }
    }
}