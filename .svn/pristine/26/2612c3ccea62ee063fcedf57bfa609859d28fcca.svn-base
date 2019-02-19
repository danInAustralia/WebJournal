using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ResourceModel;
using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using Microsoft.Azure.Documents.Linq;
using System.Linq.Expressions;
using System.Configuration;
using System.Web.Configuration;
using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Transfer;
using System.Security.Cryptography;
using System.IO;
using Repository;
using NHibernate;
using NHibernate.Criterion;
using ResourceRepository;

namespace Repository
{
    public class ResourceRepository : IResourceRepository
    {
        private static readonly string DatabaseID = WebConfigurationManager.AppSettings["database"];
        private static readonly string CollectionID = WebConfigurationManager.AppSettings["collection"];

        public List<Album> GetAlbums(Func<Album, bool> predicate)
        {
            List<Album> list = new List<Album>();

            var sessionFactory = SessionFactoryCreator.CreateSessionFactory();

            using (var session = sessionFactory.OpenSession())
            {
                using (session.BeginTransaction())
                {
                    if (predicate != null)
                    {
                        list = session.CreateCriteria(typeof(Album)).List<Album>().Where(predicate).ToList();
                    }
                    else
                    {
                        list = session.CreateCriteria(typeof(Album)).List<Album>().ToList();
                    }
                }
            }

            return list;
        }


        /// <summary>
        /// Gets an album with a name from a particular owner. Album names
        /// are unique for each owner.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="ownerName"></param>
        /// <returns></returns>
        public Album GetAlbum(int id, string ownerName)
        {
            var sessionFactory = SessionFactoryCreator.CreateSessionFactory();

            using (var session = sessionFactory.OpenSession())
            {
                using (session.BeginTransaction())
                {
                    var album = session.QueryOver<Album>()
                        .Fetch(u => u.Resources)
                        .Eager
                        .List()
                        .Where(u => u.ID == id && u.Owner.UserName == ownerName)
                        .FirstOrDefault();

                    return album;
                }
            }
        }

        public DigitalResource Get(string id)
        {
            DigitalResource resource;// list = new List<Resource>();

            var sessionFactory = SessionFactoryCreator.CreateSessionFactory();

            using (var session = sessionFactory.OpenSession())
            {
                using (session.BeginTransaction())
                {
                        //session.CreateCriteria(typeof(DigitalResource)).ToList();
                    resource = session.QueryOver<DigitalResource>()
                                    .Where(x => x.Md5 == id)
                                    .List().FirstOrDefault();

                    
                    IAmazonS3 s3Client = new AmazonS3Client();
                    long size = s3Client.GetObjectMetadata("piccoli", id).ContentLength;
                    resource.Size = size;
                }
            }

            return resource;
        }

        public bool ResourceExists(String hashID)
        {
            bool docExists = false;
            var sessionFactory = SessionFactoryCreator.CreateSessionFactory();

            using (var session = sessionFactory.OpenSession())
            {
                using (session.BeginTransaction())
                {
                    ResourceModel.DigitalResource r = session.CreateCriteria(typeof(ResourceModel.DigitalResource)).Add(Restrictions.Eq("Md5", hashID)).UniqueResult<ResourceModel.DigitalResource>();
                    if(r != null)
                    {
                        docExists = true;
                    }
                }
            }

            return docExists;
        }

        public void SaveAlbum(Album album)
        {
            var sessionFactory = SessionFactoryCreator.CreateSessionFactory();

            using (var session = sessionFactory.OpenSession())
            {
                using (var transaction = session.BeginTransaction())
                {
                    //try
                    {
                        session.SaveOrUpdate(album);
                        session.Transaction.Commit();
                    }
                }
            }
        }

        public void SaveResource(ResourceModel.DigitalResource resource)
        {
            var sessionFactory = SessionFactoryCreator.CreateSessionFactory();

            using (var session = sessionFactory.OpenSession())
            {
                using (var transaction = session.BeginTransaction())
                {
                    //try
                    {
                        session.SaveOrUpdate(resource);
                        session.Transaction.Commit();
                    }
                }
            }
        }

        public void AddAlbum(Album album)
        {
            SaveAlbum(album);
        }

        public void ReadRemoteResourceToLocalFile(string resourceID, string targetFolder)
        {
            IAmazonS3 s3Client = new AmazonS3Client();
            Stream ms = new MemoryStream();


            using (GetObjectResponse response = s3Client.GetObject("piccoli", resourceID))
            {
                //string dest = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Desktop), keyName);
                if (!File.Exists(resourceID))
                {
                    response.WriteResponseStreamToFile(targetFolder + resourceID);
                }
            }
        }

