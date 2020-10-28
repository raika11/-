package jmnet.moka.core.tps.mvc.editform.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import jmnet.moka.core.tps.common.entity.RegAudit;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "TB_CMS_EDIT_FORM_HIST")
public class EditFormHist extends RegAudit {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SEQ_NO", nullable = false)
    private Long seqNo;

    @Column(name = "EDIT_FORM_SEQ", nullable = false)
    private Long editFormSeq;

    @Lob
    @Column(name = "FORM_DATA", nullable = false)
    private String formData;

    @ManyToOne(optional = false, fetch = FetchType.LAZY, targetEntity = EditForm.class)
    @JoinColumn(name = "EDIT_FORM_SEQ", referencedColumnName = "EDIT_FORM_SEQ", nullable = false, insertable = false, updatable = false)
    private EditForm editForm;

}
