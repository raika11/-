package jmnet.moka.core.tps.mvc.directlink.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import lombok.*;
import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;

/**
 * <pre>
 * 사이트바로가기 DTO
 * 2020. 11. 16. obiwan 최초생성
 * </pre>
 *
 * @author obiwan
 * @since 2020. 11. 16. 오후 1:32:16
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class DirectLinkDTO implements Serializable {

    private static final long serialVersionUID = 3926910123722632118L;

    public static final Type TYPE = new TypeReference<List<DirectLinkDTO>>() {
    }.getType();

    /**
     * 링크일련번호
     */
    @Min(value = 0, message = "{tps.direct-link.error.pattern.linkSeq}")
    //@Size(min = 1, max = 5, message = "{tps.direct-link.error.pattern.linkSeq}")
    private Long linkSeq;

    /**
     * 사용여부(Y:사용,N:미사용)
     */
    @NotNull(message = "{tps.direct-link.notnull.usedYn}")
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.direct-link.pattern.usedYn}")
    @Builder.Default
    private String usedYn = MokaConstants.YES;

    /**
     * 노출고정(y:항상노출n:검색시만노출)
     */
    @NotNull(message = "{tps.direct-link.error.notnull.fixYn}")
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.direct-link.notnull.fixYn}")
    @Builder.Default
    private String fixYn = MokaConstants.YES;

    /**
     * 링크타입(s:본창n:새창)
     */
    @NotNull(message = "{tps.direct-link.notnull.usedYn}")
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.direct-link.pattern.fixYn}")
    @Builder.Default
    private String linkType = MokaConstants.YES;

    /**
     * 노출시작일
     */
    @Length(max = 10, message = "{tps.direct-link.error.viewSDate}")
    private String viewSdate;

    /**
     * 노출종료일
     */
    @Length(max = 10, message = "{tps.direct-link.error.viewEDate}")
    private String viewEdate;

    /**
     * 서비스제목
     */
    @NotNull(message = "{tps.direct-link.error.notnull.linkTitle}")
    @Length(min = 1, max = 100, message = "{tps.direct-link.error.length.linkTitle}")
    private String linkTitle;

    /**
     * 대표이미지
     */
//    @NotNull(message = "{tps.page.error.notnull.linkUrl}") // 일시적으로 막음. 수정할때만 필요하다.
//    @Pattern(regexp = MokaConstants.PAGE_SERVICE_URL_PATTERN, message = "{tps.page.error.pattern.linkUrl}")
    private String imgUrl = "https://pds.joins.com/news/search_direct_link/001.jpg";

    /**
     * 링크url
     */
    @NotNull(message = "{tps.direct-link.error.notnull.linkUrl}")
    @Pattern(regexp = MokaConstants.PAGE_SERVICE_URL_PATTERN, message = "{tps.direct-link.error.pattern.linkUrl}")
    @Length(min = 1, max = 200, message = "{tps.direct-link.error.length.linkUrl}")
    private String linkUrl;

    /**
     * 내용
     */
    @NotNull(message = "{tps.direct-link.error.notnull.linkContent}")
    @Length(min = 1, max = 500, message = "{tps.direct-link.error.length.linkContent}")
    private String linkContent;

    /**
     * 링크키워드
     */
    @NotNull(message = "{tps.direct-link.error.notnull.linkKwd}")
    @Length(min = 1, max = 100, message = "{tps.direct-link.error.length.linkKwd}")
    private String linkKwd;


    /**
     * 등록일자
     */
    @DTODateTimeFormat
    private Date regDt;

    /**
     * 등록자아이디
     */
    private String regId;

    /**
     * 수정일자
     */
    @DTODateTimeFormat
    private Date modDt;

    /**
     * 수정자아이디
     */
    private String modId;


}
