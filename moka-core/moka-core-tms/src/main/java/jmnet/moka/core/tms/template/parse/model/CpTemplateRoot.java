package jmnet.moka.core.tms.template.parse.model;

import static jmnet.moka.common.template.Constants.DEFAULT_DATA_NAME;
import static jmnet.moka.common.template.Constants.DEFAULT_LOOP_DATA_SIZE;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import jmnet.moka.common.ApiResult;
import jmnet.moka.common.JSONResult;
import jmnet.moka.common.template.Constants;
import jmnet.moka.common.template.exception.DataLoadException;
import jmnet.moka.common.template.exception.TemplateLoadException;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.template.loader.DataLoader;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.common.template.merge.TemplateMerger;
import jmnet.moka.common.template.parse.model.TemplateRoot;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.DpsApiConstants;
import jmnet.moka.core.common.ItemConstants;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tms.merge.CacheHelper;
import jmnet.moka.core.tms.merge.MokaTemplateMerger;
import jmnet.moka.core.tms.merge.item.ComponentItem;
import jmnet.moka.core.tms.merge.item.DatasetItem;
import jmnet.moka.core.tms.mvc.HttpParamMap;
import jmnet.moka.core.tms.mvc.abtest.AbTest;
import jmnet.moka.core.tms.template.loader.AbstractTemplateLoader;
import jmnet.moka.core.tms.template.loader.DpsWorkTemplateLoader;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * <pre>
 * 파싱된 템플릿 정보의 최상위 노드, DOM의 Root와 동일 개념
 * 2019. 9. 4. kspark 최초생성
 * </pre>
 *
 * @author kspark
 * @since 2019. 9. 4. 오후 6:20:25
 */
public class CpTemplateRoot extends MokaTemplateRoot {
    private static final Logger logger = LoggerFactory.getLogger(CpTemplateRoot.class);
    private String templateId;
    private AbstractTemplateLoader templateLoader; // Template을 로딩하기 위해 필요함

    public CpTemplateRoot(ComponentItem item, AbstractTemplateLoader templateLoader)
            throws TemplateParseException {
        super(item, null);
        this.templateLoader = templateLoader;
        this.templateId = item.getString(ItemConstants.COMPONENT_TEMPLATE_ID);
    }

    @Override
    public boolean hasPagingElement() {
        TpTemplateRoot tpTemplateRoot = this.getTpTemplateRoot(null);
        if (tpTemplateRoot != null) {
            return tpTemplateRoot.hasPagingElement();
        } else {
            // template을 로딩하지 못하면 캐싱 factor로 의미가 없음
            return false;
        }
    }

    @Override
    public boolean hasArticleToken() {
        TpTemplateRoot tpTemplateRoot = this.getTpTemplateRoot(null);
        if (tpTemplateRoot != null) {
            return tpTemplateRoot.hasArticleToken();
        } else {
            // template을 로딩하지 못하면 캐싱 factor로 의미가 없음
            return false;
        }
    }

    @Override
    public boolean hasParamToken() {
        TpTemplateRoot tpTemplateRoot = this.getTpTemplateRoot(null);
        if (tpTemplateRoot != null) {
            return tpTemplateRoot.hasParamToken();
        } else {
            // template을 로딩하지 못하면 캐싱 factor로 의미가 없음
            return false;
        }
    }

    @Override
    public boolean hasPageToken() {
        TpTemplateRoot tpTemplateRoot = this.getTpTemplateRoot(null);
        if (tpTemplateRoot != null) {
            return tpTemplateRoot.hasPageToken();
        } else {
            // template을 로딩하지 못하면 캐싱 factor로 의미가 없음
            return false;
        }
    }

    private TpTemplateRoot getTpTemplateRoot(MergeContext context) {
        TpTemplateRoot tpTemplateRoot = null;
        try {
            String effectiveTemplateId = templateId;
            if (context != null && context.has(MokaConstants.MERGE_CONTEXT_ABTEST)) { // ABTest에 템플릿정보가 있으면 templateId 변경
                AbTest abTest = (AbTest) context.get(MokaConstants.MERGE_CONTEXT_ABTEST);
                if (abTest.hasTemplate()) {
                    effectiveTemplateId = abTest.getTemplateId();
                }
            }
            tpTemplateRoot = (TpTemplateRoot) templateLoader.getParsedTemplate(MokaConstants.ITEM_TEMPLATE, effectiveTemplateId);
        } catch (TemplateParseException | TemplateLoadException e) {
            logger.error("Component's Template Load Fail:{} {}", this.item.get(ItemConstants.COMPONENT_ID),
                    this.item.get(ItemConstants.COMPONENT_TEMPLATE_ID), e);
        }
        return tpTemplateRoot;
    }


