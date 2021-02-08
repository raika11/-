package jmnet.moka.core.tps.mvc.bulklog.entity;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.Date;

/**
 * 벌크 모니터링 로그
 */
@Entity
@Table(name = "TB_BULK_LOG")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@EqualsAndHashCode(callSuper = true)
public class BulkLog extends jmnet.moka.core.tps.common.entity.BaseAudit implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 로그일련번호
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "LOG_SEQ", nullable = false)
    private Long logSeq;

    /**
     * MGT일련번호
     */
    @Column(name = "MGT_SEQ")
    private Long mgtSeq;

    /**
     * DDREF일련번호
     */
    @Column(name = "DDREF_SEQ", nullable = false)
    private Long ddrefSeq;

    /**
     * 콘텐트구분
     */
    @Column(name = "CONTENT_DIV")
    private String contentDiv;

    /**
     * 콘텐트ID
     */
    @Column(name = "CONTENT_ID", nullable = false)
    private Long contentId;

    /**
     * 입력수정삭제
     */
    @Column(name = "IUD", nullable = false)
    private String iud;

    /**
     * 매체코드
     */
    @Column(name = "ORG_SOURCE_CODE")
    private String orgSourceCode;

    /**
     * 등록일시
     */
    @Column(name = "REG_DT")
    private Date regDt;

    /**
     * 최종상태(10:완료,1:Loader진행,3:Loader완료, 5:덤프진행, 8:Dump완료,-3:Loader실패,-5:Dump실패,-10:Sender실패)
     */
    @Column(name = "STATUS")
    private Long status;

    /**
     * 로더상태(10:완료,1:진행,-1:실패,15:Loader에서 모두완료)
     */
    @Column(name = "LOADER_STATUS")
    private Long loaderStatus;

    /**
     * 로더시작일시
     */
    @Column(name = "LOADER_START_DT")
    private Date loaderStartDt;

    /**
     * 로더종료일시
     */
    @Column(name = "LOADER_END_DT")
    private Date loaderEndDt;

    /**
     * 덤프상태(15:JHOT완료, 10:완료, 3:JHOT 진행, 1:진행,-1:실패)
     */
    @Column(name = "DUMP_STATUS")
    private Long dumpStatus;

    /**
     * 덤프시작일시
     */
    @Column(name = "DUMP_START_DT")
    private Date dumpStartDt;

    /**
     * 덤프종료일시
     */
    @Column(name = "DUMP_END_DT")
    private Date dumpEndDt;

    /**
     * 로그메시지
     */
    @Column(name = "MSG")
    private String msg;

    /**
     * 제목
     */
    @Column(name = "TITLE")
    private String title;

}
