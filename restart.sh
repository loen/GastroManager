#!/bin/bash


PID=`ps -ef | grep '[n]ode' | awk '{print $2; exit}'`
echo $PID
if [ -n $PID ]
 then
  kill -9 $PID
fi
./run.sh
