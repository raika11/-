package jmnet.moka.core.tps.mvc.desking.entity;

import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.core.type.TypeReference;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


/**
 * The persistent class for the WMS_DESKING_WORK database table.
 * 
 */
@Entity
@Table(name = "WMS_DESKING_REL_WORK")
@NamedQuery(name = "DeskingRelWork.findAll", query = "SELECT w FROM DeskingRelWork w")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@JsonInclude(Include.NON_NULL)
public class DeskingRelWork implements Serializable {

    private static final long serialVersionUID = 7423222573590183603L;

    public static final Type TYPE = new TypeReference<List<DeskingRelWork>>() {
    }.getType();

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SEQ")
    private Long seq;

    @Column(name = "CREATOR")
    private String creator;

    @Column(name = "DESKING_SEQ")
    private Long deskingSeq;

    @Column(name = "CONTENTS_ID")
    private String contentsId;

    @Column(name = "REL_CONTENTS_ID")
    private String relContentsId;

    @Column(name = "REL_ORDER")
    private Integer relOrder;

    @Column(name = "REL_TITLE")
    private String relTitle;

    @Column(name = "CREATE_YMDT")
    private String createYmdt;
}
