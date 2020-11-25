package jmnet.moka.core.tps.mvc.editform.entity;

import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.code.EditStatusCode;
import jmnet.moka.core.tps.common.entity.BaseAudit;
import jmnet.moka.core.tps.mvc.member.entity.MemberInfo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

/**
 * 편집 폼 아이템 이력
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "TB_WMS_EDIT_FORM_PART_HIST")
public class EditFormPartHist extends BaseAudit {

    private static final long serialVersionUID = 1L;
    /**
     * 예약일시
     */
    @Column(name = "RESERVE_DT", updatable = false)
    protected Date reserveDt;
    /**
     * 승인여부 예약일시가 설정되어 있을 경우 예약된 작업이 완료되면 Y로 처리
     */
    @Column(name = "APPROVAL_YN", updatable = false)
    @Builder.Default
    protected String approvalYn = MokaConstants.NO;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SEQ_NO", nullable = false)
    private Long seqNo;
    @Column(name = "PART_SEQ", nullable = false)
    private Long partSeq;

    @Nationalized
    @Column(name = "FORM_DATA", nullable = false)
    private String formData;
    /**
     * 임시저장(SAVE) / 배포(PUBLISH)
     */
    @Column(name = "STATUS", nullable = false)
    @Enumerated(value = EnumType.STRING)
    private EditStatusCode status;

    /**
     * 등록자
     */
    @NotFound(action = NotFoundAction.IGNORE)
    @ManyToOne(fetch = FetchType.EAGER, optional = true)
    @JoinColumn(name = "REG_ID", insertable = false, updatable = false)
    private MemberInfo regMember;

}
