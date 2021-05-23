#!/bin/bash


sudo docker build -t myimg_3 ../BackendLogicServices/LoginService
sudo docker build -t appsvs ../BackendLogicServices/AppServic
sudo docker build -t myperf ../BusinessLogicService