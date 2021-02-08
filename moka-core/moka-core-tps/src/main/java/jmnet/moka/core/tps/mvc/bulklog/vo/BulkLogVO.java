package jmnet.moka.core.tps.mvc.bulklog.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

import java.util.Date;

/**
 * <pre>
 * 벌크 현황 조회용 VO
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.bulklog.vo
 * ClassName : BulkLogVO
 * Created : 2021-01-22 ince
 * </pre>
 *
 * @author ince
 * @since 2021-01-22 13:19
 */

@Alias("BulkLogVO")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class BulkLogVO {

    /**
     * 로그일련번호
     */
    @Builder.Default
    private Long logSeq = 0l;

    /**
     * MGT일련번호
     */
    @Builder.Default
    private Long mgtSeq = 0l;

    /**
     * DDREF일련번호
     */
    @Builder.Default
    private Long ddrefSeq = 0l;

    /**
     * 콘텐트구분
     */
    private String contentDiv;

    /**
     * 콘텐트ID
     */
    private String contentId;

    /**
     * 입력수정삭제
     */
    private String iud;

    /**
     * 매체코드
     */
    private String orgSourceCode;

    /**
     * 매체코드명
     */
    private String orgSourceName;

    /**
     * 등록일시
     */
    private Date regDt;

    /**
     * 최종상태(10:완료,1:Loader진행,3:Loader완료, 5:덤프진행, 8:Dump완료,-3:Loader실패,-5:Dump실패,-10:Sender실패)
     */
    private String status;

    /**
     * 로더상태(10:완료,1:진행,-1:실패,15:Loader에서 모두완료)
     */
    private String loaderStatus;

    /**
     * 로더시작일시
     */
    private Date loaderStartDt;

    /**
     * 로더종료일시
     */
    private Date loaderEndDt;

    /**
     * 덤프상태(15:JHOT완료, 10:완료, 3:JHOT 진행, 1:진행,-1:실패)
     */
    private String dumpStatus;

    /**
     * 덤프시작일시
     */
    private Date dumpStartDt;

    /**
     * 덤프종료일시
     */
    private Date dumpEndDt;

    /**
     * 로그메시지
     */
    private String msg;

    /**
     * 제목
     */
    private String title;

    /**
     * naver 상태
     */
    private String naverStatus;

    /**
     * daum 상태
     */
    private String daumStatus;

    /**
     * nate 상태
     */
    private String nateStatus;

    /**
     * zoom 상태
     */
    private String zoomStatus;

    /**
     * kpf 상태
     */
    private String kpfStatus;

    /**
     * remark 상태
     */
    private String remarkStatus;

}
