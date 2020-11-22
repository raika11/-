package jmnet.moka.core.tps.mvc.desking.dto;

import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import javax.persistence.Column;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.code.EditStatusCode;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import jmnet.moka.core.tps.mvc.dataset.entity.Dataset;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;

/**
 * 데스킹 히스토리 DTO
 * 
 * @author jeon0525
 *
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class DeskingHistDTO implements Serializable {

    private static final long serialVersionUID = -5657517107362421109L;

    public static final Type TYPE = new TypeReference<List<DeskingHistDTO>>() {
    }.getType();

    /**
     * 히스토리일련번호
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "HIST_SEQ", nullable = false)
    private Long histSeq;

    /**
     * 화면편집SEQ
     */
    private Long deskingSeq;

    /**
     * 데이터셋SEQ
     */
    private Long datasetSeq;

    /**
     * 서비스기사아이디
     */
    private Long totalId;

    /**
     * 부모 서비스기사아이디
     */
    private Long parentTotalId;

    /**
     * 콘텐츠타입-R:기본/P:포토/M:동영상/W:포토동영상
     */
    private String contentType;

    /**
     * 기사타입
     */
    @Builder.Default
    private String artType = TpsConstants.DEFAULT_ART_TYPE;

    /**
     * 출처
     */
    private String sourceCode;


    /**
     * 콘텐트순서
     */
    @Builder.Default
    private Integer contentOrd = 1;

    /**
     * 관련순서
     */
    @Builder.Default
    private Integer relOrd = 1;

    /**
     * 언어(기타코드)
     */
    @Builder.Default
    private String lang = TpsConstants.DEFAULT_LANG;

    /**
     * 배부일시
     */
    @DTODateTimeFormat
    private Date distDt;

    /**
     * 제목
     */
    private String title;

    /**
     * 부제목
     */
    private String subTitle;

    /**
     * 어깨제목
     */
    private String nameplate;

    /**
     * 말머리
     */
    private String titlePrefix;

    /**
     * 발췌문
     */
    private String bodyHead;

    /**
     * 링크URL
     */
    private String linkUrl;

    /**
     * 링크TARGET
     */
    private String linkTarget;

    /**
     * 더보기URL
     */
    private String moreUrl;

    /**
     * 더보기TARGET
     */
    private String moreTarget;

    /**
     * 썸네일파일명
     */
    private String thumbFileName;

    /**
     * 썸네일용량
     */
    @Builder.Default
    private Integer thumbSize = 0;

    /**
     * 썸네일가로
     */
    @Builder.Default
    private Integer thumbWidth = 0;

    /**
     * 썸네일세로
     */
    @Builder.Default
    private Integer thumbHeight = 0;

    /**
     * 화면편집생성일시 : wms_desking.deskingDt == wms_desking_hist.deskingDt(편집시간)
     */
    @DTODateTimeFormat
    private Date deskingDt;

    /**
     * 생성자
     */
    private String regId;

    /**
     * 생성일시: 편집히스토리에 등록된 시간(전송시간) wms_desking.regDt == wms_desking_hist.regDt
     */
    @DTODateTimeFormat
    private Date regDt;

    /**
     * 상태 - SAVE(임시) / PUBLISH(전송)
     */
    private EditStatusCode status = EditStatusCode.SAVE;

    /**
     * 예약일시
     */
    @DTODateTimeFormat
    protected Date reserveDt;

    /**
     * 승인여부 예약일시가 설정되어 있을 경우 예약된 작업이 완료되면 Y로 처리
     */
    @Builder.Default
    protected String approvalYn = MokaConstants.NO;
}