    @SuppressWarnings("unchecked")
    public JSONResult loadData(TemplateMerger<?> merger, MergeContext context)
            throws DataLoadException, ParseException, TemplateParseException, TemplateLoadException {
        logger.trace("Merge entered : {} {}", this.item.getItemType(), this.item.getItemId());
        String componentDataType = this.item.getString(ItemConstants.COMPONENT_DATA_TYPE);
        if (componentDataType != null && componentDataType.equals(ItemConstants.CP_DATA_TYPE_NONE) == false) {
            String datasetId = this.item.getString(ItemConstants.COMPONENT_DATASET_ID);
            if (context.has(MokaConstants.MERGE_CONTEXT_ABTEST)) { // AB테스트에 dataset 정보가 있으면 datasetId 변경
                AbTest abTest = (AbTest) context.get(MokaConstants.MERGE_CONTEXT_ABTEST);
                if (abTest.hasDataset()) {
                    datasetId = abTest.getDatasetId();
                }
            }
            // 컴포넌트에 설정된 파라미터를 가져온다.
            DatasetItem datasetItem = (DatasetItem) merger.getItem(MokaConstants.ITEM_DATASET, datasetId);
            boolean datasetAutoCreateYn = datasetItem.getBoolYN(ItemConstants.DATASET_AUTO_CREATE_YN);
            HttpParamMap httpParamMap = (HttpParamMap) context.get(Constants.PARAM);
            Map<String, Object> datasetParam = new HashMap<String, Object>(4);
            if (datasetAutoCreateYn) {
                String paramString = datasetItem.getString(ItemConstants.DATASET_API_PARAM);
                if (McpString.isNotEmpty(paramString)) {
                    JSONParser jsonParser = new JSONParser();
                    JSONObject paramJson = (JSONObject) jsonParser.parse(paramString);
                    this.convertToken(merger, context, paramJson);
                    datasetParam.putAll(paramJson);
                }
                // 파라미터 정보를 주입한다.
                datasetParam.putAll(httpParamMap);
                this.setDataRange(datasetParam, httpParamMap);
                String datasetApi = datasetItem.getString(ItemConstants.DATASET_API);
                if (datasetApi != null && datasetApi.length() > 1) {
                    return loadDataSet((MokaTemplateMerger) merger, datasetItem, datasetParam, datasetApi, context);
                }
            } else {
                // SNAPSHOT_YN=Y일때 다른 용도로 사용할 수 있으므로 가져오도록 한다.
                this.setDataRange(datasetParam, httpParamMap);
                datasetParam.put(ItemConstants.CP_DATA_TYPE_DESK_PARAM, this.item.getString(ItemConstants.COMPONENT_DATASET_ID));

                // Preview 모드 && WorkerId가 있을 경우 desking.work api를 호출한다.
                boolean isDeskingWork = context
                        .getMergeOptions()
                        .isPreview() && context.has(MokaConstants.MERGE_CONTEXT_REG_ID);
                if (isDeskingWork && this.templateLoader instanceof DpsWorkTemplateLoader) {
                    // Preview 모드의 경우에 작업중인 컴포넌트만 desking.work api를 호출한다.
                    isDeskingWork &= ((DpsWorkTemplateLoader) this.templateLoader).isWorkComponent(this.getId());
                }
                String apiName = isDeskingWork ? DpsApiConstants.DESKING_WORK : DpsApiConstants.DESKING;
                if (isDeskingWork) {
                    datasetParam.put(MokaConstants.PARAM_REG_ID, context.get(MokaConstants.MERGE_CONTEXT_REG_ID));
                }
                return loadDataSet((MokaTemplateMerger) merger, datasetItem, datasetParam, apiName, context);
            }
        }
        return null;
    }

