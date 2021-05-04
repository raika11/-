package jmnet.moka.core.tps.mvc.articlePackage.dto;

import com.fasterxml.jackson.core.type.TypeReference;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;
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
 * Package : jmnet.moka.core.tps.mvc.articlePackage.dto
 * ClassName : ArticlePackageKwdDTO
 * Created : 2021-05-03 New
 * </pre>
 *
 * @author stsoon
 * @since 2021-05-03 오후 5:51
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder(toBuilder = true)
@Alias("ArticlePackageKwdDTO")
public class ArticlePackageKwdDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    public static final Type TYPE = new TypeReference<List<ArticlePackageKwdDTO>>() {
    }.getType();

    private Long seqNo;

    private Long pkgSeq;

    private String catDiv;

    private String exceptYn;

    private String masterCode;

    private String keyword;
}
