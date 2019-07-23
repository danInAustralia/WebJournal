using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyJournal.ApiViewModels
{
    public class PartialUpload
    {
        public string uploadID { get; set; }
        public List<string> partTags { get; set; }
        public String originalName { get; set; }
        public String md5OfResource { get; set; }
        public long totalSize { get; set; }
    }
}