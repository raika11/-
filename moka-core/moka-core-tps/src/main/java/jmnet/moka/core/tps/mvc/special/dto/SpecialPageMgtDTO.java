/*
 * Copyright (c) 2020. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package jmnet.moka.core.tps.mvc.special.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
import javax.validation.constraints.Pattern;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;
import org.springframework.web.multipart.MultipartFile;

/**
 * Description: 디지털스페셜 DTO
 *
 * @author ohtah
 * @since 2020. 12. 6.
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@ApiModel("디지털스페셜 DTO")
public class SpecialPageMgtDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    public static final Type TYPE = new TypeReference<List<SpecialPageMgtDTO>>() {
    }.getType();

    @ApiModelProperty("디지털스페셜 일련번호")
    @Min(value = 0, message = "{tps.specialPageMgt.error.min.seqNo}")
    private Long seqNo;

    @ApiModelProperty("사용여부(Y:사용, N:미사용)")
    @Pattern(regexp = "^[Y|N]?$", message = "{tps.specialPageMgt.error.pattern.usedYn}")
    @Builder.Default
    private String usedYn = MokaConstants.YES;

    @ApiModelProperty("회차")
    @NotNull(message = "{tps.specialPageMgt.error.notnull.ordinal}")
    @Min(value = 1, message = "{tps.specialPageMgt.error.min.ordinal}")
    @Builder.Default
    private Integer ordinal = 1;

    @ApiModelProperty("리스트여부")
    @Pattern(regexp = "^[Y|N]?$", message = "{tps.specialPageMgt.error.pattern.listYn}")
    @Builder.Default
    private String listYn = MokaConstants.YES;

    @ApiModelProperty("검색여부")
    @Pattern(regexp = "^[Y|N]?$", message = "{tps.specialPageMgt.error.pattern.schYn}")
    @Builder.Default
    private String schYn = MokaConstants.YES;

    @ApiModelProperty("검색키워드")
    @Length(max = 100, message = "{tps.specialPageMgt.error.length.schKwd}")
    private String schKwd;

    @ApiModelProperty("페이지 태그(TB_15RE_CODE_MGT GRP_CD = PAGE_CD 참조)")
    @NotNull(message = "{tps.specialPageMgt.error.notnull.pageCd}")
    private String pageCd;

    @ApiModelProperty("페이지 서비스 시작일(yyyyMMdd)")
    @Pattern(regexp = "^[0-9]{8}$", message = "{tps.specialPageMgt.error.pattern.pageSdate}")
    private String pageSdate;

    @ApiModelProperty("페이지 서비스 종료일(yyyyMMdd)")
    @Pattern(regexp = "^[0-9]{8}$", message = "{tps.specialPageMgt.error.pattern.pageEdate}")
    private String pageEdate;

    @ApiModelProperty("페이지 제목")
    @Length(max = 100, message = "{tps.specialPageMgt.error.length.pageTitle}")
    private String pageTitle;

    @ApiModelProperty("PC URL")
    @NotNull(message = "{tps.specialPageMgt.error.notnull.pcUrl}")
    @Length(max = 200, message = "{tps.specialPageMgt.error.length.pcUrl}")
    private String pcUrl;

    @ApiModelProperty("MOBILE URL")
    @NotNull(message = "{tps.specialPageMgt.error.notnull.mobUrl}")
    @Length(max = 200, message = "{tps.specialPageMgt.error.length.mobUrl}")
    private String mobUrl;

    @ApiModelProperty("개발 담당자")
    @Length(max = 30, message = "{tps.specialPageMgt.error.length.devName}")
    private String devName;

    @ApiModelProperty("개발 담당자 이메일")
    @Length(max = 512, message = "{tps.specialPageMgt.error.length.devEmail}")
    private String devEmail;

    @ApiModelProperty("개발 담당자 연락처")
    @Length(max = 512, message = "{tps.specialPageMgt.error.length.devPhone}")
    private String devPhone;

    @ApiModelProperty("부서명")
    @Length(max = 50, message = "{tps.specialPageMgt.error.length.repDeptName}")
    private String repDeptName;

    @ApiModelProperty("이미지URL")
    @Length(max = 200, message = "{tps.specialPageMgt.error.length.imgUrl}")
    private String imgUrl;

    @ApiModelProperty("페이지 설명")
    @Length(max = 1000, message = "{tps.specialPageMgt.error.length.pageDesc}")
    private String pageDesc;

    @ApiModelProperty("구글 AD센스태그")
    @Length(max = 100, message = "{tps.specialPageMgt.error.length.googleTag}")
    private String googleTag;

    @ApiModelProperty("조인스 DA 점태그")
    @Length(max = 100, message = "{tps.specialPageMgt.error.length.joinsadTag}")
    private String joinsadTag;

    @ApiModelProperty("조인스 DA 점태그-모바일")
    @Length(max = 100, message = "{tps.specialPageMgt.error.length.joinsadTagMob}")
    private String joinsadTagMob;

    @ApiModelProperty("등록일")
    @DTODateTimeFormat
    private Date regDt;

    @ApiModelProperty("등록자ID")
    private String regId;

    @ApiModelProperty("수정일")
    @DTODateTimeFormat
    private Date modDt;

    @ApiModelProperty("수정자ID")
    private String modId;

    @ApiModelProperty("이미지파일")
    @JsonIgnore
    private MultipartFile thumbnailFile;
}
