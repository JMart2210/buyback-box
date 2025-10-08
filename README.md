# buyback-box
MVP to help kids learn responsibility through a buyback system

# 🧰 BuyBack Box (BBB)

BuyBack Box is a family-first accountability tool designed to help kids learn responsibility in a fun, gamified way. The concept is simple: when kids leave their stuff lying around the house, it gets cleaned up and placed in the BuyBack Box. To reclaim their items, they "buy" them back using virtual allowance — encouraging ownership, tidiness, and helpfulness.

## 🧠 Why This Project?

As a parent, I constantly faced the tension between keeping the home clean and letting my kids learn from their mess. BuyBack Box offers a healthy middle ground — the house stays tidy, and kids engage with their responsibilities in a fun, trackable way.

I’m building this as both a family tool and a **DevOps portfolio project** to deepen my skills in serverless architecture, CI/CD, and modern cloud workflows.

## 🎯 MVP Features

- 📸 Log Item: Cleaner uploads a photo and assigns an owner
- 📦 BuyBack Box: Each child sees what they need to reclaim
- 💰 Redeem Items: Items are bought back using allowance points
- 🔁 Weekly Reconciliation: Settles accounts between siblings
- 👥 User Profiles: Parent sets up children, allowance rates, and prices
- 📈 Transactions: Track who cleaned what and who paid whom

## 🚧 Planned Tech Stack

| Layer        | Tool / Service              |
|-------------|-----------------------------|
| Frontend     | React Native (Expo)         |
| API Gateway  | AWS API Gateway             |
| Backend      | AWS Lambda (Node.js)        |
| Database     | Amazon DynamoDB             |
| File Storage | Amazon S3 (for photos)      |
| Auth         | Amazon Cognito (later phase)|
| AI/NLP       | Amazon Bedrock (future idea)|

## 🧪 DevOps Learning Focus

This project will help me gain hands-on experience with:
- ✅ Infrastructure as Code (IaC) using AWS SAM or Terraform
- ✅ CI/CD pipelines via GitHub Actions
- ✅ Observability with CloudWatch logs/alerts
- ✅ Secure serverless architecture using IAM and Cognito
- ✅ Event-driven architecture using API Gateway and Lambda

## 🛠️ Project Status

- ✅ GitHub repo created and development environment configured
- 🟡 README + MVP planning
- 🔜 First backend milestone: `/log-item` API (photo + metadata)
- 🔜 Frontend scaffold via Expo

## 🗂️ Repo Structure (Planned)

/backend (Serverless backend with AWS Lambda functions for logging, retrieving, deleting, and redeeming items. Handles image uploads to S3 and item data in DynamoDB)
└── logItem/
└── index.js
└── template.yaml
/frontend(Expo React Native app for the BuyBack Box user interface. Includes screens for adding items, reusable UI components, theming, and API integration)
└── App.js
└── components/
└── UploadItemCard.js
/docs
└── MVP_Spec.md
└── Architecture.drawio

**main.tf**  
Terraform script for provisioning AWS infrastructure (S3 bucket, DynamoDB table, IAM roles, Lambda functions)

## 🛰️ Frontend–Backend Communication

The Expo React Native app communicates with the backend via RESTful API endpoints exposed by AWS API Gateway. Each endpoint triggers a Lambda function that interacts with DynamoDB and S3.

**API Endpoints & Data Flow:**

- **Log Item:**  
  `POST /log-item`  
  Uploads item metadata and a base64-encoded image. Lambda stores the image in S3 and item data in DynamoDB.

- **Get Items:**  
  `GET /get-items?owner_name=<name>&status=<status>`  
  Retrieves items for a specific owner (child) from DynamoDB.

- **Redeem Item:**  
  `POST /redeem-item`  
  Marks an item as redeemed in DynamoDB.

- **Delete Item:**  
  `DELETE /delete-item?item_id=<id>`  
  Deletes an item from DynamoDB.

All API calls are made from the Expo app using fetch, with the API base URL set in `frontend/app/config.ts`. See `frontend/app/api.ts` for implementation details.

## Dependencies
| Purpose | Frontend Dependencies | Backend Dependencies |
| :--- | :--- | :--- |
| **UI/Navigation** | `react`, `react-native`, `expo`, `expo-router`, `@react-navigation/*`, `@expo/vector-icons` | — |
| **Media/Animation** | `expo-image`, `expo-image-picker`, `expo-file-system`, `expo-blur`, `expo-haptics`, `reanimated` | — |
| **Theming/Fonts** | `expo-font`, `expo-system-ui`, `expo-status-bar`, `expo-symbols` | — |
| **AWS/Storage** | — | `@aws-sdk/client-dynamodb`, `lib-dynamodb`, `@aws-sdk/client-s3`, `crypto` |
| **Dev Tools** | `eslint`, `typescript`, `@types/react` | — |
| **Infra** | — | `Terraform` (`main.tf`) |

## 🤝 Contributing

This project is being built in public as part of my DevOps learning journey. If you're a fellow learner or parent with ideas, feel free to submit feedback, raise issues, or fork the repo.

## 📬 Contact

Created by **Jeremy Martin**  
GitHub: [@JMart2210](https://github.com/JMart2210)  