# AeroVit - Gamified Hybrid AI Fitness Platform

## Portfolio Summary

**Project Type:** Computer Engineering Capstone Project  
**Category:** Health & Fitness Technology, IoT, AI/ML, Web3  
**Status:** In Development (40% Complete)  
**Last Updated:** December 2024

---

## 🎯 Project Overview

AeroVit is an innovative fitness ecosystem that combines **wearable technology**, **real-time AI coaching**, and **blockchain-based rewards** to create a comprehensive, gamified fitness experience. The platform features a custom ESP32-based smartwatch, a cross-platform mobile application, and an AI-powered coaching system that provides personalized guidance based on real-time biometric data and computer vision.

### Key Innovation
First fitness platform to integrate:
- ✅ Custom wearable hardware with multi-sensor fusion
- ✅ Real-time pose tracking with BlazePose
- ✅ Adaptive AI coaching using Reinforcement Learning
- ✅ Web3 rewards and gamification

---

## 🏗️ System Architecture

### 1. **AeroVit Watch** (ESP32-S3 Wearable Device)

**Hardware:**
- Waveshare ESP32-S3-Touch-LCD-1.69 development board
- 240x280 ST7789 touch display (CST816S controller)
- MAX30102 pulse oximeter (SpO2 + Heart Rate)
- QMI8658 6-axis IMU (accelerometer + gyroscope)
- Bluetooth Low Energy (BLE) connectivity

**Features:**
- Real-time biometric monitoring (SpO2, heart rate, temperature)
- Motion-based exercise form validation
- Gesture-based controls (shake, tap, rotate)
- Activity auto-detection (running, cycling, weightlifting)
- Fall detection with emergency alerts
- QR code pairing system
- Haptic feedback via vibration motor
- Low-power design for all-day wear

**Technical Highlights:**
- Custom BLE protocol for efficient data streaming
- LVGL-based UI with smooth animations
- Advanced sensor fusion algorithms
- Signal filtering for accurate biometric readings

---

### 2. **Mobile Application** (Flutter)

**Platform:** Cross-platform (Android 5.0+, iOS 10.0+)

**Core Features:**

#### Real-Time Pose Tracking
- MediaPipe BlazePose integration (33 landmarks)
- 22 exercise types across 5 muscle groups
- Scientifically-derived thresholds from 31,033 samples
- Camera angle validation and jitter reduction
- Automatic rep counting with FSM logic
- Exercise form feedback

#### Biometric Integration
- Real-time data streaming from AeroVit Watch
- Multi-sensor fusion (HR, SpO2, temperature, motion)
- Stress score calculation
- Recovery score analysis
- Workout intensity tracking

#### AI Coaching System
- Proximal Policy Optimization (PPO) RL model
- 18-dimensional state space (biometrics + engagement)
- 6 discrete coaching actions
- Trained on 749 balanced samples
- Context-aware recommendations
- Adaptive difficulty adjustment

#### Gamification & Social
- Points system (earn points per workout)
- Achievement system with milestones
- Progress tracking and statistics
- Workout history and analytics
- Social sharing features

**Technology Stack:**
- Flutter 3.9.2 with Dart
- Firebase (Auth, Firestore, Storage)
- Provider & GetX for state management
- Flutter Blue Plus for BLE communication
- Google ML Kit for pose detection
- FL Chart for data visualization

---

### 3. **AI Coaching System**

#### Reinforcement Learning Model
**Algorithm:** Proximal Policy Optimization (PPO)
- Policy Network: Multi-Layer Perceptron (MLP)
- Training: 200,000 timesteps on AWS SageMaker
- Dataset: 749 naturally balanced samples
- State Space: 18 dimensions (engagement + biometrics)
- Action Space: 6 discrete coaching strategies

**Training Infrastructure:**
- Python 3.8-3.11
- Stable-Baselines3 for RL
- PyTorch backend
- TensorBoard monitoring
- AWS SageMaker for cloud training

#### Pose Detection System
**Framework:** MediaPipe BlazePose (LIVE_STREAM mode)

**Capabilities:**
- Real-time landmark detection (33 points)
- Exercise recognition for 22 exercises
- Rep counting with state machine
- Form validation and feedback
- Camera positioning guidance

**Exercise Categories:**
- 🦵 Legs: Squats, Lunges, Bulgarian Splits, Wall Sits
- 💪 Push: Push-ups, Shoulder Press, Dips, Incline/Decline Push-ups
- 🏋️ Pull: Pull-ups, Chin-ups, Inverted Rows, Lat Pulldowns
- 🔄 Core/Abs: Russian Twists, Bicycle Crunches, Leg Raises, Mountain Climbers, Planks
- 🤸 Full Body: Jumping Jacks, Burpees, High Knees, Star Jumps

**Quality Features:**
- One Euro Filter for jitter reduction
- Inactivity detection with auto-reset
- Color-coded angle validation
- Confidence indicators for tracking quality

---

### 4. **Planned Web3 Integration**

**Blockchain Features:**
- Points-to-token conversion (100 points = 1 AERO token)
- Achievement NFTs (ERC-721 badges)
- Wallet integration (MetaMask, WalletConnect)
- Decentralized fitness data storage
- Smart contracts for reward distribution

**Benefits:**
- True ownership of fitness achievements
- Monetization of fitness efforts
- Transparent reward system
- Community governance potential

---

## 🎯 Key Differentiators

