using File_uploader.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace File_uploader.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FilesController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public FilesController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost("add")]
        public IActionResult Add(AddFileRequest addFileRequest)
        {
            if (addFileRequest == null || string.IsNullOrEmpty(addFileRequest.FileContent))
            {
                return BadRequest();
            }

            var file = Convert.FromBase64String(addFileRequest.FileContent);

            if (file.Length > int.Parse(_configuration["FileMaxSizeMb"]) * 1024 * 1024)
            {
                return BadRequest();
            }

            var path = _configuration["FilePath"] ?? "Files";
            var filename = $"{Guid.NewGuid()}{Path.GetExtension(addFileRequest.FileName)}";

            if (!Directory.Exists(path)) Directory.CreateDirectory(path);

            var fullPath = Path.Combine(path, filename);

            using (var fileStream
                = new FileStream(fullPath,
                FileMode.Create))
            {
                fileStream.Write(file);
            }

            return Ok(new AddFileResponse { 
                FilePath = Path.Combine(Directory.GetCurrentDirectory(), fullPath)
            });
        }
    }
}
