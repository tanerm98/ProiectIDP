Clean previous setup
1. sudo docker stack rm lab5
2. sudo docker swarm leave --force (unicul manager paraseste swarmul => nu mai am swarm)
3. Delete all volumes output of command `docker volume ls`
4. Delete all images output of command `docker image ls`
  Something like this
    To remove all docker images, you need to first stop all the running containers.

    docker ps -a -q | xargs docker rm
    Now you can delete all the images this way:
    
    docker images -a -q | xargs docker rmi -f
    
Setup swarm
0. cd Database 
1. docker swarm init --advertise-addr 172.18.0.23
 - now I hava one manager
 
2. run ./make_setup.sh to create my images
3. run chmod 777 on all kong.yml files (now only in Database/kong folder)
4. docker stack deploy -c docker-compose-all.yml lab5
5. wait to hava all REPLICAS 1/1
6. send querie