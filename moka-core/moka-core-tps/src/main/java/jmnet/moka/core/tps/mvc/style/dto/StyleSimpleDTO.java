/**
 * msp-tps StyleDTO.java 2020. 4. 29. 오후 2:54:48 ssc
 */
package jmnet.moka.core.tps.mvc.style.dto;

import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
public class StyleSimpleDTO implements Serializable {

    private static final long serialVersionUID = 2969872959416847938L;

    public static final Type TYPE = new TypeReference<List<StyleSimpleDTO>>() {}.getType();

    @Min(value = 0, message = "{tps.style.error.invalid.styleSeq}")
    private Long styleSeq;

    @NotNull(message = "{tps.style.error.invalid.styleName}")
    @Pattern(regexp = ".+", message = "{tps.style.error.invalid.styleName}")
    private String styleName;
}
