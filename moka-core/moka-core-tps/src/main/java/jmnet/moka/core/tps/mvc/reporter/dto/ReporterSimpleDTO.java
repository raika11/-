package jmnet.moka.core.tps.mvc.reporter.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import lombok.*;

import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;

/**
 * <pre>
 * 기자일련번호, 아이디, 소속, 이메일, 노출여부, url link
 * 2020. 11. 09. obiwan 최초생성
 * </pre>
 *
 * @since 2020. 11. 09. 오후 4:46:30
 * @author obiwan
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class ReporterSimpleDTO implements Serializable {

    private static final long serialVersionUID = -7979684085879328911L;

    public static final Type TYPE = new TypeReference<List<ReporterSimpleDTO>>() {}.getType();

    /**
     * 기자 일련번호 (1001부터 시작)
     */
    private String repSeq;

    /**
     * 사용여부(Y:사용,N:미사용)
     */
    private String usedYn;

    /**
     * 사용자 한마디 사용여부(Y:사용,N:미사용)
     */
    private String talkYn;

    /**
     * 기자명
     */
    private String repName;

    /**
     * 집배신 이메일
     */
    private String repEmail1;

    /**
     * JNET 이메일
     */
    private String repEmail2;

    /**
     * 기자 노출용 직책
     */
    private String repTitle;

    /**
     * 기자 연락처
     */
    private String repPhone;

    /**
     * 조인스ID
     */
    private String joinsId;

    /**
     * JNET아이디
     */
    private String jnetId;

    /**
     * 기자 프로필 사진
     */
    private String repPhoto;

    /**
     * 기자 프로필 사진_직접입력
     */
    private String repImg;

    /**
     * 트위터 주소
     */
    private String snsTw;

    /**
     * 페이스북 주소
     */
    private String snsFb;

    /**
     * 인스타그램 주소
     */
    private String snsIn;

    /**
     * 조인스 블로그 주소
     */
    private String joinsBlog;

    /**
     * 기자페이지 조회수
     */
    private String viewCnt;

    /**
     * 작성 기사수
     */
    private String artCnt;

    /**
     * 구독수
     */
    private String scbCnt;

    /**
     * 공유수
     */
    private String shrCnt;

    /**
     * 댓글수
     */
    private String replyCnt;

    /**
     * 필진타입 (J1:기자필진,J2:외부필진,J3:그룹필진,J0:필진해지)
     */
    private String jplusRepDiv;

    /**
     * 직업정보
     */
    private String jplusJobInfo;

    /**
     * 필진 제목
     */
    private String jplusTitle;

    /**
     * 기타 정보
     */
    private String jplusMemo;

    /**
     * 그룹필진 수정 권한
     */
    private String jplusProfileYn;

    /**
     * JPLUS 등록일
     */
    private String jplusRegDt;

    /**
     * JPLUS사용여부
     */
    private String jplusUsedYn;

    /**
     * 직접관리용 회사코드 (TB_15RE_CODE_MGT.GRP_CD=R1)
     */
    private String r1Cd;

    /**
     * 조직개편 부서 코드
     */
    private String r2Cd;

    /**
     * 조직개편 실/국 코드
     */
    private String r3Cd;

    /**
     * 조직개편 팀 코드
     */
    private String r4Cd;

    /**
     * 사용안함
     */
    private String r5Cd;

    /**
     * 사용안함
     */
    private String r6Cd;

    /**
     * 기자 일련번호
     */
    private String jamRepSeq;

    /**
     * 대표부서 일련번호
     */
    private String jamDeptSeq;

    /**
     * JAM 대표부서명
     */
    private String jamDeptNm;

    /**
     * 필진 전문 분야
     */
    private String repField;

    /**
     * JAM 회사 코드
     */
    private String jamComCd;

    /**
     * JAM 회사 명
     */
    private String jamComNm;

    /**
     * 등록일시
     */
    private String regDt;

    /**
     * 기등록자
     */
    private String regId;

    /**
     * 수정일시
     */
    private String modDt;

    /**
     * 수정자
     */
    private String modId;

    /**
     * 기자한마디
     */
    private String repTalk;

    /**
     * 사용자한마디
     */
    private String userTalk;
}

