using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using TodoApp.Models;

namespace ToDoApp.Controllers
{
    public class CategoriesController : ApiController
    {
        private DataContext _db = new DataContext();

        [HttpGet]
        public List<Category> GetAll()
        {
            return _db.Categories.OrderBy(p => p.Id).ToList();
        }

        [HttpPost]
        //[Authorize]
        public IHttpActionResult CreateCategory(Category model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _db.Categories.Add(model);
            _db.SaveChanges();

            return Ok(model);
        }
    }
}
