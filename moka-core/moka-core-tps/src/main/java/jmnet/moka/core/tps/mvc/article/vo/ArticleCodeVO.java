package jmnet.moka.core.tps.mvc.article.vo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.article.vo
 * ClassName : ArticleCodeVO
 * Created : 2020-12-07 ince
 * </pre>
 *
 * @author ince
 * @since 2020-12-07 13:54
 */
@Alias("ArticleCodeVO")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class ArticleCodeVO {

    private Long totalId;

    private Long masterCode;

    private Long serviceCode;

    private String contentKorName;

    private String serviceKorName;

    private String sectionKorName;

    private String frstCode;

    private String scndCode;
}
