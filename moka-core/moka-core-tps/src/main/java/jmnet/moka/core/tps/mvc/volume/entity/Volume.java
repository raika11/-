package jmnet.moka.core.tps.mvc.volume.entity;

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
 * The persistent class for the WMS_VOLUME database table.
 * 
 */
@Entity
@Table(name = "WMS_VOLUME")
@NamedQuery(name = "Volume.findAll", query = "SELECT v FROM Volume v")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class Volume implements Serializable {

    private static final long serialVersionUID = 3466180693312686971L;

    @Id
    @Column(name = "VOLUME_ID", columnDefinition = "char")
    private String volumeId;

    @Column(name = "CREATE_YMDT")
    private String createYmdt;

    @Column(name = "CREATOR")
    private String creator;

    @Column(name = "LANG")
    private String lang;

    @Column(name = "MODIFIED_YMDT")
    private String modifiedYmdt;

    @Column(name = "MODIFIER")
    private String modifier;

    @Column(name = "VOLUME_NAME")
    private String volumeName;

    @Column(name = "VOLUME_PATH")
    private String volumePath;

    @Column(name = "VOLUME_SOURCE")
    private String volumeSource;
}
