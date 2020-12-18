/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.code.repository;

import jmnet.moka.core.tps.mvc.code.entity.JamMastercode;
import jmnet.moka.core.tps.mvc.code.entity.JamMastercodePK;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface JamMastercodeRepository extends JpaRepository<JamMastercode, JamMastercodePK>, JpaSpecificationExecutor<JamMastercode> {

}
