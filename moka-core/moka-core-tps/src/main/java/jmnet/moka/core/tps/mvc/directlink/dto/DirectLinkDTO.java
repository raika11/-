package jmnet.moka.core.tps.mvc.directlink.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import lombok.*;

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
    @Size(min = 1, max = 5, message = "{tps.direct-link.error.pattern.linkSeq}")
    private String linkSeq;

    /**
     * 사용여부(Y:사용,N:미사용)
     */
    private String usedYn;

    /**
     * 노출고정(y:항상노출n:검색시만노출)
     */
    private String fixYn;

    /**
     * 링크타입(s:본창n:새창)
     */
    private String linkType;

    /**
     * 노출시작일
     */
    private String viewSdate;

    /**
     * 노출종료일
     */
    private String viewEdate;

    /**
     * 서비스제목
     */
    private String linkTitle;

    /**
     * 대표이미지
     */
    private String imgUrl;

    /**
     * 링크url
     */
    private String linkUrl;

    /**
     * 내용
     */
    private String linkContent;

    /**
     * 링크키워드
     */
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
