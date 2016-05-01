#!/bin/bash
forever_running=$(forever list | awk '{print $2}')
if [ "$forever_running" != "No" ]; then
  echo 'There are forever processes running. Will kill them'
  forever stopall
  echo 'All forever process were stopped'
else
  echo 'No forever processes are running.'
fi

node_pid=$(ps -ef | grep '[n]ode' | awk '{print $2}'| tail -1)
echo $node_pid
if [ -n "$node_pid" ]; then
  echo "There is a running node process. Will kill it: ${node_pid}"
  kill $node_pid
  echo "Process ${node_pid} killed"
else 
  echo "There is no node running process."
fi
