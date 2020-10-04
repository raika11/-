package jmnet.moka.core.tps.mvc.container.vo;

import java.io.Serializable;

import javax.persistence.Column;

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

	@Column(name = "CONTAINER_SEQ")
    private Long containerSeq;
	
	@Column(name = "CONTAINER_NAME")
    private String containerName;
	
	@Column(name = "CONTAINER_BODY")
    private String containerBody;
	
	@Column(name = "USE_YN")
    private String useYn;
	
	private DomainSimpleDTO domain;
	
}
