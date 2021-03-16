package jmnet.moka.web.push.mvc.sender.entity;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * 푸시전송상태
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Embeddable
@ToString
@EqualsAndHashCode
public class PushContentsProcPK implements Serializable {

    /**
     * 콘텐트 일련번호
     */
    @Column(name = "CONTENT_SEQ", nullable = false)
    private Long contentSeq;


    /**
     * 앱 일련번호
     */
    @Column(name = "APP_SEQ", nullable = false)
    private Integer appSeq;

}
