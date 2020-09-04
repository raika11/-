package jmnet.moka.core.tps.mvc.code.entity;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


/**
 * The persistent class for the WMS_CODE database table.
 * 
 */
@Entity
@Table(name="WMS_CODE")
@NamedQuery(name="Code.findAll", query="SELECT c FROM Code c")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class Code implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="CODE_ID")
	private String codeId;

	@Column(name="CODE_LEVEL")
	private String codeLevel;

	@Column(name="CODE_NAME")
	private String codeName;

	@Builder.Default
	@Column(name="CODE_ORDER")
	private int codeOrder = 1;

	@Column(name="CREATE_YMDT")
	private String createYmdt;

	@Column(name="CREATOR")
	private String creator;

	@Column(name="FILE_NAME")
	private String fileName;

	@Column(name="FILE_PATH")
	private String filePath;

	@Column(name="LARGE_CODE_ID")
	private String largeCodeId;

	@Column(name="MIDDLE_CODE_ID")
	private String middleCodeId;

	@Column(name="MODIFIED_YMDT")
	private String modifiedYmdt;

	@Column(name="MODIFIER")
	private String modifier;

	@Column(name="SMALL_CODE_ID")
	private String smallCodeId;

	@Column(name="THUMBNAIL_FILE_NAME")
	private String thumbnailFileName;

	@Column(name="THUMBNAIL_FILE_PATH")
	private String thumbnailFilePath;

	@Builder.Default
	@Column(name="USE_YN", columnDefinition="char")
	private String useYn = "Y";


}