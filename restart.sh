#!/bin/bash

PID=`ps -ef | grep '[n]ode' | awk '{print $2; exit}'`
if [[ ! -z $PID ]]
 then
   kill -9 $PID
   fi
   ./run.sh

