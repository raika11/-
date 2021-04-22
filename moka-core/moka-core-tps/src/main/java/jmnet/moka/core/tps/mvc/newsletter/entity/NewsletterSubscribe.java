package jmnet.moka.core.tps.mvc.newsletter.entity;

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
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.core.tps.mvc.newsletter.entity
 * ClassName : NewsletterSubscribe
 * Created : 2021-04-16
 * </pre>
 *
 * @author stsoon
 * @since 2021-04-16 오후 4:03
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "TB_NEWSLETTER_SUBSCRIBE")
public class NewsletterSubscribe implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SEQ")
    private Long seq;

    @Column(name = "CHANNEL_TYPE")
    private String channelType;

    @Column(name = "CHANNEL_ID")
    private Long channelId;

    @Column(name = "USED_YN")
    private String usedYn;

    @Column(name = "EMAIL")
    private String email;

    @Column(name = "REG_DT")
    private Date regDt;

    @Column(name = "CANCEL_DT")
    private Date cancelDt;

    @Column(name = "CERT_DT")
    private Date certDt;

    @Column(name = "MEM_ID")
    private String memId;

    @Column(name = "MEM_SEQ")
    private Long memSeq;

    @Column(name = "LOGIN_TYPE")
    private String loginType;

    //    @Column(name = "LETTER_SEQ")
    //    private Long letterSeq;

    //    @JsonIgnore
    //    @ManyToOne
    //    @JoinColumn(name = "LETTER_SEQ", referencedColumnName = "LETTER_SEQ", nullable = false)
    //    private NewsletterInfo newsletterInfo;

}
