package jmnet.moka.core.common.ssh;

import org.apache.sshd.common.config.keys.KeyUtils;
import org.apache.sshd.common.config.keys.loader.pem.RSAPEMResourceKeyPairParser;
import org.apache.sshd.common.util.security.SecurityUtils;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.security.GeneralSecurityException;
import java.security.KeyPair;
import java.util.Base64;
import java.util.List;

public class RsaKeyPairParser {
    public static KeyPair load(String file) throws IOException, GeneralSecurityException {
        return load(new File(file));
    }

    public static KeyPair load(File privateKeyFile) throws IOException, GeneralSecurityException {
        List<String> lines = Files.readAllLines(privateKeyFile.toPath());
        StringBuilder data = new StringBuilder(1024);
        if ( lines.size() < 2 || lines.get(0).contains(RSAPEMResourceKeyPairParser.BEGIN_MARKER) == false) {
            throw new RuntimeException("key is invalid or is not RSA PEM");
        }
        for ( String line : lines) {
            if ( !line.contains(RSAPEMResourceKeyPairParser.BEGIN_MARKER) &&
                    !line.contains(RSAPEMResourceKeyPairParser.END_MARKER)) {
                data.append(line.trim());
            }
        }
        Base64.Decoder decoder = Base64.getDecoder();
        ByteArrayInputStream bais = new ByteArrayInputStream(decoder.decode(data.toString().trim()));
        return RSAPEMResourceKeyPairParser.decodeRSAKeyPair(SecurityUtils.getKeyFactory(KeyUtils.RSA_ALGORITHM), bais, false);
    }
}
