package jmnet.moka.core.tps.mvc.editlog.dto;

import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 로그관리 검색 DTO
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@ApiModel("로그관리 검색 DTO")
public class EditLogSearchDTO extends SearchDTO {

    private static final long serialVersionUID = 1L;

    public static final Type TYPE = new TypeReference<List<EditLogSearchDTO>>() {
    }.getType();

    /**
     * 성공여부
     */
    @ApiModelProperty(value = "SUCCESS_YN")
    private String successYn;

    /**
     * 입력수정삭제/로그인/로그아웃
     */
    private ActionType action;

    /**
     * 등록일시
     */
    @ApiModelProperty(value = "검색일자 - 시작")
    @DTODateTimeFormat
    private Date startDt;

    /**
     * 메뉴코드
     */
    @ApiModelProperty(value = "검색일자 - 종료")
    @DTODateTimeFormat
    private Date endDt;


}
