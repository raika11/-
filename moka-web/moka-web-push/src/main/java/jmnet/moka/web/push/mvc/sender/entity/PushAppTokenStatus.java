package jmnet.moka.web.push.mvc.sender.entity;

import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 푸시 앱 토큰 정보
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class PushAppTokenStatus implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long lastTokenSeq;

    private Long firstTokenSeq;

    private Long totalCount;

}
