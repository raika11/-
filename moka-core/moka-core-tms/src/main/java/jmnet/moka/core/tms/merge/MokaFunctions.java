package jmnet.moka.core.tms.merge;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import jmnet.moka.common.template.merge.Functions;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tms.merge.item.ComponentItem;
import jmnet.moka.core.tms.merge.item.PageItem;

/**
 * 
 * <pre>
 * 템플릿에서 사용할 함수를 정의한다.
 * 2020. 11. 5. kspark 최초생성
 * </pre>
 * @since 2020. 11. 5. 오후 4:19:39
 * @author kspark
 */
public class MokaFunctions extends Functions {
	public String cloc(String url, PageItem pageItem, ComponentItem componentItem) {
		if ( url == null || url.length() == 0) return "";
		String cloc = "joongang-" +
				(pageItem==null?"none":pageItem.getItemId()) + "-" +
				(componentItem==null?"none":componentItem.getItemId());
		if ( url.contains("?")) {
			return  url + "&cloc=" + cloc;
		} else {
			return  url + "?cloc=" + cloc;
		}
	}

	public String cloc(String url, String cloc) {
		return url.contains("?") ? url+"&cloc="+cloc : url+"?cloc="+cloc;
	}

	private String getString(Map<String,Object> map, String column) {
		Object obj = map.get(column);
		if ( obj != null) {
			return obj.toString().trim();
		}
		return "";
	}

	public String joinColumn(List<Map<String,Object>> mapList, String column) {
		return joinColumn(mapList, column, ",");
	}

	public String joinColumn(List<Map<String,Object>> mapList, String column, String separator) {
		if ( mapList == null || mapList.size() == 0) return "";
		List<String> valueList = new ArrayList<>();
		for(Map<String,Object> map:mapList) {
			valueList.add(this.getString(map,column));
		}
		return String.join(separator, valueList);
	}

	public String joinMultiColumn(List<Map<String,Object>> mapList, String... columns) {
		if ( mapList == null || mapList.size() == 0) return "";
		List<String> rowList = new ArrayList<>();
		for(Map<String,Object> map:mapList) {
			List<String> valueList = new ArrayList<>();
			for ( String column : columns) {
				valueList.add(this.getString(map,column));
			}
			rowList.add(String.join(",", valueList));
		}
		return String.join("|", rowList);
	}

	public String findColumn(List<Map<String,Object>> mapList, String matchColumn, String matchValue, String returnColumn) {
		for ( Map map : mapList) {
			String val = this.getString(map,matchColumn);
			if ( val.equals(matchValue)) {
				return (String)map.get(returnColumn);
			}
		}
		return "";
	}
}
