using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Web.DynamicData;

namespace CountDown.Entities
{
    [TableName("COUNTUP")]
    public class Countup
    {
        [Key]
        public int Id { get; set; }
        public string Title { get; set; }  
        public DateTime StartDate { get; set; } 
    }

}