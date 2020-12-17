package jmnet.moka.core.tps.mvc.board.dto;

import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.lang.reflect.Type;
import java.util.List;
import java.util.Set;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.mvc.member.dto.MemberSimpleDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.board.dto
 * ClassName : BoardDTO
 * Created : 2020-12-17 ince
 * </pre>
 *
 * @author ince
 * @since 2020-12-17 12:03
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@ApiModel("게시물 DTO")
public class BoardDTO {
    public static final Type TYPE = new TypeReference<List<BoardDTO>>() {
    }.getType();

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
     * 부모게시물일련번호
     */
    @ApiModelProperty("부모게시물일련번호")
    private Long parentBoardSeq;

    /**
     * 채널타입(예:JPOD)
     */
    @ApiModelProperty("채널타입(예:JPOD)")
    private String channelType;

    /**
     * 채널ID(예:JPOD 채널SEQ)
     */
    @ApiModelProperty("채널ID(예:JPOD 채널SEQ)")
    private Long channelId = 0l;

    /**
     * 말머리1
     */
    @ApiModelProperty("말머리1")
    private String titlePrefix1;

    /**
     * 말머리2
     */
    @ApiModelProperty("말머리2")
    private String titlePrefix2;

    /**
     * 제목
     */
    @ApiModelProperty("제목")
    private String title;

    /**
     * 등록자명
     */
    @ApiModelProperty("등록자명")
    private String regName;

    /**
     * 뎁스
     */
    @ApiModelProperty(hidden = true)
    @Builder.Default
    private Integer depth = 0;

    /**
     * 들여쓰기
     */
    @ApiModelProperty("들여쓰기")
    @Builder.Default
    private Integer indent = 0;

    /**
     * 1:일반 9:공지
     */
    @ApiModelProperty("1:일반 9:공지")
    @Builder.Default
    private Integer ordNo = 1;

    /**
     * 조회수
     */
    @ApiModelProperty("조회수")
    @Builder.Default
    private Integer viewCnt = 0;

    /**
     * 추천수
     */
    @ApiModelProperty("추천수")
    @Builder.Default
    private Integer recomCnt = 0;

    /**
     * 비추천수
     */
    @ApiModelProperty("비추천수")
    @Builder.Default
    private Integer decomCnt = 0;

    /**
     * 신고수
     */
    @ApiModelProperty("신고수")
    @Builder.Default
    private Integer declareCnt = 0;

    /**
     * 삭제여부
     */
    @ApiModelProperty("삭제여부")
    @Builder.Default
    private String delYn = MokaConstants.NO;

    /**
     * 내용
     */
    @ApiModelProperty("내용")
    private String content;

    /**
     * 회원ID
     */
    @ApiModelProperty("회원ID")
    private String memId;

    /**
     * 비밀번호
     */
    @ApiModelProperty("비밀번호")
    private String pwd;

    /**
     * 등록IP주소
     */
    @ApiModelProperty(hidden = true)
    private String regIp;

    /**
     * 그룹정보
     */
    @ApiModelProperty(hidden = true)
    private BoardInfoDTO boardInfo;

    /**
     * 첨부파일
     */
    @ApiModelProperty(hidden = true)
    private Set<BoardAttachDTO> attaches;

    /**
     * 등록자
     */
    @ApiModelProperty(hidden = true)
    private MemberSimpleDTO regMember;
}