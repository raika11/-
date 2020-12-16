package jmnet.moka.core.tps.mvc.archive.dto;

import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.lang.reflect.Type;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.achive.vo
 * ClassName : PhotoArchiveVO
 * Created : 2020-11-23 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-23 17:55
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ApiModel("사진 아카이브 상세 조회 결과 DTO")
public class PhotoArchiveDetailDTO extends PhotoArchiveDTO {

    public static final Type TYPE = new TypeReference<List<PhotoArchiveDetailDTO>>() {
    }.getType();

    @ApiModelProperty("캡션")
    private String dc;

    @ApiModelProperty("태그")
    private String tag;

    @ApiModelProperty("출처 코드")
    private String originCd;

    @ApiModelProperty("사진메모")
    private String photoMemo;

    @ApiModelProperty("사진 DB 등록 여부")
    private String photoYn;

    @ApiModelProperty("등록일시")
    private String regDt;

    @ApiModelProperty("수정일시")
    private String modDt;

    @ApiModelProperty("등록자명")
    private String regNm;

    @ApiModelProperty("수정자")
    private String modifier;

    @ApiModelProperty("가로 ( 단위 : mm )")
    private String imageCtsWidth;

    @ApiModelProperty("세로 ( 단위 : mm )")
    private String imageCtsVrticl;

    @ApiModelProperty("엠바고")
    private String embargoDt;

    @ApiModelProperty("patTyCd")
    private String patTyCd;

}
