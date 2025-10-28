# 🔤 --> न Transliteration: Romanized to Devanagari using Seq2Seq LSTM

![Python](https://img.shields.io/badge/Python-3.11-blue)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3.5.3-blue)
![Flask](https://img.shields.io/badge/Flask-2.3.3-lightgrey)
![Fly.io](https://img.shields.io/badge/Deployment-Fly.io-8A2BE2?logo=flydotio&logoColor=white)
![Netlify](https://img.shields.io/badge/Frontend-Netlify-00C7B7?logo=netlify&logoColor=white)
[![Live Demo](https://img.shields.io/badge/Live-Demo-green)](https://transliteration-romanized-devanagari.netlify.app/)

---

## 🚀 Project Overview

This project implements an **AI-based transliteration system** that converts **Romanized Hindi text (e.g., "ghar", "namaste") into Devanagari script (e.g., "घर", "नमस्ते")** using a **Sequence-to-Sequence (Seq2Seq) architecture** with **LSTM (Long Short-Term Memory)** networks.  

The application includes both **model training and web deployment**, making it a complete end-to-end transliteration solution.

---

### 🏦 Model Architecture
The transliteration system is built using a **Seq2Seq neural network**:

- **Encoder**: Reads Latin characters and converts them into dense hidden representations.  
- **Decoder**: Predicts Devanagari output one character at a time.  
- **RNN Cell**: LSTM (4-gate structure: input, forget, output, and cell gates).  
- **Framework**: PyTorch.

---

### ⚙️ Model Configuration

| Parameter | Symbol | Value |
|------------|---------|--------|
| Embedding Dimension | E | 128 |
| Hidden Units | H | 256 |
| Sequence Length | L | 20 |
| Layers | — | 1 |
| Source Vocabulary Size | Vₛ | 29 |
| Target Vocabulary Size | Vₜ | 67 |

---

## 📊 Model Statistics

### Trainable Parameters
**Actual Parameters:** 820,032  
**Theoretical Estimate:** 817,987  

**Formula Used:**
Params = (Vₛ + Vₜ)×E + 2×g×(E×H + H² + H) + H×Vₜ + Vₜ
where `g = 4` (LSTM gates)

---

### ⚙️ Computation Estimate (MACs)
**Approximate Computations:** 15,728,640 MACs per sequence  

**Formula Used:**
MACs = 2 × L × g × (E × H + H²)

---

## 🧮 Explanation of Formulas

- The **factor g** represents the number of gates per RNN cell (LSTM = 4, GRU = 3, Simple RNN = 1).  
- Computation counts consider only major matrix multiplications, ignoring activations and bias additions.  
- Embedding and projection layers slightly increase actual parameters beyond theoretical estimates.

---

## 🖥️ Web Application

The project provides a **Vite+React-based FrontEnd** and **Flask BackEnd** for interactive transliteration.

### Frontend Highlights

- ⚡ Built with **Vite + React + Tailwind CSS**
- 📊 **Model Explanation Card** that dynamically displays architecture, formulas, and computed values
- 🧑‍💻 Has a option to run in **Google Colab**
- 🌐 Fully responsive UI with minimal, scientific-style design

### Backend Highlights
- 🧩 **Flask API** for inference
- 🧠 **PyTorch** model loading and prediction
- 🧾 Handles real-time transliteration requests efficiently

---

## 🛠️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/RohithReddyGK/Transliteration-Romanized-to-Devanagari.git
cd Transliteration-Romanized-to-Devanagari
```

### 2️⃣ Backend Setup (Flask)
Create a virtual environment and install dependencies:
```bash
python -m venv literation
literation\Scripts\activate    

pip install -r requirements.txt
```
#### Run the BackEnd:
```bash
python app.py
```
The backend will run on http://localhost:5000

### 3️⃣ Frontend Setup (React)
```bash
cd frontend
npm install
npm run dev
```
The frontend will run on http://localhost:5173

---

### ☁️ Deployment

-- **Frontend:** Deployed on [Netlify](https://transliteration-romanized-devanagari.netlify.app/)
-- **Backend:** Deployed on [Fly.io](https://transliteration.fly.dev/), configured using **Dockerfile**.

---

### 🔎Example Usage

| Input (Romanized) | Output (Devanagari) |
| ----------------- | ------------------- |
| ghar              | घर                  |
| namaste           | नमस्ते              |
| pyaar             | प्यार               |
| dosti             | दोस्ती              |

---

### 🏁 Conclusion

This project successfully demonstrates a deep-learning-based transliteration system capable of converting Romanized String (ghar) to Devanagari (घर) using a Seq2Seq LSTM model.
It combines a robust neural model with a clean and functional web interface, making it a powerful example of AI-driven linguistic technology.

---

## 🧑‍💻 Colab Integration

After experimenting with UI:
Click “**Run in Google Colab**” to explore the notebook interactively.

---

## 🙋‍♂️ Author

**Rohith Reddy.G.K**  
🔗 [GitHub Profile](https://github.com/RohithReddyGK)  
🔗 [LinkedIn Profile](https://www.linkedin.com/in/rohithreddygk)

---

### 🌟 **If you like this project, give it a ⭐ **
