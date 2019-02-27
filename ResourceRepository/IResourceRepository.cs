using Microsoft.Azure.Documents;
using ResourceModel;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Repository
{
    public interface IResourceRepository
    {
        ResourceModel.DigitalResource SaveOrGet(ReferenceRepository r, ResourceModel.User owner, Stream fileStream, String originalName);

        //int AddTagToResource(ResourceModel.Resource resource, Tag tag);

        int AddToAlbum(int id, ResourceModel.DigitalResource resource);

        void AddAlbum(Album album);

        List<Album> GetAlbums(Func<Album, bool> predicate);
        Album GetAlbum(int id, string userName);

        bool Exists(string md5);
        DigitalResource Get(string id, ResourceModel.User user);
        List<DigitalResource> GetOrphanResourcesForUser(string userName);
    }
}
