using FluentNHibernate.Mapping;
using ResourceModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Mapping
{
    public class TagMap : ClassMap<Tag>
    {
        public TagMap()
        {
            Table("Tag");
            Id(x => x.ID).Column("TagID").GeneratedBy.Identity();
            Map(x => x.TagName).Column("Tag");
        }
    }
}
