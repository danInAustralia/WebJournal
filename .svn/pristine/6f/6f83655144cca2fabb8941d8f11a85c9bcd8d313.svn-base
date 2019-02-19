using Amazon.S3;
using Amazon.S3.Model;
using Repository;
using ResourceModel;
using ResourceRepository;
using System;
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

        public async Task<HttpResponseMessage> Get(string id)
        {

            Repository.ResourceRepository repository = new Repository.ResourceRepository();
            DigitalResource resource = repository.Get(id);
            //await stream.CopyToAsync(stream2,);
            // Create a client
            AmazonS3Client client = new AmazonS3Client();

            GetObjectRequest request = null;
            if (Request.Headers.Range != null)
            {

                if (Request.Headers.Range.Ranges.First().To == null)
                {
                    // Create a GetObject request
                    request = new GetObjectRequest
                    {
                        BucketName = "piccoli",
                        Key = id
                    };
                }
                else
                {
                    request = new GetObjectRequest
                    {
                        BucketName = "piccoli",
                        Key = id,
                        ByteRange = new ByteRange((long)Request.Headers.Range.Ranges.First().From,
                            Request.Headers.Range.Ranges.First().To == null ? 0 : (long)Request.Headers.Range.Ranges.First().To)
                    };
                }
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
            HttpResponseMessage result = new HttpResponseMessage(HttpStatusCode.OK);
            result.Content = new StreamContent(response.ResponseStream);
            result.Content.Headers.ContentType =
                new MediaTypeHeaderValue("application/octet-stream");
            return result;

        }

        /// <summary>
        /// if it's an image, then resize it as necessary.
        /// if it's a video, then provide a frame representation of the video
        /// otherwise generate a placeholder image.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="thumbnailHeight"></param>
        /// <returns></returns>
        public HttpResponseMessage GetThumbnailRepresentation(string id)
        {
            int thumbnailHeight = 120;
            Repository.ResourceRepository repository = new Repository.ResourceRepository();
            DigitalResource resource = repository.Get(id);
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
                //create an image as a placeholder for the resource.
                Image placeHolder = new Bitmap(200, 120, PixelFormat.Format24bppRgb);
                Graphics gphx = Graphics.FromImage(placeHolder);

                // Create a font
                Font fontWatermark = new Font("Verdana", 8, FontStyle.Italic);

                // Indicate that the text should be 
                // center aligned both vertically
                // and horizontally...
                StringFormat stringFormat = new StringFormat();
                stringFormat.Alignment = StringAlignment.Center;
                stringFormat.LineAlignment = StringAlignment.Center;

                // Add the watermark...
                gphx.DrawString("Non image resource",
                               fontWatermark, Brushes.Beige,
                               new Rectangle(10, 10, 200 - 10,
                                 120 - 10),
                               stringFormat);


                MemoryStream memoryStream = new MemoryStream();
                placeHolder.Save(memoryStream, System.Drawing.Imaging.ImageFormat.Jpeg);
                memoryStream.Position = 0;

                gphx.Dispose();
                result.Content = new StreamContent(memoryStream);
                result.Content.Headers.ContentType =
                    new MediaTypeHeaderValue("application/octet-stream");
            }

            return result;

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

        public bool DoesMd5Exist(string md5)
        {
            return true;
        }

        public void AddTag(string resourceID, string tag)
        {
            Repository.ResourceRepository repository = new Repository.ResourceRepository();
            TagRepository tagRepository = new TagRepository();

            DigitalResource resource = repository.Get(resourceID);
            ResourceModel.Tag tagToAdd = tagRepository.GetOrAdd(tag);

            resource.AddTag(tagToAdd);
        }
    }
}
