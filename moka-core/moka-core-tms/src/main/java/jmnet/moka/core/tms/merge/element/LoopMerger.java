package jmnet.moka.core.tms.merge.element;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jmnet.moka.common.JSONResult;
import jmnet.moka.common.template.Constants;
import jmnet.moka.common.template.exception.TemplateLoadException;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.common.template.merge.TemplateMerger;
import jmnet.moka.common.template.merge.element.AbstractElementMerger;
import jmnet.moka.common.template.parse.model.TemplateElement;
import jmnet.moka.common.template.parse.model.TemplateNode;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.ItemConstants;
import jmnet.moka.core.common.MspConstants;
import jmnet.moka.core.tms.merge.MspTemplateMerger;
import jmnet.moka.core.tms.merge.item.ComponentAd;
import jmnet.moka.core.tms.merge.item.ComponentItem;
import jmnet.moka.core.tms.mvc.HttpParamMap;
import jmnet.moka.core.tms.template.parse.model.AdTemplateRoot;

/**
 * <pre>
 * MSP용 loop 엘리먼트를 머지한다.
 * 2020. 4. 23. kspark 최초생성
 * </pre>
 * 
 * @since 2019. 9. 4. 오후 4:17:48
 * @author kspark
 */
public class LoopMerger extends AbstractElementMerger {

    private static final Logger logger = LoggerFactory.getLogger(LoopMerger.class);
    private static final Map<Integer, ComponentAd> EMPTY_AD_MAP =
            Collections.unmodifiableMap(new HashMap<Integer, ComponentAd>());

    public static class LoopState {

        public TemplateElement element;
        public MergeContext context;
        public String dataId;
        public String select;
        public int step;
        public boolean fill;
        public String filter;
        public int start = 1;
        public int count = -1;
        public int dataSize = 0;

        public LoopState(TemplateElement element, MergeContext context) {
            this.element = element;
            this.context = context;

            dataId = element.getAttribute(Constants.ATTR_DATA_ID);
            dataId = McpString.isEmpty(dataId) ? (String) context.get(Constants.CURRENT_DATA_ID)
                    : dataId;

            select = element.getAttribute(Constants.ATTR_SELECT);
            select = McpString.isEmpty(select) ? Constants.DEFAULT_LOOP_DATA_SELECT : select;

            String stepAttr = element.getAttribute(Constants.ATTR_STEP);
            step = McpString.isEmpty(stepAttr) ? 1 : Integer.parseInt(stepAttr);

            filter = element.getAttribute(Constants.ATTR_FILTER);

            // 1-base index를 사용함
            String startAttr = element.getAttribute(Constants.ATTR_START);
            if (startAttr != null && startAttr.matches("[0-9]+")) {
                start = Integer.parseInt(startAttr);
            }
            start = (start == 0 ? 1 : start);
            String countAttr = element.getAttribute(Constants.ATTR_COUNT);
            if (countAttr != null && startAttr.matches("[0-9]+")) {
                count = Integer.parseInt(countAttr);
            }

            String fillAttr = element.getAttribute(Constants.ATTR_FILL);
            fill = false;
            if (fillAttr != null && fillAttr.matches("[y|Y|n|N]")) {
                fill = fillAttr.equalsIgnoreCase("Y");
            }
        }

