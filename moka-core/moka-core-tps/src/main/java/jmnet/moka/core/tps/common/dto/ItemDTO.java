package jmnet.moka.core.tps.common.dto;

import java.io.Serializable;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import jmnet.moka.common.template.Constants;
import jmnet.moka.core.common.template.helper.TemplateParserHelper;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * TMS가 찾아주는 관련아이템 정보
 * 
 * @author ohtah
 *
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class ItemDTO implements Serializable {

    private static final long serialVersionUID = 7692383201283833742L;

    /**
     * 순서
     */
    private int order;

    /**
     * level
     */
    private int level;

    /**
     * 태그 위치의 라인 번호
     */
    private int line;

    /**
     * 노드명(컴포넌트명)
     */
    private String name;

    /**
     * 태그 아이디 (컴포넌트 순번)
     */
    private String id;

    /**
     * 노드명(TP,CP,...)
     */
    private String nodeName;

    /**
     * 태그
     */
    private String tag;


    public String getTag() {
        this.tag = String.format("<%s %s=\"%s\" %s=\"%s\"/>",
                TemplateParserHelper.itemToCustomTag(this.nodeName), Constants.ATTR_ID, this.id,
                Constants.ATTR_NAME, this.name);
        return this.tag;
    }
}
