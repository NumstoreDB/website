#!/usr/bin/env bash

git clone https://github.com/NumstoreDB/Numstore 
cd Numstore 
make TARGET=release
./build/debug/target/bin/ns_sample1_basic_crud
