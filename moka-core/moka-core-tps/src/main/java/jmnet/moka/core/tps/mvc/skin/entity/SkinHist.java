package jmnet.moka.core.tps.mvc.skin.entity;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQuery;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.common.entity.BaseAudit;
import lombok.Builder.Default;
import org.hibernate.annotations.Nationalized;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import jmnet.moka.core.tps.mvc.domain.entity.Domain;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;


/**
 * The persistent class for the WMS_SKIN_HIST database table.
 * 
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@EqualsAndHashCode(exclude = "skin")
//@JsonInclude(Include.NON_NULL)
@Entity
@Table(name = "TB_WMS_SKIN_HIST")
public class SkinHist extends BaseAudit {

    private static final long serialVersionUID = 46823883650528948L;

    /**
     * 일련번호
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SEQ")
    private Long seq;

    /**
     * 스킨
     */
    @NotFound(action = NotFoundAction.IGNORE)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "SKIN_SEQ", referencedColumnName = "SKIN_SEQ", nullable = false)
    private Skin skin;

    /**
     * 도메인
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "DOMAIN_ID", referencedColumnName = "DOMAIN_ID")
    private Domain domain;

    /**
     * 스킨본문
     */
    @Nationalized
    @Column(name = "SKIN_BODY")
    @Builder.Default
    private String skinBody = "";

    @Column(name = "WORK_TYPE", columnDefinition = "char")
    @Builder.Default
    private String workType = "U";

    @PrePersist
    @PreUpdate
    public void prePersist() {
        this.skinBody = McpString.defaultValue(this.skinBody, "");
        this.workType = McpString.defaultValue(this.workType, "U");
    }

}
