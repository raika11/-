package jmnet.moka.core.tps.mvc.member.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
public class MemberSimpleInfo {

    private static final long serialVersionUID = 1L;

    /**
     * 사용자ID
     */
    @Id
    @Column(name = "MEM_ID", nullable = false, insertable = false, updatable = false)
    private String memberId;

    /**
     * 사용자명
     */
    @Column(name = "MEM_NM", nullable = false, insertable = false, updatable = false)
    private String memberNm;
}
