﻿using System;
using System.Web;
using System.Web.Mvc;
using zsi.web.Models;
using zsi.Framework.Security.SecurityProvider;
using System.IO.Compression;
using System.Linq;

namespace zsi.web.Controllers
{
    public class baseController : Controller
    {
     

        public user CurrentUser { get { return SessionHandler.CurrentUser; } }
        public appProfile AppConfig { get { return SessionHandler.AppConfig; } }

        public IBasicFormAuth _FormAuth;
        public IBasicFormAuth FormAuth
        {
            get
            {
                if (_FormAuth == null)
                {
                    _FormAuth = new BasicFormAuth();
                }
                return _FormAuth;
            }
            set
            {
                _FormAuth = (BasicFormAuth)value;
            }
        }

 

        protected override JsonResult Json(object data, string contentType, System.Text.Encoding contentEncoding, JsonRequestBehavior behavior)
        {
            return new JsonNetResult(data, contentType, contentEncoding, JsonRequestBehavior.AllowGet);
        }
        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            if (Session["zsi_login"] == null) Session["zsi_login"] = "N";
            string ControllerName = filterContext.Controller.GetType().Name.ToLower().Replace("controller", "");
            string ActionName = filterContext.ActionDescriptor.ActionName.ToLower();
            filterContext.HttpContext.Response.Cache.SetCacheability(HttpCacheability.NoCache);

            var encodingsAccepted = filterContext.HttpContext.Request.Headers["Accept-Encoding"];
            if (!string.IsNullOrEmpty(encodingsAccepted))
            {
                string[] notIncludedInCompression = { "generateexcelfile", "generatehtmltoexcel", "loadfile" };
                if (!notIncludedInCompression.Contains(ActionName.ToLower()))
                {
                    encodingsAccepted = encodingsAccepted.ToLowerInvariant();
                    var response = filterContext.HttpContext.Response;
                    if (encodingsAccepted.Contains("deflate"))
                    {
                        response.AppendHeader("Content-encoding", "deflate");
                        response.Filter = new DeflateStream(response.Filter, CompressionMode.Compress);
                    }
                    else if (encodingsAccepted.Contains("gzip"))
                    {
                        response.AppendHeader("Content-encoding", "gzip");
                        response.Filter = new GZipStream(response.Filter, CompressionMode.Compress);
                    }
                }
            }
            base.OnActionExecuting(filterContext);
        }
        private void CheckActionLogOn(ActionExecutingContext filterContext, string CurrentActionName, string[] ExceptionedActions)
        {

            if (!Array.Exists(ExceptionedActions, e => e.Equals(CurrentActionName)))
            {

                /*if (CurrentUser.UserId == 0)
                {
                    FormAuth.AbandonUserSession();
                    filterContext.Result = new RedirectResult("/");
                }*/
            }

        }
        public ContentResult toJSON(string sql, bool isProcedure)
        {

            return Content(DataHelper.toJSON(sql, isProcedure), "application/json");
        }

        private string replaceIncludedScripts(string content) {
            return content
                    .Replace("src=\"/", "src=\"" + Url.Content("~/"))
                    .Replace("src='/", "src='" + Url.Content("~/"))
                    .Replace("href=\"/", "href=\"" + Url.Content("~/"))
                    .Replace("href='/", "href='" + Url.Content("~/"))
            ;
        }

        public void setPageLinks(string pageName)
        {
            string defaultPage = "_layout";
            dcPageData dc;
            PageData d;


            dc = new dcPageData();
            d = dc.GetData(pageName,this.CurrentUser.userId );
            ViewBag.role = (d.role != null ? d.role :"");
      

            if (d.page_id != 0)
                {
                    ViewBag.masterPage = d.master_page_name;
                    ViewBag.pageName = pageName;
                    ViewBag.pageTitle = d.page_title;
                    ViewBag.template = replaceIncludedScripts(d.pt_content);
                    ViewBag.layoutPage = string.Format("~/Views/Shared/{0}.cshtml", (d.master_page_name == null ? defaultPage : d.master_page_name));

                    if (d.zsi_lib_rev_no != 0)
                        ViewBag.zsiLibJSLink = string.Format("<script src='{0}javascript/name/zsiLib?rev={1}'></script>", Url.Content("~/"), d.zsi_lib_rev_no);

                    if (d.app_start_js_rev_no != 0)
                        ViewBag.appStartLink = string.Format("<script src='{0}javascript/name/appstart?rev={1}'></script>", Url.Content("~/"), d.app_start_js_rev_no);

                    if (d.page_js_rev_no != 0)
                        ViewBag.pageJSLink = string.Format("<script src='{0}javascript/name/{1}?rev={2}'></script>", Url.Content("~/"), pageName, d.page_js_rev_no);
                }
                else if (pageName == "admin")
                {
                    if (d.app_start_js_rev_no != 0)
                        ViewBag.appStartLink = string.Format("<script src='{0}javascript/name/appstart?rev={1}'></script>", Url.Content("~/"), d.app_start_js_rev_no);

                }
                else
                {
                    ViewBag.masterPage = defaultPage;
                    ViewBag.template = "<div class='pageNotFound'>Page Not Found.</div>";
                    ViewBag.layoutPage = string.Format("~/Views/Shared/{0}.cshtml", defaultPage);

                }
            
        }

        public void setRequestedURL()
        {
            Session["requestedURL"] = Request.Url.AbsoluteUri;
        }

        public string gePriorityURL(string currentPage)
        {

            var _sName = "requestedURL";
            string _url = currentPage;

            if (Session["isAuthenticated"] == null) Session["isAuthenticated"] = "N";
            if (Session["isAuthenticated"].ToString() == "Y"  &&  Session[_sName] != null )
            {
                _url = Session[_sName].ToString();
                Session[_sName] = null;
            }
            return _url;
        }

    }

}