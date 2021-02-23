package jmnet.moka.web.push.mvc.sender.entity;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 푸시 앱 토큰 정보
 */
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Table(name = "TB_PUSH_APP_TOKEN")
public class PushAppToken implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 토큰 일련번호
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "TOKEN_SEQ", nullable = false)
    private Long tokenSeq;

    /**
     *  앱 일련번호
     */
    @Column(name = "APP_SEQ")
    private Long appSeq;

    /**
     * 푸시 카운트
     */
    @Column(name = "BADGE")
    private Long badge;

    /**
     * 등록일시
     */
    @Column(name = "REG_DT")
    private Date regDt;

    /**
     * 수정일시
     */
    @Column(name = "MOD_DT")
    private Date modDt;

    /**
     * 회원 아이디
     */
    @Column(name = "MEM_ID")
    private String memId;


    /**
     * 푸시 토큰
     */
    @Column(name = "TOKEN")
    private String token;

}
