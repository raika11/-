package jmnet.moka.common.template.parse;

import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import jmnet.moka.common.template.Constants;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.template.parse.model.TemplateElement;
import jmnet.moka.common.template.parse.model.TemplateNode;
import jmnet.moka.common.template.parse.model.TemplateRoot;
import jmnet.moka.common.template.parse.model.TemplateText;
import jmnet.moka.common.template.parse.model.TemplateToken;

/**
 * 
 * <pre>
 * 템플릿 Root를 serialize 한다.
 * 2020. 4. 27. kspark 최초생성
 * </pre>
 * 
 * @since 2020. 4. 27. 오전 9:15:16
 * @author kspark
 */
public class TemplateSerializer {

    private static void serializeAttribute(TemplateElement templateElement, StringBuilder sb) {
        Map<String, String> attributeMap = templateElement.getAttributeMap();
        if (attributeMap != null) {
            for (Entry<String, String> entry : attributeMap.entrySet()) {
                sb.append(' ').append(entry.getKey()).append('=').append('\"')
                        .append(entry.getValue()).append('\"');
            }
        }
    }

    private static void serializeElement(TemplateElement templateElement, StringBuilder sb) {
        sb.append('<').append(templateElement.getNodeName());
        serializeAttribute(templateElement, sb);
        if (templateElement.hasChild()) {
            sb.append('>');
            for (TemplateNode node : templateElement.childNodes()) {
                if (node instanceof TemplateElement) {
                    serializeElement((TemplateElement) node, sb);
                } else if (node instanceof TemplateText) {
                    serializeText((TemplateText) node, sb);
                } else if (node instanceof TemplateToken) {
                    serializeToken((TemplateToken) node, sb);
                }
            }
            sb.append("</").append(templateElement.getNodeName()).append('>');
        } else {
            sb.append("/>");
        }
    }

    private static void serializeText(TemplateText text, StringBuilder sb) {
        List<String> lines = text.getLines();
        for (int i = 0; i < lines.size(); i++) {
            sb.append(lines.get(i));
        }
    }

    private static void serializeToken(TemplateToken token, StringBuilder sb) {
        sb.append("${").append(token.getText()).append("}");
    }

    public static String serialize(TemplateRoot templateRoot) {
        StringBuilder sb = new StringBuilder(2048);
        for (TemplateNode node : templateRoot.childNodes()) {
            if (node instanceof TemplateElement) {
                serializeElement((TemplateElement) node, sb);
            } else if (node instanceof TemplateText) {
                serializeText((TemplateText) node, sb);
            } else if (node instanceof TemplateToken) {
                serializeToken((TemplateToken) node, sb);
            }
        }
        return sb.toString();
    }

    public static String changeChildTemplate(String templateText, String templateTag,
            String originTemplateId, String destTemplateId, String destTemplateName)
            throws TemplateParseException {
        TemplateRoot templateRoot = TemplateParser.parse(templateText);
        for (TemplateNode node : templateRoot.childNodes()) {
            if (Constants.hasTemplate(node.getNodeType())) {
                if (node.getNodeName().equals(templateTag)) {
                    TemplateElement element = (TemplateElement) node;
                    Map<String, String> attributeMap = element.getAttributeMap();
                    if (attributeMap.containsKey(Constants.ATTR_ID)
                            && attributeMap.containsKey(Constants.ATTR_NAME)) {
                        if (attributeMap.get(Constants.ATTR_ID).equals(originTemplateId)) {
                            attributeMap.put(Constants.ATTR_ID, destTemplateId);
                            attributeMap.put(Constants.ATTR_NAME, destTemplateName);
                        }
                    }
                }
            }
        }
        return TemplateSerializer.serialize(templateRoot);
    }
}
