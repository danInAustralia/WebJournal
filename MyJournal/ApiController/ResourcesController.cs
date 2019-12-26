using Amazon.S3;
using Amazon.S3.Model;
using MyJournal.ApiServices;
using MyJournal.ApiViewModels;
using Repository;
using ResourceModel;
using ResourceRepository;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace MyJournal.ApiController
{
    public class ResourcesController : System.Web.Http.ApiController
    {
        /// <summary>
        /// Uploads a resource and adds it to an album
        /// </summary>
        /// <param name="resourceID">the md5 of the requested resource.</param>
        //public string GetResource(string id)
        //{
        //    Repository.ResourceRepository repository = new Repository.ResourceRepository();
        //    ReferenceRepository refRepository = new ReferenceRepository();
        //    byte[] bytes = null;

        //    using (Stream stream = repository.GetResourceStream(id))
        //    {
        //        using (var memoryStream = new MemoryStream())
        //        {
        //            stream.CopyTo(memoryStream);
        //            bytes = memoryStream.ToArray();
        //        }
        //    }
        //    string base64String = Convert.ToBase64String(bytes);
        //    return base64String;
        //}
        [Authorize]
        public async Task<HttpResponseMessage> Get(string id)
        {
            bool isPartial = false;

            UserRepository ur = new UserRepository();
            string username = User.Identity.Name;
            User user = ur.Get(username);

            Repository.ResourceRepository repository = new Repository.ResourceRepository();
            DigitalResource resource = repository.Get(id, user);
            //await stream.CopyToAsync(stream2,);
            // Create a client
            AmazonS3Client client = new AmazonS3Client();

            long from = 0;
            long to = 0;

            GetObjectRequest request = null;
            if (Request.Headers.Range != null)
            {
                isPartial = true;
                //If the last-byte-pos value is absent, or if the value is greater than or equal to the current length of the entity-body, 
                //last -byte-pos is taken to be equal to one less than the current length of the entity- body in bytes.
                //*-The final 500 bytes(byte offsets 9500 - 9999, inclusive):
                //    bytes = -500
                //  - Or bytes = 9500 -
                if(Request.Headers.Range.Ranges.First().From == null)
                {
                    from = (resource.Size - 1) - (long)Request.Headers.Range.Ranges.First().To;
                }
                else //From byte is specified
                {
                    from = (long)Request.Headers.Range.Ranges.First().From;
                }
                
                to = resource.Size - 1;
                if (Request.Headers.Range.Ranges.First().To != null)
                {
                    to = (long)Request.Headers.Range.Ranges.First().To;
                }
                else//Chrome often sends out a 0- request. Instead of passing back a massive file, just pass back the first 500 bytes
                {
                    if(from == 0)
                    {
                        to = 499;
                    }
                }
                request = new GetObjectRequest
                {
                    BucketName = "piccoli",
                    Key = id,
                    ByteRange = new ByteRange(from, to)
                };
            }
            else
            {
                request = new GetObjectRequest
                {
                    BucketName = "piccoli",
                    Key = id
                };
            }
            // Issue request and remember to dispose of the response
            //using 
            GetObjectResponse response = client.GetObject(request);
            HttpStatusCode status = isPartial ? HttpStatusCode.PartialContent : HttpStatusCode.OK;
            HttpResponseMessage result = new HttpResponseMessage(status);

            result.Content = new StreamContent(response.ResponseStream);
            string contentType = response.Headers["Content-Type"];
            result.Content.Headers.ContentLength = resource.Size;
            if (isPartial)
            {
                result.Content.Headers.ContentLength = to - from + 1;//resource.Size;
                result.Content.Headers.ContentRange = new ContentRangeHeaderValue(from, to, resource.Size);
            }
            result.Content.Headers.ContentType =
                new MediaTypeHeaderValue(contentType);//contentType);
            return result;

        }

        [Authorize]
        public async Task<HttpResponseMessage> GetMedia(string id)
        {
            bool isPartial = false;

            UserRepository ur = new UserRepository();
            string username = User.Identity.Name;
            User user = ur.Get(username);

            Repository.ResourceRepository repository = new Repository.ResourceRepository();
            DigitalResource resource = repository.Get(id, user);

            if (resource.OriginalFileName.ToLower().Contains("jpg") || resource.OriginalFileName.ToLower().Contains("mp4"))
            {
                //await stream.CopyToAsync(stream2,);
                // Create a client
                AmazonS3Client client = new AmazonS3Client();

                long from = 0;
                long to = 0;

                GetObjectRequest request = null;
                if (Request.Headers.Range != null)
                {
                    isPartial = true;
                    //If the last-byte-pos value is absent, or if the value is greater than or equal to the current length of the entity-body, 
                    //last -byte-pos is taken to be equal to one less than the current length of the entity- body in bytes.
                    //*-The final 500 bytes(byte offsets 9500 - 9999, inclusive):
                    //    bytes = -500
                    //  - Or bytes = 9500 -
                    if (Request.Headers.Range.Ranges.First().From == null)
                    {
                        from = (resource.Size - 1) - (long)Request.Headers.Range.Ranges.First().To;
                    }
                    else //From byte is specified
                    {
                        from = (long)Request.Headers.Range.Ranges.First().From;
                    }

                    to = resource.Size - 1;
                    if (Request.Headers.Range.Ranges.First().To != null)
                    {
                        to = (long)Request.Headers.Range.Ranges.First().To;
                    }
                    else//Chrome often sends out a 0- request. Instead of passing back a massive file, just pass back the first 500 bytes
                    {
                        if (from == 0)
                        {
                            to = 499;
                        }
                    }
                    request = new GetObjectRequest
                    {
                        BucketName = "piccoli",
                        Key = id,
                        ByteRange = new ByteRange(from, to)
                    };
                }
                else
                {
                    request = new GetObjectRequest
                    {
                        BucketName = "piccoli",
                        Key = id
                    };
                }
                // Issue request and remember to dispose of the response
                //using 
                GetObjectResponse response = client.GetObject(request);
                HttpStatusCode status = isPartial ? HttpStatusCode.PartialContent : HttpStatusCode.OK;
                HttpResponseMessage result = new HttpResponseMessage(status);

                result.Content = new StreamContent(response.ResponseStream);
                string contentType = response.Headers["Content-Type"];
                result.Content.Headers.ContentLength = resource.Size;
                if (isPartial)
                {
                    result.Content.Headers.ContentLength = to - from + 1;//resource.Size;
                    result.Content.Headers.ContentRange = new ContentRangeHeaderValue(from, to, resource.Size);
                }
                result.Content.Headers.ContentType =
                    new MediaTypeHeaderValue(contentType);//contentType);
                return result;
            }
            else
            {
                HttpResponseMessage result = new HttpResponseMessage(HttpStatusCode.OK);
                MemoryStream memoryStream = TextToImage(1280, 720, "Not able to render "+ resource.OriginalFileName);
                result.Content = new StreamContent(memoryStream);
                result.Content.Headers.ContentType =
                    new MediaTypeHeaderValue("application/octet-stream");
                return result;
            }

        }

        /// <summary>
        /// if it's an image, then resize it as necessary.
        /// if it's a video, then provide a frame representation of the video
        /// otherwise generate a placeholder image.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="thumbnailHeight"></param>
        /// <returns></returns>
        [Authorize]
        public HttpResponseMessage GetThumbnailRepresentation(string id)
        {
            UserRepository ur = new UserRepository();
            string username = User.Identity.Name;
            User user = ur.Get(username);

            int thumbnailHeight = 120;
            Repository.ResourceRepository repository = new Repository.ResourceRepository();
            DigitalResource resource = repository.Get(id, user);
            string mimeType = String.Empty;
            if (resource.OriginalFileName.IndexOf(".") > 0)
            {
                string extension = resource.OriginalFileName.Substring(resource.OriginalFileName.LastIndexOf(".") + 1);
                mimeType = MimeTypeHelper.GetMimeType(resource.OriginalFileName.Substring(resource.OriginalFileName.LastIndexOf(".") + 1));
            }

            //await stream.CopyToAsync(stream2,);
            // Create a client
            AmazonS3Client client = new AmazonS3Client();

            GetObjectRequest request = null;

            request = new GetObjectRequest
            {
                BucketName = "piccoli",
                Key = id
            };

            // Issue request and remember to dispose of the response
            //using 
            GetObjectResponse response = client.GetObject(request);
            HttpResponseMessage result = new HttpResponseMessage(HttpStatusCode.OK);


            if (mimeType.Contains("image"))
            {
                Image myImage = Image.FromStream(response.ResponseStream);

                float multiplicationRatio = (float)thumbnailHeight / (float)myImage.Height;
                int thumbnailWidth = (int)(multiplicationRatio * myImage.Width);
                Bitmap bmp = ResizeImage(myImage, thumbnailWidth, thumbnailHeight);
                MemoryStream memoryStream = new MemoryStream();
                bmp.Save(memoryStream, System.Drawing.Imaging.ImageFormat.Jpeg);
                memoryStream.Position = 0;
                result.Content = new StreamContent(memoryStream);
                result.Content.Headers.ContentType =
                    new MediaTypeHeaderValue("application/octet-stream");
            }
            //else if (mimeType.Contains("video"))
            //{
            //    VideoFileReader reader = new VideoFileReader();
            //    reader.
            //    Bitmap bmp = reader.ReadVideoFrame();
            //    MemoryStream memoryStream = new MemoryStream();
            //    bmp.Save(memoryStream, System.Drawing.Imaging.ImageFormat.Jpeg);
            //    memoryStream.Position = 0;
            //    result.Content = new StreamContent(memoryStream);
            //    result.Content.Headers.ContentType =
            //        new MediaTypeHeaderValue("application/octet-stream");
            //}
            else
            {
                MemoryStream memoryStream = TextToImage(200,120, "Non image resource");
                result.Content = new StreamContent(memoryStream);
                result.Content.Headers.ContentType =
                    new MediaTypeHeaderValue("application/octet-stream");
            }

            return result;

        }

        private static MemoryStream TextToImage(int width, int height, string text)
        {
            //create an image as a placeholder for the resource.
            Image placeHolder = new Bitmap(width, height, PixelFormat.Format24bppRgb);
            Graphics gphx = Graphics.FromImage(placeHolder);

            // Create a font
            Font fontWatermark = new Font("Verdana", 18, FontStyle.Italic);

            // Indicate that the text should be 
            // center aligned both vertically
            // and horizontally...
            StringFormat stringFormat = new StringFormat();
            stringFormat.Alignment = StringAlignment.Center;
            stringFormat.LineAlignment = StringAlignment.Center;

            // Add the watermark...
            gphx.DrawString(text,
                           fontWatermark, Brushes.Beige,
                           new Rectangle(10, 10, width - 10,
                             height - 10),
                           stringFormat);


            MemoryStream memoryStream = new MemoryStream();
            placeHolder.Save(memoryStream, System.Drawing.Imaging.ImageFormat.Jpeg);
            memoryStream.Position = 0;

            gphx.Dispose();
            return memoryStream;
        }

        /// <summary>
        /// Resize the image to the specified width and height.
        /// </summary>
        /// <param name="image">The image to resize.</param>
        /// <param name="width">The width to resize to.</param>
        /// <param name="height">The height to resize to.</param>
        /// <returns>The resized image.</returns>
        public static Bitmap ResizeImage(Image image, int width, int height)
        {
            var destRect = new Rectangle(0, 0, width, height);
            var destImage = new Bitmap(width, height);

            destImage.SetResolution(image.HorizontalResolution, image.VerticalResolution);

            using (var graphics = Graphics.FromImage(destImage))
            {
                graphics.CompositingMode = CompositingMode.SourceCopy;
                graphics.CompositingQuality = CompositingQuality.HighQuality;
                graphics.InterpolationMode = InterpolationMode.HighQualityBicubic;
                graphics.SmoothingMode = SmoothingMode.HighQuality;
                graphics.PixelOffsetMode = PixelOffsetMode.HighQuality;

                using (var wrapMode = new ImageAttributes())
                {
                    wrapMode.SetWrapMode(WrapMode.TileFlipXY);
                    graphics.DrawImage(image, destRect, 0, 0, image.Width, image.Height, GraphicsUnit.Pixel, wrapMode);
                }
            }

            return destImage;
        }

        private static MediaTypeHeaderValue GetMediaType(DigitalResource resource)
        {
            String ext = String.Empty;
            if (resource.OriginalFileName.Contains("."))
            {
                ext = resource.OriginalFileName.Substring(resource.OriginalFileName.IndexOf(".") + 1);
            }
            if (String.IsNullOrEmpty(ext))
            {
                ext = "application/octet-stream";
            }
            string mimeType = MimeTypeHelper.GetMimeType(ext);
            MediaTypeHeaderValue _mediaType = MediaTypeHeaderValue.Parse(mimeType);
            return _mediaType;
        }

        /// <summary>
        /// Uploads a resource 
        /// </summary>
        [Authorize]
        [HttpPut]
        public IHttpActionResult Upload()
        {
            //throw new Exception("forced error");
            HttpResponseMessage response = new HttpResponseMessage();
            var httpRequest = HttpContext.Current.Request;
            DigitalResource myResource = null;
            //DigitalResource resource = null;
            //if (albumID != null)
            {
                System.Web.HttpFileCollection files = System.Web.HttpContext.Current.Request.Files;
                Repository.ResourceRepository repository = new Repository.ResourceRepository();
                ReferenceRepository refRepository = new ReferenceRepository();
                UserRepository ur = new UserRepository();
                string currentUser = User.Identity.Name;
                User user = ur.Get(currentUser);
                //Album album = repository.GetAlbums(x => x.Name == albumID).FirstOrDefault();

                //for (int i = 0; i < files.Count; i++)
                {
                    HttpPostedFile file = files[0];

                    string name = file.FileName;
                    using (Stream fileStream = file.InputStream)
                    {
                        myResource = repository.SaveOrGet(refRepository, user, fileStream, name);
                    }
                }
            }

            return Ok(myResource);
        }

        /// <summary>
        /// Uploads a resource 
        /// </summary>
        [Authorize]
        [HttpPost]
        public IHttpActionResult UploadResource()
        {
            //throw new Exception("forced error");
            HttpResponseMessage response = new HttpResponseMessage();
            var httpRequest = HttpContext.Current.Request;
            DigitalResource myResource = null;
            //DigitalResource resource = null;
            //if (albumID != null)
            {
                System.Web.HttpFileCollection files = System.Web.HttpContext.Current.Request.Files;
                Repository.ResourceRepository repository = new Repository.ResourceRepository();
                ReferenceRepository refRepository = new ReferenceRepository();
                UserRepository ur = new UserRepository();
                string currentUser = User.Identity.Name;
                User user = ur.Get(currentUser);
                //Album album = repository.GetAlbums(x => x.Name == albumID).FirstOrDefault();

                //for (int i = 0; i < files.Count; i++)
                {
                    HttpPostedFile file = files[0];

                    string name = file.FileName;
                    using (Stream fileStream = file.InputStream)
                    {
                        myResource = repository.SaveOrGet(refRepository, user, fileStream, name);
                    }
                }
            }

            return Ok(myResource);
        }

        /// <summary>
        /// uploads part of a large file
        /// </summary>
        /// <param name="md5OfResource">the identifier key of the file. MD5 hash recommended</param>
        /// <param name="uploadIdentifier">the S3 API identifier given to the group of uploads. Keep empty if not initialised (first call in sequence)</param>
        /// <param name="partNumber">the file number in the sequence</param>
        /// <param name="numberOfParts">the total number of parts that make up the whole</param>
        /// <returns>the S3 Ekey of the partial upload</returns>
        //[Authorize]
        [HttpPost]
        public async Task<string> UploadPartial()
        {
            //assemble parameters
            var streamProvider = new CustomMultipartFileStreamProvider();
            await Request.Content.ReadAsMultipartAsync(streamProvider);
            string md5OfResource = streamProvider.FormData["md5OfResource"];
            string uploadIdentifier = streamProvider.FormData["uploadIdentifier"];
            int partNumber = int.Parse(streamProvider.FormData["partNumber"]);
            int numberOfParts = int.Parse(streamProvider.FormData["numberOfParts"]);

            string id = String.Empty;
            HttpResponseMessage response = new HttpResponseMessage();
            var httpRequest = HttpContext.Current.Request;
            //DigitalResource resource = null;
            //if (albumID != null)
            foreach (KeyValuePair<string, Stream> file in streamProvider.FileStreams)
            {
                string fileName = file.Key;
                Stream stream = file.Value;
                //System.Web.HttpFileCollection files = System.Web.HttpContext.Current.Request.Files;
                Repository.ResourceRepository repository = new Repository.ResourceRepository();
                ReferenceRepository refRepository = new ReferenceRepository();
                UserRepository ur = new UserRepository();
                string currentUser = User.Identity.Name;
                User user = ur.Get(currentUser);
                //Album album = repository.GetAlbums(x => x.Name == albumID).FirstOrDefault();
                    
                //string name = file.FileName;

                id = await repository.UploadPartial(user, md5OfResource, uploadIdentifier, stream, partNumber, numberOfParts);

            }

            return id;
        }

        /// <summary>
        /// combine the partial uploads into the original resource
        /// </summary>
        /// <param name="uploadID">id of the sequence of partial uploads</param>
        /// <param name="partIDs"></param>
        /// <param name="originalName"></param>
        /// <param name="md5OfResource">md5 of entire resource (not md5 of part hashes)</param>
        /// <param name="totalSize"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<string> CompletePartialAndSaveResource(PartialUpload partialUploadDetails)
        {
            ReferenceRepository refRepository = new ReferenceRepository();
            UserRepository ur = new UserRepository();
            string currentUser = User.Identity.Name;
            User user = ur.Get(currentUser);

            Repository.ResourceRepository repository = new Repository.ResourceRepository();
            string resourceTagID = repository.CompletePartialAndSaveResource(refRepository, 
                user, 
                partialUploadDetails.uploadID, partialUploadDetails.originalName,
                partialUploadDetails.md5OfResource,
                partialUploadDetails.partTags,
                partialUploadDetails.totalSize);
            return resourceTagID;
        }

        [Authorize]
        [HttpGet]
        public bool DoesMd5Exist(string id)
        {
            UserRepository ur = new UserRepository();
            string currentUser = User.Identity.Name;
            User user = ur.Get(currentUser);

            Repository.ResourceRepository repository = new Repository.ResourceRepository();
            return repository.ResourceExists(id, user);
        }

        public void AddTag(string resourceID, string tag)
        {
            UserRepository ur = new UserRepository();
            string username = User.Identity.Name;
            User user = ur.Get(username);

            Repository.ResourceRepository repository = new Repository.ResourceRepository();
            TagRepository tagRepository = new TagRepository();

            DigitalResource resource = repository.Get(resourceID, user);
            ResourceModel.Tag tagToAdd = tagRepository.GetOrAdd(tag);

            resource.AddTag(tagToAdd);
        }
    }
}
