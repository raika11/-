package jmnet.moka.core.tps.mvc.board.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

/**
 * 게시물첨부파일
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@ApiModel("게시물 수정 첨부파일 DTO")
public class BoardAttachSaveDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 일련번호
     */
    @ApiModelProperty("첨부파일 일련번호, 신규 파일이면 0")
    private Long seqNo;

    @ApiModelProperty("첨부파일 - 파일을 변경했거나, 신규 파일인 경우에만 입력")
    private MultipartFile attachFile;

}
