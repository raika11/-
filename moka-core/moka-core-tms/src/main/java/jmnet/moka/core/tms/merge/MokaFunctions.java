package jmnet.moka.core.tms.merge;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import jmnet.moka.common.template.merge.Functions;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tms.merge.item.ComponentItem;
import jmnet.moka.core.tms.merge.item.MergeItem;
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
	/**
	 * cloc 코드를 생성한다.
	 * @param urlObj
	 * @param pageItem
	 * @param componentItem
	 * @return
	 */
	public String cloc(Object urlObj, Object pageItem, Object componentItem) {
		String url = urlObj == null ? "" : (String)urlObj;
		if ( url == null || url.length() == 0) return "";
		String cloc = "joongang-" +
				(pageItem==null?"none":((MergeItem)pageItem).getItemId()) + "-" +
				(componentItem==null?"none":((MergeItem)componentItem).getItemId());
		if ( url.contains("?")) {
			return  url + "&cloc=" + cloc;
		} else {
			return  url + "?cloc=" + cloc;
		}
	}

	public String cloc(Object urlObj, Object clocObj) {
		String url = urlObj == null ? "" : (String)urlObj;
		String cloc = clocObj == null ? "" : (String)clocObj;
		return url.contains("?") ? url+"&cloc="+cloc : url+"?cloc="+cloc;
	}

	public String cloc(Object urlObj) {
		String url = urlObj == null ? "" : (String)urlObj;
		return url;
	}

	private String getString(Map<String,Object> map, String column) {
		Object obj = map.get(column);
		if ( obj != null) {
			return obj.toString().trim();
		}
		return "";
	}

	/**
	 * 맵형태의 구조에서 특정 컬럼을 ,구분자로 합친다.
	 * @param mapList
	 * @param column
	 * @return
	 */
	public String joinColumn(List<Map<String,Object>> mapList, String column) {
		return joinColumn(mapList, column, ",");
	}

	/**
	 * 맵형태의 구조에서 특정칼럼을 구분자로 합친다.
	 * @param mapList
	 * @param column
	 * @param separator
	 * @return
	 */
	public String joinColumn(List<Map<String,Object>> mapList, String column, String separator) {
		if ( mapList == null || mapList.size() == 0) return "";
		List<String> valueList = new ArrayList<>();
		for(Map<String,Object> map:mapList) {
			valueList.add(this.getString(map,column));
		}
		return String.join(separator, valueList);
	}

	/**
	 * 맵형태의 구조에서 여러 칼럼을 ,로 합치고, Row별로 |로 구분한다.
	 * @param mapList
	 * @param columns
	 * @return
	 */
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

	/**
	 * 맵형태에서 특정 칼럼의 값이 특정 값인 경우의 다른 칼럼 값을 가져온다.
	 * @param mapList
	 * @param matchColumn
	 * @param matchValue
	 * @param returnColumn
	 * @return
	 */
	public String findColumn(List<Map<String,Object>> mapList, String matchColumn, String matchValue, String returnColumn) {
		for ( Map map : mapList) {
			String val = this.getString(map,matchColumn);
			if ( val.equals(matchValue)) {
				return (String)map.get(returnColumn);
			}
		}
		return "";
	}

	/**
	 * 2020-09-01 12:00:00을 2020-09-01T12:00:00+09:00 형식을 만든다.
	 * @param obj
	 * @return
	 */
	public String isoTime(Object obj) {
		if ( obj == null) return "";
		String dateString = (String)obj;
		if ( dateString.contains(" ")) {
			return dateString.replace(' ','T')+"+09:00";
		}
		return dateString;
	}

	/**
	 * 값이 null이거나 빈스트링이면 default값을 넣어준다.
	 * @param value
	 * @param whenEmpty
	 * @return
	 */
	public String nvl(String value, String whenEmpty) {
		if (McpString.isNotEmpty(value)) {
			return value;
		}
		return whenEmpty;
	}

	public String t2p(String imagePath) {
		return imagePath.replace(".tn_120.jpg","");
	}

	public String sourceName(Object obj) {
		if ( obj == null) return "";
		String sourceName = (String)obj;
		if ( sourceName.equals("중앙일보(집배신)") || sourceName.equals("중앙일보(조판)")) {
			return "중앙일보";
		}
		return sourceName;
	}
}
