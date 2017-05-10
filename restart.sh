#!/bin/bash

PID=`ps -ef | grep 'sudo [n]ode index.js' | awk '{print $2; exit}'`
if [[ ! -z $PID ]]
 then
  sudo pkill -9 -P $PID
   fi
cd /home/pi/GastroManager
sudo node index.js > /home/pi/GastroManager/log.log 2>&1 &

