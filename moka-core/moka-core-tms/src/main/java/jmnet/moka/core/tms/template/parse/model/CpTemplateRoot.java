package jmnet.moka.core.tms.template.parse.model;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jmnet.moka.common.ApiResult;
import jmnet.moka.common.JSONResult;
import jmnet.moka.common.template.Constants;
import jmnet.moka.common.template.exception.DataLoadException;
import jmnet.moka.common.template.exception.TemplateLoadException;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.template.loader.DataLoader;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.common.template.merge.TemplateMerger;
import jmnet.moka.common.template.parse.TemplateParser;
import jmnet.moka.common.template.parse.model.TemplateRoot;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.ItemConstants;
import jmnet.moka.core.common.MspConstants;
import jmnet.moka.core.tms.merge.KeyResolver;
import jmnet.moka.core.tms.merge.MspTemplateMerger;
import jmnet.moka.core.tms.merge.item.ComponentItem;
import jmnet.moka.core.tms.merge.item.DatasetItem;
import jmnet.moka.core.tms.mvc.HttpParamMap;
import jmnet.moka.core.tms.template.loader.AbstractTemplateLoader;

/**
 * 
 * <pre>
 * 파싱된 템플릿 정보의 최상위 노드, DOM의 Root와 동일 개념
 * 2019. 9. 4. kspark 최초생성
 * </pre>
 * 
 * @since 2019. 9. 4. 오후 6:20:25
 * @author kspark
 */
