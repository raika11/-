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
 * 게시물
 */
@Table(name = "TB_BOARD")
@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class Board extends jmnet.moka.core.tps.common.entity.BaseAudit implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 게시물일련번호
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "BOARD_SEQ", nullable = false)
    private Long boardSeq;

    /**
     * 게시판ID
     */
    @Column(name = "BOARD_ID", nullable = false)
    private Integer boardId;

    /**
     * 부모게시물일련번호
     */
    @Column(name = "PARENT_BOARD_SEQ", nullable = false)
    private Integer parentBoardSeq;

    /**
     * 채널타입(예:JPOD)
     */
    @Column(name = "CHANNEL_TYPE")
    private String channelType;

    /**
     * 채널ID(예:JPOD 채널SEQ)
     */
    @Column(name = "CHANNEL_ID", nullable = false)
    private Integer channelId = 0;

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
     * 제목
     */
    @Column(name = "TITLE", nullable = false)
    private String TITLE;

    /**
     * 등록자명
     */
    @Column(name = "REG_NAME")
    private String regName;

    /**
     * 뎁스
     */
    @Column(name = "DEPTH", nullable = false)
    private Integer DEPTH = 0;

    /**
     * 들여쓰기
     */
    @Column(name = "INDENT", nullable = false)
    private Integer INDENT = 0;

    /**
     * 1:일반 9:공지
     */
    @Column(name = "ORD_NO", nullable = false)
    private Integer ordNo = 1;

    /**
     * 조회수
     */
    @Column(name = "VIEW_CNT", nullable = false)
    private Integer viewCnt = 0;

    /**
     * 추천수
     */
    @Column(name = "RECOM_CNT", nullable = false)
    private Integer recomCnt = 0;

    /**
     * 비추천수
     */
    @Column(name = "DECOM_CNT", nullable = false)
    private Integer decomCnt = 0;

    /**
     * 신고수
     */
    @Column(name = "DECLARE_CNT", nullable = false)
    private Integer declareCnt = 0;

    /**
     * 삭제여부
     */
    @Column(name = "DEL_YN", nullable = false)
    private String delYn = "N";

    /**
     * 내용
     */
    @Column(name = "CONTENT", nullable = false)
    private String CONTENT;

    /**
     * 회원ID
     */
    @Column(name = "MEM_ID")
    private String memId;

    /**
     * 비밀번호
     */
    @Column(name = "PWD")
    private String PWD;

    /**
     * 등록IP주소
     */
    @Column(name = "REG_IP")
    private String regIp;

}