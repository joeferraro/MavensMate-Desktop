#!/bin/sh

set -e
set -x

if [ "$TRAVIS_OS_NAME" = "linux" -o -z "$TRAVIS_OS_NAME" ]; then
    sudo add-apt-repository ppa:ubuntu-toolchain-r/test -y
    sudo apt-get update -qq
    sudo apt-get -qq install g++-4.8
    g++ -v
    sudo update-alternatives --install /usr/bin/g++ g++ /usr/bin/g++-4.8 90
    g++ -v
    sudo apt-get install libgnome-keyring-dev
elif [ "$TRAVIS_OS_NAME" = "osx" ]; then
    echo osx: nothing to see here
    # brew update
    # brew outdated xctool || brew upgrade xctool
    # curl http://pkgconfig.freedesktop.org/releases/pkg-config-0.28.tar.gz -o pkgconfig.tgz
    # tar -zxf pkgconfig.tgz && cd pkg-config-0.28
    # ./configure --with-internal-glib && make install
    # cd ..
fi

cd ..
curl -L "https://github.com/npm/npm/archive/v3.2.0.tar.gz" >> npm3.tar.gz
tar -xzvf npm3.tar.gz
ls
cd mavensmate-app/app
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
    tar -zcvf mavensmate-app-$TRAVIS_TAG-linux-x64.tar.gz -C MavensMate-linux-x64 .
    ls

elif [ "$TRAVIS_OS_NAME" = "osx" ]; then
    npm run pack:osx
    cd ../dist/osx
    ls
    zip mavensmate-app-$TRAVIS_TAG-osx-x64.zip MavensMate.dmg
    ls
fi