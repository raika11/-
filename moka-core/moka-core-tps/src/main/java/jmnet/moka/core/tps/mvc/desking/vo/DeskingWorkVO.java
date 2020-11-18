package jmnet.moka.core.tps.mvc.desking.vo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.Id;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

/**
 * 작업자 편집기사 정보
 *
 * @author ohtah
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@Alias("DeskingWorkVO")
public class DeskingWorkVO implements Serializable {

    private static final long serialVersionUID = -6662495708182386809L;

    public static final Type TYPE = new TypeReference<List<DeskingWorkVO>>() {
    }.getType();

    /**
     * 일련번호
     */
    @Id
    @Column(name = "SEQ", nullable = false)
    private Long seq;

    /**
     * 화면편집SEQ
     */
    @Column(name = "DESKING_SEQ")
    private Long deskingSeq;

    /**
     * 데이터셋SEQ
     */
    @Column(name = "DATASET_SEQ")
    private Long datasetSeq;

    /**
     * 서비스기사아이디
     */
    @Column(name = "TOTAL_ID")
    private Long totalId;

    /**
     * 부모 서비스기사아이디
     */
    @Column(name = "PARENT_TOTAL_ID")
    private Long parentTotalId;

    /**
     * 콘텐츠타입-R:기본/P:포토/M:동영상/W:포토동영상
     */
    @Column(name = "CONTENT_TYPE")
    private String contentType;

    /**
     * 기사타입
     */
    @Column(name = "ART_TYPE", columnDefinition = "char")
    private String artType;

    /**
     * 출처
     */
    @Column(name = "SOURCE_CODE")
    private String sourceCode;

    /**
     * 콘텐트순서
     */
    @Column(name = "CONTENT_ORD")
    private Integer contentOrd = 1;

    /**
     * 관련순서
     */
    @Column(name = "REL_ORD")
    private Integer relOrd = 1;

    /**
     * 임시저장여부
     */
    @Column(name = "SAVE_YN")
    private String saveYn = MokaConstants.NO;

    /**
     * 언어(기타코드)
     */
    @Column(name = "LANG")
    private String lang = TpsConstants.DEFAULT_LANG;

    /**
     * 배부일시
     */
    @DTODateTimeFormat
    @Column(name = "DIST_DT")
    private Date distDt;

    /**
     * 제목
     */
    @Column(name = "TITLE")
    private String title;

    /**
     * 모바일제목
     */
    @Column(name = "MOB_TITLE")
    private String mobTitle;

    /**
     * 부제목
     */
    @Column(name = "SUB_TITLE")
    private String subTitle;

    /**
     * 어깨제목
     */
    @Column(name = "NAMEPLATE")
    private String nameplate;

    /**
     * 말머리
     */
    @Column(name = "TITLE_PREFIX")
    private String titlePrefix;

    /**
     * 발췌문
     */
    @Column(name = "BODY_HEAD")
    private String bodyHead;

    /**
     * 링크URL
     */
    @Column(name = "LINK_URL")
    private String linkUrl;

    /**
     * 링크TARGET
     */
    @Column(name = "LINK_TARGET")
    private String linkTarget;

    /**
     * 더보기URL
     */
    @Column(name = "MORE_URL")
    private String moreUrl;

    /**
     * 더보기TARGET
     */
    @Column(name = "MORE_TARGET")
    private String moreTarget;

    /**
     * 썸네일파일명
     */
    @Column(name = "THUMB_FILE_NAME")
    private String thumbFileName;

    /**
     * 썸네일용량
     */
    @Column(name = "THUMB_SIZE", nullable = false)
    private Integer thumbSize = 0;

    /**
     * 썸네일가로
     */
    @Column(name = "THUMB_WIDTH", nullable = false)
    private Integer thumbWidth = 0;

    /**
     * 썸네일세로
     */
    @Column(name = "THUMB_HEIGHT", nullable = false)
    private Integer thumbHeight = 0;

    /**
     * 생성일시
     */
    @JsonIgnore
    @DTODateTimeFormat
    @Column(name = "REG_DT")
    private Date regDt;

    /**
     * 생성자
     */
    @JsonIgnore
    @Column(name = "REG_ID")
    private String regId;

    /**
     * 관련기사여부
     */
    private boolean rel;

    /**
     * 자식관련기사 목록
     */
    private List<Long> relSeqs;

    /**
     * 컴포넌트SEQ
     */
    private Long componentSeq;

    /**
     * 관련기사 추가
     *
     * @param relSeq 관련기사키
     */
    public void addRel(Long relSeq) {
        if (relSeq > 0) {
            if (relSeqs.contains(relSeq)) {
                return;
            } else {
                this.relSeqs.add(relSeq);
            }
        }
    }

}
