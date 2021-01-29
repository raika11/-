package jmnet.moka.core.tps.mvc.schedule.server.entity;

import lombok.*;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * CMS 사용자
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "TB_CMS_MEM")
public class Member {

    private static final long serialVersionUID = 1L;

    /**
     * 사용자ID
     */
    @Id
    @Column(name = "MEM_ID")
    private String memberId;

    /**
     * 사용자명
     */
    @Column(name = "MEM_NM")
    private String memberNm;
}
