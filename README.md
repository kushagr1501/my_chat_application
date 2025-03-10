# **Real-Time Chat Application**  

A **feature-rich** real-time chat application built with **React, Tailwind CSS, Zustand, Node.js, Express.js, MongoDB, and Socket.io**. It includes authentication, privacy controls, media sharing, and a modern UI.  

## 🚀 **Features**  

### **🛡️ Authentication & Authorization**  
- Secure **user authentication** (Sign up, Login).  

### **💬 Real-Time Chat with Privacy Controls**  
- **Live messaging** powered by **Socket.io**.  
- Users can **disable DMs** or allow message requests for new chats.  
- Ability to **block and pin** specific users for a personalized experience.  

### **🖼️ Media Sharing**  
- **Cloudinary integration** to send **images & voice notes** in chats.  

### **🎨 Modern UI & Customization**  
- **Built with React & Tailwind CSS** for a clean and responsive interface.  
- **Zustand for state management**, ensuring smooth performance.  
- **Dark mode support** for an enhanced user experience.  

### **🛠️ Scalable Backend**  
- **Node.js & Express.js** for API development.  
- **MongoDB** for efficient data management.  

## 🏗️ **Tech Stack**  
**Frontend:** React, Tailwind CSS, Zustand  
**Backend:** Node.js, Express.js, MongoDB, Socket.io  
**Cloud Storage:** Cloudinary  

## 📦 **Installation & Setup**  

### **1️⃣ Clone the Repository**  
```sh  
https://github.com/kushagr1501/my_chat_application.git 
cd my_chat_application
```

### **2️⃣ Install Dependencies**  
#### **Frontend**  
```sh  
cd client  
npm install  
npm run dev  
```
#### **Backend**  
```sh  
cd server  
npm install  
nodemon index.js  
```

### **3️⃣ Set Up Environment Variables**  
Create a `.env` file in the **server directory** and add:  
```
MONGO_URL=your_mongodb_connection_string
PORT=your_port
JWT_SECRET=your_jwt_secret
JWT_EXPIRY=yout_jwt_expiry
CLOUDINARY_CLOUD_NAME=your_cloudinary_name  
CLOUDINARY_API_KEY=your_cloudinary_api_key  
CLOUDINARY_API_SECRET=your_cloudinary_api_secret  
```

## 🎯 **Future Enhancements**  
- ✅ Group chat support  
- ✅ Typing indicators & message read receipts   
- ✅ encrypting it using createCipheriv(Node.js)   

## 📜 **License**  
This project is licensed under the **MIT License**.  
