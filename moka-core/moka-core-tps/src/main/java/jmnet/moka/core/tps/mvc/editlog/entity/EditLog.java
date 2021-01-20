package jmnet.moka.core.tps.mvc.editlog.entity;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;

/**
 * CMS 편집로그
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "TB_CMS_EDIT_LOG")
public class EditLog implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 일련번호
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SEQ_NO", nullable = false)
    private Long seqNo;

    /**
     * 성공여부
     */
    @Column(name = "SUCCESS_YN", nullable = false)
    @Builder.Default
    private String successYn = MokaConstants.NO;

    /**
     * 입력수정삭제/로그인/로그아웃
     */
    @Enumerated(value = EnumType.STRING)
    @Column(name = "ACTION", nullable = false)
    private ActionType action;

    /**
     * 사용자ID
     */
    @Column(name = "MEM_ID", nullable = false)
    private String memberId;

    /**
     * 등록IP주소
     */
    @Column(name = "REG_IP")
    private String regIp;

    /**
     * 등록일시
     */
    @Column(name = "REG_DT")
    @Builder.Default
    private Date regDt = new Date();

    /**
     * 메뉴코드
     */
    @Column(name = "MENU_ID")
    private String menuId;

    /**
     * 파라미터
     */
    @Nationalized
    @Column(name = "PARAM")
    private String param;

    /**
     * 수행시간
     */
    @Column(name = "EXEC_TIME")
    private Long executedTime;

    /**
     * API 경로
     */
    @Column(name = "API_PATH")
    private String apiPath;

    /**
     * 에러 메세지
     */
    @Column(name = "ERR_MSG")
    private String errMsg;

    /**
     * 메뉴코드
     */
    @Transient
    private String menuNm;
}
