#!/usr/bin/env bash

git clone https://github.com/NumstoreDB/Numstore 
cd Numstore 
make TARGET=release
./build/debug/target/bin/smfile_sample2_transactions
