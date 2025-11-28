using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UberEats.Application.Common;

public static class MapObjects
{
    public static void Map(object source, object target)
    {
        var sourceProperties = source.GetType().GetProperties();
        var targetProperties = target.GetType().GetProperties();

        // copied from stackoverflow, maybe refactor once I understand it
        var commonProperties = from sp in sourceProperties
                               join tp in targetProperties on new {sp.Name, sp.PropertyType} equals
                                new {tp.Name, tp.PropertyType}
                               select new {sp, tp};
        
        foreach (var property in commonProperties)
        {
            var sourceValue = property.sp.GetValue(source, null);
            if (sourceValue is not null)
            {
                property.tp.SetValue(target, sourceValue, null);
            }
        }
    }
}
