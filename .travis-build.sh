#!/bin/sh

set -e
set -x

sudo update-alternatives --install /usr/bin/g++ g++ /usr/bin/g++-4.8 90
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

elif [ "$TRAVIS_OS_NAME" = "osx" ]; then
    npm run pack:osx
    cd ../dist/osx
    ls
    zip mavensmate-app-$TRAVIS_TAG-osx-x64.zip MavensMate.dmg
    ls
fi