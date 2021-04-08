package jmnet.moka.core.tps.mvc.poll.vo;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import java.util.Date;
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
 * Package : jmnet.moka.core.tps.mvc.poll.vo
 * ClassName : TrendpollVoteVO
 * Created : 2021-04-02 ince
 * </pre>
 *
 * @author ince
 * @since 2021-04-02 09:08
 */
@Alias("TrendpollVoteVO")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@JsonInclude(Include.NON_NULL)
public class TrendpollVoteVO {

    /**
     * 일련번호
     */
    private Long seqNo;

    /**
     * 투표일련번호
     */
    private Long pollSeq;

    /**
     * 항목일련번호
     */
    private Long itemSeq;

    /**
     * 디바이스 구분(P:PC, M:MOBILE)
     */
    private String devDiv = "P";

    /**
     * 등록일시
     */
    private Date regDt;


    /**
     * 등록IP주소
     */
    private String regIp;

    /**
     * 회원ID
     */
    private String memId;

    /**
     * PC_ID
     */
    private String pcId;

    /**
     * 순서
     */
    private Integer ordNo = 1;

    /**
     * 항목별 응모수
     */
    private Integer voteCnt = 0;

    /**
     * 이미지명
     */
    private String imgUrl;

    /**
     * 링크URL
     */
    private String linkUrl;

    /**
     * 제목
     */
    private String title;
}
