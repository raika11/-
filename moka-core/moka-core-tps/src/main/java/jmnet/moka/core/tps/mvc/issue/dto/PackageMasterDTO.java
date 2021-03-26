package jmnet.moka.core.tps.mvc.issue.dto;

import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModelProperty;
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
import org.apache.ibatis.type.Alias;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.core.tps.mvc.issue.dto
 * ClassName : PackageMasterDTO
 * Created : 2021-03-24
 * </pre>
 *
 * @author stsoon
 * @since 2021-03-24 오후 2:08
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Alias("PackageMasterDTO")
public class PackageMasterDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    public static final Type TYPE = new TypeReference<List<PackageMasterDTO>>() {
    }.getType();

    /**
     * 패키지 일련번호
     */
    @ApiModelProperty("패키지 일련번호")
    private Long pkgSeq;

    /**
     * 사용 여부
     */
    @ApiModelProperty("사용 여부")
    private String usedYn;

    /**
     * 패키지 유형
     */
    @ApiModelProperty("패키지 유형")
    private String pkgDiv;

    /**
     * 패키지 일련번호
     */
    @ApiModelProperty("패키지 일련번호")
    private String seasonNo;

    /**
     * 시즌넘버
     */
    @ApiModelProperty("시즌넘버")
    private String episView;

    /**
     * 구독 가능 여부
     */
    @ApiModelProperty("구독 가능 여부")
    private String scbYn;

    /**
     * 구독상품 일련번호
     */
    @ApiModelProperty("구독상품 일련번호")
    private Long scbNo;

    /**
     * 기사 수
     */
    @ApiModelProperty("기사 수")
    private Long artCnt;

    /**
     * 최근 기사1
     */
    @ApiModelProperty("최근 기사1")
    private Long totalId1;

    /**
     * 카테고리 리스트
     */
    @ApiModelProperty("카테고리 리스트")
    private String catList;

    /**
     * 패키지 타이틀
     */
    @ApiModelProperty("패키지 타이틀")
    private String pkgTitle;

    /**
     * 패키지 설명
     */
    @ApiModelProperty("패키지 설명")
    private String pkgDesc;

    /**
     * 추천 패키지 리스트
     */
    @ApiModelProperty("추천 패키지 리스트")
    private String recommPkg;

    /**
     * 예약일시
     */
    @ApiModelProperty("패키지 일련번호")
    private Date reservDt;

    /**
     * 최종 업데이트 일시
     */
    @ApiModelProperty("패키지 일련번호")
    private Date updDt;

    /**
     * 키워드 목록
     */
    @ApiModelProperty("키워드 목록")
    private Set<PackageKeywordDTO> packageKeywords = new LinkedHashSet<>();
}
