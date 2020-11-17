package jmnet.moka.core.tms.merge.element;

import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import jmnet.moka.common.JSONResult;
import jmnet.moka.common.template.Constants;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.common.template.merge.TemplateMerger;
import jmnet.moka.common.template.merge.element.AbstractElementMerger;
import jmnet.moka.common.template.parse.model.TemplateElement;
import jmnet.moka.common.template.parse.model.TemplateNode;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.ItemConstants;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tms.merge.MokaTemplateMerger;
import jmnet.moka.core.tms.merge.item.ComponentItem;
import jmnet.moka.core.tms.mvc.HttpParamMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * <pre>
 * MSP용 loop 엘리먼트를 머지한다.
 * 2020. 4. 23. kspark 최초생성
 * </pre>
 *
 * @author kspark
 * @since 2019. 9. 4. 오후 4:17:48
 */
public class LoopMerger extends AbstractElementMerger {
    private final static String ATTR_VAR = "var";
    private static final Logger logger = LoggerFactory.getLogger(LoopMerger.class);

    public static class LoopState {
        public TemplateElement element;
        public MergeContext context;
        public String dataId;
        public String select;
        public String var;
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
            dataId = McpString.isEmpty(dataId) ? (String) context.get(Constants.CURRENT_DATA_ID) : dataId;

            select = element.getAttribute(Constants.ATTR_SELECT);
            select = McpString.isEmpty(select) ? Constants.DEFAULT_LOOP_DATA_SELECT : select;

            var = element.getAttribute(ATTR_VAR);

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

        public List<?> getDataList(MokaTemplateMerger templateMerger, Map<String, String> emptyRow) {
            this.dataSize = 0;
            Object dataListObj = null;
            List<?> dataList = null;
            if ( McpString.isNotEmpty(var)) {
                dataListObj = templateMerger.getEvaluator().eval(var, context);
            } else if (!dataId.equalsIgnoreCase(Constants.PARENT)) { //데이터셋 데이터를 가져오는 경우
                JSONResult jsonResult = templateMerger.getData(context, this.dataId);
                if (jsonResult != null) {
                    dataListObj = jsonResult.get(select);
                    // 기본 데이터가 아닐 경우 한 번 더 벗겨낸다.
                    if (!select.equals(Constants.DEFAULT_LOOP_DATA_SELECT)) {
                        dataListObj = ((JSONResult) dataListObj).get(Constants.DEFAULT_LOOP_DATA_SELECT);
                    }
                }
            } else { // 상위 loop에서 데이터를 가져오는 경우
                String column = element.getAttribute(Constants.ATTR_SELECT);
                dataListObj = context.get(column);
            }

            if (dataListObj instanceof List) {
                dataList = (List<?>) dataListObj;
                this.dataSize = dataList.size();
                if (fill) { // 지정된 count만큼 채울 경우
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
                if (dataSize > 0 && dataList.get(0) instanceof Map) { // 빈 행을 위해 emptyRow를 생성해 둔다.
                    for (String key : ((Map<String, Object>) dataList.get(0)).keySet()) {
                        emptyRow.put(key, "");
                    }
                }
            } else { // 데이터가 null 이거나
                // TODO list형태가 아닌 경우 Exception 발생
                logger.error("Data is not List type: dataId = {}, select={}", dataId, select);
            }
            return dataList;
        }

        public int getDataSize() {
            return this.dataSize;
        }
    }

    public LoopMerger(TemplateMerger<?> templateMerger)
            throws IOException {
        super(templateMerger);
        logger.debug("{} is Created", this
                .getClass()
                .getName());
    }