1. **Multi-Modal Sensor Fusion** - Combines 6+ sensors (HR, SpO2, IMU, temperature, pose, motion) for comprehensive health insights
2. **Hardware + Software Integration** - Custom wearable device seamlessly integrated with mobile AI coach
3. **Real-Time Form Validation** - Both IMU-based (watch) and vision-based (app) exercise tracking
4. **Adaptive AI Coaching** - RL-powered system that learns and adapts to user behavior
5. **Web3 Rewards** - First fitness platform with blockchain-based incentivization
6. **Scientific Accuracy** - Pose detection thresholds derived from 31,033 real exercise samples
7. **Gesture Controls** - Hands-free operation during workouts
8. **Safety Features** - Fall detection with emergency alerts

---

## 📊 Technical Metrics

### Performance
- **Pose Detection:** 30+ FPS real-time tracking
- **BLE Latency:** <100ms data streaming
- **Model Accuracy:** Trained on 749 balanced samples
- **Exercise Library:** 22 exercises with scientific thresholds
- **Dataset Size:** 31,033 pose samples from Kaggle

### Scalability
- Cloud-based RL training (AWS SageMaker)
- Firebase backend for user data
- Cross-platform mobile support
- Modular architecture for feature expansion

### Code Quality
- Comprehensive documentation
- Modular component design
- Extensive testing protocols
- Version control with Git

---

## 🛠️ Development Tools & Technologies

### Hardware Development
- PlatformIO (ESP32 development)
- ESP-IDF framework
- LVGL for UI
- I2C/SPI protocols
- BLE stack

### Mobile Development
- Flutter/Dart
- Android Studio / Xcode
- Firebase Console
- VS Code with extensions

### AI/ML Development
- Python ecosystem (NumPy, Pandas, Scikit-learn)
- PyTorch for neural networks
- Stable-Baselines3 for RL
- MediaPipe for pose detection
- TensorBoard for monitoring
- Jupyter notebooks for experimentation

### Cloud & Infrastructure
- AWS SageMaker (model training)
- Firebase (backend services)
- Git/GitHub (version control)

---

## 📈 Project Status & Roadmap

### ✅ Completed (40%)
- ESP32 watch hardware integration
- BLE communication protocol
- Basic mobile app with pose detection
- RL model training pipeline
- Biometric data collection and display
- QR code pairing system
- 22 exercise pose detection

### 🔄 In Progress
- Advanced sensor fusion algorithms
- IMU-based form validation
- Enhanced UI/UX with animations
- Workout history and analytics

### 📅 Planned Features
- **Phase 1** (Weeks 1-4): Web3 rewards foundation
- **Phase 2** (Weeks 5-8): IMU features + achievements
- **Phase 3** (Weeks 9-12): Advanced biometric fusion + WiFi
- **Phase 4** (Weeks 13-16): Polish + launch preparation

---

## 🎓 Learning Outcomes

### Technical Skills Developed
- **Embedded Systems:** ESP32 programming, sensor integration, power optimization
- **Mobile Development:** Flutter/Dart, cross-platform design, BLE communication
- **Machine Learning:** RL algorithms, pose detection, model training and deployment
- **Computer Vision:** MediaPipe, real-time video processing, landmark tracking
- **Cloud Computing:** AWS services, distributed training, serverless architecture
- **Blockchain:** Smart contracts, token economics, Web3 integration
- **System Design:** Multi-component architecture, data pipelines, API design

### Engineering Practices
- Agile development methodology
- Version control and collaboration
- Technical documentation
- Testing and validation protocols
- Performance optimization
- User experience design

---

## 🎯 Impact & Applications

### Target Users
- Fitness enthusiasts seeking personalized coaching
- Athletes requiring form validation
- Health-conscious individuals tracking biometrics
- Users interested in gamified fitness experiences
- Early adopters of Web3 technology

### Potential Market Applications
- Consumer fitness wearables
- Physical therapy and rehabilitation
- Athletic training and performance
- Corporate wellness programs
- Remote fitness coaching platforms

### Research Contributions
- Novel sensor fusion techniques for fitness tracking
- RL-based adaptive coaching methodology
- Integration of wearable + vision-based pose tracking
- Practical application of Web3 in health tech

---

## 📞 Project Information

**Repository:** ProjectA (GitHub: Aera0908)  
**Current Branch:** new_app  
**Documentation:** Comprehensive markdown files in project root  
**License:** [To be specified]

### Project Structure
```
Project Aerovit/
├── Aerovit_app/          # Flutter mobile application
├── aerovit-watch/        # ESP32 wearable firmware
├── Blazepose-test/       # Pose detection system
├── ai_coach_dummy/       # AI coaching prototype
├── ai_coach_dataset/     # RL training data and scripts
├── RL_Model_training/    # Reinforcement learning models
└── Documentation/        # Technical docs and guides
```

---

## 🏆 Summary

AeroVit represents a comprehensive integration of **hardware engineering**, **software development**, **artificial intelligence**, and **emerging Web3 technology** to solve real-world fitness challenges. The project demonstrates proficiency in:

- **Full-stack IoT development** from hardware to cloud
- **Advanced AI/ML techniques** including RL and computer vision
- **Cross-platform mobile development** with modern frameworks
- **System architecture design** for complex multi-component systems
- **Emerging technologies** including blockchain and decentralized applications

This capstone project showcases the ability to conceptualize, design, and implement a complete product ecosystem while applying cutting-edge technologies to create meaningful user value.

---

*This document provides a high-level portfolio summary. For detailed technical documentation, please refer to specific README files and implementation guides within each project component.*
