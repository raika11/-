package jmnet.moka.core.tps.mvc.archive.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.code.PhotoArchiveMenuCode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.achive.dto
 * ClassName : PhotoArchiveSearchDTO
 * Created : 2020-11-23 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-23 17:57
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@ApiModel("사진 아카이브 검색 DTO")
public class PhotoArchiveSearchDTO {
    /**
     * 매체 코드
     */
    @ApiModelProperty("매체 코드")
    @Builder.Default
    private String siteCd = TpsConstants.SITE_CD;

    /**
     * 메뉴 코드
     */
    @ApiModelProperty("메뉴 번호")
    @Builder.Default
    private PhotoArchiveMenuCode menuCode = PhotoArchiveMenuCode.PHOTO_DESK;

    /**
     * 출처 코드 ( default: ALL /  ex: coverage,newsis ) : 포토아카이브 목록 - 출처(분류) 목록 시트 참조
     */
    @ApiModelProperty("메뉴 번호")
    private String originCode;

    @Builder.Default
    private Integer page = SearchDTO.DEFAULT_PAGE;


    @ApiModelProperty("페이지번호")
    @JsonProperty(value = "page_count")
    @Builder.Default
    private Integer pageCount = SearchDTO.DEFAULT_SIZE;

    /**
     * 시작일자 검색 (ex:20201117)
     */
    @ApiModelProperty("시작일자 검색 (ex:20201117)")
    private String startdate;

    /**
     * 종료일자 검색 (ex:20201117)
     */
    @ApiModelProperty("종료일자 검색 (ex:20201117)")
    private String finishdate;

    /**
     * 검색키워드( text 제목, nid 사진ID, phtofrfm 촬영자, reg_nm 등록자, dc 캡션, all 전체 )
     */
    @ApiModelProperty("검색키워드( text 제목, nid 사진ID, phtofrfm 촬영자, reg_nm 등록자, dc 캡션, all 전체 )")
    private String searchKey;

    /**
     * 검색값
     */
    @ApiModelProperty("검색어")
    private String searchValue;

    /**
     * 등록일시 정렬 ( DESC, ASC, 정렬을 하지 않을 시에 빈값 )
     */
    @ApiModelProperty("등록일시 정렬 ( DESC, ASC, 정렬을 하지 않을 시에 빈값 )")
    @JsonProperty(value = "created_orderby")
    private String createdOrderby;
    /**
     * 제목 정렬 ( DESC, ASC, 정렬을 하지 않을 시에 빈값 )
     */
    @ApiModelProperty("제목 정렬 ( DESC, ASC, 정렬을 하지 않을 시에 빈값 )")
    @JsonProperty(value = "text_orderby")
    private String textOrderby;

    /**
     * 타매체를 조회하고 싶은 경우(일간스포츠 코드 : ILG)
     */
    @ApiModelProperty("타매체를 조회하고 싶은 경우(일간스포츠 코드 : ILG)")
    private String forceSiteCd;

    /**
     * 사진 유형 목록(Image, Photo .. 등) / 포토아카이브 사진 유형 목록 시트 Name 값 참조. (Image와 Photo를 모두 조회하고 싶은 경우 ','을 사용 ex. Image, Photo )
     */
    @ApiModelProperty("사진 유형 목록(Image, Photo .. 등) / 포토아카이브 사진 유형 목록 시트 Name 값 참조. (Image와 Photo를 모두 조회하고 싶은 경우 ','을 사용 ex. Image, Photo )")
    private String imageType;

}
