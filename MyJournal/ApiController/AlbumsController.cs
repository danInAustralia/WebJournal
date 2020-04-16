using System.Collections.Generic;
using System.Linq;
using MyJournal.Factories;
using MyJournal.ViewModels;
using ResourceModel;
using Repository;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web;
using System.IO;
using System;
using System.Net.Http;
using System.Net;
using System.Net.Http.Headers;
using Microsoft.AspNet.Identity;
using System.Security.Claims;

namespace MyJournal.ApiControllers
{
    public class AlbumsController : System.Web.Http.ApiController
    {
        /// <summary>
        /// returns a JSON representation of the albums returned from repository.
        /// 
        /// URL translates to http://localhost:[port]/api/albums [52885]
        /// </summary>
        /// <returns>JSON of ViewModel of the list of albums retrieved from a repository</returns>
        /// 
        [Authorize]
        public AlbumListViewModel Get()//GetAllAlbums()
        {
            string userName = User.Identity.Name;
            AlbumListViewModelFactory albumListFactory = new AlbumListViewModelFactory();
            IResourceRepository repository = new Repository.ResourceRepository();
            AlbumListViewModel vm = albumListFactory.GetAlbumListViewModel(repository, userName);

            return vm;
        }

        [Authorize]
        public async Task<Album> PostAlbum(Album album)
        {
            //add to the database
            string userName = this.User.Identity.Name;
            UserRepository ur = new UserRepository();
            User user = ur.Get(userName);
            album.Owner = user;

            IResourceRepository repository = new Repository.ResourceRepository();
            repository.AddAlbum(album);
            return album;
     
        }

        [Authorize]
        public Album GetAlbum(int id)
        {
            IResourceRepository repository = new Repository.ResourceRepository();

            string userName = this.User.Identity.Name;
            try
            {
                Album album = repository.GetAlbum(id, userName);
                //reset the resources list because it causes circular reference
                album.Resources = new List<ResourceModel.DigitalResource>();

                return album;
            }
            catch(Exception e)
            {
                throw new System.Exception("No such album called "+ id);
            }
        }

        [Authorize]
        [HttpGet]
        public ResourceListViewModel AlbumResources(int AlbumID, int PageNumber)
        {
            IResourceRepository repository = new Repository.ResourceRepository();
            try
            {
                string userName = this.User.Identity.Name;

                Album album = repository.GetAlbum(AlbumID, userName);

                ResourceListViewModel resourceVM = new ResourceListViewModel
                {
                    Resources = album.Resources.Skip((PageNumber - 1) * 20).Take(20).ToList(),
                    Total = album.Resources.Count
                };

                //Clear the album's resources to prevent circular reference converting to json
                album.Resources.Clear();

                return resourceVM;
            }
            catch(Exception e)
            {
                throw new System.Exception("No such album called " + AlbumID);
            }
        }

        [Authorize]
        [HttpGet]
        public List<DigitalResource> OrphanResources()
        {
            IResourceRepository repository = new Repository.ResourceRepository();

            string userName = this.User.Identity.Name;

            List<DigitalResource> resources = repository.GetOrphanResourcesForUser(userName);

            return resources;
        }

        public bool GetDoesMd5Exist(string md5)
        {
            return true;
        }

        /// <summary>
        /// Adds a resource to an album.
        /// assertion that the resourceID and albumID exist
        /// </summary>
        /// <param name="albumID"></param>
        [Authorize]
        [HttpPost]
        public bool AddResource(int albumID, string resourceID)
        {
            bool success = false;
            //throw new Exception("forced error");
            Repository.ResourceRepository rr = new Repository.ResourceRepository();

            AlbumResource albumResource = rr.GetOrCreateAlbumResource(albumID, resourceID, User.Identity.Name);

            //DigitalResource resource = null;
            if (albumResource.Album != null && albumResource.Resource != null)
            {
                if(albumResource.ID == 0)//needs to be saved to the database
                {
                    if (albumResource.IsValid)
                    {
                        rr.SaveAlbumResource(albumResource);
                    }
                }
            }
            else
            {
                success = false;
                throw new System.Exception("Unable to add resource to Album. Check that you own both resource and album and that they exist");
            }

            return true;
        }

        /// <summary>
        /// Uploads a resource and adds it to an album
        /// (to be deprecated because it does two things)
        /// </summary>
        /// <param name="albumID"></param>
        [Authorize]
        [HttpPut]
        public IHttpActionResult Upload(string albumID)
        {
            //throw new Exception("forced error");
            HttpResponseMessage response = new HttpResponseMessage();
            var httpRequest = HttpContext.Current.Request;
            DigitalResource myResource = null;
            //DigitalResource resource = null;
            if (albumID != null)
            {
                System.Web.HttpFileCollection files = System.Web.HttpContext.Current.Request.Files;
                Repository.ResourceRepository repository = new Repository.ResourceRepository();
                ReferenceRepository refRepository = new ReferenceRepository();
                UserRepository ur = new UserRepository();
                string username = User.Identity.Name;
                User user = ur.Get(username);
                Album album = repository.GetAlbums(x => x.Name == albumID).FirstOrDefault();

                //for (int i = 0; i < files.Count; i++)
                {
                    HttpPostedFile file = files[0];

                    string name = file.FileName;
                    using (Stream fileStream = file.InputStream)
                    {
                        myResource = repository.SaveOrGet(refRepository, user, fileStream, name);
                        if (myResource != null)
                        {
                            album.AddResource(myResource);
                            repository.SaveAlbum(album);
                        }
                        //resource = myResource;
                        //response.Content = new StringContent("{\"Md5\": \""+ "12345" + "\"");
                        //response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
                    }
                }
            }

            return Ok(myResource);
        }



    }
}
