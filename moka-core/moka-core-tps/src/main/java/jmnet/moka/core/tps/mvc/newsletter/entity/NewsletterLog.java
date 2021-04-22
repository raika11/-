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
 * ClassName : NewsletterLog
 * Created : 2021-04-16
 * </pre>
 *
 * @author stsoon
 * @since 2021-04-16 오후 3:44
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "TB_NEWSLETTER_LOG")
public class NewsletterLog implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SEQ")
    private Long seq;

    @Column(name = "CHANNEL_TYPE")
    private String channelType;

    @Column(name = "CHANNEL_ID")
    private Long channelId;

    @Column(name = "CHANNEL_DATA_ID")
    private Long channelDataId;

    @Column(name = "CHANNEL_SEND_ID")
    private Long channelSendId;

    @Column(name = "MAIL_START_ID")
    private Long mailStartId;

    @Column(name = "MAIL_END_ID")
    private Long mailEndId;

    @Column(name = "SUBSCRIBE_COUNT")
    private Long subscribeCount;

    @Column(name = "SEND_COUNT")
    private Long sendCount;

    @Column(name = "OPEN_COUNT")
    private Long openCount;

    @Column(name = "CLICK_COUNT")
    private Long clickCount;

    @Column(name = "SEND_DT")
    private Date sendDt;

    //    @Column(name = "LETTER_SEQ")
    //    private Long letterSeq;

    //    @JsonIgnore
    //    @ManyToOne
    //    @JoinColumn(name = "LETTER_SEQ", referencedColumnName = "LETTER_SEQ", nullable = false)
    //    private NewsletterInfo newsletterInfo;
}
