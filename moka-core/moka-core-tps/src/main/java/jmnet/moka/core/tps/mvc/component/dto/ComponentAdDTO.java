package jmnet.moka.core.tps.mvc.component.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.mvc.ad.dto.AdSimpleDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 컴포넌트의 광고 DTO
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class ComponentAdDTO implements Serializable {

    private static final long serialVersionUID = 7067421000499185540L;

    /**
     * 일련번호
     */
    @Min(value = 0, message = "{tps.componentad.error.min.seq}")
    private Long seq;

    /**
     * 컴포넌트SEQ
     */
    @NotNull(message = "{tps.component.error.notnull.componentSeq}")
    private Long componentSeq;

    /**
     * 광고
     */
    @NotNull(message = "{tps.ad.error.notnull.adSeq}")
    private AdSimpleDTO ad;

    /**
     * 리스트단락
     */
    @NotNull(message = "{tps.componentad.error.notnull.listParagraph}")
    @Builder.Default
    private Integer listParagraph = TpsConstants.LIST_PARAGRAPH;

}
