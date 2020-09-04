package jmnet.moka.core.tps.mvc.desking.vo;

import java.io.Serializable;

import javax.persistence.Column;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Alias("EditionVO")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class EditionVO implements Serializable {

	private static final long serialVersionUID = 6562275346368420319L;

	@Column(name="EDITION_SEQ")
	private Long editionSeq;

	@Column(name="COMPONENT_SEQ")
	private Long componentSeq;

	@Column(name="EDITION_NAME")
	private String editionName;
	
	@Column(name="DOMAIN_ID")
	private String domainId;

	@Column(name="TEMPLATE_SEQ")
	private Long templateSeq;
	
	@Column(name="DATASET_SEQ")
	private Long datasetSeq;
	
	@Column(name="EDITION_START_YMDT")
	private String editionStartYmdt;
	
	@Column(name="DATA_TYPE")
	private String dataType;

	@Column(name="SNAPSHOT_YN")
	private String snapshotYn;

	@Column(name="SNAPSHOT_BODY")
	private String snapshotBody;
	
	@Column(name="CREATE_YMDT")
	private String createYmdt;

	@Column(name="CREATOR")
	private String creator;
	
	@Column(name="MODIFIED_YMDT")
	private String modifiedYmdt;

	@Column(name="MODIFIER")
	private String modifier;
}
