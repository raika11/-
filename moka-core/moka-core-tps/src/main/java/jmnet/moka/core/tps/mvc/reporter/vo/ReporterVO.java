package jmnet.moka.core.tps.mvc.reporter.vo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Alias("ReporterVO")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class ReporterVO implements Serializable {

    private static final long serialVersionUID = 4915460246745266545L;

    /**
     * 기자 일련번호 (1001부터 시작)
     */
    @Column(name = "REP_SEQ")
    private String repSeq;

    /**
     * 사용여부(Y:사용,N:미사용)
     */
    @Column(name = "USED_YN")
    private String usedYn;

    /**
     * 사용자 한마디 사용여부(Y:사용,N:미사용)
     */
    @Column(name = "TALK_YN")
    private String talkYn;

    /**
     * 기자명
     */
    @Column(name = "REP_NAME")
    private String repName;

    /**
     * 집배신 이메일
     */
    @Column(name = "REP_EMAIL1")
    private String repEmail1;

    /**
     * JNET 이메일
     */
    @Column(name = "REP_EMAIL2")
    private String repEmail2;

    /**
     * 기자 노출용 직책
     */
    @Column(name = "REP_TITLE")
    private String repTitle;

    /**
     * 기자 연락처
     */
    @Column(name = "REP_PHONE")
    private String repPhone;

    /**
     * 조인스ID
     */
    @Column(name = "JOINS_ID")
    private String joinsId;

    /**
     * JNET아이디
     */
    @Column(name = "JNET_ID")
    private String jnetId;

    /**
     * 기자 프로필 사진
     */
    @Column(name = "REP_PHOTO")
    private String repPhoto;

    /**
     * 기자 프로필 사진_직접입력
     */
    @Column(name = "REP_IMG")
    private String repImg;

    /**
     * 트위터 주소
     */
    @Column(name = "SNS_TW")
    private String snsTw;

    /**
     * 페이스북 주소
     */
    @Column(name = "SNS_FB")
    private String snsFb;

    /**
     * 인스타그램 주소
     */
    @Column(name = "SNS_IN")
    private String snsIn;

    /**
     * 조인스 블로그 주소
     */
    @Column(name = "JOINS_BLOG")
    private String joinsBlog;

    /**
     * 기자페이지 조회수
     */
    @Column(name = "VIEW_CNT")
    private String viewCnt;

    /**
     * 작성 기사수
     */
    @Column(name = "ART_CNT")
    private String artCnt;

    /**
     * 구독수
     */
    @Column(name = "SCB_CNT")
    private String scbCnt;

    /**
     * 공유수
     */
    @Column(name = "SHR_CNT")
    private String shrCnt;

    /**
     * 댓글수
     */
    @Column(name = "REPLY_CNT")
    private String replyCnt;

    /**
     * 필진타입 (J1:기자필진,J2:외부필진,J3:그룹필진,J0:필진해지)
     */
    @Column(name = "JPLUS_REP_DIV")
    private String jplusRepDiv;

    /**
     * 직업정보
     */
    @Column(name = "JPLUS_JOB_INFO")
    private String jplusJobInfo;

    /**
     * 필진 제목
     */
    @Column(name = "JPLUS_TITLE")
    private String jplusTitle;

    /**
     * 기타 정보
     */
    @Column(name = "JPLUS_MEMO")
    private String jplusMemo;

    /**
     * 그룹필진 수정 권한
     */
    @Column(name = "JPLUS_PROFILE_YN")
    private String jplusProfileYn;

    /**
     * JPLUS사용여부
     */
    @Column(name = "JPLUS_USED_YN")
    private String jplusUsedYn;

    /**
     * 직접관리용 회사코드 (TB_15RE_CODE_MGT.GRP_CD=R1)
     */
    @Column(name = "R1_CD")
    private String r1Cd;

    /**
     * 직접관리용 회사코드명
     */
    @Column(name = "R1_CD_NM")
    private String r1CdNm;

    /**
     * 조직개편 부서 코드
     */
    @Column(name = "R2_CD")
    private String r2Cd;

    /**
     * 조직개편 부서 코드
     */
    @Column(name = "R2_CD_NM")
    private String r2CdNm;

    /**
     * 조직개편 실/국 코드
     */
    @Column(name = "R3_CD")
    private String r3Cd;

    /**
     * 조직개편 실/국 코드
     */
    @Column(name = "R3_CD_NM")
    private String r3CdNm;

    /**
     * 조직개편 팀 코드
     */
    @Column(name = "R4_CD")
    private String r4Cd;

    /**
     * 조직개편 팀 코드
     */
    @Column(name = "R4_CD_NM")
    private String r4CdNm;

    /**
     * 사용안함
     */
    @Column(name = "R5_CD")
    private String r5Cd;

    /**
     * 사용안함
     */
    @Column(name = "R6_CD")
    private String r6Cd;

    /**
     * 기자 일련번호
     */
    @Column(name = "JAM_REP_SEQ")
    private String jamRepSeq;

    /**
     * 대표부서 일련번호
     */
    @Column(name = "JAM_DEPT_SEQ")
    private String jamDeptSeq;

    /**
     * JAM 대표부서명
     */
    @Column(name = "JAM_DEPT_NM")
    private String jamDeptNm;

    /**
     * 필진 전문 분야
     */
    @Column(name = "REP_FIELD")
    private String repField;

    /**
     * JAM 회사 코드
     */
    @Column(name = "JAM_COM_CD")
    private String jamComCd;

    /**
     * JAM 회사 명
     */
    @Column(name = "JAM_COM_NM")
    private String jamComNm;

    /**
     * 기등록자
     */
    @Column(name = "REG_ID")
    private String regId;

    /**
     * 수정자
     */
    @Column(name = "MOD_ID")
    private String modId;

    /**
     * 기자한마디
     */
    @Column(name = "REP_TALK")
    private String repTalk;

    /**
     * 사용자한마디
     */
    @Column(name = "USER_TALK")
    private String userTalk;

    /**
     * 수정일시
     */
    @DTODateTimeFormat
    @ApiModelProperty(value = "수정일시", hidden = true)
    private Date modDt;
}
