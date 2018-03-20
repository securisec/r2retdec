#!/bin/bash

echo "Only tested with a fresh vagrant running Ubuntu 16.04 64 bit [ENTER] to continue"
read something
sudo apt update -y
sudo apt upgrade -y
cpucores="nproc"

sudo apt-get install libcurl4-gnutls-dev build-essential git perl python3 bash bison flex autoconf automake libtool pkg-config m4 coreutils zlib1g-dev libtinfo-dev wget bc upx doxygen graphviz python3-dev -y

git clone https://github.com/avast-tl/retdec

git clone -b v3.10.2 https://cmake.org/cmake.git cmake
cd cmake
./bootstrap --system-curl
make -j$cpucores
sudo make install

cd ~/retdec
mkdir build && cd build
cmake -DCMAKE_INSTALL_PREFIX=$HOME/retdec-install ..
wget https://github.com/avast-tl/llvm/archive/753e703b185f07f6f85c8ca474a65f4a965371b1.zip -O external/src/llvm.zip
make -j$cpucores
make install
