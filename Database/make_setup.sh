#!/bin/bash


sudo docker build -t lgsvs ../BackendLogicServices/LoginService
sudo docker build -t appsvs ../BackendLogicServices/AppService
sudo docker build -t bsnsvs ../BusinessLogicService

sudo chmod 777 kong/kong.yml 