        @SuppressWarnings("unchecked")
        public List<?> getDataList(JSONResult jsonResult, Map<String, String> emptyRow) {
            dataSize = 0;
            List<?> dataList = null;
            if (jsonResult != null) {
                Object dataListObj = jsonResult.get(select);
                // 기본 데이터가 아닐 경우 한 번 더 벗겨낸다.
                if (select.equals(Constants.DEFAULT_LOOP_DATA_SELECT) == false) {
                    dataListObj =
                            ((JSONResult) dataListObj).get(Constants.DEFAULT_LOOP_DATA_SELECT);
                }
                if (dataListObj != null && dataListObj instanceof List) {
                    dataList = (List<?>) dataListObj;
                    dataSize = dataList.size();
                    if (fill == true) { // 지정된 count만큼 채울 경우
                        if (count == -1) { // 지정된 count값이 없을 경우 데이터의 건수로 결정
                            count = dataSize;
                        }
                        // else  지정된 count 사용

                    } else {  // 조회된 데이터 만큼만 채울 경우
                        if (count == -1) { // 지정된 count값이 없을 경우 데이터의 건수로 결정
                            count = dataSize;
                        } else if (count > dataSize) { // count보다 조회된 데이터 건수가 적을 경우
                            count = dataSize;
                        } //  지정된 count 사용 
                    }
                    if (dataSize > 0) { // 빈 행을 위해 emptyRow를 생성해 둔다.
                        for (String key : ((Map<String, Object>) dataList.get(0)).keySet()) {
                            emptyRow.put(key, "");
                        }
                    }
                } else {
                    // TODO list형태가 아닌 경우 Exception 발생
                    logger.error("Data is not List type: dataId = {}", dataId);
                }
            }
            return dataList;
        }

        public int getDataSize() {
            return this.dataSize;
        }
    }

    public LoopMerger(TemplateMerger<?> templateMerger) throws IOException {
        super(templateMerger);
        logger.debug("{} is Created", this.getClass().getName());
    }

    @Override
    public void merge(TemplateElement element, MergeContext context, StringBuilder sb)
            throws TemplateMergeException {
        String indent = context.getCurrentIndent();
        boolean isDebug = context.getMergeOptions().isDebug();

        LoopState state = new LoopState(element, context);

        MergeContext childContext = context.createRowDataChild();
        childContext.set(Constants.LOOP_START, state.start);
        childContext.set(Constants.LOOP_COUNT, state.count);

        if (isDebug)
            debug("START", element, indent, sb);

        JSONResult jsonResult =
                ((MspTemplateMerger) this.templateMerger).getData(childContext, state.dataId);

        Map<String, String> emptyRow = new HashMap<String, String>(16);
        List<?> dataList = state.getDataList(jsonResult, emptyRow);
        int dataSize = state.getDataSize(); // getDataList()를 먼저 호출해야 함

        ComponentItem componentItem = getComponentItem(context);
        Map<Integer, ComponentAd> adMap = this.getAdMap(componentItem, state.count);
        state.count = state.count + adMap.size();
        HttpParamMap httpParamMap = (HttpParamMap) context.get(MspConstants.MERGE_CONTEXT_PARAM);
        int page = httpParamMap.getInt(MspConstants.PARAM_PAGE);
        // 삭제 단어를 구한다.
        List<String> delWordList = getDelWordList(componentItem);
        int dataIndex = state.start;
        for (int loopIndex = state.start; loopIndex <= state.count; loopIndex =
                loopIndex + state.step) {
            childContext.set(Constants.LOOP_INDEX, loopIndex);
            int totalIndex = getTotalIndex(componentItem, page, loopIndex);
            childContext.set(Constants.LOOP_TOTAL_INDEX, totalIndex);
            // 반복횟수보다 row 갯수가 적을 경우 채우기 여부
            childContext.set(Constants.LOOP_DATA_FILL, state.fill);

            if (adMap.containsKey(loopIndex)) {
                ComponentAd componentAd = adMap.get(loopIndex);
                // TODO AdTemplateRoot로 머징해야 한다
                //                sb.append(String.format("<li>%d <ul><li>AD_ID:%s, AD_NAME:%s</li></ul></li>",
                //                        totalIndex, componentAd.getAdId(), componentAd.getAdName()));
                try {
                    AdTemplateRoot adRoot = (AdTemplateRoot) this.templateMerger
                            .getParsedTemplate(MspConstants.ITEM_AD, componentAd.getAdId());
                    adRoot.merge(this.templateMerger, childContext, sb);
                } catch (TemplateParseException e) {
                    e.printStackTrace();
                } catch (TemplateLoadException e) {
                    e.printStackTrace();
                }

            } else {
                if (dataList != null && dataSize >= dataIndex) {
                    Object row = dataList.get(dataIndex - 1);
                    childContext.set(Constants.LOOP_DATA_ROW, dataList.get(dataIndex - 1));
                    if (McpString.isNotEmpty(state.filter)) {
                        Object evalObj =
                                this.templateMerger.getEvaluator().eval(state.filter, childContext);
                        if (evalObj != null && (boolean) evalObj == false) {
                            dataIndex++;
                            continue;
                        }
                    }
                    replaceDelWords(row, delWordList);
                } else {
                    childContext.set(Constants.LOOP_DATA_ROW, emptyRow);
                }
                dataIndex++;

                if (isDebug)
                    debug("START", "LOOP index=" + loopIndex, indent + "\t", sb);
                for (TemplateNode node : element.childNodes()) {
                    node.merge(templateMerger, childContext, sb);
                }
                if (isDebug)
                    debug("END  ", "LOOP index=" + loopIndex, indent + "\t", sb);
            }
        }

        if (isDebug)
            debug("END  ", element, indent, sb);
    }

