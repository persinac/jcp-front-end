# Order of Ops
1. Create the repo:
```
aws ecr create-repository --repository-name jcp-ui
```

2. For ease of use, tag the local image with your ecr url:
```
docker tag jcp-ui:latest 059039070213.dkr.ecr.us-east-1.amazonaws.com/jcp-ui
```

3. Push to repo
```
docker push 059039070213.dkr.ecr.us-east-1.amazonaws.com/jcp-ui
```

4. Deploy to EC2 and run it
   https://medium.com/@meetakoti.kirankumar/deploying-fastapi-web-application-in-aws-a1995675087d

# Code updates order of ops
1. push to github
2. rebuild image locally
3. push image to ECR
4. log into ec2 instance
5. stop & rm the container
6. pull new image
7. restart containerw

## Useful commands
```
docker pull 059039070213.dkr.ecr.us-east-1.amazonaws.com/jcp-ui
docker run --name jcp-ui -d -p 3000:8080 059039070213.dkr.ecr.us-east-1.amazonaws.com/jcp-ui
docker exec -it jcp-ui /bin/sh
docker stop jcp-ui
docker rm jcp-ui

```