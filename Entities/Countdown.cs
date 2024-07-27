using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.DynamicData;

namespace CountDown.Entities
{
	[TableName("COUNTDOWN")]
	public class Countdown
	{
		public int? Id { get; set; }
		public string UserId { get; set; }
		public string Title { get; set; }
		public DateTime StartDate { get; set; }
		public DateTime EndDate { get; set; }
		public DateTime CreateDate { get; set; }
	

	}
}