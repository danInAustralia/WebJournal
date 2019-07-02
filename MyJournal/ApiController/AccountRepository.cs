using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security.DataProtection;
using MyJournal.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace MyJournal.ApiController
{
    public class AccountRepository : IDisposable
    {
        private ApplicationDbContext _ctx;

        private UserManager<ApplicationUser> _userManager;
        //private ApplicationSignInManager _signInManager;

        public AccountRepository()
        {
            _ctx = new ApplicationDbContext();
            var provider = new DpapiDataProtectionProvider("Journal");
            _userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(_ctx));
            _userManager.UserTokenProvider = new DataProtectorTokenProvider<ApplicationUser>(
                provider.Create("JournalToken"));
            _userManager.EmailService = new EmailService();
        }

        //public async Task<IdentityResult> RegisterUser(UserModel userModel)
        //{
        //    IdentityUser user = new IdentityUser
        //    {
        //        UserName = userModel.UserName
        //    };

        //    var result = await _userManager.CreateAsync(user, userModel.Password);

        //    return result;
        //}

        public async Task<ApplicationUser> FindUser(string userName, string password)
        {
            ApplicationUser user = await _userManager.FindAsync(userName, password);

            return user;
        }

        public async Task<ApplicationUser> FindByNameAsync(string userName)
        {
            ApplicationUser user = await _userManager.FindByNameAsync(userName);

            return user;
        }

        public async Task<bool> IsEmailConfirmedAsync(ApplicationUser user)
        {
            return await _userManager.IsEmailConfirmedAsync(user.Id);
        }

        public void Dispose()
        {
            //_ctx.Dispose();
            _userManager.Dispose();

        }

        public async Task<string> GeneratePasswordResetTokenAsync(string id)
        {
            return await _userManager.GeneratePasswordResetTokenAsync(id);
        }

        internal async Task SendEmailAsync(string userID, string emailTitle, string emailContent)
        {
            await _userManager.SendEmailAsync(userID, emailTitle, emailContent);
        }

        internal async Task ResetPasswordAsync(string id, string code, string password)
        {
            await _userManager.ResetPasswordAsync(id, code, password);
        }
    }
}