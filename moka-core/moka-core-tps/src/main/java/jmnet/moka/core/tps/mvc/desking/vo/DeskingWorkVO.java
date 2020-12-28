package jmnet.moka.core.tps.mvc.desking.vo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;
import javax.persistence.Column;
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
@ApiModel("편집기사워크 VO")
public class DeskingWorkVO implements Serializable {

    private static final long serialVersionUID = -6662495708182386809L;

    public static final Type TYPE = new TypeReference<List<DeskingWorkVO>>() {
    }.getType();

    @ApiModelProperty("편집기사워크 일련번호")
    @Column(name = "SEQ", nullable = false)
    private Long seq;

    @ApiModelProperty("화면편집SEQ")
    @Column(name = "DESKING_SEQ")
    private Long deskingSeq;

    @ApiModelProperty("데이터셋SEQ")
    @Column(name = "DATASET_SEQ")
    private Long datasetSeq;

    @ApiModelProperty("서비스기사아이디")
    @Column(name = "CONTENT_ID")
    private String contentId;

    @ApiModelProperty("부모 서비스기사아이디. 있을경우 관련기사")
    @Column(name = "PARENT_CONTENT_ID")
    private String parentContentId;

    @ApiModelProperty("콘텐츠타입-R:기본/P:포토/M:동영상/W:포토동영상")
    @Column(name = "CONTENT_TYPE")
    private String contentType;

    @ApiModelProperty("기사타입")
    @Column(name = "ART_TYPE")
    @Builder.Default
    private String artType = TpsConstants.DEFAULT_ART_TYPE;

    @ApiModelProperty("매체코드")
    @Column(name = "SOURCE_CODE")
    private String sourceCode;

    @ApiModelProperty("콘텐트순서")
    @Column(name = "CONTENT_ORD")
    @Builder.Default
    private Integer contentOrd = 1;

    @ApiModelProperty("관련순서")
    @Column(name = "REL_ORD")
    @Builder.Default
    private Integer relOrd = 1;

    @ApiModelProperty("언어(기타코드)")
    @Column(name = "LANG")
    @Builder.Default
    private String lang = TpsConstants.DEFAULT_LANG;

    @ApiModelProperty("배부일시")
    @DTODateTimeFormat
    @Column(name = "DIST_DT")
    private Date distDt;

    @ApiModelProperty("제목")
    @Column(name = "TITLE")
    private String title;

    @ApiModelProperty("제목/부제목 위치")
    @Column(name = "TITLE_LOC")
    private String titleLoc;

    @ApiModelProperty("제목크기")
    @Column(name = "TITLE_SIZE")
    private String titleSize;

    @ApiModelProperty("부제목")
    @Column(name = "SUB_TITLE")
    private String subTitle;

    @ApiModelProperty("Box 제목")
    @Column(name = "NAMEPLATE")
    private String nameplate;

    @ApiModelProperty("Box Url")
    @Column(name = "NAMEPLATE_URL")
    private String nameplateUrl;

    @ApiModelProperty("Box target")
    @Column(name = "NAMEPLATE_TARGET")
    private String nameplateTarget;

    @ApiModelProperty("말머리")
    @Column(name = "TITLE_PREFIX")
    private String titlePrefix;

    @ApiModelProperty("말머리 위치")
    @Column(name = "TITLE_PREFIX_LOC")
    private String titlePrefixLoc;

    @ApiModelProperty("발췌문")
    @Column(name = "BODY_HEAD")
    private String bodyHead;

    @ApiModelProperty("링크URL")
    @Column(name = "LINK_URL")
    private String linkUrl;

    @ApiModelProperty("링크TARGET")
    @Column(name = "LINK_TARGET")
    private String linkTarget;

    @ApiModelProperty("썸네일파일명")
    @Column(name = "THUMB_FILE_NAME")
    private String thumbFileName;

    @ApiModelProperty("썸네일용량")
    @Column(name = "THUMB_SIZE", nullable = false)
    @Builder.Default
    private Integer thumbSize = 0;

    @ApiModelProperty("썸네일가로")
    @Column(name = "THUMB_WIDTH", nullable = false)
    @Builder.Default
    private Integer thumbWidth = 0;

    @ApiModelProperty("썸네일세로")
    @Column(name = "THUMB_HEIGHT", nullable = false)
    @Builder.Default
    private Integer thumbHeight = 0;

    @ApiModelProperty("생성일시")
    @DTODateTimeFormat
    @Column(name = "REG_DT")
    private Date regDt;

    @ApiModelProperty("생성자")
    @JsonIgnore
    @Column(name = "REG_ID")
    private String regId;

    @ApiModelProperty("영상URL")
    @Column(name = "VOD_URL")
    private String vodUrl;

    @ApiModelProperty("아이콘파일명")
    @Column(name = "ICON_FILE_NAME")
    private String iconFileName;

    @ApiModelProperty("관련기사여부")
    @Builder.Default
    private boolean rel = false;

    @ApiModelProperty("자식관련기사 목록")
    private List<Long> relSeqs;

    @ApiModelProperty("컴포넌트SEQ")
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
