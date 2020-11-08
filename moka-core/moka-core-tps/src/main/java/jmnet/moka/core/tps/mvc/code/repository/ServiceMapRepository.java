/*
 * Copyright (c) 2020. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package jmnet.moka.core.tps.mvc.code.repository;

import jmnet.moka.core.tps.mvc.code.entity.ServiceMap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Description: 분류코드(마스터코드) 묶음 repository
 *
 * @author ohtah
 * @since 2020. 11. 8.
 */
@Repository
public interface ServiceMapRepository extends JpaRepository<ServiceMap, String>, ServiceMapRepositorySupport {

}
