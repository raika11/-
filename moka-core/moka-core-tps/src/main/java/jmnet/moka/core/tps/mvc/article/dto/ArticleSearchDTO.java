package jmnet.moka.core.tps.mvc.article.dto;

import org.apache.ibatis.type.Alias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.tps.mvc.article.vo.ArticleVO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;

@AllArgsConstructor
@Data
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(Include.NON_NULL)
@EqualsAndHashCode(callSuper = true)
@Alias("articleSearchDTO")
public class ArticleSearchDTO extends SearchDTO {

    private static final long serialVersionUID = 6774193298696439472L;

    private String mediaId;

    // 시작일자 배부일
    private String distStartYmdt;

    // 종료일자 배부일
    private String distEndYmdt;

    // 부서
    //    private String bylineDeptNo;

    // 언어(기타코드)
    private String lang;

    // 분류(기타코드)
    private String codeId;

    // 서비스 타입(기타코드)
    private String serviceType;

    // 검색조건 (전체/제목/기사키)
    private String searchType;

    private String keyword;

    public ArticleSearchDTO() {
        super(ArticleVO.class, "seq,desc");
    }
}
