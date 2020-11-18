package jmnet.moka.core.tps.mvc.member.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.member.dto
 * ClassName : LoginLogDTO
 * Created : 2020-11-18 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-18 11:45
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@SuperBuilder
@JsonIgnoreProperties(ignoreUnknown = true)
public class LoginLogDTO {

    public static final Type TYPE = new TypeReference<List<LoginLogDTO>>() {
    }.getType();

    private Long seqNo;

    /**
     * IP주소
     */
    private String ip;

    /**
     * 성공여부
     */
    private String successYn;

    /**
     * 등록일시
     */
    @DTODateTimeFormat
    protected Date regDt;
}
