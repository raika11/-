package jmnet.moka.core.tps.mvc.board.dto;

import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 게시물첨부파일
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@ApiModel("게시물 첨부파일 DTO")
public class BoardAttachDTO implements Serializable {

    public static final Type TYPE = new TypeReference<Set<BoardAttachDTO>>() {
    }.getType();

    private static final long serialVersionUID = 1L;

    /**
     * 일련번호
     */
    @ApiModelProperty(hidden = true)
    private Long seqNo;

    /**
     * 게시물일련번호
     */
    @ApiModelProperty(hidden = true)
    private Long boardSeq;

    /**
     * 게시판ID
     */
    @ApiModelProperty(hidden = true)
    private Integer boardId;

    /**
     * 원본파일명
     */
    @ApiModelProperty(hidden = true)
    private String orgFileName;

    /**
     * 파일명
     */
    @ApiModelProperty(hidden = true)
    private String fileName;

    /**
     * 파일경로
     */
    @ApiModelProperty(hidden = true)
    private String filePath;

    /**
     * 파일크기(KB)
     */
    @ApiModelProperty(hidden = true)
    @Builder.Default
    private Integer fileSize = 0;

    /**
     * 다운로드수
     */
    @ApiModelProperty(hidden = true)
    @Builder.Default
    private Integer downloadCnt = 0;
}
