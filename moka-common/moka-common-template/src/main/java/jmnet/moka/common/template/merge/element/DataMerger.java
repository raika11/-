package jmnet.moka.common.template.merge.element;

import static jmnet.moka.common.template.Constants.ATTR_API;
import static jmnet.moka.common.template.Constants.ATTR_DATA;
import static jmnet.moka.common.template.Constants.ATTR_NAME;
import static jmnet.moka.common.template.Constants.ATTR_URL;
import static jmnet.moka.common.template.Constants.ATTR_VALUE;
import static jmnet.moka.common.template.Constants.DEFAULT_DATA_NAME;
import static jmnet.moka.common.template.Constants.EL_PARAM;
import static jmnet.moka.common.template.Constants.TYPE_STATEMENT;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jmnet.moka.common.ApiResult;
import jmnet.moka.common.JSONResult;
import jmnet.moka.common.template.exception.DataLoadException;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.loader.DataLoader;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.common.template.merge.TemplateMerger;
import jmnet.moka.common.template.parse.TemplateParser;
import jmnet.moka.common.template.parse.model.TemplateElement;
import jmnet.moka.common.template.parse.model.TemplateNode;

/**
 * <pre>
 * data 엘리먼트를 머지한다.
 * 2019. 9. 4. kspark 최초생성
 * </pre>
 * 
 * @since 2019. 9. 4. 오후 4:17:48
 * @author kspark
 */
public class DataMerger extends AbstractElementMerger {

	private static final Logger logger = LoggerFactory.getLogger(DataMerger.class);

	public DataMerger(TemplateMerger<?> templateMerger) throws IOException {
		super(templateMerger);
		logger.debug("{} is Created",this.getClass().getName());
	}

	@SuppressWarnings("rawtypes")
	@Override
	public void merge(TemplateElement element, MergeContext context, StringBuilder sb) throws TemplateMergeException   {
		String url = element.getAttribute(ATTR_URL);
		String api = element.getAttribute(ATTR_API);
		String data = element.getAttribute(ATTR_DATA);
		data = (data == null) ? DEFAULT_DATA_NAME : data;
		Map<String, Object> parameterMap = new HashMap<String, Object>(4);
		for ( TemplateNode node : element.childNodes() ) {
			if ( node.getNodeType() == TYPE_STATEMENT && node.getNodeName().equals(EL_PARAM)) { // <mte:param 만 처리함
				TemplateElement paramEl = (TemplateElement)node;
				String name = paramEl.getAttribute(ATTR_NAME);
				String value = paramEl.getAttribute(ATTR_VALUE);
				// value를 evaluation 한다.
				if ( TemplateParser.hasToken(value)) {
					Object evalValue = this.templateMerger.getEvaluator().eval(TemplateParser.getExpression(value), context);
					parameterMap.put(name, evalValue);		
				} else {
					parameterMap.put(name, value);		
				}
			}
		}
		DataLoader loader = this.templateMerger.getDataLoader();
		JSONResult jsonResult;
		try {
			if ( api != null ) {
				jsonResult = loader.getJSONResult(api, parameterMap, true);					
			} else if ( url != null) {
				jsonResult = loader.getJSONResult(url, parameterMap, false);
			} else {
				throw new TemplateMergeException("Data api/url Attribute Not Found: "+ url, element );
			}
			context.set(data, jsonResult);
			// TOTAL 예외 처리
			JSONResult total = (JSONResult)jsonResult.get(ApiResult.MAIN_TOTAL);
			if ( total.isEmpty() == false) {
				Object obj = total.get(ApiResult.MAIN_DATA);
				if ( obj instanceof List) {
					context.set(ApiResult.MAIN_TOTAL, ((List)obj).get(0));
				} else {
					context.set(ApiResult.MAIN_TOTAL, total.get(ApiResult.MAIN_DATA));
				}
			}
			
			
		} catch ( DataLoadException e) {
//				throw new TemplateMergeException("Data Load Fail: "+ url, element, e);
			Exception de = new TemplateMergeException("Data Load Fail: "+ api +" : " + url, element, e);
			logger.error("Data Load Fail: {} {}", url, de.toString());
			context.set(data, null);
		}  catch ( TemplateMergeException  e) {
			throw e;
		}
	}
}
