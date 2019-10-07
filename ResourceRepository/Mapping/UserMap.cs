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
            HasOne(x => x.UserDetail).Cascade.All();
        }
    }

    public class UserDetailMap : ClassMap<UserDetail>
    {
        public UserDetailMap()
        {
            Table("Users");
            Id(x => x.ID).GeneratedBy.Foreign("User");
            Map(x => x.NickName).Column("NickName");
            Map(x => x.FirstName).Column("FirstName");
            Map(x => x.LastName).Column("LastName");

            HasOne(x => x.User).Constrained().Cascade.None();
        }
    }
}
