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
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@MappedSuperclass
@Getter
@Setter
@EntityListeners(AuditingEntityListener.class)
public abstract class RegAudit implements Serializable {

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

}
