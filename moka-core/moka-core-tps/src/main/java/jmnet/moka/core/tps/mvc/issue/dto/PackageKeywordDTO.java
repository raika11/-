package jmnet.moka.core.tps.mvc.issue.dto;

import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModelProperty;
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
@Alias("PackageKeywordDTO")
public class PackageKeywordDTO implements Serializable {

    public static final Type TYPE = new TypeReference<List<PackageKeywordDTO>>() {
    }.getType();

    private static final long serialVersionUID = 1L;

    /**
     * 키워드 일련번호
     */
    @ApiModelProperty("패키지 일련번호")
    private Long seqNo;

    /**
     * 패키지 일련번호
     */
    @ApiModelProperty("패키지 일련번호")
    private Long pkgSeq;

    /**
     * 검색 카테고리
     */
    @ApiModelProperty("검색 카테고리")
    private String catDiv;

    /**
     * 검색 조건
     */
    @ApiModelProperty("검색 조건")
    private String schCondi;

    /**
     * AND OR (A:AND, O:OR)
     */
    @ApiModelProperty("AND OR (A:AND, O:OR)")
    private String andOr;

    /**
     * 기자 OR 코드 키워드 수
     */
    @ApiModelProperty("기자 OR 코드 키워드 수")
    private Long kwdCnt;

    /**
     * 순번
     */
    @ApiModelProperty("순번")
    private Long ordno;

    /**
     * 패키지 일련번호
     */
    @ApiModelProperty("패키지 일련번호")
    private Long repMaster;

    /**
     * 기자 일련번호 또는 마스터코드
     */
    @ApiModelProperty("기자 일련번호 또는 마스터코드")
    private Long kwdOrd;

    /**
     * 키워드
     */
    @ApiModelProperty("키워드")
    private String keyword;

    /**
     * 검색 시작일
     */
    @ApiModelProperty("검색 시작일")
    private String sDate;

    /**
     * 검색 종료일
     */
    @ApiModelProperty("검색 종료일")
    private String eDate;
}
