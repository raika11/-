package jmnet.moka.core.tps.mvc.style.dto;

import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * The primary key class for the WMS_STYLE_REF database table.
 * 
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class StyleRefPKDTO implements Serializable {

    private static final long serialVersionUID = -6772052053879056076L;

    public static final Type TYPE = new TypeReference<List<StyleRefPKDTO>>() {}.getType();

    private Long styleSeq;

    private String refType;

}
