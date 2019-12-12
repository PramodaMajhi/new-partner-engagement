#!/bin/sh
set -e

jenkins_home="/opt/jenkins"
#Remove and stop old continers

cd ${jenkins_home}
docker-compose -f "docker-compose-pilot.yml" down --rmi 'all'

#Cleanup the docker cache
# docker system prune -af
echo "_____________________________________________________________"
echo ""
#Perform the docker build
docker-compose -f "docker-compose-pilot.yml" build
echo "_____________________________________________________________"
echo ""
docker-compose -f "docker-compose-pilot.yml" up -d

docker-compose -f "docker-compose-pilot.yml" ps

echo "_____________________________________________________________"
echo ""
docker ps
echo "_____________________________________________________________"
echo ""