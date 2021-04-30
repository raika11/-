package jmnet.moka.core.tps.mvc.container.vo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.Column;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.mvc.domain.dto.DomainSimpleDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;
import org.hibernate.annotations.Nationalized;

@Alias("ContainerVO")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class ContainerVO implements Serializable {

    private static final long serialVersionUID = -2033484313595836293L;

    /**
     * 컨테이너SEQ
     */
    @Column(name = "CONTAINER_SEQ")
    private Long containerSeq;

    /**
     * 컨테이너명
     */
    @Column(name = "CONTAINER_NAME")
    private String containerName;

    /**
     * 컨테이너본문
     */
    //	@Column(name = "CONTAINER_BODY")
    //	@Builder.Default
    //    private String containerBody = "";

    /**
     * 사용여부
     */
    @Column(name = "USED_YN")
    @Builder.Default
    private String usedYn = MokaConstants.NO;

    /**
     * 도메인
     */
    private DomainSimpleDTO domain;

    /**
     * 컨테이너그룹
     */
    @Column(name = "CONTAINER_GROUP")
    private String containerGroup;

    /**
     * 컨테이너썸네일
     */
    @Column(name = "CONTAINER_THUMB")
    private String containerThumb;

    /**
     * 컨테이너설명
     */
    @Nationalized
    @Column(name = "CONTAINER_DESC")
    private String containerDesc;

}