    private JSONResult loadDataSet(MokaTemplateMerger merger, DatasetItem datasetItem, Map<String, Object> datasetParam, String api,
            MergeContext context)
            throws DataLoadException {
        JSONResult jsonResult = null;
        DataLoader loader = merger.getDataLoader();
        if (merger.isDefaultApiHostPathUse()) {
            jsonResult = loader.getJSONResult(api, datasetParam, true);
        } else {
            String apiHost = datasetItem.getString(ItemConstants.DATASET_API_HOST);
            String apiPath = datasetItem.getString(ItemConstants.DATASET_API_PATH);
            if (api == null) {
                api = datasetItem.getString(ItemConstants.DATASET_API);
            }
            String uri = String.join("/", apiHost, apiPath, api);
            jsonResult = loader.getJSONResult(uri, datasetParam, false);
        }
        if (jsonResult != null) {
            merger.setData(context, CacheHelper.makeDataId(this.getItemType(), this.getId()), jsonResult);
        }
        return jsonResult;
    }

    private void convertToken(TemplateMerger<?> merger, MergeContext context, JSONObject jsonObject) {
        for (Object key : jsonObject.keySet()) {
            Object valueObj = jsonObject.get(key);
            if (valueObj != null) {
                String value = valueObj
                        .toString()
                        .trim();
                if (value.startsWith(Constants.TOKEN_START) && value.endsWith(Constants.TOKEN_END)) {
                    Object evalValue = merger
                            .getEvaluator()
                            .eval(value.substring(2, value.length() - 1), context);
                    jsonObject.put(key, evalValue);
                }
            }
        }
    }

    public MergeContext getRowDataContext(TemplateMerger<?> merger, MergeContext context) {
        MergeContext rowDataContext = context.createRowDataChild();
        rowDataContext.set(MokaConstants.MERGE_CONTEXT_COMPONENT, this.item);

        String componentDataType = this.item.getString(ItemConstants.COMPONENT_DATA_TYPE);
        // dataType이 NONE이 아닐 경우만 데이터 처리
        if (componentDataType != null && componentDataType.equals(ItemConstants.CP_DATA_TYPE_NONE) == false) {
            HashMap<String, JSONResult> dataMap = (HashMap<String, JSONResult>) context.get(MokaConstants.MERGE_DATA_MAP);

            JSONResult jsonResult = null;
            if (dataMap != null) {
                // AB테스트에 데이터셋이 설정되지 않은 경우만 dataMap에서 조회한다.
                if (context.has(MokaConstants.MERGE_CONTEXT_ABTEST)) {
                    AbTest abTest = (AbTest) context.get(MokaConstants.MERGE_CONTEXT_ABTEST);
                    if (!abTest.hasDataset()) {
                        jsonResult = dataMap.get(CacheHelper.makeDataId(this.getItemType(), this.getId()));
                    }
                } else {
                    jsonResult = dataMap.get(CacheHelper.makeDataId(this.getItemType(), this.getId()));
                }
            }
            if (jsonResult == null) {
                try {
                    jsonResult = this.loadData(merger, rowDataContext);
                } catch (DataLoadException | ParseException | TemplateParseException | TemplateLoadException e) {
                    logger.warn("DataLoad Fail: {} - component : {} {} {}", ((MokaTemplateMerger) merger).getDomainId(), templateRoot.getItemType(),
                            templateRoot.getId(), e.getMessage());
                    return null;
                }
            }
            // 데이터를 참조할 수 있도록 _RESULT에 추가
            context.set(DEFAULT_DATA_NAME, jsonResult);
            if (jsonResult.getDataList() != null) { // _DATA로 시작하는 경우
                int dataSize = jsonResult
                        .getDataList()
                        .size();
                context.set(DEFAULT_LOOP_DATA_SIZE, dataSize);
                rowDataContext.set(Constants.CURRENT_DATA_ID, this.item.getItemType() + this.item.getItemId());
                // loop 커스텀태그 없이(혹은 결과가 1건인 경우) 첫번째 데이터를 사용하는 경우를 위해 첫 row를 context에
                rowDataContext.set(Constants.LOOP_INDEX, 0);
                Object resultObject = jsonResult.get(Constants.DEFAULT_LOOP_DATA_SELECT);
                if (resultObject != null) {
                    if (resultObject instanceof List && ((List<?>) resultObject).size() > 0) {
                        rowDataContext.set(Constants.LOOP_DATA_ROW, ((List<?>) resultObject).get(0));
                    } else {
                        // 리스트 형태가 아닐 경우 _DATA로 넣어준다.
                        context.set(Constants.DEFAULT_LOOP_DATA_SELECT, resultObject);
                    }
                }
                // TOTAL 처리
                int total = jsonResult.getTotal();
                if (total == 0 & dataSize > 0) {
                    total = dataSize;
                }
                rowDataContext.set(ApiResult.MAIN_TOTAL, total);
            }
        } else {
            rowDataContext.set(ApiResult.MAIN_TOTAL, 0);
        }
        return rowDataContext;
    }

