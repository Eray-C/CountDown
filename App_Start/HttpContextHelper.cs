using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CountDown.App_Start
{
	public static class HttpContextHelper
	{
		private static HttpContextBase _httpContext;

		public static void SetHttpContext(HttpContextBase httpContext)
		{
			_httpContext = httpContext;
		}

		public static string GetCurrentUserId()
		{
			if (_httpContext != null && _httpContext.User.Identity.IsAuthenticated)
			{
				return _httpContext.User.Identity.Name;
			}
			return null;
		}
	}

}