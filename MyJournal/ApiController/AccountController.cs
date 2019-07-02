using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Host.SystemWeb;
using MyJournal.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace MyJournal.ApiController
{
    public class AccountController : System.Web.Http.ApiController
    {

        private ApplicationSignInManager _signInManager;
        public ApplicationSignInManager SignInManager
        {
            get
            {
                if(_signInManager == null)
                {
                    var abc = Request.GetOwinContext();
                    ApplicationSignInManager manager = abc.Get<ApplicationSignInManager>();
                }
                return _signInManager ?? Request.GetOwinContext().Get<ApplicationSignInManager>();
            }
            private set
            {
                _signInManager = value;
            }
        }

        private ApplicationUserManager _userManager;
        public ApplicationUserManager UserManager
        {
            get
            {
                if (_userManager == null)
                {
                    var abc = Request.GetOwinContext();
                    ApplicationUserManager manager = abc.Get<ApplicationUserManager>();
                }
                return _userManager ?? Request.GetOwinContext().Get<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }

        // POST: /Account/Register
        [HttpPost]
        public async void Register(RegisterViewModel model)
        {
            if (ModelState.IsValid)
            {
                var user = new ApplicationUser { UserName = model.Email, Email = model.Email };
                var result = await UserManager.CreateAsync(user, model.Password);
                if (result.Succeeded)
                {
                    await SignInManager.SignInAsync(user, isPersistent: false, rememberBrowser: false);

                    // For more information on how to enable account confirmation and password reset please visit http://go.microsoft.com/fwlink/?LinkID=320771
                    // Send an email with this link
                    string code = await UserManager.GenerateEmailConfirmationTokenAsync(user.Id);
                    //var callbackUrl = Url.Action("ConfirmEmail", "Account", new { userId = user.Id, code = code }, protocol: Request.Url.Scheme);
                    //await UserManager.SendEmailAsync(user.Id, "Confirm your account", "Please confirm your account by clicking <a href=\"" + callbackUrl + "\">here</a>");

                    //return RedirectToAction("Index", "Home");
                }
                //AddErrors(result);
            }

            // If we got this far, something failed, redisplay form
            //return View(model);

            //--------Taxcloud
            //List<KeyValuePair<string, string>> ErrorList = new List<KeyValuePair<string, string>>();
            //if (!ModelState.IsValid)
            //{
            //    var Vals = ModelState.Values.ToList();
            //    var keys = ModelState.Keys.ToList();
            //    for (int i = 0; i < Vals.Count; i++)
            //    {
            //        var errors = Vals[i].Errors.ToList();
            //        if (errors.Count > 0)
            //        {
            //            ErrorList.Add(new KeyValuePair<string, string>(keys[i], errors[0].ErrorMessage));
            //        }
            //    }
            //    return ActionResultFactory.ValidationErrorsResult(ErrorList);
            //}
            //else
            //{
            //    //var ret = isValidPassword(model.Password);
            //    //if (!ret.IsSuccess)
            //    //{
            //    //    ErrorList.Add(new KeyValuePair<string, string>("model.Password", ret.FriendlyError));
            //    //    return ActionResultFactory.ValidationErrorsResult(ErrorList);
            //    //}

            //    HttpContext.Current.GetOwinContext().GetUserManager<ApplicationUserManager>();
            //    var existuser = IdentityService.UserManager.FindByName(model.Email);
            //    if (existuser != null)
            //    {
            //        if (!existuser.EmailConfirmed)
            //        {
            //            var message = string.Format("{0} already exists but has not been activated.", model.Email);
            //            //TaxLogger.Audit(message);
            //            ErrorList.Add(new KeyValuePair<string, string>("model.Email.activation", "This user already exists but has not been activated."));
            //        }
            //        else
            //        {
            //            var message = string.Format("{0} already exists but try to register the second time", model.Email);
            //            //TaxLogger.Audit(message);
            //            ErrorList.Add(new KeyValuePair<string, string>("model.Email.activation", "User already exists. Try logging in"));
            //        }
            //        return ActionResultFactory.ValidationErrorsResult(ErrorList);
            //    }
            //    if (Regex.IsMatch(model.LastName, "[<>@/\\!]"))
            //    {
            //        ErrorList.Add(new KeyValuePair<string, string>("model.LastName", "User Last Name contains invalid characters"));
            //        return ActionResultFactory.ValidationErrorsResult(ErrorList);
            //    }
            //    var user = new ApplicationUser { UserName = model.Email, Email = model.Email };

            //    var result = IdentityService.UserManager.Create(user, model.Password);
            //    if (result.Succeeded)
            //    {
            //        try
            //        {
            //            UserRepository.AddUpdateUser(model.Email, model.FirstName, model.LastName, BizName: null);
            //            AccountService.SendAccountConfirmationEmail(user.Id);
            //            var message = string.Format("{0} has reigstered as user with First Name '{1}' and Last Name '{2}'", model.Email, model.FirstName, model.LastName);
            //            TaxLogger.Audit(message);
            //        }
            //        catch (Exception ex)
            //        {
            //            //TaxLogger.Error(ex, string.Format("Error to register user: {0}", ex.Message));
            //            AccountService.RemoveUserFromIdentityModule(model.Email);
            //            ErrorList.Add(new KeyValuePair<string, string>("Login", "Could not update user details"));
            //            return ActionResultFactory.ValidationErrorsResult(ErrorList);
            //        }
            //    }
            //    else
            //    {
            //        foreach (string err in result.Errors)
            //        {
            //            ErrorList.Add(new KeyValuePair<string, string>("Login", err));
            //        }
            //        return ActionResultFactory.ValidationErrorsResult(ErrorList);
            //    }
            //}
        }

        //
        // GET: /Account/ConfirmEmail
        [AllowAnonymous]
        public async Task<bool> ConfirmEmail(string userId, string code)
        {
            var result = await UserManager.ConfirmEmailAsync(userId, code);
            return result.Succeeded;
        }

        /// <summary>
        /// this get called when the user clicks reset password. It generates a code associated with their email.
        /// This code will be used as a parameter to ResetPassword
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        //[AllowAnonymous]
        public async Task ForgotPassword(ForgotPasswordViewModel model)
        {
            if (ModelState.IsValid)
            {
                AccountRepository _repo = new AccountRepository();
                var user = await _repo.FindByNameAsync(model.Email);
                if (user == null || !(await _repo.IsEmailConfirmedAsync(user)))
                {
                    // Don't reveal that the user does not exist or is not confirmed
                    return; ;// View("ForgotPasswordConfirmation");
                }

                // For more information on how to enable account confirmation and password reset please visit http://go.microsoft.com/fwlink/?LinkID=320771
                // Send an email with this link
                string code = await _repo.GeneratePasswordResetTokenAsync(user.Id);
                string port = Request.RequestUri.Port == 443 ? String.Empty : ":"+Request.RequestUri.Port.ToString();
                var callbackUrl = Request.RequestUri.Scheme + "://" + Request.RequestUri.Host + port  + "/#/reset?userID=" + model.Email + "&code=" + code;
                //var callbackUrl = Url.Action("ResetPassword", "Account", new { userId = user.Id, code = code }, protocol: Request.Url.Scheme);
                await _repo.SendEmailAsync(user.Id, "Reset Password", "<p>Dear customer,</p> <p>we have received a request to reset your password. If this was not you, please ignore this e-mail.</p><p>Otherwise, please reset your password by clicking <a href=\"" + callbackUrl + "\">here</a></p><p>Please note that this is an automated email. Please end any further queries to "+ ConfigurationManager.AppSettings["SupportEmailAddr"] + "</p>");
                // return RedirectToAction("ForgotPasswordConfirmation", "Account");
            }

            // If we got this far, something failed, redisplay form
            //return View(model);
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task ResetPassword(ResetPasswordViewModel model)
        {
            if (ModelState.IsValid)
            {
                AccountRepository _repo = new AccountRepository();
                var user = await UserManager.FindByNameAsync(model.Email);
                if (user == null)
                {
                    // Don't reveal that the user does not exist
                    return;
                }
                await _repo.ResetPasswordAsync(user.Id, model.Code, model.Password);
            }
        }
    }
}