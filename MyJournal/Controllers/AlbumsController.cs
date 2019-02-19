using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MyJournal.Controllers
{
    public class AlbumsController : Controller
    {
        // GET: Album
        [Authorize]
        public ActionResult Index()
        {
                return base.View();
        }

        [Authorize]
        public ViewResult Detail(string albumName)
        {
            return View((object)albumName);
        }

        public ViewResult ResourceUploader(string albumName)
        {
            return View((object) albumName);
        }
    }
}