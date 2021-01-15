/*
 * Copyright (c) 2020. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package jmnet.moka.web.tms;

import jmnet.moka.core.common.logger.ActionLogger;
import jmnet.moka.core.common.logger.LoggerCodes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationContextInitializedEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

@Component
public class MokaTmsApplicationListener implements ServletContextListener {
    @Autowired
    private ActionLogger actionLogger;
    private long startTime = System.currentTimeMillis();

    @Override
    public void contextInitialized(ServletContextEvent event) {
        actionLogger.success("SYSTEM", LoggerCodes.ActionType.STARTUP, System.currentTimeMillis() - startTime);
    }

    @Override
    public void contextDestroyed(ServletContextEvent event) {
        actionLogger.success("SYSTEM", LoggerCodes.ActionType.SHUTDOWN, System.currentTimeMillis() - startTime);
    }


}
