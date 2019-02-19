using FluentNHibernate.Mapping;
using ResourceModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Mapping
{
    public class ResourceMap : ClassMap<DigitalResource>
    {
        public ResourceMap()
        {
            Table("Resource");
            Id(x => x.Md5).Column("HashID");
            Map(x => x.OriginalFileName).Column("OriginalFileName");
            Map(x => x.Description).Column("Description");
            Map(x => x.Date).Column("Date");
            Map(x => x.Uploaded).Column("Uploaded");
            References(x => x.Type).Column("TypeID");
            //References(x => x.Owner).Column("OwnerID");
            HasManyToMany<Tag>(x => x.Tags).Table("ResourceTag")
                .ParentKeyColumn("ResourceID")
                .ChildKeyColumn("TagID")
                //.FetchType.Join()
                .Not.LazyLoad();
            HasManyToMany<ResourceModel.User>(x => x.Owners).Table("ResourceOwner")
                .ParentKeyColumn("ResourceID")
                .ChildKeyColumn("OwnerID")
                .FetchType.Join()
                .Not.LazyLoad();
        }
    }
}
