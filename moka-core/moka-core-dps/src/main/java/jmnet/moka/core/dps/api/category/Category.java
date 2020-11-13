package jmnet.moka.core.dps.api.category;

import java.util.ArrayList;
import java.util.List;
import javax.xml.xpath.XPathExpressionException;
import jmnet.moka.common.utils.McpString;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

/**
 * <pre>
 *
 * Project : moka-web-bbs
 * Package : jmnet.moka.core.dps.api.category
 * ClassName : Category
 * Created : 2020-11-13 kspark
 * </pre>
 *
 * @author kspark
 * @since 2020-11-13 오전 8:36
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class Category {
    private List<String> masterCodeList;
    private List<String> serviceCodeList;
    private List<String> sourceCodeList;
    private List<String> exceptSourceCodeList;
    private String key;
    private String usageType;
    private String term;
    private final static List<String> EMPTY_CODE_LIST = new ArrayList<>(0);

    public Category(Node CategoryNode, CategoryParser categoryParser)
            throws XPathExpressionException {
        Element categoryEl = (Element) CategoryNode;
        this.key = categoryEl.getAttribute("Key");
        this.term = categoryEl.getAttribute("Term");
        this.masterCodeList = getCodeList(categoryEl, categoryParser, "MasterCodes/string");
        this.serviceCodeList = getCodeList(categoryEl, categoryParser, "ServiceCodes/string");
        this.sourceCodeList = getCodeList(categoryEl, categoryParser, "SourceCodes/string");
        this.exceptSourceCodeList = getCodeList(categoryEl, categoryParser, "ExceptSourceCodes/string");
    }

    public boolean isMatch(String masterCode, String serviceCode, String sourceCode) {
        if ( this.masterCodeList.size()>0) {
            if (this.masterCodeList.contains(masterCode)) { // 마스터코드와 일치하면
                //소스코드 포함조건
                if ( this.sourceCodeList.size() > 0) {
                    if ( this.sourceCodeList.contains(sourceCode)) {
                        return true;
                    } else {
                        return false;
                    }
                }
                //소스코드 제외 조건
                if ( this.exceptSourceCodeList.size() > 0) {
                    if ( this.exceptSourceCodeList.contains(sourceCode)) {
                        return false;
                    }
                }
                return true;
            }
        } else if (this.serviceCodeList.size()>0){
            if (McpString.isNotEmpty(serviceCode) && this.serviceCodeList.contains(serviceCode)) {
                return true;
            }
        }
        return false;
    }

    public List<String> getCodeList(Element categoryEl, CategoryParser categoryParser, String xPath)
            throws XPathExpressionException {
        NodeList codeElList = categoryParser.getNodeList(categoryEl, xPath);
        if (codeElList.getLength() > 0) {
            List<String> codeList = new ArrayList<>(16);
            for (int i = 0; i < codeElList.getLength(); i++) {
                codeList.add(codeElList
                        .item(i)
                        .getTextContent());
            }
            return codeList;
        } else {
            return EMPTY_CODE_LIST;
        }
    }
}
