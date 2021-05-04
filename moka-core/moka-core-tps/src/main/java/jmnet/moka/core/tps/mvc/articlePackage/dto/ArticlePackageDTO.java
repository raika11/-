package jmnet.moka.core.tps.mvc.articlePackage.dto;

import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import javax.validation.constraints.Pattern;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;
import org.hibernate.validator.constraints.Length;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.core.tps.mvc.articlePackage.dto
 * ClassName : ArticlePackageDTO
 * Created : 2021-05-03 New
 * </pre>
 *
 * @author stsoon
 * @since 2021-05-03 오후 4:38
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder(toBuilder = true)
@Alias("ArticlePackageDTO")
public class ArticlePackageDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    public static final Type TYPE = new TypeReference<List<ArticlePackageDTO>>() {
    }.getType();

    @ApiModelProperty("기사패키지 일련번호")
    @Min(value = 0, message = "{tps.common.error.min.seqNo}")
    private Long pkgSeq;

    @ApiModelProperty("패키지 유형(A:전체기사, S:섹션, D:출고일)")
    @Pattern(regexp = "^(A)|(S)|(D)$", message = "{tps.article-package.error.pattern.pkgDiv}")
    private String pkgDiv;

    @ApiModelProperty("패키지 타이틀")
    @Length(max = 100, message = "{tps.newsletter.error.size.senderName}")
    private String pkgTitle;

    @ApiModelProperty("섹션 리스트(분류목록 또는 메뉴XML의 KEY값 목록)")
    private String catList;

    @ApiModelProperty("제외 섹션 리스트(분류목록 또는 메뉴XML의 KEY값 목록)")
    private String exceptCatList;

    @ApiModelProperty("제외 AND OR (A:AND, O:OR)")
    @Pattern(regexp = "^(A)|(O)$", message = "{tps.newsletter.error.pattern.exceptAndOr}")
    private String exceptAndOr;

    @ApiModelProperty("제외 태그리스트")
    private String exceptTagList;

    @ApiModelProperty("검색 시작일")
    @Pattern(regexp = "^([12]\\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01]))$", message = "{tps.issue.error.pattern.sDate}")
    private String sDate;

    @ApiModelProperty("검색 종료일")
    @Pattern(regexp = "^([12]\\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01]))$", message = "{tps.issue.error.pattern.eDate}")
    private String eDate;

    @ApiModelProperty("사용 여부(Y:사용, E:검색종료(노출))")
    @Pattern(regexp = "^(Y)|(E)$", message = "{tps.article-package.error.pattern.usedYn}")
    private String usedYn;

    @ApiModelProperty("출고일시")
    @DTODateTimeFormat
    private Date distDt;

    @ApiModelProperty("B:이전 / A:이후")
    @Pattern(regexp = "^(A)|(B)$", message = "{tps.article-package.error.pattern.beforeAfter}")
    private String beforeAfter;

    @ApiModelProperty("출고후기간(일)")
    private Long distPeriod;

    @ApiModelProperty("종료일시")
    @DTODateTimeFormat
    private Date endDt;

    @ApiModelProperty("구독 가능 여부 (PKG_DIV=S일때만 설정)")
    private String scbYn;

    /**
     * 키워드 목록
     */
    @Builder.Default
    @Valid
    @ApiModelProperty("키워드 목록")
    private Set<ArticlePackageKwdDTO> Keywords = new LinkedHashSet<>();
}
