using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.OAuth;
using MyJournal.ApiController;
using MyJournal.Models;
using Repository;
using ResourceModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;

namespace MyJournal.Providers
{
    public class SimpleAuthorizationServerProvider : OAuthAuthorizationServerProvider
    {
        public override async Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {
            context.Validated();
        }

        public override Task TokenEndpoint(OAuthTokenEndpointContext context)
        {
            foreach (KeyValuePair<string, string> property in context.Properties.Dictionary)
            {
                context.AdditionalResponseParameters.Add(property.Key, property.Value);
            }

            return Task.FromResult<object>(null);
        }

        public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        {

            context.OwinContext.Response.Headers.Add("Access-Control-Allow-Origin", new[] { "*" });
            UserDetail userDetail = null;

            using (AccountRepository _repo = new AccountRepository())
            {
                UserRepository repository = new UserRepository();
                ApplicationUser user = await _repo.FindUser(context.UserName, context.Password);
                if (user != null)
                {
                    userDetail = repository.GetUserDetails(user.Id);
                }

                if (user == null)
                {
                    context.SetError("invalid_grant", "The user name or password is incorrect.");
                    return;
                }
            }

            var identity = new ClaimsIdentity(context.Options.AuthenticationType);

            identity.AddClaim(new Claim("sub", context.UserName));
            identity.AddClaim(new Claim("role", "user"));
            identity.AddClaim(new Claim(ClaimTypes.Name, context.UserName));


            var userDetails = new AuthenticationProperties(new Dictionary<string, string>
            {
                {
                    "FirstName", userDetail == null ? context.UserName : userDetail.FirstName
                },
                {
                    "NickName", userDetail == null ? context.UserName : (userDetail.NickName == null ? userDetail.FirstName : userDetail.NickName)
                }
            });

            var ticket = new AuthenticationTicket(identity, userDetails);
            context.Validated(ticket);

        }
    }
}