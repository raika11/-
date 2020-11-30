package jmnet.moka.core.tps.mvc.naverbulk.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import lombok.*;
import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;

/**
 * <pre>
 * 네이버벌크문구기사목록 DTO
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
public class NaverBulkListDTO implements Serializable {

    private static final long serialVersionUID = 3926910123722652118L;

    public static final Type TYPE = new TypeReference<List<NaverBulkListDTO>>() {}.getType();

    /**
     * int   10,0    NO  클릭기사일련번호
     */
    @Min(value = 0, message = "{tps.naver-bulk.error.min.clickartSeq}")
    private Long clickartSeq;

    /**
     * tinyint  3,0 ((1))   NO  순서
     */
    //@NotNull(message = "{tps.naver-bulk.error.notnull.ordNo}")
    @Min(value = 0, message = "{tps.naver-bulk.error.min.ordNo}")
    private Long ordNo;

    /**
     * nvarchar 510 NO  제목
     */
    @Length(max = 510, message = "{tps.naver-bulk.error.length.title}")
    @NotNull(message = "{tps.naver-bulk.error.notnull.title}")
    private String title;

    /**
     * varchar  500 NO  URL
     */
    @NotNull(message = "{tps.naver-bulk.error.notnull.url}")
    @Length(max = 510, message = "{tps.naver-bulk.error.length.url}")
    //@Pattern(regexp = "/^(((http(s?))\\:\\/\\/)?)([0-9a-zA-Z\\-]+\\.)+[a-zA-Z]{2,6}(\\:[0-9]+)?(\\/\\S*)?$/", message = "{tps.naver-bulk.error.pattern.url}")
    private String url;

    /**
     * int  10,0    YES 서비스기사아이디
     */
    @Min(value = 0, message = "{tps.naver-bulk.error.min.totalId}")
    private Long totalId;

}
