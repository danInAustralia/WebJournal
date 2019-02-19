using FluentNHibernate.Mapping;
using ResourceModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Mapping
{
    public class UserMap : ClassMap<User>
    {
        public UserMap()
        {
            Table("AspNetUsers");
            Id(x => x.ID).Column("Id");
            Map(x => x.UserName).Column("UserName");
        }
    }
}
