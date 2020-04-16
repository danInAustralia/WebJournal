using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ResourceModel
{
    public class AlbumResource
    {
        public virtual int ID { get; set; }
        public virtual Album Album { get; set; }
        public virtual DigitalResource Resource {get; set;}

        public virtual bool IsValid
        {
            get
            {
                //the resource is owned by the owner of the ablum
                return Resource.Owners.Any(x => x.UserName == Album.Owner.UserName);
            }
        }
    }
}
