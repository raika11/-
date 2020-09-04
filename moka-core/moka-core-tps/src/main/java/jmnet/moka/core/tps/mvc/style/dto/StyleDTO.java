/**
 * msp-tps StyleDTO.java 2020. 4. 29. 오후 2:54:48 ssc
 */
package jmnet.moka.core.tps.mvc.style.dto;

import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.fasterxml.jackson.core.type.TypeReference;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <pre>
 * 
 * 2020. 4. 29. ssc 최초생성
 * </pre>
 * 
 * @since 2020. 4. 29. 오후 2:54:48
 * @author ssc
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "styleSeq")
public class StyleDTO implements Serializable {

    private static final long serialVersionUID = 7337403468688523789L;

    public static final Type TYPE = new TypeReference<List<StyleDTO>>() {}.getType();

    @Min(value = 0, message = "{tps.style.error.invalid.styleSeq}")
    private Long styleSeq;

    @NotNull(message = "{tps.style.error.invalid.styleName}")
    @Pattern(regexp = ".+", message = "{tps.style.error.invalid.styleName}")
    private String styleName;

    @Builder.Default
    private Set<StyleRefDTO> styleRefs = new LinkedHashSet<StyleRefDTO>();

    public void addStyleRef(StyleRefDTO ref) {
        if (ref.getStyle() == null) {
            ref.setStyle(this);
            return;
        }

        if (styleRefs.contains(ref)) {
            return;
        } else {
            this.styleRefs.add(ref);
        }
    }
}
