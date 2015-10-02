#!/bin/sh

set -e
set -x

if [ "$TRAVIS_OS_NAME" = "linux" -o -z "$TRAVIS_OS_NAME" ]; then
    echo running linux build
    sudo add-apt-repository ppa:ubuntu-toolchain-r/test -y
    sudo apt-get update -qq
    sudo apt-get -qq install g++-4.8
    g++ -v
    sudo update-alternatives --install /usr/bin/g++ g++ /usr/bin/g++-4.8 90
    g++ -v
    sudo apt-get install gnome-keyring
    sudo apt-get install libgnome-keyring-dev
elif [ "$TRAVIS_OS_NAME" = "osx" ]; then
    echo running osx build
    brew update && brew upgrade xctool || true
    # decrypt certs
    openssl aes-256-cbc -k "$ENCRYPTION_SECRET" -in scripts/certs/app.cer.enc -d -a -out scripts/certs/app.cer
    openssl aes-256-cbc -k "$ENCRYPTION_SECRET" -in scripts/certs/installer.cer.enc -d -a -out scripts/certs/installer.cer
    openssl aes-256-cbc -k "$ENCRYPTION_SECRET" -in scripts/certs/dist.p12.enc -d -a -out scripts/certs/dist.p12
    # add to keychain
    ./scripts/add-key.sh
fi

cd ..
curl -L "https://github.com/npm/npm/archive/v3.2.0.tar.gz" >> npm3.tar.gz
tar -xzvf npm3.tar.gz
ls
cd MavensMate-app/app
node ../../npm-3.2.0/bin/npm-cli.js install -g node-gyp-install
node-gyp-install
node ../../npm-3.2.0/bin/npm-cli.js install
ls
../../npm-3.2.0/bin/npm-cli.js install electron-builder -g
../../npm-3.2.0/bin/npm-cli.js install electron-packager -g
./node_modules/.bin/electron-rebuild

#if OS is linux or is not set
if [ "$TRAVIS_OS_NAME" = "linux" -o -z "$TRAVIS_OS_NAME" ]; then
    npm run build:linux
    cd ../dist/linux/MavensMate-linux-x64
    ls
    cd ..
    ls
    tar -zcvf MavensMate-app-$TRAVIS_TAG-linux-x64.tar.gz -C MavensMate-linux-x64 .
    ls
    # npm run pack:win
    # cd ../dist/win
    # ls
    # # zip MavensMate-app-$TRAVIS_TAG-win-ia32.tar.gz MavensMate-win32-ia32 .
    # # zip MavensMate-app-$TRAVIS_TAG-win-x64.tar.gz MavensMate-win32-x64 .

elif [ "$TRAVIS_OS_NAME" = "osx" ]; then
    npm run build:osx
    # TODO: sign ../dist/osx/MavensMate-darwin-x64/MavensMate.app
    certtool y | grep Developer\ ID
    sudo security unlock-keychain -p travis mavensmate.keychain
    sudo codesign --deep --force --verbose --keychain ~/Library/Keychains/mavensmate.keychain --sign "Developer ID Application: Joseph Ferraro ($APPLE_TEAM_ID)" ../dist/osx/MavensMate-darwin-x64/MavensMate.app
    codesign --verify -vvvv ../dist/osx/MavensMate-darwin-x64/MavensMate.app
    npm run pack-only:osx
    cd ../dist/osx
    ls
    zip MavensMate-app-$TRAVIS_TAG-osx-x64.zip MavensMate.dmg
    ls
fi