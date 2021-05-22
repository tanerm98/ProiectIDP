Intri in folderul Database si rulezi

1. docker volume rm <volum_name_or_id>
2. docker stack rm lab5

3. docker swarm init (eventual cu parametru --advertise-addr <IP_ADDR>)
4. docker stack deploy -c docker-compose.yml lab5
5. docker service ls - toate trebuie sa aiba macar o replica si sa fie stabile 
(poti verifica stabilitatea cu docker service update nume_service)

Dupa faci un fisier body in care pui body-ul cererii HTTP
ex:
{
    "username" : "corina",
    "password" :"parola1"
}

Apoi cu curl verifici ca merge kong
curl --data '@body' 'http://localhost:8000/pg/api/v1/users/register' -H "Content-Type: application/json"

Cu kong pui la ruta in loc de localhost:3004/api/.. => localhost:8000/pg/api...
8000 e portul pe care ruleaza kong
/pg e ruta pusa de mine in kong/kong.yml

Daca vrei sa rulezi fara kong, si ruta cu localhost:3004/api/.. e valabila
pentru ca nu i-am sters porturile 3004:3004 serviciului de loginservice-api
