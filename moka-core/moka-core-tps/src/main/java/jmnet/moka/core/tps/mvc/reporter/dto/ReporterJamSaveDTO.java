package jmnet.moka.core.tps.mvc.reporter.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * <pre>
 * JAM 기자정보 연동 DTO
 * 2021. 04. 12.   최초생성
 * </pre>
 *
 * @author
 * @since 2021. 04. 12. 오후 4:46:30
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@ApiModel("기자 수정 DTO")
public class ReporterJamSaveDTO implements Serializable {

    private static final long serialVersionUID = -7979684085879328911L;

    public static final Type TYPE = new TypeReference<List<ReporterJamSaveDTO>>() {
    }.getType();

    /**
     * 기자 일련번호 (1001부터 시작)
     */
    @NotNull(message = "{tps.reporterMsg.error.notnull.repSeq}")
    @Min(value = 0, message = "{tps.columnist.error.pattern.repSeq}")
    private Integer repSeq;

    /**
     * 사용여부(Y:사용,N:미사용)
     */
    @ApiModelProperty("사용여부(Y:사용,N:미사용)")
    private String usedYn;

    /**
     * 사용자 한마디 사용여부(Y:사용,N:미사용)
     */
    @ApiModelProperty("사용자 한마디 사용여부(Y:사용,N:미사용)")
    private String talkYn;

    /**
     * 기자명
     */
    @ApiModelProperty("기자명")
    private String repName;

    /**
     * 집배신 이메일
     */
    @ApiModelProperty("집배신 이메일")
    private String repEmail1;

    /**
     * JNET 이메일
     */
    @ApiModelProperty("JNET 이메일")
    private String repEmail2;

    /**
     * 기자 노출용 직책
     */
    @ApiModelProperty("기자 노출용 직책")
    private String repTitle;

    /**
     * 기자 연락처
     */
    @ApiModelProperty("기자 연락처")
    private String repPhone;

    /**
     * 조인스ID
     */
    @ApiModelProperty("조인스ID")
    private String joinsId;

    /**
     * JNET아이디
     */
    @ApiModelProperty("JNET아이디")
    private String jnetId;

    /**
     * 기자 프로필 사진
     */
    @ApiModelProperty("기자 프로필 사진")
    private String repPhoto;

    /**
     * 기자한마디
     */
    @ApiModelProperty("기자한마디")
    private String repTalk;

    /**
     * 트위터 주소
     */
    @ApiModelProperty("트위터 주소")
    private String snsTw;

    /**
     * 페이스북 주소
     */
    @ApiModelProperty("페이스북 주소")
    private String snsFb;

    /**
     * 인스타그램 주소
     */
    @ApiModelProperty("인스타그램 주소")
    private String snsIn;

    /**
     * 조인스 블로그 주소
     */
    @ApiModelProperty("조인스 블로그 주소")
    private String joinsBlog;

    /**
     * 등록자
     */
    @ApiModelProperty("등록자")
    private String regId;

    /**
     * 등록일시
     */
    @ApiModelProperty("등록일시")
    private Date regDt;

    /**
     * 수정자
     */
    @ApiModelProperty("수정자")
    private String modId;

    /**
     * 수정일시
     */
    @ApiModelProperty("수정일시")
    private Date modDt;

    /**
     * 기자 일련번호
     */
    @ApiModelProperty("JAM 기자 일련번호")
    private Integer jamRepSeq;

    /**
     * 대표부서 일련번호 : jamDeptSeq
     */
    @ApiModelProperty("JAM 대표부서 일련번호")
    private Integer jamPartSeq;

    /**
     * JAM 대표부서명 : jamDeptNm
     */
    @ApiModelProperty("JAM 대표부서명")
    private String jamDepartNm;

    /**
     * 보안 MD5 (jcms기자번호 + jam기자번호+ yyyymmdd)  해쉬 값
     */
    @ApiModelProperty("보안 MD5 해쉬 값")
    private String hash;

    /**
     * 필진타입 (J1:기자필진,J2:외부필진,J3:그룹필진,J0:필진해지) : jplusRepDiv
     */
    @ApiModelProperty("필진타입 (J1:기자필진,J2:외부필진,J3:그룹필진,J0:필진해지)")
    private String typeCode;

    /**
     * 필진 전문 분야 : repField
     */
    @ApiModelProperty("필진 전문 분야")
    private String typeSecs;

    /**
     * JAM 회사 코드 : jamComCd
     */
    @ApiModelProperty("JAM 회사 코드")
    private String siteCd;

    /**
     * JAM 회사 명 : jamComNm
     */
    @ApiModelProperty("JAM 회사 명")
    private String siteName;
}

