using NHibernate.Criterion;
using ResourceModel;
using ResourceRepository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository
{
    public class UserRepository
    {
        public User Get(string userName)
        {

            var sessionFactory = SessionFactoryCreator.CreateSessionFactory();

            using (var session = sessionFactory.OpenSession())
            {
                using (session.BeginTransaction())
                {
                    //List<SubjectSample> subjectSamples = session.CreateCriteria(typeof(Model.SubjectSample)).List<Model.SubjectSample>().ToList();

                    //Quantity volume = subjectSamples[0].Volume;
                    User user = session.CreateCriteria(typeof(User)).Add(Restrictions.Eq("UserName", userName)).UniqueResult<User>();
                    //List<SubjectSample> subjectSamplesp = projects[60].SubjectSamples.ToList();
                    return user;
                }
            }
        }
    }
}
