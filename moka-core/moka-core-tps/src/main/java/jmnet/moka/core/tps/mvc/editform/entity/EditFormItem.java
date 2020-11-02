package jmnet.moka.core.tps.mvc.editform.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import jmnet.moka.core.tps.common.entity.BaseAudit;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;

/**
 * 편집 폼 아이템
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Table(name = "TB_WMS_EDIT_FORM_ITEM")
@Entity
public class EditFormItem extends BaseAudit {

    private static final long serialVersionUID = 1L;

    /**
     * Edit Form Item 일련번호
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ITEM_SEQ", nullable = false)
    private Long itemSeq;

    /**
     * Form Seq
     */
    @Column(name = "FORM_SEQ", nullable = false)
    private Long formSeq;

    /**
     * EditForm
     */
    @ManyToOne(fetch = FetchType.LAZY, targetEntity = EditForm.class)
    @JoinColumn(name = "FORM_SEQ", referencedColumnName = "FORM_SEQ", nullable = false, insertable = false, updatable = false)
    private EditForm editForm;

    /**
     * Form Item ID
     */
    @Column(name = "ITEM_ID", nullable = false)
    private String itemId;

    /**
     * Form Item Title
     */
    @Nationalized
    @Column(name = "ITEM_TITLE", nullable = false)
    private String itemTitle;

    /**
     * Edit Form Data
     */
    @Nationalized
    @Column(name = "FORM_DATA", nullable = false)
    private String formData;

    /**
     * 사용여부(Y:사용, N:미사용)
     */
    @Column(name = "USED_YN")
    @Builder.Default
    private String usedYn = "Y";

}
