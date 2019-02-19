using FluentNHibernate.Mapping;
using ResourceModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Mapping
{
    public class ResourceTypeMap : ClassMap<ResourceType>
    {
        public ResourceTypeMap()
        {
            Table("ResourceType");
            Id(x => x.ID).Column("TypeID").GeneratedBy.Identity();
            Map(x => x.Type).Column("Type");
        }
    }
}
