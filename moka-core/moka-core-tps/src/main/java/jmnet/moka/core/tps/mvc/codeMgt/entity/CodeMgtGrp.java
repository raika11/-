package jmnet.moka.core.tps.mvc.codeMgt.entity;

import java.io.Serializable;
import java.util.Date;
import java.util.LinkedHashSet;
import java.util.Set;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import lombok.*;


/**
 * The persistent class for the TB_15RE_CODE_MGT_GRP database table.
 * 
 */

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@EqualsAndHashCode(exclude = "codeMgts")
//@JsonInclude(Include.NON_NULL)
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "grpCd")
@Entity
@Table(name = "TB_15RE_CODE_MGT_GRP")
@NamedQuery(name = "CodeMgtGrp.findAll", query = "SELECT e FROM CodeMgtGrp e")
public class CodeMgtGrp implements Serializable {

    private static final long serialVersionUID = 7521210132764582029L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SEQ_NO")
    private Long seqNo;

    @Column(name = "GRP_CD", nullable = false, length = 12)
    private String grpCd;

    @Column(name = "CD_NM", nullable = false, length = 100)
    private String cdNm;

    @Column(name = "CD_ENG_NM", length = 100)
    private String cdEngNm;

    @Column(name = "CD_COMMENT", length = 100)
    private String cdComment;

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

    @Builder.Default
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "codeMgtGrp", cascade = CascadeType.REMOVE)
    private Set<CodeMgt> codeMgts = new LinkedHashSet<CodeMgt>();

    @PrePersist
    public void prePersist() {
        this.cdEngNm = McpString.defaultValue(this.cdEngNm, "");
        this.cdComment = McpString.defaultValue(this.cdComment, "");
        this.regId = McpString.defaultValue(this.regId, "");
        this.modId = McpString.defaultValue(this.modId, "");
        this.regDt = McpDate.defaultValue(this.regDt);
    }

    @PreUpdate
    public void preUpdate() {
        this.cdEngNm = McpString.defaultValue(this.cdEngNm, "");
        this.cdComment = McpString.defaultValue(this.cdComment, "");
        this.regId = McpString.defaultValue(this.regId, "");
        this.modId = McpString.defaultValue(this.modId, "");
        this.regDt = McpDate.defaultValue(this.regDt);
        this.modDt = McpDate.defaultValue(this.modDt);
    }
}
