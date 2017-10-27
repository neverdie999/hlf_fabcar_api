#!/bin/bash

cd /home/bcadmin/fabric-samples/basic-network
./teardown.sh

docker rm $(docker ps -aq)
