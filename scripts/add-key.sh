#!/bin/sh

# Create a custom keychain
security create-keychain -p travis mavensmate.keychain

# Make the custom keychain default, so xcodebuild will use it for signing
security default-keychain -s mavensmate.keychain

# Unlock the keychain
security unlock-keychain -p travis mavensmate.keychain

# Set keychain timeout to 1 hour for long builds
# see http://www.egeek.me/2013/02/23/jenkins-and-xcode-user-interaction-is-not-allowed/
security set-keychain-settings -t 3600 -u ~/Library/Keychains/mavensmate.keychain

# Add certificates to keychain and allow codesign to access them
security import ./scripts/certs/apple.cer -k ~/Library/Keychains/mavensmate.keychain -T /usr/bin/codesign
security import ./scripts/certs/app.cer -k ~/Library/Keychains/mavensmate.keychain -T /usr/bin/codesign
security import ./scripts/certs/dist.p12 -k ~/Library/Keychains/mavensmate.keychain -P $KEY_PASSWORD -T /usr/bin/codesign

echo "list keychains: "
security list-keychains
echo " ****** "

echo "find indentities keychains: "
security find-identity -p codesigning  ~/Library/Keychains/mavensmate.keychain
echo " ****** "
