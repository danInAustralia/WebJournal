using System.Web;
using System.Web.Optimization;

namespace MyJournal
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-2.2.3.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            bundles.Add(new ScriptBundle("~/bundles/angular")
                .Include("~/Scripts/angular.js")
                .Include("~/Scripts/angular-animate.min.js")
                .Include("~/Scripts/angular-messages.js")
                .Include("~/Scripts/angular-aria.min.js")
                .Include("~/Scripts/angular-route.js")
                .Include("~/Scripts/angular-material.js")
                .Include("~/Scripts/moment.min.js")
                .Include("~/Scripts/angular-file-upload.js")
                .Include("~/Scripts/angular-local-storage.js")
                .Include("~/Scripts/angular-ui.js")
                .Include("~/Scripts/loading-bar.min.js")
                );

            bundles.Add(new ScriptBundle("~/bundles/fileSaver")
                .Include("~/Scripts/fileSaver.js")
                );

            bundles.Add(new ScriptBundle("~/bundles/devExpress")
                .Include("~/Scripts/dx.web.js")
                );

            bundles.Add(new ScriptBundle("~/bundles/md5")
                .Include("~/Scripts/md5.js")
                );


            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/angular-ui/ui-bootstrap-tpls.js",
                      "~/Scripts/respond.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/angular-ui.css",
                      "~/Content/ui-bootstrap-csp.css",
                      "~/Content/site.css",
                      "~/Content/dx.common.css",
                      "~/Content/dx.spa.css",
                      "~/Content/dx.light.css"));
        }
    }
}
