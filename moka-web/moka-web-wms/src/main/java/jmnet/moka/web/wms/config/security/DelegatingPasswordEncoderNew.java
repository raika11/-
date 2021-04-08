/*
 * Copyright (c) 2021. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package jmnet.moka.web.wms.config.security;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.wms.config.security
 * ClassName : DelegatingPasswordEncoderNew
 * Created : 2021-04-07 root
 * </pre>
 *
 * @author root
 * @since 2021-04-07 오전 11:56
 */

public class DelegatingPasswordEncoderNew implements PasswordEncoder {
    private static final String PREFIX = "{";
    private static final String SUFFIX = "}";
    private final String idForEncode;
    private final PasswordEncoder passwordEncoderForEncode;
    private final Map<String, PasswordEncoder> idToPasswordEncoder;
    private PasswordEncoder defaultPasswordEncoderForMatches =
            new jmnet.moka.web.wms.config.security.DelegatingPasswordEncoderNew.UnmappedIdPasswordEncoder();

    public DelegatingPasswordEncoderNew(String idForEncode, Map<String, PasswordEncoder> idToPasswordEncoder) {
        if (idForEncode == null) {
            throw new IllegalArgumentException("idForEncode cannot be null");
        } else if (!idToPasswordEncoder.containsKey(idForEncode)) {
            throw new IllegalArgumentException("idForEncode " + idForEncode + "is not found in idToPasswordEncoder " + idToPasswordEncoder);
        } else {
            Iterator var3 = idToPasswordEncoder
                    .keySet()
                    .iterator();

            while (var3.hasNext()) {
                String id = (String) var3.next();
                if (id != null) {
                    if (id.contains("{")) {
                        throw new IllegalArgumentException("id " + id + " cannot contain " + "{");
                    }

                    if (id.contains("}")) {
                        throw new IllegalArgumentException("id " + id + " cannot contain " + "}");
                    }
                }
            }

            this.idForEncode = idForEncode;
            this.passwordEncoderForEncode = (PasswordEncoder) idToPasswordEncoder.get(idForEncode);
            this.idToPasswordEncoder = new HashMap(idToPasswordEncoder);
        }
    }

    public void setDefaultPasswordEncoderForMatches(PasswordEncoder defaultPasswordEncoderForMatches) {
        if (defaultPasswordEncoderForMatches == null) {
            throw new IllegalArgumentException("defaultPasswordEncoderForMatches cannot be null");
        } else {
            this.defaultPasswordEncoderForMatches = defaultPasswordEncoderForMatches;
        }
    }

    public String encode(CharSequence rawPassword) {
        return this.passwordEncoderForEncode.encode(rawPassword);
    }

    public boolean matches(CharSequence rawPassword, String prefixEncodedPassword) {
        if (rawPassword == null && prefixEncodedPassword == null) {
            return true;
        } else {
            //String id = this.extractId(prefixEncodedPassword);

            String id = "SHA-256";

            System.out.println("id   =" + id);

            PasswordEncoder delegate = (PasswordEncoder) this.idToPasswordEncoder.get(id);

            System.out.println("delegate   =" + delegate);

            if (delegate == null) {
                return this.defaultPasswordEncoderForMatches.matches(rawPassword, prefixEncodedPassword);
            } else {
                String encodedPassword = prefixEncodedPassword;
                //String encodedPassword = this.extractEncodedPassword(prefixEncodedPassword);
                return delegate.matches(rawPassword, encodedPassword);
            }
        }
    }

    private String extractId(String prefixEncodedPassword) {
        if (prefixEncodedPassword == null) {
            return null;
        } else {
            int start = prefixEncodedPassword.indexOf("{");
            if (start != 0) {
                return null;
            } else {
                int end = prefixEncodedPassword.indexOf("}", start);
                return end < 0 ? null : prefixEncodedPassword.substring(start + 1, end);
            }
        }
    }

    public boolean upgradeEncoding(String encodedPassword) {
        String id = this.extractId(encodedPassword);
        return !this.idForEncode.equalsIgnoreCase(id);
    }

    private String extractEncodedPassword(String prefixEncodedPassword) {
        int start = prefixEncodedPassword.indexOf("}");
        return prefixEncodedPassword.substring(start + 1);
    }

    private class UnmappedIdPasswordEncoder implements PasswordEncoder {
        private UnmappedIdPasswordEncoder() {
        }

        public String encode(CharSequence rawPassword) {
            throw new UnsupportedOperationException("encode is not supported");
        }

        public boolean matches(CharSequence rawPassword, String prefixEncodedPassword) {
            String id = jmnet.moka.web.wms.config.security.DelegatingPasswordEncoderNew.this.extractId(prefixEncodedPassword);
            throw new IllegalArgumentException("There is no PasswordEncoder mapped for the id \"" + id + "\"");
        }
    }
}