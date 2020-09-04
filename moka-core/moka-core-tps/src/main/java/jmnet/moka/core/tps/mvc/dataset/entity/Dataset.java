package jmnet.moka.core.tps.mvc.dataset.entity;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


/**
 * The persistent class for the WMS_DATASET database table.
 * 
 */
@Entity
@Table(name = "WMS_DATASET")
@NamedQuery(name = "Dataset.findAll", query = "SELECT d FROM Dataset d")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class Dataset implements Serializable {

    private static final long serialVersionUID = 2114564214212670123L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "DATASET_SEQ")
    private Long datasetSeq;

    @Column(name = "DATASET_NAME")
    private String datasetName;

    @Column(name = "DATA_API_HOST")
    private String dataApiHost;

    @Column(name = "DATA_API_PATH")
    private String dataApiPath;

    @Column(name = "DATA_API")
    private String dataApi;

    @Column(name = "DATA_API_PARAM")
    private String dataApiParam;

    @Column(name = "DESCRIPTION")
    private String description;

    @Column(name = "AUTO_CREATE_YN", columnDefinition = "char")
    private String autoCreateYn;

    @Column(name = "CREATE_YMDT")
    private String createYmdt;

    @Column(name = "CREATOR")
    private String creator;

    @Column(name = "MODIFIED_YMDT")
    private String modifiedYmdt;

    @Column(name = "MODIFIER")
    private String modifier;
}
