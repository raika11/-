/**
 * msp-tps StyleRef.java 2020. 4. 29. 오후 3:18:34 ssc
 */
package jmnet.moka.core.tps.mvc.style.dto;

import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * <pre>
 * 
 * 2020. 4. 29. ssc 최초생성
 * </pre>
 * 
 * @since 2020. 4. 29. 오후 3:18:34
 * @author ssc
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@EqualsAndHashCode(exclude = "style")
public class StyleRefDTO implements Serializable {

    private static final long serialVersionUID = 3772185557901443764L;

    public static final Type TYPE = new TypeReference<List<StyleRefDTO>>() {}.getType();

    private StyleRefPKDTO id;

    private String styleBody;

    @ToString.Exclude
    private StyleDTO style;

    public void setStyle(StyleDTO style) {
        if (style == null) {
            return;
        }
        this.style = style;
        this.style.addStyleRef(this);
    }
}
