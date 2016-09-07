using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using TodoApp.Models;

namespace ToDoApp.Controllers
{
    public class TasksController : ApiController
    {
        private DataContext _db = new DataContext();

        [HttpGet]
        public List<Task> GetAll()
        {
            return _db.Tasks.OrderBy(p => p.Id).ToList();
        }

        [HttpPost]
        //[Authorize]
        public IHttpActionResult CreateProduct(Task model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            model.DateCreated = DateTime.Now;

            _db.Tasks.Add(model);
            _db.SaveChanges();

            return Ok(model);
        }

        [HttpDelete]
        //[Authorize]
        public IHttpActionResult DeleteTask(int Id)
        {
            Task task = _db.Tasks.Where(p => p.Id == Id).FirstOrDefault();

            if (task == null)
            {
                return NotFound();
            }

            _db.Tasks.Remove(task);
            _db.SaveChanges();

            return Ok(task);
        }


        [HttpPut]
        //[Authorize]
        public IHttpActionResult CompleteTask(int Id)
        {
            Task task = _db.Tasks.Where(p => p.Id == Id).FirstOrDefault();

            if (task == null)
            {
                return NotFound();
            }

            task.Completed = true;

            _db.Entry(task).State = System.Data.Entity.EntityState.Modified;
            _db.SaveChanges();

            return Ok(task);
        }

        [HttpPut]
        //[Authorize]
        [Route("api/tasks/changecategory/{TaskId}/{CatId}")]
        public IHttpActionResult ChangeTaskCategory(int TaskId, int CatId)
        {
            Task task = _db.Tasks.Where(p => p.Id == TaskId).FirstOrDefault();

            if (task == null)
            {
                return NotFound();
            }

            task.CategoryId = CatId;

            _db.Entry(task).State = System.Data.Entity.EntityState.Modified;
            _db.SaveChanges();

            return Ok(task);
        }
    }
}
