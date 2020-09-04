package jmnet.moka.core.tps.mvc.user.entity;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


/**
 * The persistent class for the WMS_USER database table.
 * 
 */
@Entity
@Table(name = "WMS_USER")
@NamedQuery(name = "User.findAll", query = "SELECT u FROM User u")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class User implements Serializable {

    private static final long serialVersionUID = 4112556838310451422L;

    @Id
    @Column(name = "USER_ID")
    private String userId;

    @Column(name = "USER_NAME")
    private String userName;

    @Column(name = "PASSWORD")
    private String password;

    @Column(name = "DEPT_NO")
    private Integer deptNo;

    @Column(name = "POSITION")
    private String position;

    @Column(name = "EMAILADDRESS")
    private String emailaddress;

    @Column(name = "PHONE_NO")
    private String phoneNo;

    @Column(name = "CELL_PHONE_NO")
    private String cellPhoneNo;

    @Column(name = "WORK_YN", columnDefinition = "char")
    private String workYn;

    @Column(name = "USER_LEVEL")
    private String userLevel;

    @Column(name = "PHOTO")
    private String photo;

    @Column(name = "ALLOW_MEDIA_IDS")
    private String allowMediaIds;

    @Column(name = "CREATE_YMDT")
    private String createYmdt;

    @Column(name = "CREATOR")
    private String creator;

    @Column(name = "MODIFIED_YMDT")
    private String modifiedYmdt;

    @Column(name = "MODIFIER")
    private String modifier;



}
