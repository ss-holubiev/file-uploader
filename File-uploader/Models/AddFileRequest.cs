using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace File_uploader.Models
{
    public class AddFileRequest
    {
        public string FileContent { get; set; }

        public string FileName { get; set; }
    }
}
