package jmnet.moka.core.tps.mvc.issue.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.core.tps.mvc.issue.entity
 * ClassName : PackageList
 * Created : 2021-03-19
 * </pre>
 *
 * @author stsoon
 * @since 2021-03-19 오후 2:02
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "TB_MOKA_PACKAGE_LIST")
public class PackageList implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "SEQ_NO")
    private Long seqNo;

    @Column(name = "CAT_DIV")
    private String catDiv;

    @Column(name = "ORD_NO")
    private Long ordNo;

    @Column(name = "TOTAL_ID")
    private Long totalId;

    @Column(name = "REG_DT")
    private Date regDt;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "PKG_SEQ", referencedColumnName = "PKG_SEQ", nullable = false)
    private PackageMaster packageMaster;
}