    private Map<Integer, ComponentAd> getAdMap(ComponentItem componentItem, int count) {
        Object componentAds = componentItem.get(ItemConstants.COMPONENTAD_LIST);
        if (componentAds == null)
            return EMPTY_AD_MAP;
        @SuppressWarnings("unchecked")
        List<ComponentAd> componentAdList = (List<ComponentAd>) componentAds;
        Map<Integer, ComponentAd> adMap = new HashMap<Integer, ComponentAd>();
        for (ComponentAd componentAd : componentAdList) {
            int listParagraph = componentAd.getListParagraph();
            if (listParagraph <= count) {
                count++;
                adMap.put(listParagraph, componentAd);
            }
        }
        return adMap;
    }

    private int getTotalIndex(ComponentItem item, int page, int index) {
        if (item.getBoolYN(ItemConstants.COMPONENT_PAGING_YN)) {
            if (item.getString(ItemConstants.COMPONENT_PAGING_TYPE)
                    .equals(MspConstants.COMPONENT_PAGING_TYPE_NUMBER)) {
                return (page - 1) * item.getInt(ItemConstants.COMPONENT_PER_PAGE_COUNT) + index;
            } else {
                if (page > 1) {
                    return item.getInt(ItemConstants.COMPONENT_PER_PAGE_COUNT)
                            + (page - 2) * item.getInt(ItemConstants.COMPONENT_MORE_COUNT) + index;
                }
                // 1페이지는 그냥 index
            }

            return index;
        }
        return index;

    }

    private void replaceDelWords(Object row, List<String> delWordList) {
        if (delWordList == null)
            return;
        if (row instanceof Map) {
            @SuppressWarnings("unchecked")
            Map<String, Object> rowMap = (Map<String, Object>) row;
            if (rowMap.containsKey(ItemConstants.CP_DEL_WORDS_COLUMN) && delWordList != null) {
                String title = (String) rowMap.get(ItemConstants.CP_DEL_WORDS_COLUMN);
                for (String delWord : delWordList) {
                    //TODO 기능 검증후 {삭제: } 제거
                    title = title.replace(delWord, "{삭제:" + delWord + "}");
                }
                rowMap.put(ItemConstants.CP_DEL_WORDS_COLUMN, title);
            }
        }
    }

    private List<String> getDelWordList(ComponentItem componentItem) {
        if (componentItem == null)
            return null;
        String delWords = componentItem.getString(ItemConstants.COMPONENT_DEL_WORDS);
        if (McpString.isNotEmpty(delWords)) {
            return Arrays.asList(delWords.split("\\r?\\n"));
        }
        return null;
    }

    private ComponentItem getComponentItem(MergeContext context) {
        Object itemObject = context.get(MspConstants.MERGE_CONTEXT_COMPONENT);
        if (itemObject != null) {
            return (ComponentItem) itemObject;
        }
        return null;
    }
}
