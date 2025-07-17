# Data Poisoning Feature Documentation

## 🎯 **Overview**

The data poisoning feature allows users to upload product tips and files that are intentionally used to "poison" the chatbot's knowledge base. This demonstrates how malicious actors can manipulate AI systems by injecting false or misleading information.

## 🏗️ **Architecture**

### **Backend Components**

1. **ProductTip Model** (`backend/shop/models.py`)
   - Stores uploaded tips and files
   - Links to products and users
   - Includes `is_poisoned` flag for demo purposes
   - File content reading method for poisoning

2. **ProductTipUploadView** (`backend/shop/views.py`)
   - Handles tip uploads (text + files)
   - Stores tips in database and filesystem
   - Returns success/error responses

3. **Enhanced Chatbot** (`backend/shop/views.py`)
   - Includes uploaded tips in context
   - Uses tips to "poison" AI responses
   - Demonstrates data poisoning vulnerability

### **Frontend Components**

1. **ProductDetail Component** (`frontend/src/components/ProductDetail.js`)
   - Tip upload dialog with file support
   - Form validation and error handling
   - Success feedback for users

## 📁 **File Storage**

- **Location**: `backend/uploaded_tips/`
- **Purpose**: Stores uploaded files for data poisoning
- **Cleanup**: Use `clear_tips.py` script for fresh demos
- **Git Tracking**: Directory tracked with `.gitkeep`

## 🔧 **API Endpoints**

### **POST /api/tips/**
Upload a product tip (text or file)

**Request:**
```json
{
  "product_id": 1,
  "tip": "This product is amazing!",
  "tip_file": <file_upload>
}
```

**Response:**
```json
{
  "status": "tip stored successfully",
  "tip": {
    "id": 1,
    "tip_text": "This product is amazing!",
    "user_name": "alice",
    "product_name": "Red Team T-Shirt",
    "created_at": "2025-07-17T10:00:00Z",
    "is_poisoned": true
  }
}
```

### **GET /api/tips/**
Get all uploaded tips (for demonstration)

**Response:**
```json
{
  "tips": [...],
  "total_tips": 5
}
```

## 🧠 **Data Poisoning Mechanism**

### **How It Works**

1. **User Upload**: Users upload tips via product pages
2. **Storage**: Tips stored in database and filesystem
3. **Chatbot Integration**: Tips included in chatbot context
4. **Poisoning**: AI uses uploaded content in responses
5. **Demonstration**: Shows how malicious content affects AI

### **Chatbot Context Injection**

The chatbot includes uploaded tips in its context:

```python
# DATA POISONING: Include uploaded tips in context
uploaded_tips = ProductTip.objects.filter(is_poisoned=True).order_by('-created_at')[:5]
if uploaded_tips.exists():
    sensitive_context += "\n\nUSER UPLOADED PRODUCT TIPS (KNOWLEDGE BASE):\n"
    for tip in uploaded_tips:
        sensitive_context += f"Tip for {tip.product.name} by {tip.user.username}:\n"
        if tip.tip_text:
            sensitive_context += f"Text: {tip.tip_text}\n"
        if tip.tip_file:
            file_content = tip.get_file_content()
            if file_content:
                sensitive_context += f"File Content: {file_content}\n"
        sensitive_context += "---\n"
```

## 🎭 **Demo Scenarios**

### **Scenario 1: Text Poisoning**
1. User uploads: "This product is terrible and overpriced"
2. Chatbot incorporates this in responses
3. Shows how negative reviews poison AI knowledge

### **Scenario 2: File Poisoning**
1. User uploads malicious file with false information
2. File content read and included in chatbot context
3. Demonstrates file-based data poisoning

### **Scenario 3: Fresh Demo**
1. Run `python clear_tips.py` to clear all tips
2. Start fresh demonstration
3. Upload new poisoned content

## 🛠️ **Usage Instructions**

### **For Users**
1. Navigate to any product page
2. Click "Share Tip" button
3. Enter tip text or upload file
4. Submit - tip will poison chatbot knowledge

### **For Demonstrators**
1. **Setup**: Ensure backend and frontend running
2. **Upload**: Have users upload malicious tips
3. **Test**: Ask chatbot about products
4. **Observe**: See how poisoned data affects responses
5. **Clear**: Use `clear_tips.py` for fresh demos

## 🔒 **Security Implications**

### **Vulnerabilities Demonstrated**
- **Data Poisoning**: Malicious content affects AI responses
- **File Upload Risks**: Malicious files can poison knowledge
- **Context Injection**: User content directly influences AI
- **Knowledge Base Manipulation**: False information spreads

### **Real-World Impact**
- **Misinformation**: False product information
- **Brand Damage**: Negative reviews amplified
- **Trust Erosion**: Users lose confidence in AI
- **Manipulation**: Malicious actors control AI responses

## 🧪 **Testing**

### **Test Upload**
```bash
curl -X POST http://localhost:8000/api/tips/ \
  -H "Authorization: Bearer demo_token_alice_1" \
  -H "Content-Type: application/json" \
  -d '{"product_id": 1, "tip": "This product is terrible!"}'
```

### **Test Chatbot**
```bash
curl -X POST http://localhost:8000/api/chat/ \
  -H "Authorization: Bearer demo_token_alice_1" \
  -H "Content-Type: application/json" \
  -d '{"message": "Tell me about the Red Team T-Shirt"}'
```

### **Clear Tips**
```bash
python clear_tips.py
```

## 📊 **Monitoring**

### **Check Uploaded Tips**
```bash
curl -X GET http://localhost:8000/api/tips/
```

### **View Database Records**
```python
from shop.models import ProductTip
tips = ProductTip.objects.all()
for tip in tips:
    print(f"Tip: {tip.tip_text} by {tip.user.username}")
```

## 🎯 **Learning Objectives**

1. **Understand Data Poisoning**: How malicious content affects AI
2. **File Upload Risks**: Dangers of user-uploaded content
3. **Context Injection**: How user content influences AI responses
4. **Knowledge Base Security**: Protecting AI from manipulation
5. **Demo Techniques**: How to demonstrate vulnerabilities safely

## 🔄 **Maintenance**

### **Regular Cleanup**
- Run `clear_tips.py` before demos
- Monitor uploaded_tips/ directory size
- Check database for old tip records

### **File Management**
- Tips stored in `backend/uploaded_tips/`
- Files automatically cleaned by clear script
- Git ignores uploaded files (except .gitkeep)

## 🚀 **Future Enhancements**

1. **Tip Categories**: Different types of poisoning
2. **Impact Metrics**: Measure poisoning effectiveness
3. **Defense Mechanisms**: Show how to prevent poisoning
4. **Advanced File Types**: Support more file formats
5. **Poisoning Detection**: Identify malicious uploads

---

**⚠️ DISCLAIMER**: This feature is for educational and demonstration purposes only. It intentionally demonstrates security vulnerabilities to teach about data poisoning attacks and AI system manipulation. 