    @Override
    public void merge(TemplateElement element, MergeContext context, StringBuilder sb)
            throws TemplateMergeException {
        String indent = context.getCurrentIndent();
        boolean isDebug = context
                .getMergeOptions()
                .isDebug();

        LoopState state = new LoopState(element, context);

        MergeContext childContext = context.createRowDataChild();
        childContext.set(Constants.LOOP_START, state.start);
        childContext.set(Constants.LOOP_COUNT, state.count);

        if (isDebug) {
            debug("START", element, indent, sb);
        }

        Map<String, String> emptyRow = new HashMap<>(16);
        List<?> dataList = state.getDataList((MokaTemplateMerger) this.templateMerger, emptyRow);
        int dataSize = state.getDataSize(); // getDataList()를 먼저 호출해야 함

        ComponentItem componentItem = getComponentItem(context);

        HttpParamMap httpParamMap = (HttpParamMap) context.get(MokaConstants.MERGE_CONTEXT_PARAM);
        int page = httpParamMap.getInt(MokaConstants.PARAM_PAGE);
        // 삭제 단어를 구한다.
        List<String> delWordList = getDelWordList(componentItem);
        int dataIndex = state.start;
        for (int loopIndex = state.start; loopIndex <= state.count; loopIndex = loopIndex + state.step) {
            childContext.set(Constants.LOOP_INDEX, loopIndex);
            int totalIndex = getTotalIndex(componentItem, page, loopIndex);
            childContext.set(Constants.LOOP_TOTAL_INDEX, totalIndex);
            // 반복횟수보다 row 갯수가 적을 경우 채우기 여부
            childContext.set(Constants.LOOP_DATA_FILL, state.fill);

            if (dataList != null && dataSize >= dataIndex) {
                Object row = dataList.get(dataIndex - 1);
                childContext.set(Constants.LOOP_DATA_ROW, dataList.get(dataIndex - 1));
                if (McpString.isNotEmpty(state.filter)) {
                    Object evalObj = this.templateMerger
                            .getEvaluator()
                            .eval(state.filter, childContext);
                    if (evalObj != null && !((boolean) evalObj)) {
                        dataIndex++;
                        continue;
                    }
                }
                if (componentItem != null) {
                    replaceDelWords(row, delWordList);
                }
            } else {
                childContext.set(Constants.LOOP_DATA_ROW, emptyRow);
            }
            dataIndex++;

            if (isDebug) {
                debug("START", "LOOP index=" + loopIndex, indent + "\t", sb);
            }
            for (TemplateNode node : element.childNodes()) {
                node.merge(templateMerger, childContext, sb);
            }
            if (isDebug) {
                debug("END  ", "LOOP index=" + loopIndex, indent + "\t", sb);
            }
        }

        if (isDebug) {
            debug("END  ", element, indent, sb);
        }
    }

    private int getTotalIndex(ComponentItem item, int page, int index) {
        if (item == null) {
            return 0;
        }
        if (item.getBoolYN(ItemConstants.COMPONENT_PAGING_YN)) {
            if (item
                    .getString(ItemConstants.COMPONENT_PAGING_TYPE)
                    .equals(MokaConstants.COMPONENT_PAGING_TYPE_NUMBER)) {
                return (page - 1) * item.getInt(ItemConstants.COMPONENT_PER_PAGE_COUNT) + index;
            } else {
                if (page > 1) {
                    return item.getInt(ItemConstants.COMPONENT_PER_PAGE_COUNT) + (page - 2) * item.getInt(ItemConstants.COMPONENT_MORE_COUNT) + index;
                }
                // 1페이지는 그냥 index
            }

            return index;
        }
        return index;

    }

    private void replaceDelWords(Object row, List<String> delWordList) {
        if (delWordList == null) {
            return;
        }
        if (row instanceof Map) {
            @SuppressWarnings("unchecked") Map<String, Object> rowMap = (Map<String, Object>) row;
            if (rowMap.containsKey(ItemConstants.CP_DEL_WORDS_COLUMN)) {
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
        if (componentItem == null) {
            return null;
        }
        String delWords = componentItem.getString(ItemConstants.COMPONENT_DEL_WORDS);
        if (McpString.isNotEmpty(delWords)) {
            return Arrays.asList(delWords.split("\\r?\\n"));
        }
        return null;
    }

    private ComponentItem getComponentItem(MergeContext context) {
        Object itemObject = context.get(MokaConstants.MERGE_CONTEXT_COMPONENT);
        if (itemObject != null) {
            return (ComponentItem) itemObject;
        }
        return null;
    }
}
