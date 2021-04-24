package jmnet.moka.web.dps.module.menu;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import javax.xml.xpath.XPathExpressionException;
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
    private String display;
    private String term;
    private String startDate;
    private List<Category> subCategoryList;
    private final static List<String> EMPTY_CODE_LIST = new ArrayList<>(0);

    public Category(String key, Node CategoryNode, MenuParser menuParser)
            throws XPathExpressionException {
        this.key = key;
        Element categoryEl = (Element) CategoryNode;
        this.term = categoryEl.getAttribute("Term");
        this.display = categoryEl.getAttribute("Display");
        this.startDate = categoryEl.getAttribute("StartDate");
        NodeList subCategoryNodes = menuParser.getNodeList(categoryEl, "SubCategory");
        if ( subCategoryNodes == null || subCategoryNodes.getLength() == 0) {
            this.masterCodeList = buildCodeList(categoryEl, menuParser, "MasterCodes");
            this.serviceCodeList = buildCodeList(categoryEl, menuParser, "ServiceCodes");
            this.sourceCodeList = buildCodeList(categoryEl, menuParser, "SourceCodes");
            this.exceptSourceCodeList = buildCodeList(categoryEl, menuParser, "ExceptSourceCodes");
        } else {
            this.subCategoryList = new ArrayList<Category>();
            for ( int i=0; i<subCategoryNodes.getLength(); i++) {
                Element subCategoryEl = (Element)subCategoryNodes.item(i);
                Category subCategory = new Category(subCategoryEl.getAttribute("Key"), subCategoryEl, menuParser);
                this.subCategoryList.add(subCategory);
                menuParser.addCategory(subCategory.getKey(),subCategory);
            }
            // 서브카테고리를 머지함
            Set<String> masterCodeSet = new HashSet<>();
            Set<String> serviceCodeSet = new HashSet<>();
            Set<String> sourceCodeSet = new HashSet<>();
            Set<String> exceptsourceCodeSet = new HashSet<>();
            for ( Category subCategory : this.subCategoryList) {
                masterCodeSet.addAll(subCategory.masterCodeList);
                serviceCodeSet.addAll(subCategory.serviceCodeList);
                sourceCodeSet.addAll(subCategory.sourceCodeList);
                exceptsourceCodeSet.addAll(subCategory.exceptSourceCodeList);
            }
            this.masterCodeList = new ArrayList(masterCodeSet);
            this.serviceCodeList = new ArrayList(serviceCodeSet);
            this.sourceCodeList = new ArrayList(sourceCodeSet);
            this.exceptSourceCodeList = new ArrayList(exceptsourceCodeSet);
        }
        menuParser.addCategory(this.key,this);
    }

    public Map<String, String> getSubCategoryEntry() {
        if ( this.subCategoryList != null) {
            Map<String,String> subCategoryEntryMap = new LinkedHashMap<>();
            for (Category subCategory : this.subCategoryList) {
                subCategoryEntryMap.put(subCategory.getKey(), subCategory.getDisplay());
            }
            return subCategoryEntryMap;
        }
        return null;
    }

    public boolean isMatch(String[] inputMasterCodes, String[] inputServiceCodes, String sourceCode) {
        if ( this.masterCodeList.size()>0) {
            if (isMatchMasterCode(inputMasterCodes)) { // 마스터코드와 일치하면
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
            if (isMatchServiceCode(inputServiceCodes)) {
                return true;
            }
        }
        return false;
    }

    private boolean isMatchMasterCode(String[] inputMasterCodes) {
        if ( inputMasterCodes == null ) return false;
        for ( String input : inputMasterCodes) {
            if (this.masterCodeList.contains(input)) {
                return true;
            }
        }
        return false;
    }

    private boolean isMatchServiceCode(String[] inputServiceCodes) {
        if ( inputServiceCodes == null ) return false;
        for ( String input : inputServiceCodes) {
            if (this.serviceCodeList.contains(input)) {
                return true;
            }
        }
        return false;
    }

    public List<String> buildCodeList(Element categoryEl, MenuParser menuParser, String xPath)
            throws XPathExpressionException {
        NodeList codeElList = menuParser.getNodeList(categoryEl, xPath);
        if (codeElList.getLength() > 0) {
            List<String> codeList = new ArrayList<>(16);
            for (int i = 0; i < codeElList.getLength(); i++) {
                String codeData = codeElList
                        .item(i)
                        .getTextContent();
                if ( codeData != null && codeData.length()>0) {
                    String[] codes = codeData.split("\\s+");
                    Arrays.stream(codes).filter(code->code.length()>0).forEach(code -> {codeList.add(code);});
                }
            }
            return codeList;
        } else {
            return EMPTY_CODE_LIST;
        }
    }
}
