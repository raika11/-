package jmnet.moka.web.push.mvc.board.entity;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import jmnet.moka.core.common.MokaConstants;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 게시물
 */
@Table(name = "TB_BOARD")
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class Board implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 게시물일련번호
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "BOARD_SEQ", nullable = false)
    private Long boardSeq;

    /**
     * 제목
     */
    @Column(name = "TITLE", nullable = false)
    private String title;

    /**
     * 등록자명
     */
    @Column(name = "REG_NAME")
    private String regName;

    /**
     * 삭제여부
     */
    @Column(name = "DEL_YN", nullable = false)
    @Builder.Default
    private String delYn = MokaConstants.NO;


    /**
     * 내용
     */
    @Column(name = "CONTENT", nullable = false)
    private String content;


    /**
     * app os
     */
    @Column(name = "APP_OS")
    private String appOs;

    /**
     * 디바이스 구분
     */
    @Column(name = "DEV_DIV")
    private String devDiv;

    /**
     * 디바이스 푸시 토큰
     */
    @Column(name = "TOKEN")
    private String token;

}
