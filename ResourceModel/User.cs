using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ResourceModel
{
    public class User
    {
        public virtual string ID { get; set; }
        public virtual String UserName { get; set; }
        public virtual UserDetail UserDetail { get; set; }
    }

    public class UserDetail
    {
        public virtual User User { get; set; }
        public virtual string ID { get; set; }
        public virtual string NickName { get; set; }
        public virtual string FirstName { get; set; }
        public virtual string LastName { get; set; }
    }
}
