package jmnet.moka.common.template.parse.model;

import static jmnet.moka.common.template.Constants.COMPONENT_API;
import static jmnet.moka.common.template.Constants.COMPONENT_PARAM;
import static jmnet.moka.common.template.Constants.COMPONENT_TEMPLATE_ID;
import static jmnet.moka.common.template.Constants.DEFAULT_DATA_NAME;
import static jmnet.moka.common.template.Constants.DEFAULT_LOOP_DATA_SELECT;
import static jmnet.moka.common.template.Constants.ITEM_COMPONENT;
import static jmnet.moka.common.template.Constants.ITEM_TEMPLATE;
import static jmnet.moka.common.template.Constants.LOOP_DATA_ROW;
import static jmnet.moka.common.template.Constants.LOOP_INDEX;
import static jmnet.moka.common.template.Constants.PARAM;
import java.util.List;
import java.util.Map;
import org.json.simple.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jmnet.moka.common.ApiResult;
import jmnet.moka.common.JSONResult;
import jmnet.moka.common.template.exception.DataLoadException;
import jmnet.moka.common.template.exception.TemplateLoadException;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.template.loader.DataLoader;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.common.template.merge.TemplateMerger;

/**
 * 
 * <pre>
 * 파싱된 템플릿 정보의 최상위 노드, DOM의 Root와 동일 개념
 * 2019. 9. 4. kspark 최초생성
 * </pre>
 * @since 2019. 9. 4. 오후 6:20:25
 * @author kspark
 */
public class CpTemplateRoot extends TemplateRoot {
	private static final Logger logger = LoggerFactory.getLogger(CpTemplateRoot.class);
	private String id;
	private JSONObject componentJson;
	
	public CpTemplateRoot(String id, JSONObject componentJson) {
		// templateComponent는 templateRoot가 null이며, lineNumber도 0이다.
		super(ITEM_COMPONENT,id);
		this.id = id;
		this.componentJson = componentJson;
	}
	
	public void setComponent(JSONObject componentJson) {
		this.componentJson = componentJson;
	}

	@SuppressWarnings("unchecked")
	@Override
    public void merge(TemplateMerger<?> merger, MergeContext context, StringBuilder sb) {
		try {
			Map<String,Object> componentParam = (Map<String,Object>)componentJson.get(COMPONENT_PARAM);
			// 페이지 정보를 주입한다.
			if ( context.get(PARAM) != null) {
				Map<String, Object> paramMap =  (Map<String, Object>)context.get(PARAM);
//				if ( paramMap.get(PARAM_PAGE) != null) {
//					componentParam.put(PARAM_PAGE, paramMap.get(PARAM_PAGE));
//				}
//				if ( context.get(PARAM_SIZE) != null) {
//					componentParam.put(PARAM_SIZE, paramMap.get(PARAM_SIZE));
//				}
				// http param정보를 넣는다. overwrite될 수 있다.
				componentParam.putAll(paramMap);
			}
			Object componentApi = componentJson.get(COMPONENT_API);
			MergeContext childContext = context.createRowDataChild();
			if ( componentApi != null && ((String)componentApi).length()>1) {

				DataLoader loader = merger.getDataLoader();
				JSONResult jsonResult;
				String api = (String)componentJson.get(COMPONENT_API);
				jsonResult = loader.getJSONResult(api, componentParam, true);					
				context.set(DEFAULT_DATA_NAME, jsonResult);
				// loop 커스텀태그 없이 첫번째 데이터를 사용하는 경우를 위해 첫 row를 context에 
				childContext.set(LOOP_INDEX, 0);
				Object resultObject = jsonResult.get(DEFAULT_LOOP_DATA_SELECT);
				if ( resultObject != null && resultObject instanceof List && ((List<?>)resultObject).size() > 0) {
					childContext.set(LOOP_DATA_ROW, ((List<?>)resultObject).get(0));
				}
				// TOTAL 예외 처리
                int total = jsonResult.getTotal();
                childContext.set(ApiResult.MAIN_TOTAL, total);
			}
			String templateId = (String)componentJson.get(COMPONENT_TEMPLATE_ID);
			// 템플릿 정보를 가져와 머징한다.
			TemplateRoot templateRoot = merger.getParsedTemplate(ITEM_TEMPLATE, templateId);
			if ( context.getMergeOptions().isWrapItem()) {
				sb.append(context.getCurrentIndent()).append(merger.getWrapItemStart(ITEM_TEMPLATE, templateId))
				.append(System.lineSeparator());
			}
			templateRoot.merge(merger, childContext, sb);
			if ( context.getMergeOptions().isWrapItem()) {
				sb.append(context.getCurrentIndent()).append(merger.getWrapItemEnd(ITEM_TEMPLATE, templateId))
				.append(System.lineSeparator());
			}
        } catch (DataLoadException | TemplateParseException | TemplateLoadException e) {
			// 데이터 로딩에 실패해도 머지작업은 계속 수행한다.
			logger.error(String.format("Component Data Load Fail: %s %s",ITEM_COMPONENT, id),e);
		}
	}
	
}
