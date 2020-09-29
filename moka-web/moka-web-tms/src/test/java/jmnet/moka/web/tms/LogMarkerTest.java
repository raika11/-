package jmnet.moka.web.tms;

import jmnet.moka.core.common.logger.ActionLogger;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import org.jboss.logging.MDC;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import jmnet.moka.core.common.logger.LogMarker;
import lombok.extern.slf4j.Slf4j;

@SpringBootTest
@RunWith(SpringRunner.class)
@Slf4j
public class LogMarkerTest {

	@Autowired
	private ActionLogger actionLogger;

	@Test
	public void markerTest() {
		
		/**
		 * 일반 로그
		 */
		log.debug("basic log test");
		
		/**
		 * 액션 로그
		 */
		actionLogger.success("userId", ActionType.INSERT, 10, null);

	}
}
