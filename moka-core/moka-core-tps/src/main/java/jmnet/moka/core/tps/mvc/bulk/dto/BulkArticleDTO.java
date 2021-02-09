package jmnet.moka.core.tps.mvc.bulk.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

/**
 * <pre>
 * 벌크문구기사목록 DTO
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
@ApiModel("벌크 기사 DTO")
public class BulkArticleDTO implements Serializable {

    private static final long serialVersionUID = 3926910123722652118L;

    public static final Type TYPE = new TypeReference<List<BulkArticleDTO>>() {
    }.getType();

    /**
     * int   10,0    NO  클릭기사일련번호
     */
    @ApiModelProperty("클릭기사일련번호")
    @Min(value = 0, message = "{tps.bulk.error.min.bulkartSeq}")
    private Long bulkartSeq;

    /**
     * tinyint  3,0 ((1))   NO  순서
     */
    @ApiModelProperty("순서")
    @Min(value = 0, message = "{tps.bulk.error.min.ordNo}")
    private Long ordNo;

    /**
     * nvarchar 510 NO  제목
     */
    @ApiModelProperty("제목")
    @Length(max = 510, message = "{tps.bulk.error.length.title}")
    @NotNull(message = "{tps.bulk.error.notnull.title}")
    private String title;

    /**
     * varchar  500 NO  URL
     */
    @ApiModelProperty("URL")
    @NotNull(message = "{tps.bulk.error.notnull.url}")
    @Length(max = 510, message = "{tps.bulk.error.length.url}")
    private String url;

    /**
     * int  10,0    YES 서비스기사아이디
     */
    @ApiModelProperty("서비스기사아이디")
    @Min(value = 0, message = "{tps.bulk.error.min.totalId}")
    private Long totalId;

    /**
     * nvarchar 2 YES  심볼
     */
    @ApiModelProperty("심볼")
    //@Length(max = 2, message = "{tps.bulk.error.length.symbol}")
    private String symbol;

}
