package jmnet.moka.core.tps.mvc.editform.entity;

import java.io.Serializable;
import java.util.Date;
import java.util.LinkedHashSet;
import java.util.Set;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;
import javax.persistence.Table;
import jmnet.moka.core.tps.common.entity.BaseAudit;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;

/**
 * 편집 폼
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Table(name = "TB_WMS_EDIT_FORM")
@Entity
public class EditForm extends BaseAudit implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 마지막 수정일시
     */
    @CreatedDate
    @Column(name = "LAST_DT")
    @Builder.Default
    protected Date lastDt = new Date();
    /**
     * Edit Form 일련번호
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "FORM_SEQ", nullable = false)
    private Long formSeq;
    /**
     * Form ID - legacy xml 파일명
     */
    @Column(name = "FORM_ID", nullable = false)
    private String formId;
    /**
     * Form name - xml channelFormat name
     */
    @Column(name = "FORM_NAME", nullable = false)
    private String formName;
    /**
     * Service Url
     */
    @Column(name = "SERVICE_URL", nullable = false)
    private String serviceUrl;

    /**
     * 사용여부(Y:사용, N:미사용)
     */
    @Column(name = "USED_YN")
    @Builder.Default
    private String usedYn = "Y";
    /**
     * Base Url
     */
    @Column(name = "BASE_URL", nullable = false)
    private String baseUrl;
    /**
     * 편집 폼 아이템 목록
     */
    @Builder.Default
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "editForm", cascade = {CascadeType.ALL}, orphanRemoval = true)
    @OrderBy("partSeq")
    private Set<EditFormPart> editFormParts = new LinkedHashSet<EditFormPart>();

}
