package jmnet.moka.web.dps.module.menu;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.HashMap;
import java.util.LinkedHashMap;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

/**
 * <pre>
 *
 * Project : moka-web-bbs
 * Package : jmnet.moka.web.dps.mvc.menu.model
 * ClassName : Url
 * Created : 2020-11-03 kspark
 * </pre>
 *
 * @author kspark
 * @since 2020-11-03 오전 10:51
 */

public class SearchParameter extends LinkedHashMap<String, String> {
//    @JsonProperty("Key")
//    private String key;
//
//    @JsonProperty("Keyword")
//    private String keyword;
//
//    @JsonProperty("SourceCode")
//    private String sourceCode;
//
//    @JsonProperty("ScopeType")
//    private String scopeType;

    public SearchParameter(NodeList parameterNodes) {
        if ( parameterNodes != null) {
            for (int i = 0; i < parameterNodes.getLength(); i++) {
                Element parameterEl = (Element)parameterNodes.item(i);
                this.put(parameterEl.getAttribute("Name"), parameterEl.getAttribute("Value"));
            }
        }
    }

}
