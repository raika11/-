package jmnet.moka.core.tps.mvc.pkg.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;


/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.core.tps.mvc.packagae.dto
 * ClassName : PackageSearchDTO
 * Created : 2021-03-19 New
 * </pre>
 *
 * @author stsoon
 * @since 2021-03-19 오전 11:40
 */
@AllArgsConstructor
@Getter
@Setter
@ToString
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(Include.NON_NULL)
@ApiModel("패키지 검색 DTO")
public class PackageSearchDTO extends SearchDTO {

    public static final Type TYPE = new TypeReference<List<PackageSearchDTO>>() {
    }.getType();

    @ApiModelProperty("카테고리. 구분자 ,")
    private String catList;

    @ApiModelProperty("사용여부")
    private String userYn;

    @ApiModelProperty("패키지 유형")
    private String pkgDiv;

    @ApiModelProperty("검색 시작일자(필수)")
    //    @NotNull(message = "{tps.rcv-article.error.notnull.startDay}")
    @DTODateTimeFormat
    private Date startDay;

    @ApiModelProperty("검색 종료일자(필수)")
    //    @NotNull(message = "{tps.rcv-article.error.notnull.endDay}")
    @DTODateTimeFormat
    private Date endDay;

    @ApiModelProperty("검색어")
    private String keyword;

    //    @ApiModelProperty("SEQ의 유형 (PG:페이지, AP: 기사페이지, TP:템플릿, CT:컨테이너)")
    //    @Pattern(regexp = "^(PG)|(AP)|(CT)|(TP)|()$", message = "{tps.history.error.pattern.seqType}")
    //    private String seqType;

    @ApiModelProperty("구독 가능 여부")
    private String scbYn;

    public PackageSearchDTO() {
        super("regDt,desc");
        setSize(20);
    }
}
