package jmnet.moka.core.tps.mvc.newsletter.entity;

import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import jmnet.moka.core.tps.common.entity.RegAudit;
import jmnet.moka.core.tps.mvc.member.entity.MemberSimpleInfo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.core.tps.mvc.newsletter.entity
 * ClassName : NewsletterSend
 * Created : 2021-04-16
 * </pre>
 *
 * @author stsoon
 * @since 2021-04-16 오후 3:33
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder(toBuilder = true)
@Entity
@Table(name = "TB_NEWSLETTER_SEND")
public class NewsletterSend extends RegAudit {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SEND_SEQ")
    private Long sendSeq;

    @Column(name = "LETTER_SEQ")
    private Long letterSeq;

    @Column(name = "ABTEST_YN")
    private String abtestYn;

    @Column(name = "AB_VARIANT_TYPE")
    private String abVariantType;

    @Column(name = "SEND_STATUS")
    private String sendStatus;

    @Column(name = "SENDER_NAME")
    private String senderName;

    @Column(name = "SENDER_NAME_B")
    private String senderNameB;

    @Column(name = "SENDER_EMAIL")
    private String senderEmail;

    @Column(name = "VIEW_YN")
    private String viewYn;

    @Column(name = "RESERVE_YN")
    private String reserveYn;

    @Column(name = "SEND_DT")
    private Date sendDt;

    @Column(name = "SEND_DT_B")
    private Date sendDtB;

    @Column(name = "SCB_LINK_YN")
    private String scbLinkYn;

    @Column(name = "CONTAINER_SEQ")
    private Long containerSeq;

    @Column(name = "CONTAINER_SEQ_B")
    private Long containerSeqB;

    @Column(name = "HEADER_IMG")
    private String headerImg;

    @Column(name = "PART_SEQ")
    private Long partSeq;

    @Column(name = "LETTER_TITLE")
    private String letterTitle;

    @Column(name = "LETTER_TITLE_B")
    private String letterTitleB;

    @Column(name = "LETTER_URL")
    private String letterUrl;

    @Column(name = "LETTER_BODY")
    private String letterBody;

    @Column(name = "LETTER_HTML")
    private String letterHtml;

    @ManyToOne
    @JoinColumn(name = "LETTER_SEQ", referencedColumnName = "LETTER_SEQ", nullable = false, insertable = false, updatable = false)
    private NewsletterInfo newsletterInfo;

    /**
     * 등록자
     */
    @NotFound(action = NotFoundAction.IGNORE)
    @ManyToOne(fetch = FetchType.EAGER, optional = true)
    @JoinColumn(name = "REG_ID", insertable = false, updatable = false)
    private MemberSimpleInfo regMember;
}
