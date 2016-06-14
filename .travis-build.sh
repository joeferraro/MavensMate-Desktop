#!/bin/sh

set -e
set -x

if [ "$TRAVIS_OS_NAME" = "linux" -o -z "$TRAVIS_OS_NAME" ]; then
    echo running linux build
    sudo add-apt-repository ppa:ubuntu-toolchain-r/test -y
    sudo apt-get -y update -qq
    sudo apt-get -y -qq install g++-4.8
    g++ -v
    sudo update-alternatives --install /usr/bin/g++ g++ /usr/bin/g++-4.8 90
    g++ -v
    sudo apt-get -y install gnome-keyring
    sudo apt-get -y install libgnome-keyring-dev
    sudo apt-get -y install --no-install-recommends -y icnsutils graphicsmagick xz-utils
elif [ "$TRAVIS_OS_NAME" = "osx" ]; then
    echo running osx build
    # brew update && brew upgrade xctool || true
    # decrypt certs
    openssl aes-256-cbc -k "$ENCRYPTION_SECRET" -in scripts/certs/app.cer.enc -d -a -out scripts/certs/app.cer
    openssl aes-256-cbc -k "$ENCRYPTION_SECRET" -in scripts/certs/installer.cer.enc -d -a -out scripts/certs/installer.cer
    openssl aes-256-cbc -k "$ENCRYPTION_SECRET" -in scripts/certs/dist.p12.enc -d -a -out scripts/certs/dist.p12
    # add to keychain
    ./scripts/add-key.sh
fi

# next two lines required for proper build
npm install -g node-gyp-install
node-gyp-install

node -v
npm -v

npm install
cd app
npm install
cd ..
ls

#if OS is linux or is not set
if [ "$TRAVIS_OS_NAME" = "linux" -o -z "$TRAVIS_OS_NAME" ]; then
    npm run dist

elif [ "$TRAVIS_OS_NAME" = "osx" ]; then
    npm run dist
fi

ls dist