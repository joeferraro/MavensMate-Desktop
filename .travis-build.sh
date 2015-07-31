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
    touch /tmp/.com.apple.dt.CommandLineTools.installondemand.in-progress;
    PROD=$(softwareupdate -l |
      grep "\*.*Command Line" |
      head -n 1 | awk -F"*" '{print $2}' |
      sed -e 's/^ *//' |
      tr -d '\n')
    softwareupdate -i "$PROD" -v;
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