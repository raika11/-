package jmnet.moka.core.tps.mvc.article.vo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.Date;
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
 * ClassName : ArticleComponentRel
 * Created : 2020-12-07 ince
 * </pre>
 *
 * @author ince
 * @since 2020-12-07 13:56
 */
@Alias("ArticleComponentRelVO")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class ArticleComponentRelVO {

    private Long totalId;

    private Integer compOrd;

    private String compType;

    private String compFileTitle;

    private String compFileDesc;

    private String artTitle;

    private String artSummary;

    private String artThumb;

    private Date artRegDt;

    private Date artModDt;


}
