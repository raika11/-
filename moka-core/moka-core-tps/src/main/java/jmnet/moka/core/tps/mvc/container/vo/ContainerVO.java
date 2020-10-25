package jmnet.moka.core.tps.mvc.container.vo;

import java.io.Serializable;

import javax.persistence.Column;

import jmnet.moka.core.common.MokaConstants;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jmnet.moka.core.tps.mvc.domain.dto.DomainSimpleDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
	@Column(name = "CONTAINER_BODY")
	@Builder.Default
    private String containerBody = "";

	/**
	 * 사용여부
	 */
	@Column(name = "USE_YN")
	@Builder.Default
    private String useYn = MokaConstants.NO;

	/**
	 * 도메인
	 */
	private DomainSimpleDTO domain;
	
}
