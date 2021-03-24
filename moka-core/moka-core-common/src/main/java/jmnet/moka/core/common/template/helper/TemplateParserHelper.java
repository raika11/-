package jmnet.moka.core.common.template.helper;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import jmnet.moka.common.template.Constants;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.template.parse.TemplateParser;
import jmnet.moka.common.template.parse.model.TemplateRoot;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.template.ParsedItemDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class TemplateParserHelper {

    private static final Logger logger = LoggerFactory.getLogger(TemplateParserHelper.class);

    private static HashMap<String, String> customTagToItemMap = new HashMap<String, String>(8);

    static {
        customTagToItemMap.put(Constants.EL_CT, MokaConstants.ITEM_CONTAINER);
        customTagToItemMap.put(Constants.EL_CP, MokaConstants.ITEM_COMPONENT);
        customTagToItemMap.put(Constants.EL_TP, MokaConstants.ITEM_TEMPLATE);
        customTagToItemMap.put(Constants.EL_AD, MokaConstants.ITEM_AD);
    }

    private static HashMap<String, String> itemToCustomTagMap = new HashMap<String, String>(8);

    static {
        itemToCustomTagMap.put(MokaConstants.ITEM_CONTAINER, Constants.EL_CT);
        itemToCustomTagMap.put(MokaConstants.ITEM_COMPONENT, Constants.EL_CP);
        itemToCustomTagMap.put(MokaConstants.ITEM_TEMPLATE, Constants.EL_TP);
        itemToCustomTagMap.put(MokaConstants.ITEM_AD, Constants.EL_AD);
    }

    public static String customTagToItem(String customTag) {
        return customTagToItemMap.get(customTag);
    }

    public static String itemToCustomTag(String item) {
        return itemToCustomTagMap.get(item);
    }

    public static List<ParsedItemDTO> getItemList(String templateText)
            throws UnsupportedEncodingException, IOException, TemplateParseException {
        TemplateRoot templateRoot = TemplateParser.parse(templateText);
        List<Map<String, Object>> elementInfoList = templateRoot.getElementInfoList();
        int order = 0;
        List<ParsedItemDTO> templateItemList = new ArrayList<ParsedItemDTO>(16);
        for (Map<String, Object> elementInfo : elementInfoList) {
            if (Constants.hasTemplate(Constants.nodeType((String) elementInfo.get(Constants.INFO_NODE_NAME)))) {
                ParsedItemDTO itemDto = new ObjectMapper().convertValue(elementInfo, ParsedItemDTO.class);
                String item = customTagToItem(itemDto.getNodeName());
                if (item != null) {
                    itemDto.setNodeName(item);
                }
                itemDto.setOrder(order);
                templateItemList.add(itemDto);
                order++;
                // relCp가 있을 경우 추가해 준다.
                Map attributeMap = (Map) elementInfo.get(Constants.INFO_ATTR_MAP);
                if (attributeMap.containsKey(MokaConstants.ATTR_REL_CP)) {
                    ParsedItemDTO relCpDto = new ParsedItemDTO();
                    relCpDto.setOrder(order);
                    relCpDto.setId((String) attributeMap.get(MokaConstants.ATTR_REL_CP));
                    relCpDto.setNodeName(MokaConstants.ITEM_COMPONENT);
                    templateItemList.add(relCpDto);
                    order++;
                }
            }
        }
        return templateItemList;
    }

    public static void checkSyntax(String templateText)
            throws UnsupportedEncodingException, IOException, TemplateParseException {
        try {
            TemplateParser.parse(templateText);
        } catch (TemplateParseException e) {
            logger.error("Template Syntax is not valid:", e.getMessage());
            throw e;
        }
    }

}
