package jmnet.moka.core.tps.mvc.pkg.dto;

import java.io.Serializable;
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
 * Package : jmnet.moka.core.tps.mvc.packagae.entity
 * ClassName : PackageKeywordDTO
 * Created : 2021-03-24
 * </pre>
 *
 * @author stsoon
 * @since 2021-03-24 오후 2:27
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@ToString
@Alias("PackageKeywordDTO")
public class PackageKeywordDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long seqNo;

    private Long pkgSeq;

    private String catDiv;

    private String schCondi;

    private String andOr;

    private Long kwdCnt;

    private Long ordno;

    private Long repMaster;

    private Long kwdOrd;

    private String keyword;
    
    private String sDate;

    private String eDate;
}
