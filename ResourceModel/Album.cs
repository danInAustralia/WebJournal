using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ResourceModel
{
    public class Album
    {
        public virtual int ID { get; set; }
        public virtual String Name { get; set; }
        public virtual User Owner { get; set; }
        public virtual String Description { get; set; }

        public virtual DateTime AlbumDate { get; set; }
        public virtual IList<DigitalResource> Resources { get; set; }

        /// <summary>
        /// Adds a resource if a resource with the MD5 hash has not been added previously
        /// </summary>
        /// <param name="resource">resource to add</param>
        public virtual void AddResource(DigitalResource resource)
        {
            DigitalResource foundResource = (from r in Resources
                                 where r.Md5 == resource.Md5
                                 select r).FirstOrDefault();

            if(foundResource == null)
            {
                Resources.Add(resource);
            }
        }
    }
}
