package jmnet.moka.core.tps.mvc.poll.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import java.util.Date;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

/**
 * 투표항목
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@ApiModel("투표항목정보")
public class TrendpollItemDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 항목일련번호
     */
    @ApiModelProperty(value = "항목일련번호", hidden = true)
    private Long itemSeq;

    /**
     * 투표일련번호
     */
    @ApiModelProperty(value = "투표일련번호", hidden = true)
    private Long pollSeq;

    /**
     * 순서
     */
    @ApiModelProperty(value = "순서", hidden = true)
    private Integer ordNo = 1;

    /**
     * 항목별 응모수
     */
    @ApiModelProperty(value = "항목별 응모수", hidden = true)
    private Integer voteCnt = 0;

    /**
     * 등록일시
     */
    @ApiModelProperty(value = "등록일시", hidden = true)
    @DTODateTimeFormat
    @Builder.Default
    private Date regDt = new Date();

    /**
     * 이미지명
     */
    @ApiModelProperty(value = "이미지URL")
    private String imgUrl;

    /**
     * 링크URL
     */
    @ApiModelProperty(value = "링크URL")
    private String linkUrl;

    /**
     * 제목
     */
    @ApiModelProperty(value = "제목")
    private String title;

    @ApiModelProperty("이미지파일")
    @JsonIgnore
    private MultipartFile imgFile;
}