        public Stream GetResourceStream(string resourceID)
        {
            IAmazonS3 s3Client = new AmazonS3Client();
            Stream ms = new MemoryStream();

            using (TransferUtility tr = new TransferUtility(s3Client))
            {
                Stream amazonStream = tr.OpenStream("piccoli", resourceID);
                ms = Amazon.S3.Util.AmazonS3Util.MakeStreamSeekable(amazonStream);
            }

            return ms;
        }

        //public Stream GetResourceStreamPartial(string resourceID, long start, long? end)
        //{

        //    MemoryStream memStram = new MemoryStream();
        //    IAmazonS3 s3Client = new AmazonS3Client();
        //    GetObjectRequest request = new GetObjectRequest
        //    {
        //        BucketName = "piccoli",
        //        Key = resourceID
        //    };

        //    if(end != null)
        //    {
        //        request.ByteRange = new ByteRange(start, (long)end);
        //    }

        //    using (GetObjectResponse response = s3Client.GetObject(request))
        //    {
        //        //string dest = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Desktop), keyName);
        //        //if (!File.Exists(dest))
        //        {
        //            Stream returnStream = response.ResponseStream;
        //            returnStream.CopyTo(memStram);
        //        }
        //    }
        //    return memStram;
        //}

        public Stream GetResourceStream(string resourceID, long start, long end)
        {
            IAmazonS3 s3Client = new AmazonS3Client();

            using (TransferUtility tr = new TransferUtility(s3Client))
            {
                return tr.OpenStream("piccoli", resourceID);
            }
        }

        //Dont need this. Just need to add the tag to the resource model,
        //then save the resource
        //public int AddTagToResource(string md5, ResourceModel.Tag tag)
        //{
        //    throw new NotImplementedException();
        //}

        public int AddToAlbum(string albumName, ResourceModel.DigitalResource resource)
        {
            int resourcesAdded = 0;
            Album album = GetAlbums(x => x.Name == albumName).FirstOrDefault();

            if(album != null)
            {
                album.AddResource(resource);

                //save the updated album to the database


                resourcesAdded++;
            }
            return resourcesAdded;
        }

        String Md5Hash(Stream fileStream)
        {
            using (var md5 = MD5.Create())
            {
                String md5Sum = BitConverter.ToString(md5.ComputeHash(fileStream)).Replace("-", "").ToLower();
                return md5Sum;
            }
        }

        /// <summary>
        /// Saves a NEW resource. Only saves if resource with the MD5Sum has not previously been added.
        /// </summary>
        /// <param name="referenceRepository"></param>
        /// <param name="fileStream"></param>
        /// <param name="originalName"></param>
        /// <returns>DigitalResource with the length of the file. The Digital Resource may
        /// be newly created OR retrieved from the database if it already exists</returns>
        public ResourceModel.DigitalResource SaveOrGet(ReferenceRepository referenceRepository,
            ResourceModel.User owner,
            Stream fileStream, 
            String originalName)
        {
            ResourceModel.DigitalResource resource = null;
            ResourceType imageRT = referenceRepository.AllResourceTypes().Where(x => x.Type == "Image").FirstOrDefault();
            ResourceType otherRT = referenceRepository.AllResourceTypes().Where(x => x.Type == "Other").FirstOrDefault();
            //User user = reference

            try
            {

                //calculate md5 of the file to upload
                string md5Sum = Md5Hash(fileStream);
                
                if (!ResourceExists(md5Sum))
                {
                    //create the resource object
                    resource = new ResourceModel.DigitalResource
                    {
                        Md5 = md5Sum,
                        OriginalFileName = originalName,
                        Size = fileStream.Length
                    };

                    if (ReferenceService.IsValidImage(fileStream))
                    {
                        resource.Type = imageRT;
                        //resource.Type = "Image";
                        resource.Date = ReferenceService.GetDateTakenFromImage(fileStream);

                    }
                    else
                    {
                        resource.Type = otherRT;
                        resource.Date = null;
                    }

                    //fileStream.Position = 0;
                    //TransferUtilityUploadRequest tuu = new TransferUtilityUploadRequest
                    //{
                    //    InputStream = fileStream,
                    //    BucketName = "piccoli",
                    //    Key = "belvedere"
                    //};
                    //tr.UploadAsync(tuu);

                    //upload the file
                    IAmazonS3 s3Client = new AmazonS3Client();
                    //ListBucketsResponse response = s3Client.ListBuckets();

                    using (TransferUtility tr = new TransferUtility(s3Client))
                    {
                        tr.Upload(fileStream, "piccoli", md5Sum);
                        //update the database
                        SaveResource(resource);
                    }
                }
                else
                {

                    return this.Get(md5Sum);
                }
            }
            catch (AmazonS3Exception ex)
            {

            }

            return resource;
        }
    }
}
