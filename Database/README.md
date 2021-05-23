## Clean previous setup
    1. $ sudo docker stack rm lab5
    2. $ sudo docker swarm leave --force        # (the only manager node leaves the swarm => no more swarm :( )
    3. $ docker volume ls       # Delete all volumes output of command
    4. $ docker image ls        # Delete all images output of command
    5. $ docker network ls      # Delete all non-default networks output of command
    6. $ docker ps -a       # Delete all containers output of command

### Something like this
    To remove all docker images, you need to first stop all the running containers.
        docker ps -a -q | xargs docker rm
        
    Now you can delete all the images, volumes, non-default networks this way:
        docker images -a -q | xargs docker rmi -f
    
## Setup swarm
    0. $ cd Database 
    1. $ docker swarm init      # now I hava one manager
    2. $ ./make_setup.sh        # to create my images
    3. $ chmod 777      # on all kong.yml files (now only in Database/kong folder)
    4. $ docker stack deploy -c docker-compose-all.yml lab5
    5. $ docker service ls      # wait to have all REPLICAS 1/1
    6. Now you can start using the application!
