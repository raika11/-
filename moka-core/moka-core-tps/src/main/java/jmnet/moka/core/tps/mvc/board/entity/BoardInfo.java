package jmnet.moka.core.tps.mvc.board.entity;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 게시판설정정보
 */
@Entity
@Table(name = "TB_BOARD_INFO")
@Data
@EqualsAndHashCode(callSuper = true)
public class BoardInfo extends jmnet.moka.core.tps.common.entity.BaseAudit implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 게시판ID
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "BOARD_ID", nullable = false)
    private Long boardId;

    /**
     * 게시판명
     */
    @Column(name = "BOARD_NAME", nullable = false)
    private String boardName;

    /**
     * 게시판유형(S:서비스 / A:관리자)
     */
    @Column(name = "BOARD_TYPE")
    private String boardType = "N";

    /**
     * 사용여부
     */
    @Column(name = "USED_YN", nullable = false)
    private String usedYn = "Y";

    /**
     * 말머리1
     */
    @Column(name = "TITLE_PREFIX1")
    private String titlePrefix1;

    /**
     * 말머리2
     */
    @Column(name = "TITLE_PREFIX2")
    private String titlePrefix2;

    /**
     * 글쓰기 권한(0:모두 1:회원 9:관리자)
     */
    @Column(name = "INS_LEVEL")
    private String insLevel = "9";

    /**
     * 조회 권한(0:모두 1:회원 9:관리자)
     */
    @Column(name = "VIEW_LEVEL")
    private String viewLevel = "0";

    /**
     * 답변글 작성권한(0:모두 1:회원 9:관리자)
     */
    @Column(name = "ANSW_LEVEL")
    private String answLevel = "9";

    /**
     * 댓글 작성권한(0:모두 1:회원)
     */
    @Column(name = "REPLY_LEVEL")
    private String replyLevel = "1";

    /**
     * 에디터여부
     */
    @Column(name = "EDITOR_YN")
    private String editorYn = "N";

    /**
     * 답글여부
     */
    @Column(name = "ANSW_YN")
    private String answYn = "N";

    /**
     * 댓글여부
     */
    @Column(name = "REPLY_YN")
    private String replyYn = "N";

    /**
     * 파일업로드여부
     */
    @Column(name = "FILE_YN")
    private String fileYn = "Y";

    /**
     * 허용파일개수
     */
    @Column(name = "ALLOW_FILE_CNT", nullable = false)
    private Integer allowFileCnt = 5;

    /**
     * 허용되는 파일크기(MB)
     */
    @Column(name = "ALLOW_FILE_SIZE", nullable = false)
    private Integer allowFileSize = 10;

    /**
     * 허용되는 파일확장자(;로 구분)
     */
    @Column(name = "ALLOW_FILE_EXT", nullable = false)
    private String allowFileExt = "zip;xls;xlsx;ppt;doc;hwp;jpg;png;gif;";

    /**
     * 추천여부 0:사용안함 1:추천/비추천 2:추천만
     */
    @Column(name = "RECOM_FLAG")
    private String recomFlag;

    /**
     * 신고여부
     */
    @Column(name = "DECLARE_YN")
    private String declareYn;

    /**
     * 캡차여부
     */
    @Column(name = "CAPTCHA_YN")
    private String captchaYn;

    /**
     * 채널타입(예:JPOD)
     */
    @Column(name = "CHANNEL_TYPE")
    private String channelType;

    /**
     * 게시판설명
     */
    @Column(name = "BOARD_DESC")
    private String boardDesc;

}
