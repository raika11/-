/*
 * Copyright (c) 2021. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package jmnet.moka.web.wms.config.security;

import java.util.HashMap;
import java.util.Map;
import org.springframework.security.crypto.password.MessageDigestPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.wms.config.security
 * ClassName : PasswordEncoderNewFactories
 * Created : 2021-04-07 root
 * </pre>
 *
 * @author root
 * @since 2021-04-07 오전 11:01
 */
public class PasswordEncoderNewFactories {
    public static PasswordEncoder createDelegatingPasswordEncoder() {
        String encodingId = "SHA-256";
        Map<String, PasswordEncoder> encoders = new HashMap();
        //encoders.put(encodingId, new BCryptPasswordEncoder());
        //        encoders.put("ldap", new LdapShaPasswordEncoder());
        //        encoders.put("MD4", new Md4PasswordEncoder());
        //        encoders.put("MD5", new MessageDigestPasswordEncoder("MD5"));
        //        encoders.put("noop", NoOpPasswordEncoder.getInstance());
        //        encoders.put("pbkdf2", new Pbkdf2PasswordEncoder());
        //        encoders.put("scrypt", new SCryptPasswordEncoder());
        //        encoders.put("SHA-1", new MessageDigestPasswordEncoder("SHA-1"));
        encoders.put("SHA-256", new MessageDigestPasswordEncoder("SHA-256"));
        //        encoders.put("sha256", new StandardPasswordEncoder());
        return new DelegatingPasswordEncoderNew(encodingId, encoders);
    }

    private PasswordEncoderNewFactories() {
    }
}
