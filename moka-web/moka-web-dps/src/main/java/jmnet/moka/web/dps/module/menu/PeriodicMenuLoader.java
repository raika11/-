package jmnet.moka.web.dps.module.menu;

import java.io.IOException;
import java.util.concurrent.ScheduledFuture;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPathExpressionException;
import jmnet.moka.core.common.util.ResourceMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.ResourcePatternResolver;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.dps.module.menu
 * ClassName : PeriodicMenuLoader
 * Created : 2021-04-24 kspark
 * </pre>
 *
 * @author kspark
 * @since 2021-04-24 오후 3:07
 */
public class PeriodicMenuLoader implements Runnable {
    public static final Logger logger = LoggerFactory.getLogger(PeriodicMenuLoader.class);
    private String menuLocation;
    private ResourcePatternResolver patternResolver;
    private MenuParser menuParser;

    private ThreadPoolTaskScheduler scheduler;
    private ScheduledFuture<?> schedule;

    public PeriodicMenuLoader(String menuLocation, ThreadPoolTaskScheduler scheduler, int menuLoadIntervalMinutes)
            throws IOException, ParserConfigurationException, XPathExpressionException {
        this.menuLocation = menuLocation;
        this.scheduler = scheduler;
        this.patternResolver = ResourceMapper.getResouerceResolver();
        loadMenu();

        // 스케줄 주기 등록 : http(s)로 가져올 때만 주기적으로 수행
        if (menuLocation.startsWith("http")) {
            this.schedule = scheduler.scheduleAtFixedRate(this, menuLoadIntervalMinutes * 100 * 60);
        }
    }

    public MenuParser getMenuParser() {
        return this.menuParser;
    }

    @Override
    public void run() {
        try {
            loadMenu();
        } catch (Exception e) {
            logger.error("Menu Load Fail:{} {}", e, e);
        }
        logger.debug("Menu Loaded");
    }

    private void loadMenu()
            throws IOException, ParserConfigurationException, XPathExpressionException {
        if (menuLocation.startsWith("classpath")) {
            Resource resource = this.patternResolver.getResource(menuLocation);
            this.menuParser = new MenuParser(resource);
        } else {
            this.menuParser = new MenuParser(menuLocation);
        }
    }

    public void shutdown() {
        if (schedule != null) {
            this.schedule.cancel(true);
        }
    }

}
