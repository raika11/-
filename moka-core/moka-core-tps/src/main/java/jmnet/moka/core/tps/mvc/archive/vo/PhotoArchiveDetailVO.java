package jmnet.moka.core.tps.mvc.archive.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonFormat.Shape;
import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.achive.vo
 * ClassName : PhotoArchiveVO
 * Created : 2020-11-23 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-23 17:55
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PhotoArchiveDetailVO extends PhotoArchiveVO {
    /**
     * 캡션
     */
    private String dc;

    /**
     * 태그
     */
    private String tag;

    /**
     * 출처 코드
     */
    private String originCd;

    /**
     * 사진메모
     */
    private String photoMemo;

    /**
     * 사진 DB 등록 여부
     */
    private String photoYn;

    /**
     * 등록일시
     */
    @JsonFormat(shape = Shape.STRING, pattern = "yyyyMMdd HHmmss")
    private Date regDt;

    /**
     * 수정일시
     */
    @JsonFormat(shape = Shape.STRING, pattern = "yyyyMMdd HHmmss")
    private Date modDt;

    /**
     * 등록자명
     */
    private String regNm;

    /**
     * 수정자
     */
    private String modifier;

    /**
     * 가로 ( 단위 : mm )
     */
    private String imageCtsWidth;

    /**
     * 세로 ( 단위 : mm )
     */
    private String imageCtsVrticl;

    /**
     * 엠바고
     */
    @JsonFormat(shape = Shape.STRING, pattern = "yyyyMMdd HHmmss")
    private Date embargoDt;

    /**
     * 사진유형(포토아카이브 사진 유형 목록 시트 cd 값 참조)
     */
    private String patTyCd;
}
