package jmnet.moka.core.tps.mvc.reporter.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.NamedQuery;
import javax.persistence.PreUpdate;
import javax.persistence.Table;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.entity.BaseAudit;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


/**
 * The persistent class for the TB_15RE_REPORTER table.
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "TB_15RE_REPORTER")
@NamedQuery(name = "Reporter.findAll", query = "SELECT d FROM Reporter d")
public class Reporter extends BaseAudit {

    private static final long serialVersionUID = -6113879324816610973L;

    /**
     * 기자일련번호
     */
    @Id
    @Column(name = "REP_SEQ", length = 4)
    private String repSeq;

    /**
     * 사용여부(Y:사용,N:미사용)
     */
    @Column(name = "USED_YN", nullable = false, length = 1)
    private String usedYn;

    /**
     * 사용자 한마디 사용여부(Y:사용,N:미사용)
     */
    @Column(name = "TALK_YN", nullable = false, length = 1)
    private String talkYn;

    /**
     * 기자명
     */
    @Column(name = "REP_NAME", updatable = false)
    private String repName;

    /**
     * 집배신 이메일
     */
    @Column(name = "REP_EMAIL1", updatable = false)
    private String repEmail1;

    /**
     * JNET 이메일
     */
    @Column(name = "REP_EMAIL2", updatable = false)
    private String repEmail2;

    /**
     * 기자 노출용 직책
     */
    @Column(name = "REP_TITLE", updatable = false)
    private String repTitle;

    /**
     * 기자 연락처
     */
    @Column(name = "REP_PHONE", updatable = false)
    private String repPhone;

    /**
     * 조인스ID
     */
    @Column(name = "JOINS_ID", updatable = false)
    private String joinsId;

    /**
     * JNET아이디
     */
    @Column(name = "JNET_ID", updatable = false)
    private String jnetId;

    /**
     * 기자 프로필 사진
     */
    @Column(name = "REP_PHOTO", updatable = false)
    private String repPhoto;

    /**
     * 기자 프로필 사진_직접입력
     */
    @Column(name = "REP_IMG", updatable = false)
    private String repImg;

    /**
     * 트위터 주소
     */
    @Column(name = "SNS_TW", updatable = false)
    private String snsTw;

    /**
     * 페이스북 주소
     */
    @Column(name = "SNS_FB", updatable = false)
    private String snsFb;

    /**
     * 인스타그램 주소
     */
    @Column(name = "SNS_IN", updatable = false)
    private String snsIn;

    /**
     * 조인스 블로그 주소
     */
    @Column(name = "JOINS_BLOG", updatable = false)
    private String joinsBlog;

    /**
     * 기자페이지 조회수
     */
    @Column(name = "VIEW_CNT", updatable = false)
    private String viewCnt;

    /**
     * 작성 기사수
     */
    @Column(name = "ART_CNT", updatable = false)
    private String artCnt;

    /**
     * 구독수
     */
    @Column(name = "SCB_CNT", updatable = false)
    private String scbCnt;

    /**
     * 공유수
     */
    @Column(name = "SHR_CNT", updatable = false)
    private String shrCnt;

    /**
     * 댓글수
     */
    @Column(name = "REPLY_CNT", updatable = false)
    private Integer replyCnt;

    /**
     * 필진타입 (J1:기자필진,J2:외부필진,J3:그룹필진,J0:필진해지)
     */
    @Column(name = "JPLUS_REP_DIV", updatable = false)
    private String jplusRepDiv;

    /**
     * 직업정보
     */
    @Column(name = "JPLUS_JOB_INFO", updatable = false)
    private String jplusJobInfo;

    /**
     * 필진 제목
     */
    @Column(name = "JPLUS_TITLE", updatable = false)
    private String jplusTitle;

    /**
     * 기타 정보
     */
    @Column(name = "JPLUS_MEMO", updatable = false)
    private String jplusMemo;

    /**
     * 그룹필진 수정 권한
     */
    @Column(name = "JPLUS_PROFILE_YN", updatable = false)
    private String jplusProfileYn;

    /**
     * JPLUS사용여부
     */
    @Column(name = "JPLUS_USED_YN", updatable = false)
    private String jplusUsedYn;

    /**
     * 직접관리용 회사코드 (TB_15RE_CODE_MGT.GRP_CD=R1)
     */
    @Column(name = "R1_CD", updatable = false)
    private String r1Cd;

    /**
     * 조직개편 부서 코드
     */
    @Column(name = "R2_CD", updatable = false)
    private String r2Cd;

    /**
     * 조직개편 실/국 코드
     */
    @Column(name = "R3_CD", updatable = false)
    private String r3Cd;

    /**
     * 조직개편 팀 코드
     */
    @Column(name = "R4_CD", updatable = false)
    private String r4Cd;

    /**
     * 사용안함
     */
    @Column(name = "R5_CD", updatable = false)
    private String r5Cd;

    /**
     * 사용안함
     */
    @Column(name = "R6_CD", updatable = false)
    private String r6Cd;

    /**
     * JAM 기자 일련번호
     */
    @Column(name = "JAM_REP_SEQ", updatable = false)
    private String jamRepSeq;

    /**
     * JAM 대표부서 일련번호
     */
    @Column(name = "JAM_DEPT_SEQ", updatable = false)
    private String jamDeptSeq;

    /**
     * JAM 대표부서명
     */
    @Column(name = "JAM_DEPT_NM", updatable = false)
    private String jamDeptNm;

    /**
     * 필진 전문 분야
     */
    @Column(name = "REP_FIELD", updatable = false)
    private String repField;

    /**
     * JAM 회사 코드
     */
    @Column(name = "JAM_COM_CD", updatable = false)
    private String jamComCd;

    /**
     * JAM 회사 명
     */
    @Column(name = "JAM_COM_NM", updatable = false)
    private String jamComNm;

    /**
     * 기자한마디
     */
    @Column(name = "REP_TALK", updatable = false)
    private String repTalk;

    /**
     * 사용자한마디
     */
    @Column(name = "USER_TALK", updatable = false)
    private String userTalk;

    /**
     * 수정전 처리
     */
    @PreUpdate
    public void preUpdate() {
        this.usedYn = McpString.defaultValue(this.usedYn, MokaConstants.YES); // 노출여부
        this.talkYn = McpString.defaultValue(this.talkYn, MokaConstants.YES); // 기자에게 한마디 사용여부
    }
}
