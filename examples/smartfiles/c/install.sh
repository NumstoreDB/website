#!/usr/bin/env bash
set -euo pipefail

git clone https://github.com/NumstoreDB/Numstore
cd Numstore/src
# Edit main.c here
gcc *.c -o main
./main
