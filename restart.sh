#!/bin/bash

PID=`ps -ef | grep '[n]ode' | awk '{print $2; exit}'`
if [[ ! -z $PID ]]
 then
   kill -9 $PID
   fi
cd /home/pi/GastroManager
sudo node index.js > /home/pi/GastroManager/log.log 2>&1 &

