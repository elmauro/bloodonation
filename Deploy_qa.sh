#!/bin/bash
# My script

#Centos 7 Yuxi Release Server
SCRIPT1='IMAGEID=$(docker images --format {{.ID}} lce_back);'
SCRIPT2='CONTAINERS=$(docker ps -aq --filter="ancestor=$IMAGEID");'
SCRIPT3='if [ ! -z "$CONTAINERS" ]; then docker stop $CONTAINERS; docker rm -f $CONTAINERS; fi;'
SCRIPT4='if [ ! -z "$IMAGEID" ]; then docker rmi -f $IMAGEID; fi;'
SCRIPT5="git pull;" 
SCRIPT6="docker build -t bloodonation .;"
SCRIPT7="docker run --name bloodonation -p 8080:8080 bloodonation;"

${SCRIPT1} ${SCRIPT2} ${SCRIPT3} ${SCRIPT4} ${SCRIPT5} ${SCRIPT6} ${SCRIPT7}
