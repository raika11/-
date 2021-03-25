package jmnet.moka.core.tps.mvc.pkg.vo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.core.tps.mvc.pkg.vo
 * ClassName : PackageSimpleVO
 * Created : 2021-03-24
 * </pre>
 *
 * @author stsoon
 * @since 2021-03-24 오전 10:36
 */
@Alias("PackageSimpleVO")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class PackageSimpleVO implements Serializable {

    private static final long serialVersionUID = 1L;

    @Column(name = "PKG_SEQ")
    private Long pkgSeq;

    @Column(name = "CAT_LIST")
    private String catList;

    @Column(name = "PKG_DIV")
    private String pkgDiv;

    @Column(name = "PKG_TITLE")
    private String pkgTitle;

    @Column(name = "REPORTER_LIST")
    private String reporters;

    @Column(name = "ARTICLE_COUNT")
    private Long articleCount;

    @DTODateTimeFormat
    @Column(name = "LAST_ARTICLE_UPDATE_DATE")
    private Date lastArticleUpdateDate;

    @Column(name = "SCB_YN")
    private String scbYn;

    @Column(name = "USED_YN")
    private String usedYn;
}
