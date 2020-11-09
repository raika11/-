package jmnet.moka.core.tps.mvc.reporter.entity;

import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import jmnet.moka.core.tps.common.entity.BaseAudit;
import lombok.*;

import javax.persistence.*;
import java.util.Date;


/**
 * The persistent class for the TB_WMS_DOMAIN database table.
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "TB_15RE_REPORTER")
@NamedQuery(name = "ReporterMgr.findAll", query = "SELECT d FROM Reporter d")
public class Reporter extends BaseAudit {

    private static final long serialVersionUID = -6113879324816610973L;

    /**
     * 기자일련번호
     */
    @Id
    @Column(name = "REP_SEQ", columnDefinition = "char", length = 4)
    private String repSeq;

    /**
     * 사용여부
     */
    @Column(name = "USED_YN", nullable = false, length = 1)
    private String usedYn;

    /**
     * 사용자 한마디
     */
    @Column(name = "TALK_YN", nullable = false, length = 1)
    private String talkYn;

    @Column(name = "REP_NAME", updatable = false)
    private String repName;

    @Column(name = "REP_EMAIL1", updatable = false)
    private String repEmail1;

    @Column(name = "REP_EMAIL2", updatable = false)
    private String repEmail2;

    @Column(name = "REP_TITLE", updatable = false)
    private String repTitle;

    @Column(name = "REP_PHONE", updatable = false)
    private String repPhone;

    @Column(name = "JOINS_ID", updatable = false)
    private String joinsId;

    @Column(name = "JNET_ID", updatable = false)
    private String jnetId;

    @Column(name = "REP_PHOTO", updatable = false)
    private String repPhoto;

    @Column(name = "REP_IMG", updatable = false)
    private String repImg;

    @Column(name = "SNS_TW", updatable = false)
    private String snsTw;

    @Column(name = "SNS_FB", updatable = false)
    private String snsFb;

    @Column(name = "SNS_IN", updatable = false)
    private String snsIn;

    @Column(name = "JOINS_BLOG", updatable = false)
    private String joinsBlog;

    @Column(name = "VIEW_CNT", updatable = false)
    private String viewCnt;

    @Column(name = "ART_CNT", updatable = false)
    private String artCnt;

    @Column(name = "SCB_CNT", updatable = false)
    private String scbCnt;

    @Column(name = "SHR_CNT", updatable = false)
    private String shrCnt;

    @Column(name = "REPLY_CNT", updatable = false)
    private String replyCnt;

    @Column(name = "JPLUS_REP_DIV", updatable = false)
    private String jplusRepDiv;

    @Column(name = "JPLUS_JOB_INFO", updatable = false)
    private String jplusJobInfo;

    @Column(name = "JPLUS_TITLE", updatable = false)
    private String jplusTitle;

    @Column(name = "JPLUS_MEMO", updatable = false)
    private String jplusMemo;

    @Column(name = "JPLUS_PROFILE_YN", updatable = false)
    private String jplusProfileYn;

    @Column(name = "JPLUS_REG_DT", updatable = false)
    @DTODateTimeFormat
    private Date jplusRegDt;

    @Column(name = "JPLUS_USED_YN", updatable = false)
    private String jplusUsedYn;

    @Column(name = "R1_CD", updatable = false)
    private String r1Cd;

    @Column(name = "R2_CD", updatable = false)
    private String r2Cd;

    @Column(name = "R3_CD", updatable = false)
    private String r3Cd;

    @Column(name = "R4_CD", updatable = false)
    private String r4Cd;

    @Column(name = "R5_CD", updatable = false)
    private String r5Cd;

    @Column(name = "R6_CD", updatable = false)
    private String r6Cd;

    @Column(name = "JAM_REP_SEQ", updatable = false)
    private String jamRepSeq;

    @Column(name = "JAM_DEPT_SEQ", updatable = false)
    private String jamDeptSeq;

    @Column(name = "JAM_DEPT_NM", updatable = false)
    private String jamDeptNm;

    @Column(name = "REP_FIELD", updatable = false)
    private String repField;

    @Column(name = "JAM_COM_CD", updatable = false)
    private String jamComCd;

    @Column(name = "JAM_COM_NM", updatable = false)
    private String jamComNm;

    /*
    @DTODateTimeFormat
    @Column(name = "REG_DT", updatable = false)
    private Date regDt;

    @Column(name = "REG_ID", updatable = false)
    private String regId;

    @DTODateTimeFormat
    @Column(name = "MOD_DT")
    private Date modDt;

    @Column(name = "MOD_ID")
    private String modId;
    */

    @Column(name = "REP_TALK", updatable = false)
    private String repTalk;

    @Column(name = "USER_TALK", updatable = false)
    private String userTalk;

    /**
     * 수정 전 처리
     */
    @PreUpdate
    public void preUpdate() {
        this.usedYn = McpString.defaultValue(this.usedYn, MokaConstants.YES); // 노출여부
        this.talkYn = McpString.defaultValue(this.talkYn, MokaConstants.YES); // 기자에게 한마디 사용여부
    }
}