public class CpTemplateRoot extends MspTemplateRoot {
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
        TpTemplateRoot tpTemplateRoot = this.getTpTemplateRoot();
        if (tpTemplateRoot != null) {
            return tpTemplateRoot.hasPagingElement();
        } else {
            // template을 로딩하지 못하면 캐싱 factor로 의미가 없음
            return false;
        }
    }

    @Override
    public boolean hasBodyToken() {
        TpTemplateRoot tpTemplateRoot = this.getTpTemplateRoot();
        if (tpTemplateRoot != null) {
            return tpTemplateRoot.hasBodyToken();
        } else {
            // template을 로딩하지 못하면 캐싱 factor로 의미가 없음
            return false;
        }
    }

    @Override
    public boolean hasParamToken() {
        TpTemplateRoot tpTemplateRoot = this.getTpTemplateRoot();
        if (tpTemplateRoot != null) {
            return tpTemplateRoot.hasParamToken();
        } else {
            // template을 로딩하지 못하면 캐싱 factor로 의미가 없음
            return false;
        }
    }

    @Override
    public boolean hasPageToken() {
        TpTemplateRoot tpTemplateRoot = this.getTpTemplateRoot();
        if (tpTemplateRoot != null) {
            return tpTemplateRoot.hasPageToken();
        } else {
            // template을 로딩하지 못하면 캐싱 factor로 의미가 없음
            return false;
        }
    }

    private TpTemplateRoot getTpTemplateRoot() {
        TpTemplateRoot tpTemplateRoot = null;
        try {
            tpTemplateRoot = (TpTemplateRoot) templateLoader
                    .getParsedTemplate(MspConstants.ITEM_TEMPLATE, templateId);
        } catch (TemplateParseException | TemplateLoadException e) {
            logger.error("Component's Template Load Fail:{} {}",
                    this.item.get(ItemConstants.COMPONENT_ID),
                    this.item.get(ItemConstants.COMPONENT_TEMPLATE_ID), e);
        }
        return tpTemplateRoot;
    }


    @SuppressWarnings("unchecked")
    public JSONResult loadData(TemplateMerger<?> merger, MergeContext context)
            throws DataLoadException, ParseException, TemplateParseException,
            TemplateLoadException {
        logger.trace("Merge entered : {} {}", this.item.getItemType(), this.item.getItemId());
        String componentDataType = this.item.getString(ItemConstants.COMPONENT_DATA_TYPE);
        if (componentDataType != null
                && componentDataType.equals(ItemConstants.CP_DATA_TYPE_NONE) == false) {
            // 컴포넌트에 설정된 파라미터를 가져온다.
            DatasetItem datasetItem = (DatasetItem) merger.getItem(MspConstants.ITEM_DATASET,
                    this.item.getString(ItemConstants.COMPONENT_DATASET_ID));
            boolean datasetAutoCreateYn =
                    datasetItem.getBoolYN(ItemConstants.DATASET_AUTO_CREATE_YN);
            HttpParamMap httpParamMap = (HttpParamMap) context.get(Constants.PARAM);
            Map<String, Object> datasetParam = new HashMap<String, Object>(4);
            if (datasetAutoCreateYn) {
                String paramString = datasetItem.getString(ItemConstants.DATASET_API_PARAM);
                if (McpString.isNotEmpty(paramString)) {
                    JSONParser jsonParser = new JSONParser();
                    JSONObject paramJson = (JSONObject) jsonParser.parse(paramString);
                    datasetParam.putAll(paramJson);
                }
                // 파라미터 정보를 주입한다.
                datasetParam.putAll(httpParamMap);
                this.setDataRange(datasetParam, httpParamMap);
                String datasetApi = datasetItem.getString(ItemConstants.DATASET_API);
                if (datasetApi != null && ((String) datasetApi).length() > 1) {
                    DataLoader loader = merger.getDataLoader();
                    JSONResult jsonResult = loader.getJSONResult(getDataUri(datasetItem, null),
                            datasetParam, false);
                    ((MspTemplateMerger) merger).setData(context,
                            KeyResolver.makeDataId(this.getItemType(), this.getId()), jsonResult);
                    return jsonResult;
                }
            } else {
                // SNAPSHOT_YN=Y일때 다른 용도로 사용할 수 있으므로 가져오도록 한다.
                this.setDataRange(datasetParam, httpParamMap);
                datasetParam.put(ItemConstants.CP_DATA_TYPE_DESK_PARAM,
                        this.item.getString(ItemConstants.COMPONENT_DATASET_ID));

                // Preview 모드 && WorkerId가 있을 경우 desking.work api를 호출한다.
                boolean isDeskingWork = context.getMergeOptions().isPreview()
                        && context.has(MspConstants.MERGE_CONTEXT_WORKER_ID);
                String apiName = isDeskingWork ? ItemConstants.CP_DATA_TYPE_DESK_WORK_API
                        : ItemConstants.CP_DATA_TYPE_DESK_API;
                if (isDeskingWork) {
                    datasetParam.put(MspConstants.PARAM_WORKER_ID,
                            context.get(MspConstants.MERGE_CONTEXT_WORKER_ID));
                    datasetParam.put(MspConstants.PARAM_EDITION_SEQ,
                            context.get(MspConstants.MERGE_CONTEXT_EDITION_SEQ));
                }
                DataLoader loader = merger.getDataLoader();
                JSONResult jsonResult =
                        loader.getJSONResult(getDataUri(datasetItem, apiName), datasetParam, false);
                ((MspTemplateMerger) merger).setData(context,
                        KeyResolver.makeDataId(this.getItemType(), this.getId()), jsonResult);
                return jsonResult;
            }
        }
        return null;
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

        // 미리보기 일 경우 preview resource 추가
        if (context.getMergeOptions().isPreviewResource()) {
            this.setPreviewResource(merger, context, sb);
        }
        MergeContext childContext = context.createRowDataChild();
        childContext.set(MspConstants.MERGE_CONTEXT_COMPONENT, this.item);

        String componentDataType = this.item.getString(ItemConstants.COMPONENT_DATA_TYPE);
        // dataType이 NONE이 아닐 경우만 데이터 처리
        if (componentDataType != null
                && componentDataType.equals(ItemConstants.CP_DATA_TYPE_NONE) == false) {
            HashMap<String, JSONResult> dataMap =
                    (HashMap<String, JSONResult>) context.get(MspConstants.MERGE_DATA_MAP);

            JSONResult jsonResult = null;
            if (dataMap != null) {
                jsonResult = dataMap.get(KeyResolver.makeDataId(this.getItemType(), this.getId()));
            }
            if (jsonResult == null) {
                try {
                    jsonResult = this.loadData(merger, childContext);
                } catch (DataLoadException | ParseException | TemplateParseException
                        | TemplateLoadException e) {
                    logger.warn("DataLoad Fail: {} - component : {} {} {}",
                            ((MspTemplateMerger) merger).getDomainId(), templateRoot.getItemType(),
                            templateRoot.getId(), e.getMessage());
                }
            }

            childContext.set(Constants.CURRENT_DATA_ID,
                    this.item.getItemType() + this.item.getItemId());
            // loop 커스텀태그 없이(혹은 결과가 1건인 경우) 첫번째 데이터를 사용하는 경우를 위해 첫 row를 context에
            childContext.set(Constants.LOOP_INDEX, 0);
            Object resultObject = jsonResult.get(Constants.DEFAULT_LOOP_DATA_SELECT);
            if (resultObject != null && resultObject instanceof List
                    && ((List<?>) resultObject).size() > 0) {
                childContext.set(Constants.LOOP_DATA_ROW, ((List<?>) resultObject).get(0));
            }
            // TOTAL 처리
            int total = jsonResult.getTotal();
            childContext.set(ApiResult.MAIN_TOTAL, total);
        } else {
            childContext.set(ApiResult.MAIN_TOTAL, 0);
        }

        TemplateRoot tpTemplateRoot = this.getTpTemplateRoot();
        /* mte:tp를 거치지 않고 바로 TpTemplateRoot를 처리하므로 wrapping을 처리한다. */
        wrapItemStart(merger, context, sb);

        if (tpTemplateRoot != null) {
            tpTemplateRoot.merge(merger, childContext, sb);
        } else {
            if (context.getMergeOptions().isDebug()) {
                sb.append("\n ERROR!! Template Load Fail \n");
            }
        }

        wrapItemEnd(merger, context, sb);
    }

    private void wrapItemStart(TemplateMerger<?> merger, MergeContext context, StringBuilder sb) {
        if (context.getMergeOptions().isWrapItem()) {
            sb.append(context.getCurrentIndent())
                    .append(merger.getWrapItemStart(MspConstants.ITEM_TEMPLATE, this.templateId))
                    .append(System.lineSeparator());
        }
    }

    private void wrapItemEnd(TemplateMerger<?> merger, MergeContext context, StringBuilder sb) {
        if (context.getMergeOptions().isWrapItem()) {
            sb.append(context.getCurrentIndent())
                    .append(merger.getWrapItemEnd(MspConstants.ITEM_TEMPLATE, this.templateId))
                    .append(System.lineSeparator());
        }
    }

    private void setPreviewResource(TemplateMerger<?> merger, MergeContext context,
            StringBuilder sb) {
        String resource = this.item.getString(ItemConstants.COMPONENT_PREVIEW_RESOURCE);
        if (McpString.isEmpty(resource))
            return;
        TemplateRoot templateRoot = null;
        try {
            templateRoot = TemplateParser.parse(resource);
        } catch (TemplateParseException e) {
            logger.error("Preview Resource Parsing Fail: {} - component : {} {} {}",
                    ((MspTemplateMerger) merger).getDomainId(), this.getItemType(), this.getId(),
                    e.getMessage());
            return;
        }
        sb.append(System.lineSeparator());
        templateRoot.merge(merger, context, sb);
        sb.append(System.lineSeparator());
    }

    private void setDataRange(Map<String, Object> datasetParam, HttpParamMap httpParamMap) {
        String page = httpParamMap.get(MspConstants.PARAM_PAGE);
        String count = null;
        String start = null;
        // 컴포넌트에서 페이징 정보를 주입한다.
        if (this.isComponentPaging()) {
            if (this.getPagingType().equals(MspConstants.COMPONENT_PAGING_TYPE_NUMBER)) {
                count = Integer.toString(this.getPerPageCount());
            } else if (this.getPagingType().equals(MspConstants.COMPONENT_PAGING_TYPE_MORE)) {
                if (page.equals("1")) {
                    count = Integer.toString(this.getPerPageCount());
                } else {
                    count = Integer.toString(this.getMoreCount());
                    start = Integer.toString(this.getPerPageCount()
                            + (Integer.parseInt(page) - 2) * this.getMoreCount());
                }
            }
        }
        if (count != null)
            datasetParam.put(MspConstants.PARAM_COUNT, count);
        if (start != null)
            datasetParam.put(MspConstants.PARAM_START, start);
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

    private String getDataUri(DatasetItem datasetItem, String api) {
        String apiHost = datasetItem.getString(ItemConstants.DATASET_API_HOST);
        String apiPath = datasetItem.getString(ItemConstants.DATASET_API_PATH);
        if (api == null) {
            api = datasetItem.getString(ItemConstants.DATASET_API);
        }
        return String.join("/", apiHost, apiPath, api);
    }

}
