package jmnet.moka.core.tps.mvc.pkg.dto;

import com.fasterxml.jackson.core.type.TypeReference;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;
import java.util.Set;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import jmnet.moka.core.tps.mvc.pkg.entity.PackageKeyword;
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
 * Package : jmnet.moka.core.tps.mvc.packagae.dto
 * ClassName : PackageSimpleDTO
 * Created : 2021-03-19
 * </pre>
 *
 * @author stsoon
 * @since 2021-03-19 오후 2:08
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Alias("PackageSimpleDTO")
public class PackageSimpleDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    public static final Type TYPE = new TypeReference<List<PackageSimpleDTO>>() {
    }.getType();

    private Long pkgSeq;

    private String catList;

    private String pkgDiv;

    private String pkgTitle;

    /**
     * 담당기자
     */
    private List<String> reporters;

    private Long articleCount;

    /**
     * 최신기사 업데이트
     */
    @DTODateTimeFormat
    private Date lastArticleUpdateDate;

    //    private String fin;

    private String scbYn;

    private String usedYn;

    private Set<PackageKeyword> packageKeywords;
}
