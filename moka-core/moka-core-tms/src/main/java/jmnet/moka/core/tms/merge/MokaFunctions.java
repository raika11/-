package jmnet.moka.core.tms.merge;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;
import jmnet.moka.common.template.merge.Functions;
import jmnet.moka.common.utils.KoreanCalender;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
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

	/** 웹 페이지 날짜 관련 함수 **/
	private static final DateTimeFormatter DTF_YMDHM_DEFAULT = DateTimeFormatter
			.ofPattern("yyyy. M. d HH:mm")
			.withZone(ZoneId.of(MokaConstants.JSON_DATE_TIME_ZONE));
	private static final DateTimeFormatter DTF_YMDHM_COMPACT = DateTimeFormatter
			.ofPattern("M. d HH:mm")
			.withZone(ZoneId.of(MokaConstants.JSON_DATE_TIME_ZONE));
	private static final DateTimeFormatter DTF_YMD = DateTimeFormatter
			.ofPattern("yyyy. M. d")
			.withZone(ZoneId.of(MokaConstants.JSON_DATE_TIME_ZONE));
	private static final DateTimeFormatter DTF_MD = DateTimeFormatter
			.ofPattern("M. d")
			.withZone(ZoneId.of(MokaConstants.JSON_DATE_TIME_ZONE));
	private static final DateTimeFormatter DTF_YMDE = DateTimeFormatter
			.ofPattern("yyyy. M. d E요일")
			.withZone(ZoneId.of(MokaConstants.JSON_DATE_TIME_ZONE));
	private static final int SEC_MIN = 60;
	private static final int SEC_HOUR = 60*60;
	private static final int SEC_DAY = 60*60*24;
	private static final String TYPE_DEFAULT = "default";
	private static final String TYPE_COMPACT = "compact";
	private static final String TYPE_WEEKDAY = "weekday";

	public String timeAgo(String dateTime) {
		LocalDateTime dt = LocalDateTime.parse(dateTime, MokaConstants.dtf);
		LocalDateTime now = LocalDateTime.now();
		Duration duration = Duration.between(dt, now);
		long seconds = duration.getSeconds();
		if ( seconds < 60 ) { // 1분 이내
			return "방금 전";
		} else if ( seconds < SEC_HOUR) { //1시간 이내
			return String.format("%d분 전",(int)Math.floor(seconds / SEC_MIN));
		} else if ( seconds < SEC_DAY) { //24시간 이내
			return String.format("%d시간 전",(int)Math.floor(seconds / SEC_HOUR));
		}
		return dateTime(dateTime);
	}

	public String dateTime(String dateTime) {
		return dateTime(dateTime, TYPE_DEFAULT);
	}

	public String dateTime(String dateTime, String type) {
		if ( type.equalsIgnoreCase(TYPE_DEFAULT)) {
			LocalDateTime dt = LocalDateTime.parse(dateTime, MokaConstants.dtf);
			return dt.format(DTF_YMDHM_DEFAULT);
		} else if ( type.equalsIgnoreCase(TYPE_COMPACT)) {
			LocalDateTime dt = LocalDateTime.parse(dateTime, MokaConstants.dtf);
			return dt.format(DTF_YMDHM_COMPACT);
		} else if ( type.equalsIgnoreCase(TYPE_WEEKDAY)) {
			LocalDateTime dt = LocalDateTime.parse(dateTime, MokaConstants.dtf);
			return dt.format(DTF_YMDE);
		}
		return dateTime;
	}

	public String dateBetween(String startDateTime, String endDateTime) {
		LocalDateTime start = LocalDateTime.parse(startDateTime, MokaConstants.dtf);
		LocalDateTime end = LocalDateTime.parse(endDateTime, MokaConstants.dtf);
		if ( start.getYear() == end.getYear() ) {
			return String.format("%s ~ %s",start.format(DTF_YMD),end.format(DTF_MD));
		} else {
			return String.format("%s ~ %s",start.format(DTF_YMD),end.format(DTF_YMD));
		}
	}

	public String lunar(String dateTime) {
		LocalDateTime dt = LocalDateTime.parse(dateTime, MokaConstants.dtf);
		String yyyymmdd = String.format("%04d%02d%02d", dt.getYear(), dt.getMonthValue(), dt.getDayOfMonth());
		String lunarData = KoreanCalender.sol2lun(yyyymmdd);
		String[] splits = lunarData.split("\\|");
		String month = splits[0].substring(4,6);
		String day = splits[0].substring(6,8);
		return "음력 " + (month.startsWith("0")? month.substring(1): month) +". "
				+ (day.startsWith("0")? day.substring(1): day) + (splits[1].equals("0")?"":"[윤]");
	}

}
