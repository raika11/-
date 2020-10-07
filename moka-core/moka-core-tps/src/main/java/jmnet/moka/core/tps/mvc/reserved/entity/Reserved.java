package jmnet.moka.core.tps.mvc.reserved.entity;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQuery;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.mvc.domain.entity.Domain;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


/**
 * The persistent class for the TB_WMS_RESERVED database table.
 * 
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "TB_WMS_RESERVED")
@NamedQuery(name = "Reserved.findAll", query = "SELECT r FROM Reserved r")
public class Reserved implements Serializable {

    private static final long serialVersionUID = -8423627992254670355L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RESERVED_SEQ")
    private Long reservedSeq;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "DOMAIN_ID", nullable = false, referencedColumnName = "DOMAIN_ID")
    private Domain domain;

    @Column(name = "RESERVED_ID", nullable = false, length = 24)
    private String reservedId;

    @Column(name = "RESERVED_VALUE", nullable = false, length = 24)
    private String reservedValue;

    @Column(name = "DESCRIPTION", length = 4000)
    private String description;

    @Column(name = "USE_YN", columnDefinition = "char")
    private String useYn;

    /**
     * 등록 일시
     */
    @Column(name = "REG_DT")
    @Temporal(TemporalType.TIMESTAMP)
    private Date regDt;

    /**
     * 등록 아이디
     */
    @Column(name = "REG_ID", length = 30)
    private String regId;

    /**
     * 수정 일시
     */
    @Column(name = "MOD_DT")
    @Temporal(TemporalType.TIMESTAMP)
    private Date modDt;

    /**
     * 수정 아이디
     */
    @Column(name = "MOD_ID", length = 30)
    private String modId;

    /**
     * 신규 등록 전 처리
     */
    @PrePersist
    public void prePersist() {
        this.useYn = McpString.defaultValue(this.useYn, "Y");
        this.regDt = McpDate.defaultValue(this.regDt);
    }

    /**
     * 수정 전 처리
     */
    @PreUpdate
    public void preUpdate() {
        this.useYn = McpString.defaultValue(this.useYn, "Y");
        this.regDt = McpDate.defaultValue(this.regDt);
        this.modDt = McpDate.defaultValue(this.modDt);;
    }
}
