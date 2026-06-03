# EMG Controller - Overall Documentation

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![Platform](https://img.shields.io/badge/platform-ESP32S3-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## Table of Contents

- [Project Overview](#-project-overview)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Hardware Components](#-hardware-components)
- [Software Components](#-software-components)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Development Tools](#-development-tools)
- [Getting Started](#-getting-started)
- [Use Cases](#-use-cases)
- [Version History](#-version-history)
- [Contributing](#-contributing)
- [License](#-license)

---

## Project Overview

The **EMG Controller** is a real-time electromyography (EMG) signal processing and visualization system designed for muscle activity monitoring and human-computer interaction. Built on the ESP32S3 microcontroller platform, it captures, processes, and visualizes EMG signals with professional-grade accuracy and provides multiple interaction modes including game control and data analysis.

### Key Capabilities
- Real-time EMG signal acquisition and processing
- Adaptive threshold calibration for different users and muscle groups
- Multiple visualization interfaces (Python GUI, Serial Plotter)
- Game controller functionality (Roblox integration)
- Professional signal analysis (RMS, envelope detection, threshold visualization)

---

## Tech Stack

### Hardware
| Component | Specification | Purpose |
|-----------|--------------|---------|
| **Microcontroller** | ESP32S3 (Seeed XIAO ESP32S3) | Signal acquisition & processing |
| **EMG Sensor** | EMG Candy (Upside Down Labs) | Pre-amplified EMG signal (0-3.3V) |
| **PCB** | Custom KiCad Design | Circuit integration & connections |
| **Enclosure** | Custom 3D Design (Fusion 360) | Hardware protection |

### Firmware
| Technology | Version/Spec | Purpose |
|------------|-------------|---------|
| **Platform** | ESP32 Arduino Framework | Core firmware development |
| **IDE Support** | Arduino IDE / PlatformIO | Code compilation & upload |
| **Sample Rate** | 500 Hz | Signal acquisition frequency |
| **Communication** | Serial UART @ 115200 baud | Data transmission |
| **Language** | C/C++ (Arduino) | Embedded programming |

### Software (Python)
| Library | Version | Purpose |
|---------|---------|---------|
| **pyserial** | ≥3.5 | Serial communication with ESP32 |
| **matplotlib** | ≥3.8.0 | Real-time signal visualization |
| **numpy** | ≥1.26.2 | Numerical computations |
| **pynput** | ≥1.7.6 | Keyboard simulation for game control |

### Design & Development
| Tool | Purpose |
|------|---------|
| **KiCad** | PCB schematic & layout design |
| **Fusion 360** | 3D enclosure modeling |
| **Git** | Version control |
| **VS Code / Cursor** | Code editor & development |
| **PlatformIO** | Advanced ESP32 development (optional) |

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    EMG CONTROLLER SYSTEM                     │
└─────────────────────────────────────────────────────────────┘

┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│              │      │              │      │              │
│  EMG Sensor  │─────▶│  ESP32S3     │◀────▶│  Computer    │
│  (EMG Candy) │      │  Processor   │ USB  │  (Python)    │
│              │      │              │      │              │
└──────────────┘      └──────────────┘      └──────────────┘
  Analog Signal         Digital Signal        Visualization
  0-3.3V               Serial @ 115200         & Control

┌─────────────────────────────────────────────────────────────┐
│                    SIGNAL PROCESSING PIPELINE                │
└─────────────────────────────────────────────────────────────┘

EMG Sensor Output (Pre-processed)
    │
    ▼
ADC Sampling (500 Hz)
    │
    ▼
Moving Average Filter (Envelope Detection)
    │
    ▼
RMS Calculation (20-sample window)
    │
    ▼
Two-Stage Smoothing (Fast + Display)
    │
    ▼
Adaptive Threshold Detection (ON/OFF)
    │
    ▼
Serial Output ────────────▶ Python Visualizer
                           │
                           ├─ Real-time Graphs
                           ├─ Statistical Analysis
                           └─ Game Controller (Keyboard)
```

### Processing Stages

1. **Signal Acquisition**: EMG Candy provides pre-amplified, rectified signal (0-3.3V)
2. **Sampling**: ESP32S3 ADC samples at 500 Hz (12-bit resolution: 0-4095)
3. **Envelope Detection**: 16-sample circular buffer for moving average
4. **RMS Calculation**: 20-sample rolling RMS for smooth signal representation
5. **Calibration**: Two-phase adaptive calibration (10s relaxed + 10s flex)
6. **Threshold Detection**: Binary ON/OFF detection with hysteresis
7. **Data Transmission**: Serial output @ 115200 baud to computer

---

## Hardware Components

### 1. Microcontroller: Seeed XIAO ESP32S3

**Specifications:**
- **Processor**: Dual-core Xtensa LX7 @ 240 MHz
- **Memory**: 512 KB SRAM, 8 MB Flash
- **ADC**: 12-bit resolution, multiple channels
- **USB**: Native USB support (CDC)
- **Size**: Ultra-compact (21×17.5mm)
- **Pin Used**: GPIO8 (D9) for EMG signal input

**Why ESP32S3?**
- High sampling rate capability (500 Hz+)
- Built-in USB CDC for easy computer connection
- Sufficient processing power for real-time filtering
- Low power consumption
- Arduino ecosystem support

### 2. EMG Sensor: EMG Candy (Upside Down Labs)

**Specifications:**
- **Output Range**: 0-3.3V analog
- **Pre-processing**: Built-in amplification, rectification, and envelope detection
- **Power**: 3.3V from ESP32
- **Connection**: 3-electrode setup (Signal, Ground, Reference)

**Key Features:**
- Pre-conditioned signal (no additional filtering needed)
- Plug-and-play design
- Medical-grade signal quality

### 3. Custom PCB (KiCad Design)

**Features:**
- ESP32S3 integration
- EMG Candy connector interface
- Power management circuitry
- Compact form factor

**Files Location**: `EMG_CONTROL_INTERFACE/`

### 4. 3D Printed Enclosure (Fusion 360)

**Components:**
- `emg v2 body.f3d` - Main enclosure body
- `emg v2 top.f3d` - Top cover

**Design Features:**
- Custom-fit for PCB assembly
- Access ports for USB and electrodes
- Professional appearance

---

## Software Components

### Firmware: `emg_function.ino`

**Core Features:**
- **Sampling**: 500 Hz interrupt-driven ADC reading
- **Signal Processing**: 
  - Moving average filter (16 samples)
  - RMS calculation (20 samples)
  - Two-stage smoothing for clean output
- **Calibration**:
  - 3-second wait period
  - 10-second relaxed baseline measurement
  - 10-second flex peak detection
  - Adaptive threshold calculation
- **State Detection**: Binary ON/OFF with hysteresis
- **Output Format**: CSV (timestamp, envelope, RMS, thresholds, state)

**Key Parameters:**
```cpp
SAMPLE_RATE = 500 Hz
BUFFER_SIZE = 16 samples
RMS_BUFFER_SIZE = 20 samples
SPIKE_THRESHOLD_POSITION = 0.15 (15% above baseline)
HOLD_THRESHOLD_RATIO = 0.6 (60% of spike threshold)
```

### Python Applications

#### 1. **EMG Visualizer** (`emg_visualizer.py`)

**Features:**
- Real-time dual-plot display
- Threshold visualization
- Live statistics (current, average, max, min)
- Muscle state indicator
- Professional matplotlib-based GUI

**Usage:**
```bash
python emg_visualizer.py
# or double-click: run_visualizer.bat
```

#### 2. **Simple Visualizer** (`emg_visualizer_simple.py`)

**Features:**
- Lightweight version
- Single plot display
- Minimal dependencies
- Fast startup

**Usage:**
```bash
python emg_visualizer_simple.py
# or double-click: run_simple_visualizer.bat
```

#### 3. **Roblox Controller** (`roblox_emg_controller.py`)

**Features:**
- EMG-to-keyboard mapping
- Single flex → W (forward)
- Double flex → S (backward)
- Triple flex → A (left)
- Quad flex → D (right)
- Visual feedback GUI

**Usage:**
```bash
python roblox_emg_controller.py
# or double-click: run_roblox_controller.bat
```

#### 4. **Utility Scripts**

- `check_port.py` - Detect available COM ports
- `test_connection.py` - Test serial communication

---

## Features

### Signal Processing
- **500 Hz Sampling Rate**: Professional-grade temporal resolution
- **Envelope Detection**: 16-sample moving average filter
- **RMS Calculation**: 20-sample rolling RMS
- **Two-Stage Smoothing**: Fast response + smooth display
- **Noise Handling**: Baseline tracking and adaptive thresholds

### Calibration
- **Automatic Calibration**: Two-phase adaptive system
- **User-Specific**: Adapts to individual muscle strength
- **Position-Agnostic**: Works with different electrode placements
- **Statistical Analysis**: Mean, variance, and standard deviation tracking
- **One-Time Setup**: Calibrates at startup, no recalibration needed

### Threshold Detection
- **Binary State**: Clear ON/OFF muscle activation
- **Hysteresis**: Separate spike and hold thresholds prevent flickering
- **Adaptive**: Calculates thresholds from calibration data
- **Configurable**: Easy adjustment via parameters

### Visualization
- **Real-Time Plotting**: Live signal display with matplotlib
- **Dual Views**: Envelope + RMS display
- **Threshold Lines**: Visual threshold indicators
- **Statistics Panel**: Live numerical data
- **State Indicator**: Visual muscle state feedback

### Interaction
- **Game Control**: Roblox keyboard mapping
- **Pattern Recognition**: Multi-flex gesture detection
- **Flexible Mapping**: Customizable key bindings
- **GUI Control**: Enable/disable via interface

---

## Project Structure

```
project/
│
├── emg v2 body.f3d              # 3D enclosure body design
├── emg v2 top.f3d               # 3D enclosure top cover
│
├── EMG_CONTROL_INTERFACE/       # PCB Design Files (KiCad)
│   ├── EMG_CONTROL_INTERFACE.kicad_pcb    # PCB layout
│   ├── EMG_CONTROL_INTERFACE.kicad_sch    # Schematic
│   ├── EMG_CONTROL_INTERFACE.kicad_pro    # Project file
│   └── EMG_CONTROL_INTERFACE-backups/     # Auto-backups
│
├── emg_function/                # Main Software Directory
│   │
│   ├── emg_function.ino         # ESP32S3 Firmware (Arduino)
│   ├── platformio.ini           # PlatformIO configuration
│   ├── requirements.txt         # Python dependencies
│   │
│   ├── emg_visualizer.py        # Full-featured visualizer
│   ├── emg_visualizer_simple.py # Lightweight visualizer
│   ├── roblox_emg_controller.py # Game controller
│   ├── test_connection.py       # Connection tester
│   ├── check_port.py            # Port scanner
│   │
│   ├── run_visualizer.bat       # Windows launcher (main)
│   ├── run_simple_visualizer.bat # Windows launcher (simple)
│   ├── run_roblox_controller.bat # Windows launcher (game)
│   │
│   ├── README.md                # Main documentation
│   ├── START_HERE.md            # Getting started guide
│   ├── SETUP_GUIDE.md           # Detailed setup instructions
│   ├── QUICK_START.txt          # Quick reference
│   ├── QUICK_REFERENCE.md       # Command reference
│   ├── HOW_TO_USE.md            # Usage instructions
│   ├── ROBLOX_CONTROLLER_GUIDE.md # Game controller guide
│   ├── CALIBRATION_UPDATE.md    # Calibration info
│   ├── IMPROVEMENTS.md          # Future enhancements
│   ├── CHANGELOG.md             # Version history
│   ├── FIX_ARDUINO_CACHE.txt    # Troubleshooting
│   └── PYTHON_SETUP_NOTE.txt    # Python setup notes
│
└── PCB pdf/                     # PCB Documentation PDFs

```

---

## Development Tools

### Required Tools

#### For Firmware Development
- **Arduino IDE** (Recommended for beginners)
  - Install ESP32 board support
  - Simple upload process
  - Built-in Serial Monitor
  
- **PlatformIO** (Alternative, advanced)
  - VS Code extension
  - Better dependency management
  - Advanced debugging

#### For Python Development
- **Python 3.8+**
- **pip** (Package manager)
- **VS Code / Cursor** (Recommended editors)

#### For Hardware Design
- **KiCad 7.0+** (PCB design)
- **Fusion 360** (3D modeling)

### Recommended Workflow

1. **Code Editing**: VS Code / Cursor (better editor, AI features)
2. **Firmware Upload**: Arduino IDE (simple, reliable)
3. **Python Execution**: Terminal or batch files
4. **Version Control**: Git

---

## Getting Started

### Quick Start (5 Minutes)

1. **Hardware Setup**
   ```
   EMG Candy → ESP32S3 (GPIO8)
   ESP32S3 → Computer (USB)
   ```

2. **Install Arduino IDE & ESP32 Support**
   - Download from: https://www.arduino.cc/en/software
   - Add ESP32 board URL in preferences
   - Install "esp32 by Espressif Systems" from Board Manager

3. **Upload Firmware**
   - Open `emg_function/emg_function.ino` in Arduino IDE
   - Select: Tools → Board → ESP32S3 Dev Module
   - Select: Tools → Port → Your COM port
   - Click Upload button

4. **Install Python Dependencies**
   ```bash
   cd emg_function
   pip install -r requirements.txt
   ```

5. **Run Visualizer**
   ```bash
   python emg_visualizer.py
   # or double-click: run_visualizer.bat
   ```

### Detailed Setup

See `emg_function/SETUP_GUIDE.md` for comprehensive instructions.

---

## Use Cases

### 1. Biomedical Research
- Muscle activity analysis
- Rehabilitation monitoring
- Fatigue detection studies
- Neuromuscular research

### 2. Human-Computer Interaction
- Gesture-based control
- Accessibility devices
- Alternative input methods
- Gaming interfaces

### 3. Sports & Fitness
- Muscle activation monitoring
- Training optimization
- Form analysis
- Fatigue tracking

### 4. Education
- EMG signal processing learning
- Embedded systems projects
- Real-time signal processing
- Python data visualization

### 5. Prototyping
- Prosthetic control research
- Wearable device development
- Biometric authentication
- Smart device integration

---

## Version History

### Current Version: 2.1 (October 2025)

#### Version 2.1 - Extended Calibration
- Extended calibration from 5s to 10s per phase
- Removed automatic recalibration (one-time only)
- Improved baseline measurement accuracy
- More stable threshold calculation

#### Version 2.0 - ON/OFF Detection Refactor
- Changed from 3-level to binary (ON/OFF) detection
- Simplified threshold system
- Added hysteresis (spike + hold thresholds)
- Improved code organization and documentation
- Enhanced calibration process

#### Earlier Versions
- Initial development with 3-level detection
- Arduino Serial Plotter visualization
- Basic EMG signal processing

See `emg_function/CHANGELOG.md` for complete history.

---

## Future Improvements

### Planned Features
- [ ] Bluetooth/WiFi connectivity
- [ ] Multi-channel EMG support
- [ ] Machine learning gesture recognition
- [ ] Mobile app interface
- [ ] Data logging to SD card
- [ ] Battery power support
- [ ] Advanced filtering options (IIR, FIR)
- [ ] Frequency domain analysis (FFT)
- [ ] Cloud data storage
- [ ] Multi-user profiles

### Hardware Enhancements
- [ ] Smaller PCB form factor
- [ ] Integrated battery management
- [ ] Multiple EMG channel support
- [ ] Haptic feedback
- [ ] OLED display integration

See `emg_function/IMPROVEMENTS.md` for detailed roadmap.

---

## Contributing

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Test thoroughly**
5. **Commit with clear messages**
   ```bash
   git commit -m "Add amazing feature"
   ```
6. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Development Guidelines

- Follow existing code style
- Comment complex algorithms
- Test on actual hardware before submitting
- Update documentation for new features
- Add entries to CHANGELOG.md

---

## License

This project is licensed under the MIT License.

---

## Support & Contact

### Documentation
- **Main Guide**: `emg_function/README.md`
- **Setup**: `emg_function/SETUP_GUIDE.md`
- **Quick Start**: `emg_function/START_HERE.md`
- **Roblox Control**: `emg_function/ROBLOX_CONTROLLER_GUIDE.md`

### Troubleshooting
- Check `emg_function/FIX_ARDUINO_CACHE.txt` for Arduino issues
- Check `emg_function/PYTHON_SETUP_NOTE.txt` for Python issues
- Verify COM port with `check_port.py`
- Test connection with `test_connection.py`

### Repository
- **GitHub**: Aera0908/emg_controller
- **Branch**: main

---

## Credits

**Project by**: CPE4B - 1st Semester DSP Project

**Hardware Components**:
- Seeed Studio - XIAO ESP32S3
- Upside Down Labs - EMG Candy

**Software Libraries**:
- ESP32 Arduino Core
- Python: pyserial, matplotlib, numpy, pynput

**Design Tools**:
- KiCad (PCB design)
- Fusion 360 (3D modeling)

---

## Technical Specifications Summary

| Category | Specification |
|----------|--------------|
| **Microcontroller** | ESP32S3 (Dual-core 240MHz) |
| **Sampling Rate** | 500 Hz |
| **ADC Resolution** | 12-bit (0-4095) |
| **Input Voltage** | 0-3.3V (EMG Candy output) |
| **Serial Baud Rate** | 115200 |
| **Processing Delay** | ~50ms (envelope + RMS) |
| **Calibration Time** | 23 seconds (3s wait + 10s relax + 10s flex) |
| **Power Supply** | USB 5V |
| **Current Draw** | ~100mA typical |
| **Python Version** | 3.8+ |
| **OS Support** | Windows, macOS, Linux |

---

## Key Achievements

- Professional-grade EMG signal processing  
- Real-time visualization with sub-100ms latency  
- Adaptive calibration for different users  
- Multiple interaction modes (visualization + game control)  
- Clean, well-documented codebase  
- Complete hardware design (PCB + enclosure)  
- Cross-platform Python applications  
- Comprehensive documentation  

---

**Last Updated**: December 28, 2025  
**Documentation Version**: 1.0  
**Project Status**: Active Development
