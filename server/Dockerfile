# pull node
FROM node:lts
#sets the working directory for any subsequent instructions that follow it in the Dockerfile. This is where commands like RUN and COPY will be executed.
WORKDIR /app

#copies the package.json and package-lock.json files to the working directory
COPY package*.json .

#installs the dependencies and packages in the package.json file
RUN npm install

#copies files or directories from the host machine to the Docker image
COPY . .

#exposes port 9000 to the host machine.does not actually publish the ports
EXPOSE 9000


#this is the command that runs when the container starts from the image
CMD ["npm","run","dev"]
