package jmnet.moka.core.comment.common.logger;

import java.io.Serializable;
import java.util.Date;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 댓글 로그
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class LogInfo implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 성공여부
     */
    @Builder.Default
    private String successYn = MokaConstants.NO;

    /**
     * 입력수정삭제/로그인/로그아웃
     */
    private ActionType action;

    /**
     * 사용자ID
     */
    private String memberId;

    /**
     * 등록IP주소
     */
    private String regIp;

    /**
     * 등록일시
     */
    @Builder.Default
    private Date regDt = new Date();

    /**
     * 메뉴코드
     */
    private String menuId;

    /**
     * 파라미터
     */
    private String param;

    /**
     * 수행시간
     */
    private Long executedTime;

    /**
     * API 경로
     */
    private String apiPath;

    /**
     * 에러 메세지
     */
    private String errMsg;
}
