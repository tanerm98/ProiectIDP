#!/bin/bash


sudo docker build -t myimg_3 ../BackendLogicServices/LoginService
sudo docker build -t appsvs ../BackendLogicServices/AppService
sudo docker build -t myperf ../BusinessLogicService

sudo chmod 777 kong/kong.yml 
