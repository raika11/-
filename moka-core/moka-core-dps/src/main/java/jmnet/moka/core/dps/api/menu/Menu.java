package jmnet.moka.core.dps.api.menu;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
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

    @JsonProperty("SubKey")
    private String subKey;

    @JsonProperty("Display")
    private String display;

    @JsonProperty("DisplayTitle")
    private String displayTitle;

    @JsonProperty("LogoImage")
    private String logoImage;

    @JsonProperty("Url")
    private Url url;

    @JsonProperty("PartialUrl")
    private String partialUrl;

    @JsonProperty("IsTrackable")
    private boolean IsTrackable;

    @JsonProperty("Children")
    private List<Menu> children;

    @JsonProperty("IsShowMegaMenu")
    private boolean IsShowMegaMenu;

    @JsonProperty("IsShowTopMenu")
    private boolean IsShowTopMenu;

    @JsonProperty("IsDummy")
    private boolean isDummy;

    @JsonProperty("Width")
    private String width;

    @JsonProperty("Height")
    private String height;

    @JsonProperty("HeadingTag")
    private String headingTag;

    @JsonProperty("IconType")
    private String iconType;

    @JsonProperty("IsDisplayTitle")
    private boolean IsDisplayTitle;

    @JsonProperty("IconHtml")
    private String iconHtml;

    @JsonProperty("CategoryKey")
    private String categoryKey;

    @JsonIgnore
    private Menu parentMenu;

    public Menu(Menu parentMenu, Node menuNode, MenuParser menuParser)
            throws XPathExpressionException {
        this.parentMenu = parentMenu;
        Element menuEl = (Element)menuNode;

        // Key
        this.setKey(decideString(menuEl,"Key", ""));
        // SubKey
            this.setSubKey("");
        // Display
        this.setDisplay(decideString(menuEl,"Display"));
        // DisplayTitle
        this.setDisplayTitle(decideString(menuEl,"DisplayTitle"));
        // LogoImage
        this.setLogoImage(decideString(menuEl,"LogoImage"));
        // Url
        this.setUrl(this.getUrl(menuEl, menuParser));
        // PartialUrl

        // IsTrackable
            this.setIsTrackable(false);
        // Children : recursive하게 append 함

        // IsShowMegaMenu
        this.setIsShowMegaMenu(decideBoolean(menuEl,"IsShowMegaMenu",true));
        // IsShowTopMenu
        this.setIsShowTopMenu(decideBoolean(menuEl,"IsShowTopMenu",true));
        // IsDummy
        this.setDummy(decideBoolean(menuEl,"IsDummy",false));
        // Width
        this.setWidth(decideString(menuEl,"Width"));
        // Hight
        this.setHeight(decideString(menuEl,"Hight"));
        // HeadingTag
            this.setHeadingTag("h2");
        // IconType
        this.setIconType(decideString(menuEl,"IconType"));
        // IsDisplayTitle
            this.setIsDisplayTitle(false);
        // IconHtml
            this.setIconHtml("");
        // CategoryKeys
        this.setCategoryKey(getCategoryKey(menuEl, menuParser));
    }

    public boolean hasChildren() {
        return this.children.size() > 0;
    }

    public Url getUrl(Element menuNode,MenuParser menuParser)
            throws XPathExpressionException {
        Node urlNode = menuParser.getNode(menuNode,"Url");
        if ( urlNode != null) {
            Element urlEl = (Element)urlNode;
            if ( urlEl.hasAttribute("Link")) {
                String link = urlEl.getAttribute("Link");
                return new Url(link,link);
            } else if (urlEl.hasAttribute("Controller")) {
                String uri = "";
                String controller = urlEl.getAttribute("Controller");
                String action = urlEl.getAttribute("Action");
                if ( action.equalsIgnoreCase("List")) {
                    String key = menuParser.getKeyFromParameter(urlEl);
                    if ( controller.equalsIgnoreCase("Find")) {
                        uri = "find/list"+ (key== null?"":"?key="+key);
                    } else {
                        uri = controller.toLowerCase()+ (key == null?"/":"/"+key.toLowerCase()+"/") + "list";
                    }
                } else {
                    uri = controller.toLowerCase() + (action.equalsIgnoreCase("Index")?"":"/"+action.toLowerCase());
                }

                String url = URL_PREFIX + uri;
                return new Url(url,url);
            }
        }
        return null;
    }

    public String getCategoryKey(Element menuNode,MenuParser menuParser)
            throws XPathExpressionException {
        Node categoryNode = menuParser.getNode(menuNode,"Section/CategoryKeys/string");
        if ( categoryNode != null) {
            return categoryNode.getTextContent();
        }
        Node listNode = menuParser.getNode(menuNode,"List");
        if ( listNode != null) {
            return ((Element)listNode).getAttribute("CategoryKey");
        }
        return null;
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

