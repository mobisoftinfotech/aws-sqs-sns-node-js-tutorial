# AWS SQS and SNS with Nest JS

Learn how to build a reliable, scalable messaging system in Node.js by leveraging AWS Simple Queue Service (SQS) and Simple Notification Service (SNS).

This repository contains the code for the tutorial: <a  href="https://mobisoftinfotech.com/resources/blog/aws-sqs-sns-nestjs-typescript-tutorial">AWS SQS and SNS in a NestJS Application with TypeScript Integration</a> by <a  href="https://mobisoftinfotech.com/">Mobisoft - App Development Company, Houston</a>

## How to Run the Project

To run the project locally:

1. Clone the repository:

```bash
git clone https://github.com/mobisoftinfotech/sqs-sns-with-nest.git
```

2. Navigate to the project directory:

```bash
cd sqs-sns-with-nest
```

3. Install the dependencies:

```bash
npm install
```

4. Set up environment variables:

```bash
AWS_ACCESS_KEY_ID=<Your  AWS  Access  Key>
AWS_SECRET_ACCESS_KEY=<Your  AWS  Secret  Key>
AWS_REGION=<Your  AWS  Region>
SNS_TOPIC_ARN=<Your SNS Topic  ARN>
SQS_QUEUE_URL=<Your SQS queue URL>
```

5. Start the development server:

```bash
npm start
```

The application should now be running on [http://localhost:3000](http://localhost:3000).

---

## **Testing the APIs**

You can test the integration using a **POST** request to publish a message to SNS Or SQS:

### **API Endpoint**

- **URL**: `http://localhost:3000/sns/publish`
- **Method**: `POST`

### **Request Body**

```json
{
  "message": "Test SNS Message"
}
```

### **Expected Response**

Upon successful execution, you will receive a confirmation of the message being published to the SNS topic and sqs-consumer will consume the message and trigger handleMessage function also processed message entry will be saved in sqs_message table.

---

### **API Endpoint**

- **URL**: `http://localhost:3000/sqs/publish`

- **Method**: `POST`

### **Request Body**

```json
{
  "message": "Test SQS Message"
}
```

### **Expected Response**

Upon successful execution, you will receive a confirmation of the message being published to the SQS topic and sqs-consumer will consume the message and trigger handleMessage function also processed message entry will be saved in sqs_message table.

---

## Features

- Integration of SQS and SNS with Nest JS.
- Integration of sqs-consumer package for SQS messages polling
- Integration of SQLite DB to save processed messages

---

Enjoy exploring SQS and SNS with Nest JS!
