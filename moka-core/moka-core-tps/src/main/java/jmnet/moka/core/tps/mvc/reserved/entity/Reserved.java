package jmnet.moka.core.tps.mvc.reserved.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.entity.BaseAudit;
import jmnet.moka.core.tps.mvc.domain.entity.Domain;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;


/**
 * 에약어
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "TB_WMS_RESERVED")
public class Reserved extends BaseAudit {

    private static final long serialVersionUID = -8423627992254670355L;

    /**
     * 예약어SEQ
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RESERVED_SEQ")
    private Long reservedSeq;

    /**
     * 도메인
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "DOMAIN_ID", nullable = false, referencedColumnName = "DOMAIN_ID")
    private Domain domain;

    /**
     * 예약어ID
     */
    @Column(name = "RESERVED_ID", nullable = false)
    private String reservedId;

    /**
     * 예약어값
     */
    @Nationalized
    @Column(name = "RESERVED_VALUE", nullable = false)
    private String reservedValue;

    /**
     * 상세정보
     */
    @Nationalized
    @Column(name = "DESCRIPTION", length = 4000)
    private String description;

    /**
     * 사용여부
     */
    @Column(name = "USE_YN", columnDefinition = "char")
    @Builder.Default
    private String useYn = MokaConstants.YES;

    /**
     * 신규등록, 수정 전 처리
     */
    @PrePersist
    @PreUpdate
    public void prePersist() {
        this.useYn = McpString.defaultValue(this.useYn, MokaConstants.YES);
    }

}
