package jmnet.moka.core.tps.mvc.jpod.dto;

import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * JPOD - 키워드
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class JpodKeywordDTO implements Serializable {

    public static final Type TYPE = new TypeReference<List<JpodKeywordDTO>>() {
    }.getType();

    private static final long serialVersionUID = 1L;

    /**
     * 출연진 일련번호
     */
    @ApiModelProperty(value = "출연진 일련번호", hidden = true)
    private Long seqNo;

    /**
     * 채널 SEQ
     */
    @ApiModelProperty(value = "채널 SEQ", hidden = true)
    private Long chnlSeq;

    /**
     * 에피소드SEQ
     */
    @ApiModelProperty(value = "에피소드SEQ", hidden = true)
    private Long epsdSeq;

    /**
     * 순서
     */
    @ApiModelProperty(value = "순서")
    private Integer ordNo = 1;


    /**
     * 키워드
     */
    @ApiModelProperty(value = "키워드")
    @NotEmpty(message = "{tps.jpod-episode.error.notempty.keyword}")
    @Size(max = 255, message = "{tps.jpod-episode.error.size.keyword}")
    private String keyword;

}
