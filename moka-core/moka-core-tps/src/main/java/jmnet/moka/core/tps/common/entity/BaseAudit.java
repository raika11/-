package jmnet.moka.core.tps.common.entity;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.EntityListeners;
import javax.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@MappedSuperclass
@Getter
@Setter
@EntityListeners(AuditingEntityListener.class)
public abstract class BaseAudit implements Serializable {

    /**
     * 등록자
     */
    @CreatedBy
    @Column(name = "REG_ID", updatable = false)
    protected String regId;

    /**
     * 등록일시
     */
    @CreatedDate
    @Column(name = "REG_DT", updatable = false)
    protected Date regDt;

    /**
     * 수정자
     */
    @LastModifiedBy
    @Column(name = "MOD_ID", insertable = false)
    protected String modId;

    /**
     * 수정일시
     */
    @LastModifiedDate
    @Column(name = "MOD_DT", insertable = false)
    protected Date modDt;
}
