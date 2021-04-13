/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.issue.repository;

import jmnet.moka.core.tps.mvc.issue.entity.IssueDeskingHist;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.core.tps.mvc.issue.repository
 * ClassName : IssueDeskingRepository
 * Created : 2021-03-19
 * </pre>
 *
 * @author ssc
 * @since 2021-03-19 오후 3:24
 */
public interface IssueDeskingHistRepository extends JpaRepository<IssueDeskingHist, Long> {
}
