package jmnet.moka.core.tps.mvc.comment.entity;

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

@Entity
@Table(name = "TB_CMT_URL")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class CommentUrl implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "URL_SEQ", nullable = false)
    private Integer urlSeq;

    @Column(name = "DOMAIN", nullable = false)
    private String domain;

    @Column(name = "SECTION", nullable = false)
    private String section;

    @Column(name = "GROUP_ID")
    private Integer urlGrp = 1;

}
