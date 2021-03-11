package jmnet.moka.web.push.mvc.sender.dto;

import io.swagger.annotations.ApiModelProperty;
import lombok.*;

import java.io.Serializable;

/**
 * <pre>
 * 푸시 전송 앱 정보
 * Project : moka
 * Package : jmnet.moka.web.push.mvc.sender.dto
 * ClassName : PushAppSearchDTO
 * Created : 2021-02-08 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-08 15:36
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class PushAppSearchDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 앱 일련번호
     */
    private Integer appSeq;
    /**
     * 관련 콘텐트ID
     */
    private Long relContentId;

    /**
     * Device OS (AND, iOS, PWA)
     */
    private String appOs;
    /**
     * 디바이스 구분 (T:Tablet, M:Mobile)
     */
    private String devDiv;

    /**
     * 앱 구분(J:중앙일보, M:미세먼지)
     */
    private String appDiv;
}
