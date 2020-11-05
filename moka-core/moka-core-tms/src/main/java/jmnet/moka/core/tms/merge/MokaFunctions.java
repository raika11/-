package jmnet.moka.core.tms.merge;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
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
}
