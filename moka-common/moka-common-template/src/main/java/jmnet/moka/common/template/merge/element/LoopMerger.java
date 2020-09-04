package jmnet.moka.common.template.merge.element;

import static jmnet.moka.common.template.Constants.ATTR_COUNT;
import static jmnet.moka.common.template.Constants.ATTR_DATA;
import static jmnet.moka.common.template.Constants.ATTR_FILL;
import static jmnet.moka.common.template.Constants.ATTR_SELECT;
import static jmnet.moka.common.template.Constants.ATTR_START;
import static jmnet.moka.common.template.Constants.DEFAULT_DATA_NAME;
import static jmnet.moka.common.template.Constants.DEFAULT_LOOP_DATA_SELECT;
import static jmnet.moka.common.template.Constants.LOOP_COUNT;
import static jmnet.moka.common.template.Constants.LOOP_DATA_FILL;
import static jmnet.moka.common.template.Constants.LOOP_DATA_ROW;
import static jmnet.moka.common.template.Constants.LOOP_INDEX;
import static jmnet.moka.common.template.Constants.LOOP_START;
import static jmnet.moka.common.template.Constants.LOOP_TOTAL_INDEX;
import static jmnet.moka.common.template.Constants.PARAM;
import static jmnet.moka.common.template.Constants.PARAM_COUNT;
import static jmnet.moka.common.template.Constants.PARAM_PAGE;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.common.template.merge.TemplateMerger;
import jmnet.moka.common.template.parse.model.TemplateElement;
import jmnet.moka.common.template.parse.model.TemplateNode;

/**
 * <pre>
 * loop 엘리먼트를 머지한다.
 * 2019. 9. 4. kspark 최초생성
 * </pre>
 * @since 2019. 9. 4. 오후 4:17:48
 * @author kspark
 */
public class LoopMerger extends AbstractElementMerger{

	private static final Logger logger = LoggerFactory.getLogger(LoopMerger.class);
	
	public LoopMerger(TemplateMerger<?> templateMerger) throws IOException {
		super(templateMerger);
		logger.debug("{} is Created",this.getClass().getName());
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	@Override
	public void merge(TemplateElement element, MergeContext context, StringBuilder sb) throws TemplateMergeException  {
		String indent = context.getCurrentIndent();
		
		String data = element.getAttribute(ATTR_DATA);
		data = (data == null) ? DEFAULT_DATA_NAME : data;
		String select = element.getAttribute(ATTR_SELECT);
		select = (select == null) ? DEFAULT_LOOP_DATA_SELECT : select;

		// 1-base index를 사용함
		int start = 1, count = -1;
		String startAttr = element.getAttribute(ATTR_START);
		if ( startAttr != null && startAttr.matches("[0-9]+")) {
			start = Integer.parseInt(startAttr);
		}
		start = ( start == 0 ? 1 : start);
		String countAttr = element.getAttribute(ATTR_COUNT);
		if ( countAttr != null && startAttr.matches("[0-9]+")) {
			count = Integer.parseInt(countAttr);
		}

		String fillAttr = element.getAttribute(ATTR_FILL);
		boolean fill = false;
		if ( fillAttr != null && fillAttr.matches("[y|Y|n|N]")) {
			fill = fillAttr.equalsIgnoreCase("Y");
		}
		
		boolean isDebug = context.getMergeOptions().isDebug();
		
		MergeContext childContext = context.createRowDataChild();
		childContext.set(LOOP_START, start);
		childContext.set(LOOP_COUNT, count);
		
		if (isDebug) debug("START", element, indent, sb);
		
		Object resultObject = context.get(data);
		List dataList = null;
		int dataSize = 0;
		Map<String,String> emptyRow = new HashMap<String,String>(16);
		if ( resultObject != null) {
			Object dataListObj = null;
			if ( resultObject instanceof Map) {
				dataListObj = ((Map)resultObject).get(select);
			}
			if ( dataListObj != null && dataListObj instanceof List) {
				dataList = (List)dataListObj;
				dataSize = dataList.size();
                if (fill == true) { // 지정된 count만큼 채울 경우
                    if (count == -1) { // 지정된 count값이 없을 경우 데이터의 건수로 결정
                        count = dataSize;
                    } else {
                        // 지정된 count 사용
                    }
                } else {  // 조회된 데이터 만큼만 채울 경우
                    if (count == -1) { // 지정된 count값이 없을 경우 데이터의 건수로 결정
                        count = dataSize;
                    } else if (count > dataSize) { // count보다 조회된 데이터 건수가 적을 경우
                        count = dataSize;
                    } else {
                        //  지정된 count 사용 
                    }
                }
				if ( dataSize > 0) {
					for ( String key : ((Map<String,Object>)dataList.get(0)).keySet() ) {
						emptyRow.put(key, "");
					}
				}
			} else {
				// TODO list형태가 아닌 경우 Exception 발생
			}
		} 
		
//		if ( object != null ) {
//			dataList = (List<HashMap<String,Object>>)object;
//		}
//		if ( dataList != null) {
			for ( int i=start; i <= count; i++) {
				childContext.set(LOOP_INDEX, i);
				if ( context.get(PARAM) != null) {
					Map httpParam = ((Map)context.get(PARAM));
					if ( httpParam != null) {
						Object pageIndex = httpParam.get(PARAM_PAGE);
						Object listCount = httpParam.get(PARAM_COUNT);
						if ( pageIndex != null && listCount != null) {
							int pi = Integer.parseInt((String)pageIndex);
							int lc = Integer.parseInt((String)listCount);
							childContext.set(LOOP_TOTAL_INDEX, i+(pi-1)*lc);
						} else {
							childContext.set(LOOP_TOTAL_INDEX, i);
						}
						
					}
				}
				// 반복횟수보다 row 갯수가 적을 경우 채우기 여부
				childContext.set(LOOP_DATA_FILL, fill);
				
				if ( dataList != null && dataSize >= i) {
					childContext.set(LOOP_DATA_ROW, dataList.get(i-1));
				} else {
//					childContext.remove(LOOP_DATA_ROW);
					childContext.set(LOOP_DATA_ROW, emptyRow);
				}
				
				if (isDebug) debug("START", "LOOP index="+i, indent+"\t", sb) ;
				for ( TemplateNode node : element.childNodes()) {
					node.merge(templateMerger, childContext, sb);
				}
				if (isDebug) debug("END  ", "LOOP index="+i, indent+"\t", sb) ;
			}
//		}
		
		if (isDebug) debug("END  ", element, indent, sb);
	}
}
