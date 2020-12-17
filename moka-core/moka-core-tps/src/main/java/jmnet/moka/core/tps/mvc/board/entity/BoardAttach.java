package jmnet.moka.core.tps.mvc.board.entity;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 게시물첨부파일
 */
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@EqualsAndHashCode(callSuper = true)
@Table(name = "TB_BOARD_ATTACH")
public class BoardAttach extends jmnet.moka.core.tps.common.entity.BaseAudit implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 일련번호
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SEQ_NO", nullable = false)
    private Long seqNo;

    /**
     * 게시물일련번호
     */
    @Column(name = "BOARD_SEQ", nullable = false)
    private Long boardSeq;

    /**
     * 게시판ID
     */
    @Column(name = "BOARD_ID", nullable = false)
    private Long boardId;

    /**
     * 원본파일명
     */
    @Column(name = "ORG_FILE_NAME", nullable = false)
    private String orgFileName;

    /**
     * 파일명
     */
    @Column(name = "FILE_NAME", nullable = false)
    private String fileName;

    /**
     * 파일경로
     */
    @Column(name = "FILE_PATH", nullable = false)
    private String filePath;

    /**
     * 파일크기(KB)
     */
    @Column(name = "FILE_SIZE", nullable = false)
    @Builder.Default
    private Integer fileSize = 0;

    /**
     * 다운로드수
     */
    @Column(name = "DOWNLOAD_CNT", nullable = false)
    @Builder.Default
    private Integer downloadCnt = 0;

    /**
     * 그룹정보
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "BOARD_SEQ", nullable = false, insertable = false, updatable = false)
    private Board board;


}
