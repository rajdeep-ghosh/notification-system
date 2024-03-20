# Multi-channel notification delivery system

Server/Client triggers sending notification by calling the API service and providing relevant data like type of notification to send (eg email/sms/push etc.), email/phone number, body, etc. These tasks are then pushed by the API service to the exchange which gets routed to relevant queue according to its message type. These tasks are consumed by their respective services and notifications are sent to end users. After which a copy of the task along with its status (success/failure) is saved in the database through a different message queue. This is a highly customizable and scalable infrastructure where new notification channels can be easily added.

![architecture](./.github/image.png)

## Components and Technologies Used

1. Node.js and Express Server:

   - Handles incoming requests and manages responses.

1. RabbitMQ Message Queue:

   - Notifications are forwarded to a message queue of its type upon receipt.

   - A subscriber consumes these tasks and writes them to the database.

1. MongoDB:

   - Stores all notifications along with its status

## Running Locally

### Using Docker

To run the project you need **Docker** installed on your system. If you don't have Docker installed, follow the instructions provided [here](https://docs.docker.com/get-docker/) to install Docker for your operating system.

- Clone the project locally & cd into the project

- Start the containers

  ```bash
  docker compose -f docker-compose.yml up
  ```

### Manual Setup

To run locally make sure you have **Node.js, RabbitMQ and MongoDB** installed on your system & running on default ports.

- Clone the project locally & cd into the project

- Install dependencies

  ```bash
  npm i
  ```

- Change the RabbitMQ and MongoDB connection strings of all the services

- Start project

  ```bash
  npm run start
  ```

## Usage

Using Postman send a **POST** request to **localhost:6969/notify** with the following JSON body

```json
{
  "type": "email", // or "sms"
  "to": "name@example.com", // phone no. for sms
  "subject": "Notification System Test",
  "body": "it works!"
}
```

\
_Note: - Email service is fully functional_
