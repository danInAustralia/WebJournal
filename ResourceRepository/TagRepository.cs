using ResourceModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Configuration;

namespace ResourceRepository
{
    public class TagRepository
    {
        private static readonly string DatabaseID = WebConfigurationManager.AppSettings["database"];
        private static readonly string CollectionID = WebConfigurationManager.AppSettings["collection"];

        public Tag GetOrAdd(string tag)
        {
            Tag resourceTag;

            var sessionFactory = SessionFactoryCreator.CreateSessionFactory();

            using (var session = sessionFactory.OpenSession())
            {
                using (session.BeginTransaction())
                {
                    //session.CreateCriteria(typeof(DigitalResource)).ToList();
                    resourceTag = session.QueryOver<Tag>()
                                    .Where(x => x.TagName == tag)
                                    .List().FirstOrDefault();

                    //if it doesn't yet exist, create it
                    if(resourceTag == null)
                    {
                        resourceTag = new Tag
                        {
                            TagName = tag
                        };
                        session.SaveOrUpdate(resourceTag);
                        session.Transaction.Commit();

                        //get the new tag from the database
                        resourceTag = session.QueryOver<Tag>()
                            .Where(x => x.TagName == tag)
                            .List().FirstOrDefault();
                    }
                }
            }

            return resourceTag;
        }
    }
}
