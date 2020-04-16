using FluentNHibernate.Mapping;
using ResourceModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ResourceRepository.Mapping
{
    public class AlbumResourceMap : ClassMap<AlbumResource>
    {
        public AlbumResourceMap()
        {
            Table("Album_X_Resource");
            Id(x => x.ID).Column("Album_X_ResourceID").GeneratedBy.Identity();
            References(x => x.Album).Column("AlbumID").Not.LazyLoad();
            References(x => x.Resource).Column("ResourceID").Not.LazyLoad();

        }
    }
}
