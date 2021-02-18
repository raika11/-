package jmnet.moka.core.tms.merge.element;

import static jmnet.moka.common.template.Constants.DEFAULT_LOOP_DATA_SELECT;
import static jmnet.moka.common.template.Constants.LOOP_DATA_ROW;
import static jmnet.moka.common.template.Constants.LOOP_INDEX;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import jmnet.moka.core.tms.merge.MokaTemplateMerger;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jmnet.moka.common.ApiResult;
import jmnet.moka.common.JSONResult;
import jmnet.moka.common.template.Constants;
import jmnet.moka.common.template.exception.DataLoadException;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.loader.DataLoader;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.common.template.merge.TemplateMerger;
import jmnet.moka.common.template.parse.TemplateParser;
import jmnet.moka.common.template.parse.model.TemplateElement;
import jmnet.moka.common.template.parse.model.TemplateNode;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tms.merge.item.MergeItem;
import jmnet.moka.core.tms.template.parse.model.MokaTemplateRoot;

/**
 * <pre>
 * MSP용 data 엘리먼트를 머지한다.
 * 2020. 4. 23. kspark 최초생성
 * </pre>
 * 
 * @since 2019. 9. 4. 오후 4:17:48
 * @author kspark
 */
public class DataMerger extends MokaAbstractElementMerger {

	private static final Logger logger = LoggerFactory.getLogger(DataMerger.class);

    public DataMerger(TemplateMerger<MergeItem> templateMerger) throws IOException {
		super(templateMerger);
		logger.debug("{} is Created",this.getClass().getName());
	}

    public String makeCacheKey(TemplateElement element, MokaTemplateRoot templateRoot,
            MergeContext context) {
        return "Not_Implemented";
    }

    public JSONResult loadData(TemplateElement element, MergeContext context)
            throws TemplateMergeException {
        String url = element.getAttribute(Constants.ATTR_URL);
        String api = element.getAttribute(Constants.ATTR_API);
        String dataId = element.getAttribute(Constants.ATTR_DATA_ID);
        if (McpString.isEmpty(dataId)) {
            TemplateMergeException de =
                    new TemplateMergeException("dataId Not Found: " + api + " : " + url, element);
            logger.warn("Data Load Fail: {} {}", url, de.toString());
            throw de;
        }
        Map<String, Object> parameterMap = new HashMap<String, Object>(4);
        for (TemplateNode node : element.childNodes()) {
            if (node.getNodeType() == Constants.TYPE_STATEMENT
                    && node.getNodeName().equals(Constants.EL_PARAM)) { // <mte:param 만 처리함
                TemplateElement paramEl = (TemplateElement) node;
                String name = paramEl.getAttribute(Constants.ATTR_NAME);
                String value = paramEl.getAttribute(Constants.ATTR_VALUE);
                // value를 evaluation 한다.
                if (TemplateParser.hasToken(value)) {
                    Object evalValue = this.templateMerger.getEvaluator()
                            .eval(TemplateParser.getExpression(value), context);
                    parameterMap.put(name, evalValue);
                } else {
                    parameterMap.put(name, value);
                }
            }
        }
        MokaTemplateMerger mokaMerger = (MokaTemplateMerger)this.templateMerger;
        DataLoader loader = mokaMerger.getDataLoader();
        JSONResult jsonResult = null;
        try {
            if (api != null) {
                jsonResult = loader.getJSONResult(api, parameterMap, true);
            } else if (url != null) {
                jsonResult = loader.getJSONResult(url, parameterMap, false);
            } else {
                throw new TemplateMergeException("Data api/url Attribute Not Found: " + url,
                        element);
            }
            if (jsonResult != null) {
                ((MokaTemplateMerger) templateMerger).setData(context, dataId, jsonResult);
            }
            return jsonResult;
        } catch (DataLoadException e) {
            throw new TemplateMergeException("Data Load Fail: " + api + " : " + url, element, e);
        } catch (TemplateMergeException e) {
            throw e;
        }
    }

	@Override
	public void merge(TemplateElement element, MergeContext context, StringBuilder sb) throws TemplateMergeException   {
        String dataId = element.getAttribute(Constants.ATTR_DATA_ID);
        JSONResult jsonResult = ((MokaTemplateMerger) templateMerger).getData(context, dataId);
        if (jsonResult == null) {
            jsonResult = loadData(element, context);
        }
        if (jsonResult != null) {
            context = context.createRowDataChild(); // row data를 포함할 수 있는 child context를 생성한다.
//            ((MokaTemplateMerger) templateMerger).setData(context, dataId, jsonResult);
            context.set(Constants.CURRENT_DATA_ID, dataId);
            // TODO context가 LoopContext 아닐 경우에는 _ROW 를 인식하지 못해 찾을 수 없는 문제가 있음
            // loop 커스텀태그 없이(혹은 결과가 1건인 경우) 첫번째 데이터를 사용하는 경우를 위해 첫 row를 context에
            context.set(LOOP_INDEX, 0);
            Object resultObject = jsonResult.get(DEFAULT_LOOP_DATA_SELECT);
            if (resultObject != null && resultObject instanceof List
                    && ((List<?>) resultObject).size() > 0) {
                context.set(LOOP_DATA_ROW, ((List<?>) resultObject).get(0));
            }
            // TOTAL 처리
            int total = jsonResult.getTotal();
            context.set(ApiResult.MAIN_TOTAL, total);
        }
	}
}
