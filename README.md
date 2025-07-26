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

/backend
└── logItem/
└── index.js
└── template.yaml
/frontend
└── App.js
└── components/
└── UploadItemCard.js
/docs
└── MVP_Spec.md
└── Architecture.drawio


## 🤝 Contributing

This project is being built in public as part of my DevOps learning journey. If you're a fellow learner or parent with ideas, feel free to submit feedback, raise issues, or fork the repo.

## 📬 Contact

Created by **Jeremy Martin**  
GitHub: [@JMart2210](https://github.com/JMart2210)  