package jmnet.moka.core.tps.mvc.editlog.dto;

import com.fasterxml.jackson.core.type.TypeReference;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * CMS 편집로그
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class EditLogDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    public static final Type TYPE = new TypeReference<List<EditLogDTO>>() {
    }.getType();

    /**
     * 일련번호
     */
    private Long seqNo;

    /**
     * 성공여부
     */
    private String successYn = MokaConstants.YES;

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
    @DTODateTimeFormat
    private Date regDt;

    /**
     * 메뉴코드
     */
    private String menuId;

    /**
     * 메뉴명
     */
    private String menuNm;

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
