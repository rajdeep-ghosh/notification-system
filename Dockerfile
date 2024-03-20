# Use a node base image
FROM node:20-alpine

# Set the working directory
WORKDIR /home/app

# Copy all package.json and root package-lock.json
COPY ./package*.json .
COPY ./services/api/package.json services/api/
COPY ./services/email/package.json services/email/
COPY ./services/sms/package.json services/sms/
COPY ./services/db/package.json services/db/

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the port the app runs on
EXPOSE 6969

# Run the application
CMD ["npm", "run", "start"]
