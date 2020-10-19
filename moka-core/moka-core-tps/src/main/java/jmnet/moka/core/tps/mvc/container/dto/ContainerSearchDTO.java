package jmnet.moka.core.tps.mvc.container.dto;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.tps.mvc.container.vo.ContainerVO;
import lombok.*;

/**
 * <pre>
 * 컨테이너 검색정보
 * 2020. 5. 21. ssc 최초생성
 * </pre>
 * 
 * @since 2020. 5. 21. 오전 11:53:53
 * @author ssc
 */
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
//@JsonInclude(Include.NON_NULL)
@EqualsAndHashCode(callSuper = true)
public class ContainerSearchDTO extends SearchDTO {

    private static final long serialVersionUID = -3544871391843287828L;

    @NotNull(message = "{tps.domain.error.pattern.domainId}")
    @Pattern(regexp = "[0-9]{4}$", message = "{tps.domain.error.pattern.domainId}")
    private String domainId;

    private String searchType;

    private String keyword;

    // 검색 조건의 기본값을 설정
    public ContainerSearchDTO() {
        super(ContainerVO.class, "containerSeq,desc");
    }
}
