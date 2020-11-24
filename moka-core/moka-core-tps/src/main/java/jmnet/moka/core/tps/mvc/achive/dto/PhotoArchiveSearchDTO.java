package jmnet.moka.core.tps.mvc.achive.dto;

import jmnet.moka.common.data.support.SearchDTO;
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
public class PhotoArchiveSearchDTO extends SearchDTO {
    /**
     * 매체 코드
     */
    @Builder.Default
    private String siteCd = "JAI";
    /**
     * 메뉴 번호 ( 포토데스크 : 320, 사진 DB : 119 )
     */
    @Builder.Default
    private String menuNo = "320";

    /**
     * 출처 코드 ( default: ALL /  ex: coverage,newsis ) : 포토아카이브 목록 - 출처(분류) 목록 시트 참조
     */
    private String originCode;

    /**
     * 시작일자 검색 (ex:20201117)
     */
    private String startdate;

    /**
     * 종료일자 검색 (ex:20201117)
     */
    private String finishdate;
    /**
     * 등록일시 정렬 ( DESC, ASC, 정렬을 하지 않을 시에 빈값 )
     */
    private String createdOrderby;
    /**
     * 제목 정렬 ( DESC, ASC, 정렬을 하지 않을 시에 빈값 )
     */
    private String textOrderby;

    /**
     * 타매체를 조회하고 싶은 경우(일간스포츠 코드 : ILG)
     */
    private String forceSiteCd;

}
