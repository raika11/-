package jmnet.moka.core.tps.mvc.columnist.entity;

import jmnet.moka.core.tps.common.entity.BaseAudit;
import lombok.*;
import javax.persistence.*;



/**
 * The persistent class for the TB_15RE_DIRECT_LINK table.
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "TB_COLUMNIST")
@NamedQuery(name = "Columnist.findAll", query = "SELECT d FROM Columnist d")
public class Columnist extends BaseAudit {

    private static final long serialVersionUID = -6113879324816610973L;

    /**
     * int	10,0 NO	일련번호
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SEQ_NO")
    private Long seqNo;

    /**
     * char	1   ('O')   NO	내외부구분(I내부,O외부)
     */
    @Column(name = "INOUT", length = 1)
    private String inout;

    /**
     * char	1   ('N')	NO	상태(유효/정지)
     */
    @Column(name = "STATUS", length = 1)
    private String status;

    /**
     * int	10,0((0))   NO	기자일련번호
     */
    @Column(name = "REP_SEQ")
    private Long repSeq;

    /**
     * nvarchar	30		NO	칼럼니스트이름
     */
    @Column(name = "COLUMNIST_NM", nullable = false, length = 30)
    private String columnistNm;

    /**
     * varchar	512		YES	이메일
     */
    @Column(name = "EMAIL", length = 512)
    private String email;

    /**
     * nvarchar	200			YES	직책
     */
    @Column(name = "POSITION", length = 200)
    private String position;

    /**
     * varchar	200			YES	프로필사진
     */
    @Column(name = "PROFILE_PHOTO", length = 200)
    private String profilePhoto;

    /**
     * nvarchar	500			YES	프로필
     */
    @Column(name = "PROFILE", length = 500)
    private String profile;


    @PrePersist
    @PreUpdate
    public void prePersist() {
        this.inout = this.inout == null ? "O" : this.inout;
        this.status = this.status == null ? "N" : this.status;
    }
}



