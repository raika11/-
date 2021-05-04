package jmnet.moka.core.tps.mvc.articlePackage.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
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
 * Package : jmnet.moka.core.tps.mvc.articlePackage.entity
 * ClassName : ArticlePackageKwd
 * Created : 2021-05-03 New
 * </pre>
 *
 * @author stsoon
 * @since 2021-05-03 오후 3:59
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "TB_ARTICLE_PACKAGE_KWD")
public class ArticlePackageKwd implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SEQ_NO")
    private Long seqNo;

    @Column(name = "PKG_SEQ")
    private Long pkgSeq;

    @Column(name = "CAT_DIV")
    private String catDiv;

    @Column(name = "EXCEPT_YN")
    private String exceptYn;

    @Column(name = "MASTER_CODE")
    private String masterCode;

    @Column(name = "KEYWORD")
    private String keyword;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "PKG_SEQ", referencedColumnName = "PKG_SEQ", nullable = false, updatable = false, insertable = false)
    private ArticlePackage articlePackage;
}
