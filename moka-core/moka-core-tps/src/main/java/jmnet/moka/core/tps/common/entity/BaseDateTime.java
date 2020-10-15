package jmnet.moka.core.tps.common.entity;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.EntityListeners;
import javax.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@MappedSuperclass
@Getter
@Setter
@EntityListeners(AuditingEntityListener.class)
public abstract class BaseDateTime implements Serializable {

    /**
     * 등록일시
     */
    @CreatedDate
    @Column(name = "REG_DT")
    protected Date regDt;

    /**
     * 수정일시
     */
    @LastModifiedDate
    @Column(name = "MOD_DT", insertable = false)
    protected Date modDt;
}
