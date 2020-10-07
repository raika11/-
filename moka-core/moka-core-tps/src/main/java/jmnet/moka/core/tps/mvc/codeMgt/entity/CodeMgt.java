package jmnet.moka.core.tps.mvc.codeMgt.entity;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import lombok.*;


/**
 * The persistent class for the TB_15RE_CODE_MGT database table.
 * 
 */

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@EqualsAndHashCode(exclude = "codeMgtGrp")
//@JsonInclude(Include.NON_NULL)
@Entity
@Table(name = "TB_15RE_CODE_MGT")
@NamedQuery(name = "CodeMgt.findAll", query = "SELECT e FROM CodeMgt e")
public class CodeMgt implements Serializable {

    private static final long serialVersionUID = -1877787466206944682L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SEQ_NO")
    private Long seqNo;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "GRP_CD", referencedColumnName = "GRP_CD", nullable = false)
    private CodeMgtGrp codeMgtGrp;

    @Column(name = "DTL_CD", nullable = false, length = 24)
    private String dtlCd;

    @Column(name = "CD_ORD")
    private Integer cdOrd;

    @Column(name = "CD_NM", nullable = false, length = 100)
    private String cdNm;

    @Column(name = "CD_ENG_NM", length = 100)
    private String cdEngNm;

    @Column(name = "CD_COMMENT", length = 100)
    private String cdComment;

    @Column(name = "CD_NM_ETC1", length = 512)
    private String cdNmEtc1;

    @Column(name = "CD_NM_ETC2", length = 1024)
    private String cdNmEtc2;

    @Column(name = "CD_NM_ETC3", length = 1024)
    private String cdNmEtc3;

    @Column(name = "USED_YN", columnDefinition = "char")
    private String usedYn;

    @Column(name = "REG_DT")
    @Temporal(TemporalType.TIMESTAMP)
    private Date regDt;

    @Column(name = "REG_ID", length = 30)
    private String regId;

    @Column(name = "MOD_DT")
    @Temporal(TemporalType.TIMESTAMP)
    private Date modDt;

    @Column(name = "MOD_ID", length = 30)
    private String modId;

    @PrePersist
    public void prePersist() {
        this.cdOrd = this.cdOrd == null ? 0 : this.cdOrd;
        this.cdEngNm = McpString.defaultValue(this.cdEngNm, "");
        this.cdComment = McpString.defaultValue(this.cdComment, "");
        this.cdNmEtc1 = McpString.defaultValue(this.cdNmEtc1, "");
        this.cdNmEtc2 = McpString.defaultValue(this.cdNmEtc2, "");
        this.cdNmEtc3 = McpString.defaultValue(this.cdNmEtc3, "");
        this.usedYn = McpString.defaultValue(this.usedYn, "Y");
        this.regDt = McpDate.defaultValue(this.regDt);
        this.regId = McpString.defaultValue(this.regId, "");
        this.modId = McpString.defaultValue(this.modId, "");
    }

    @PreUpdate
    public void preUpdate() {
        this.cdOrd = this.cdOrd == null ? 0 : this.cdOrd;
        this.cdEngNm = McpString.defaultValue(this.cdEngNm, "");
        this.cdComment = McpString.defaultValue(this.cdComment, "");
        this.cdNmEtc1 = McpString.defaultValue(this.cdNmEtc1, "");
        this.cdNmEtc2 = McpString.defaultValue(this.cdNmEtc2, "");
        this.cdNmEtc3 = McpString.defaultValue(this.cdNmEtc3, "");
        this.usedYn = McpString.defaultValue(this.usedYn, "Y");
        this.regDt = McpDate.defaultValue(this.regDt);
        this.regId = McpString.defaultValue(this.regId, "");
        this.modDt = McpDate.defaultValue(this.modDt);
        this.modId = McpString.defaultValue(this.modId, "");
    }
}
