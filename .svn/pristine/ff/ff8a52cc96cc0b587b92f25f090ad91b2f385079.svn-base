using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ResourceModel
{
    public class Tag
    {
        public virtual int ID { get; set; }
        public virtual String TagName { get; set; }

        public override bool Equals(object obj)
        {
            return ((Tag)obj).ID == ID;
        }

        public override int GetHashCode()
        {
            return ID.GetHashCode();
        }
    }
}
