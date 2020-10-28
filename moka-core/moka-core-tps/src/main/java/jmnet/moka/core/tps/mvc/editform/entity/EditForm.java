package jmnet.moka.core.tps.mvc.editform.entity;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.Table;
import jmnet.moka.core.tps.common.entity.BaseAudit;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 편집 폼
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Table(name = "TB_CMS_EDIT_FORM")
@Entity
public class EditForm extends BaseAudit implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * Edit Form 일련번호
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "EDIT_FORM_SEQ", nullable = false)
    private Long editFormSeq;

    /**
     * Channel ID
     */
    @Column(name = "CHANNEL_ID", nullable = false)
    private String channelId;

    /**
     * Form Part ID
     */
    @Column(name = "PART_ID", nullable = false)
    private String partId;

    /**
     * Edit Form Data
     */
    @Lob
    @Column(name = "FORM_DATA", nullable = false)
    private String formData;

    /**
     * 사용여부(Y:사용, N:미사용)
     */
    @Column(name = "USED_YN")
    @Builder.Default
    private String usedYn = "Y";

}
