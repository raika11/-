package jmnet.moka.core.tps.mvc.newsletter.entity;

import java.io.Serializable;
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
 * ClassName : NewsletterExcel
 * Created : 2021-04-22 New
 * </pre>
 *
 * @author stsoon
 * @since 2021-04-22 오후 4:15
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder(toBuilder = true)
@Entity
@Table(name = "TB_NEWSLETTER_EXCEL")
public class NewsletterExcel implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SEQ")
    private Long seq;

    @Column(name = "SEND_SEQ")
    private Long sendSeq;

    @Column(name = "LETTER_SEQ")
    private Long letterSeq;

    @Column(name = "MEM_ID")
    private String memId;

    @Column(name = "MEM_NM")
    private String memNm;

    @Column(name = "MEM_SEQ")
    private Long memSeq;

    @Column(name = "EMAIL")
    private String email;
    
}
