# JCP UI

## Note:
Once npm installs everything, run the command: `npm run postinstall`
 - ONLY DO THIS ONCE

## Available Scripts

## Docker

### Build the image
``docker build -t jcp-ui:latest .``

### Start the container
``docker run --name jcp-ui -d -p 3000:8080 jcp-ui:latest``

### Stop the container
``docker stop jcp-ui``

### Remove the container
``docker rm jcp-ui``
