package jmnet.moka.core.tps.mvc.media.entity;

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
 * The persistent class for the WMS_MEDIA database table.
 * 
 */
@Entity
@Table(name = "WMS_MEDIA")
@NamedQuery(name = "Media.findAll", query = "SELECT m FROM Media m")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class Media implements Serializable {

    private static final long serialVersionUID = 3822183557164959389L;

    @Id
    @Column(name = "MEDIA_ID", columnDefinition = "char")
    private String mediaId;

    @Column(name = "MEDIA_NAME")
    private String mediaName;

    @Column(name = "MEDIA_TYPE", columnDefinition = "char")
    private String mediaType;

    @Column(name = "PARENT_MEDIA_ID", columnDefinition = "char")
    private String parentMediaId;

    @Column(name = "SITE_ID")
    private String siteId;

    @Column(name = "DESCRIPTION")
    private String description;

    @Column(name = "CREATE_YMDT")
    private String createYmdt;

    @Column(name = "CREATOR")
    private String creator;

    @Column(name = "MODIFIED_YMDT")
    private String modifiedYmdt;

    @Column(name = "MODIFIER")
    private String modifier;

}
