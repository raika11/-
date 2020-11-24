package jmnet.moka.core.tps.mvc.achive.vo;

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
public class PhotoArchiveVO {
    /**
     * 초상권주의(Y, N)
     */
    private String atpnPoriatentYn;
    /**
     * 재사용금지(Y, N)
     */
    private String atpnReusprhibtYn;
    /**
     * 사용금지(Y, N)
     */
    private String atpnUseprhibtYn;

    /**
     * 등록일
     */
    @JsonFormat(shape = Shape.STRING, pattern = "yyyyMMdd HHmmss")
    private Date date;

    /**
     * 파일타입
     */
    private String fileTy;

    /**
     * 타매체 조회 일 경우 forceSiteCd값 존재(일간스포츠 : ILG..)
     */
    private String forceSiteCd;

    /**
     * 온라인 이미지 경로
     */
    private String imageOnlnPath;
    /**
     * 썸네일 이미지 경로
     */
    private String imageThumPath;
    /**
     * 사진 NID
     */
    private String nid;
    /**
     * 출처
     */
    private String origin;
    /**
     * 등록자
     */
    private String regNm;
    /**
     * 목목
     */
    private String text;

    /**
     * 사용기간 시작일자
     */
    @JsonFormat(shape = Shape.STRING, pattern = "yyyyMMdd HHmmss")
    private Date usePdBeginDt;

    /**
     * 사용기간 종료일자
     */
    @JsonFormat(shape = Shape.STRING, pattern = "yyyyMMdd HHmmss")
    private Date usePdEndDt;
}