    @SuppressWarnings("unchecked")
    @Override
    public void merge(TemplateMerger<?> merger, MergeContext context, StringBuilder sb) {

        // SNAPSHOT_YN = Y 일 경우
        ComponentItem componentItem = (ComponentItem) this.item;
        if (componentItem.getBoolYN(ItemConstants.COMPONENT_SNAPSHOT_YN)) {
            wrapItemStart(merger, context, sb);
            sb.append(componentItem.getString(ItemConstants.COMPONENT_SNAPSHOT_BODY));
            wrapItemEnd(merger, context, sb);
            return;
        }

        MergeContext rowDataContext = getRowDataContext(merger, context);
        if (rowDataContext == null) {
            return;
        }

        TemplateRoot tpTemplateRoot = this.getTpTemplateRoot(context);
        /* mte:tp를 거치지 않고 바로 TpTemplateRoot를 처리하므로 wrapping을 처리한다. */
        wrapItemStart(merger, context, sb);

        if (tpTemplateRoot != null) {
            tpTemplateRoot.merge(merger, rowDataContext, sb);
        } else {
            if (context
                    .getMergeOptions()
                    .isDebug()) {
                sb.append("\n ERROR!! Template Load Fail \n");
            }
        }

        wrapItemEnd(merger, context, sb);
    }

    private void wrapItemStart(TemplateMerger<?> merger, MergeContext context, StringBuilder sb) {
        if (context
                .getMergeOptions()
                .isWrapItem()) {
            sb
                    .append(context.getCurrentIndent())
                    .append(merger.getWrapItemStart(MokaConstants.ITEM_TEMPLATE, this.templateId))
                    .append(System.lineSeparator());
        }
    }

    private void wrapItemEnd(TemplateMerger<?> merger, MergeContext context, StringBuilder sb) {
        if (context
                .getMergeOptions()
                .isWrapItem()) {
            sb
                    .append(context.getCurrentIndent())
                    .append(merger.getWrapItemEnd(MokaConstants.ITEM_TEMPLATE, this.templateId))
                    .append(System.lineSeparator());
        }
    }

    private void setDataRange(Map<String, Object> datasetParam, HttpParamMap httpParamMap) {
        String page = httpParamMap.get(MokaConstants.PARAM_PAGE);
        String count = null;
        String start = null;
        // 컴포넌트에서 페이징 정보를 주입한다.
        if (this.isComponentPaging()) {
            if (this
                    .getPagingType()
                    .equals(MokaConstants.COMPONENT_PAGING_TYPE_NUMBER)) {
                count = Integer.toString(this.getPerPageCount());
            } else if (this
                    .getPagingType()
                    .equals(MokaConstants.COMPONENT_PAGING_TYPE_MORE)) {
                if (page == null || page.equals("1")) {
                    count = Integer.toString(this.getPerPageCount());
                } else {
                    count = Integer.toString(this.getMoreCount());
                    start = Integer.toString(this.getPerPageCount() + (Integer.parseInt(page) - 2) * this.getMoreCount());
                }
            }
        }
        if (count != null) {
            datasetParam.put(MokaConstants.PARAM_COUNT, count);
        }
        if (start != null) {
            datasetParam.put(MokaConstants.PARAM_START, start);
        }
    }

    public boolean isComponentPaging() {
        return this.item.getBoolYN(ItemConstants.COMPONENT_PAGING_YN);
    }

    public String getPagingType() {
        return this.item.getString(ItemConstants.COMPONENT_PAGING_TYPE);
    }

    public int getPerPageCount() {
        String count = this.item.getString(ItemConstants.COMPONENT_PER_PAGE_COUNT);
        return Integer.parseInt(count);
    }

    public int getMaxPageCount() {
        String count = this.item.getString(ItemConstants.COMPONENT_MAX_PAGE_COUNT);
        return Integer.parseInt(count);
    }

    public int getDispPageCount() {
        String count = this.item.getString(ItemConstants.COMPONENT_DISP_PAGE_COUNT);
        return Integer.parseInt(count);
    }

    public int getMoreCount() {
        String count = this.item.getString(ItemConstants.COMPONENT_MORE_COUNT);
        return Integer.parseInt(count);
    }

}
