package jmnet.moka.core.common.encrypt;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.security.SecureRandom;
import java.util.Arrays;
import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.util.Base64Utils;

/**
 * <pre>
 * KISA의 블록 암호 SEED 중 CBC 방식으로 암복화 처리
 * Project : moka
 * Package : jmnet.moka.core.common.encrypt
 * ClassName : MokaMembershipCrypt
 * Created : 2020-11-19 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-19 09:02
 */
public class MokaMembershipCrypt {

    /* 암호화 key spec */
    private final Key keySpec;
    /* IvParameterSpec */
    private final IvParameterSpec ivSpec;
    /* 암호화 알고리즘 */
    private final String algorithm = "AES/CBC/PKCS5Padding";

    public MokaMembershipCrypt(String key) {
        byte[] keyBytes = new byte[32];
        byte[] ivBytes = new byte[16];
        byte[] b = key.getBytes(StandardCharsets.UTF_8);
//        int len = b.length;
//        if (len > keyBytes.length) {
//            len = keyBytes.length;
//        }
        System.arraycopy(b, 0, keyBytes, 0, 32);
        System.arraycopy(b, 0, ivBytes, 0, 16);
        this.keySpec = new SecretKeySpec(keyBytes, "AES");
        this.ivSpec = new IvParameterSpec(ivBytes);
    }

    /**
     * 암호화
     *
     * @param text 원본
     * @return 암호문
     * @throws Exception 에러 처리
     */
    public String encrypt(String text)
            throws Exception {
        Cipher cipher = Cipher.getInstance(algorithm);
        cipher.init(Cipher.ENCRYPT_MODE, keySpec, this.ivSpec);
        byte[] encrypted = cipher.doFinal(text.getBytes(StandardCharsets.UTF_8));
        return Base64Utils.encodeToString(encrypted);
    }

    /**
     * 복호화
     *
     * @param encoded 암호문
     * @return 원문
     * @throws Exception 에러 처리
     */
    public String decrypt(String encoded)
            throws Exception {
        Cipher cipher = Cipher.getInstance(algorithm);
        cipher.init(Cipher.DECRYPT_MODE, keySpec, this.ivSpec);
        byte[] byteStr = Base64Utils.decodeFromString(encoded);
        return new String(cipher.doFinal(byteStr),StandardCharsets.UTF_8);
    }

}
