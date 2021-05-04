/*
 * Copyright (c) 2021. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package jmnet.moka.core.tps.mvc.abtest.repository;

import java.util.List;
import jmnet.moka.core.tps.mvc.abtest.entity.AbTestCase;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.abtest.repository
 * ClassName : AbTestCaseRepositorySupport
 * Created : 2021-04-21
 * </pre>
 *
 * @author ince
 * @since 2021-04-21 17:07
 */
public interface AbTestCaseRepositorySupport {
    List<AbTestCase> findByPageTypeAndPageValueAndZoneDivAndZoneSeqAndAbtestPurpose(String pageType, String pageValue, String zoneDiv, String zoneSeq,
            String abtestPurpose);
}
