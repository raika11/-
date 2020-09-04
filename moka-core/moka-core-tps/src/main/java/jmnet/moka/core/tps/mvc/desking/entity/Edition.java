package jmnet.moka.core.tps.mvc.desking.entity;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


/**
 * The persistent class for the WMS_EDITION database table.
 * 
 */
@Entity
@Table(name="WMS_EDITION")
@NamedQuery(name="Edition.findAll", query="SELECT e FROM Edition e")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class Edition implements Serializable {

	private static final long serialVersionUID = 578472845368320696L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="EDITION_SEQ")
	private Long editionSeq;

	@Column(name="COMPONENT_SEQ")
	private Long componentSeq;

	@Column(name="EDITION_NAME")
	private String editionName;
	
	@Column(name="DOMAIN_ID", columnDefinition = "char")
	private String domainId;

	@Column(name="TEMPLATE_SEQ")
	private Long templateSeq;
	
	@Column(name="DATASET_SEQ")
	private Long datasetSeq;
	
	@Column(name="EDITION_START_YMDT")
	private String editionStartYmdt;
	
	@Column(name="DATA_TYPE")
	private String dataType;

	@Column(name="SNAPSHOT_YN", columnDefinition = "char")
	private String snapshotYn;

	@Lob
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