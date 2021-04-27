package jmnet.moka.web.dps.module.menu;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
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
 * Package : jmnet.moka.web.dps.mvc.menu.controller.model
 * ClassName : Menu
 * Created : 2020-11-03 kspark
 * </pre>
 *
 * @author kspark
 * @since 2020-11-03 오전 10:44
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class Menu {
    public static String URL_PREFIX = "https://news.joins.com/";
    @JsonProperty("Key")
    private String key;

    @JsonProperty("Display")
    private String display;

    @JsonProperty("Dummy")
    private boolean dummy;

    @JsonProperty("MegaMenu")
    private boolean MegaMenu;

    @JsonProperty("TopMenu")
    private boolean TopMenu;

    @JsonProperty("LogoImage")
    private String logoImage;

    @JsonProperty("Width")
    private String width;

    @JsonProperty("Height")
    private String height;

    @JsonProperty("Url")
    private String url;

    @JsonProperty("Target")
    private String target;

    @JsonProperty("New")
    private String New;

    @JsonProperty("FilterOnlyJoongang")
    private boolean filterOnlyJoongang = false;

    @JsonProperty("FilterDate")
    private boolean filterDate = false;

    @JsonProperty("Children")
    private List<Menu> children;

    @JsonIgnore
    @JsonProperty("Category")
    private Category category;

    @JsonIgnore
    @JsonProperty("SearchParameter")
    private SearchParameter searchParameter;

    @JsonIgnore
    private Menu parentMenu;

    public Menu(Menu parentMenu, Node menuNode, MenuParser menuParser)
            throws XPathExpressionException {
        this.parentMenu = parentMenu;
        Element menuEl = (Element)menuNode;

        // Key
        this.setKey(decideString(menuEl,"Key", ""));

        // Display
        this.setDisplay(decideString(menuEl,"Display"));

        // Dummy
        this.setDummy(decideBoolean(menuEl,"Dummy",false));

        // MegaMenu
        this.setMegaMenu(decideBoolean(menuEl,"MegaMenu",true));

        // IsShowTopMenu
        this.setTopMenu(decideBoolean(menuEl,"TopMenu",true));

        // LogoImage
        this.setLogoImage(decideString(menuEl,"LogoImage"));

        // New
        this.setNew(decideString(menuEl,"New"));

        // Url
        this.setUrl(menuEl, menuParser);

        // Width
        this.setWidth(decideString(menuEl,"Width"));

        // Hight
        this.setHeight(decideString(menuEl,"Hight"));

        this.setCategoryAndSearchParamter(menuEl, menuParser);
    }

    public boolean hasChildren() {
        return this.children.size() > 0;
    }

    public boolean matchedSubCategory(String key) {
        if ( this.category != null && this.category.getSubCategoryList() != null) {
            for ( Category subCategory:this.category.getSubCategoryList()) {
                if ( subCategory.getKey().equalsIgnoreCase(key)) {
                    return true;
                }
            }
        }
        return false;
    }

    public void setUrl(Element menuNode, MenuParser menuParser)
            throws XPathExpressionException {
        Node urlNode = menuParser.getNode(menuNode,"Url");
        if ( urlNode != null) {
            Element urlEl = (Element)urlNode;
            if ( urlEl.hasAttribute("Link")) {
                this.url = urlEl.getAttribute("Link");
            }
            if ( urlEl.hasAttribute("Target")) {
                this.target = urlEl.getAttribute("Target");
            }
        }
    }

    public void setFilter(Element menuNode, MenuParser menuParser)
            throws XPathExpressionException {
        Node listNode = menuParser.getNode(menuNode,"List");
        if ( listNode != null) {
            Element listEl = (Element)listNode;
            this.setFilterOnlyJoongang(decideBoolean(listEl,"FilterOnlyJoongang",false));
            this.setFilterDate(decideBoolean(listEl,"FilterDate",false));
        }
    }

    public void setCategoryAndSearchParamter(Element menuNode, MenuParser menuParser)
            throws XPathExpressionException {
        Node categoryNode = menuParser.getNode(menuNode,"Category");
        if ( categoryNode != null) {
            Category category = new Category(this.key, categoryNode, menuParser);
            this.setCategory(category);
        }
        Node searchParameterNode = menuParser.getNode(menuNode,"SearchParameters");
        if ( searchParameterNode != null) {
            NodeList nodeList = menuParser.getNodeList(searchParameterNode,"Parameter");
            if ( nodeList != null) {
                this.searchParameter = new SearchParameter(nodeList);
            }
        }
    }

    public void addChildMenu(Menu childMenu) {
        if ( this.children == null) {
            this.children = new ArrayList<>();
        }
        this.children.add(childMenu);
    }

    private boolean decideBoolean(Element element, String attribute, boolean defaultValue) {
        String value = element.getAttribute(attribute);
        if (McpString.isEmpty(value)) {
            return defaultValue;
        } else if ( value.equalsIgnoreCase("true")) {
            return true;
        } else {
            return false;
        }
    }

    private String decideString(Element element, String attribute, String... defaultValues) {
        String defaultValue;
        if (defaultValues.length == 0) {
            defaultValue = null;
        } else {
            defaultValue = defaultValues[0];
        }
        String value = element.getAttribute(attribute);
        if (value == null) {
            return defaultValue;
        } else {
            return value;
        }
    }
}

