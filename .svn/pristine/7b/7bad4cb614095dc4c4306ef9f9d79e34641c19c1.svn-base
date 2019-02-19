using ResourceModel;
using ResourceRepository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository
{
    public class ReferenceRepository
    {
        public List<Tag> AllTags()
        {
            var sessionFactory = SessionFactoryCreator.CreateSessionFactory();

            using (var session = sessionFactory.OpenSession())
            {
                using (session.BeginTransaction())
                {
                    List<Tag> tags = session.CreateCriteria(typeof(Tag)).List<Tag>().ToList();
                    return tags;
                }
            }
        }

        public List<ResourceType> AllResourceTypes()
        {
            var sessionFactory = SessionFactoryCreator.CreateSessionFactory();

            using (var session = sessionFactory.OpenSession())
            {
                using (session.BeginTransaction())
                {
                    List<ResourceType> resourceType = session.CreateCriteria(typeof(ResourceType)).List<ResourceType>().ToList();
                    return resourceType;
                }
            }
        }
    }
}
