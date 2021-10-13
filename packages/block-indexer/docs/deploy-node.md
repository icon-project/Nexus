# References

https://git.baikal.io/icon/btp/-/blob/BTPDocument/BTP-Document.md

# Prepare Environment

```bash
# requires Node >= 10.x
# requires version GoLang 1.13+
brew install go
go version
# go version go1.16.3 darwin/arm64

brew install python
pip install virtualenv setuptools wheel

# Install OpenJDK 11 version.
brew tap AdoptOpenJDK/openjdk
brew install --cask adoptopenjdk11
java --version
# openjdk 11.0.11 2021-04-20
# OpenJDK Runtime Environment AdoptOpenJDK-11.0.11+9 (build 11.0.11+9)
# OpenJDK 64-Bit Server VM AdoptOpenJDK-11.0.11+9 (build 11.0.11+9, mixed mode)

# List Java versions installed
/usr/libexec/java_home -V

# optional: manually set active version at Java 11
# ref: https://stackoverflow.com/a/46517346/108616
export JAVA_HOME=$(/usr/libexec/java_home -v 11)

brew install gradle@6
gradle --version
# Gradle 6.9

npm install -g truffle@5.3.0
truffle --version
```
