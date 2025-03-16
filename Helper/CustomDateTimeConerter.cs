using System;
using System.Collections.Generic;
using System.Web.Script.Serialization;

public class CustomDateTimeConverter : JavaScriptConverter
{
	public override IEnumerable<Type> SupportedTypes
	{
		get { return new List<Type> { typeof(DateTime) }; }
	}

	public override object Deserialize(IDictionary<string, object> dictionary, Type type, JavaScriptSerializer serializer)
	{
		throw new NotImplementedException();
	}

	public override IDictionary<string, object> Serialize(object obj, JavaScriptSerializer serializer)
	{
		DateTime date = (DateTime)obj;
		return new Dictionary<string, object>
		{
			{ "Date", date.ToString("yyyy-MM-dd HH:mm:ss") } 
        };
	}
}
