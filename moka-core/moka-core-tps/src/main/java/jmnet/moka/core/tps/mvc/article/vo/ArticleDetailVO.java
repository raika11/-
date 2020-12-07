package jmnet.moka.core.tps.mvc.article.vo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import jmnet.moka.core.tps.mvc.reporter.vo.ReporterVO;
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
 * ClassName : ArticleDetailVO
 * Created : 2020-12-07 ince
 * </pre>
 *
 * @author ince
 * @since 2020-12-07 13:51
 */
@Alias("ArticleDetailVO")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class ArticleDetailVO {

    private Long totalId;

    /**
     * 기사타입 코드
     */
    private String artType;

    private Integer trendRank;

    private Integer aid;

    private String artTitle;

    private String mobTitle;

    private String jiTitle;

    private String artSubTitle;

    private String artSummary;

    private String artThumb;

    @DTODateTimeFormat
    private Date artRegDt;

    @DTODateTimeFormat
    private Date artModDt;

    /**
     * 출처코드
     */
    private String sourceCode;

    private String sourceBaseUrl;

    private String sourceEtc;
    /**
     * 출처
     */
    private String sourceName;

    private Integer shrFcnt;

    private Integer shrTcnt;

    private Integer shrIcnt;

    private Integer shrGcnt;

    private Integer shrKscnt;

    private Integer shrKcnt;

    private Integer shrPcnt;

    private Integer emailCnt;

    private Integer likeCnt;

    private Integer hateCnt;

    private Integer clickCnt;

    private Integer replyCnt;

    /**
     * 판
     */
    private String pressPan;

    /**
     * 면
     */
    private String pressMyun;

    private String pressCategory;

    private String pressNumber;

    private String pressDate;

    private String artContent;

    private Long orgId;

    private String joongangUse;

    private String keywords;

    private String adultFlag;

    private String loginFlag;

    private String multiLink;

    private String varcharKey;

    private String multiLinkMobile;

    private String fbMetaTitle;

    private String fbMetaImage;

    private String fbMetaSummary;

    private String twMetaTitle;

    private String twMetaImage;

    private String twMetaSummary;

    private String jaMetaTitle;

    private String jaMetaSummary;

    private String jaMetaKeyword;

    private String headerKey;

    @Builder.Default
    private List<ArticleCodeVO> codes = new ArrayList<>();

    public void addCode(ArticleCodeVO code) {
        codes.add(code);
    }

    @Builder.Default
    private List<ReporterVO> reporters = new ArrayList<>();

    public void addReporter(ReporterVO reporter) {
        reporters.add(reporter);
    }

    @Builder.Default
    private List<ArticleComponentRelVO> componentRels = new ArrayList<>();

    public void addComponentRel(ArticleComponentRelVO componentRel) {
        componentRels.add(componentRel);
    }
}
