package jmnet.moka.core.tps.mvc.pkg.dto;

import com.fasterxml.jackson.core.type.TypeReference;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.apache.ibatis.type.Alias;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.core.tps.mvc.packagae.dto
 * ClassName : PackageMasterDTO
 * Created : 2021-03-24
 * </pre>
 *
 * @author stsoon
 * @since 2021-03-24 오후 2:08
 */
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Setter
@Getter
@Builder
@Alias("PackageMasterDTO")
public class PackageMasterDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    public static final Type TYPE = new TypeReference<List<PackageMasterDTO>>() {
    }.getType();

    private Long pkgSeq;

    private String usedYn;

    private String pkgDiv;

    private String seasonNo;

    private String episView;

    private String scbYn;

    private Long scbNo;

    private Long artCnt;

    private Long totalId1;

    private String catList;

    private String pkgTitle;

    private String pkgDesc;

    private String recommPkg;

    private Date reservDt;

    private Date updDt;

    private Set<PackageKeywordDTO> packageKeywords = new LinkedHashSet<>();
}
