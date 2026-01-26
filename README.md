# 🗼 Tower of Hanoi Game

An interactive and visually appealing implementation of the classic **Tower of Hanoi** puzzle game built with **React** and **Vite**. This project demonstrates the mathematical puzzle with a modern, user-friendly interface featuring smooth animations, sound effects, and both manual and automatic solving capabilities.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📖 About the Tower of Hanoi

The Tower of Hanoi is a mathematical puzzle invented by French mathematician Édouard Lucas in 1883. The puzzle consists of three rods and a number of disks of different sizes, which can slide onto any rod. The puzzle starts with the disks in a neat stack in ascending order of size on one rod, with the smallest disk at the top.

### 🎯 Objective

Move the entire stack of disks from the source rod to the destination rod, following these simple rules:

1. Only one disk can be moved at a time
2. Each move consists of taking the upper disk from one of the stacks and placing it on top of another stack
3. No larger disk may be placed on top of a smaller disk

## ✨ Features

- 🎮 **Interactive Gameplay**: Click-based interface to move disks between towers
- 🎨 **Modern UI/UX**: Clean, responsive design with smooth animations
- 🌓 **Theme Support**: Toggle between dark and light modes
- 🔊 **Sound Effects**: Audio feedback for moves, wins, and restarts
- 🎵 **Volume Control**: Adjustable volume and mute functionality
- 🤖 **Auto-Solve**: Watch the optimal solution play out automatically
- 📊 **Move Counter**: Track your moves vs. the minimum possible moves
- ⏱️ **Timer**: Keep track of how long it takes to solve the puzzle
- 🎯 **Difficulty Levels**: Choose between 3-7 disks for varying challenge
- 🎉 **Win Detection**: Celebration when you successfully complete the puzzle

## 🛠️ Technologies Used

- **[React](https://react.dev/)** - UI library for building interactive components
- **[Vite](https://vite.dev/)** - Next-generation frontend build tool
- **[React Icons](https://react-icons.github.io/react-icons/)** - Icon library
- **ESLint** - Code quality and consistency
- **CSS3** - Modern styling with gradients and animations

## 🚀 Getting Started

### Prerequisites

- **Node.js** (version 18 or higher recommended)
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Kishore-Krish19/TowersOfHanoi.git
   cd TowersOfHanoi
   ```

2. **Navigate to the game directory**
   ```bash
   cd hanoi-game
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173` (or the URL shown in your terminal)

### Building for Production

```bash
npm run build
```

The optimized build will be created in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 🎮 How to Play

1. **Select Difficulty**: Choose the number of disks (3-7) from the dropdown menu
2. **Move Disks**: 
   - Click on a tower to select the top disk
   - Click on another tower to move the selected disk there
   - The game will only allow valid moves (smaller disk on larger disk)
3. **Track Progress**: 
   - Monitor your move count vs. the optimal solution
   - Watch the timer to see how quickly you can solve it
4. **Win the Game**: Move all disks to the rightmost tower (marked as GOAL)
5. **Use Auto-Solve**: Click "Auto Solve" to watch the optimal solution
6. **Restart**: Click "Restart" to reset the game at any time

### Optimal Solution

The minimum number of moves required to solve the Tower of Hanoi with `n` disks is:

```
Minimum Moves = 2^n - 1
```

For example:
- 3 disks: 7 moves
- 4 disks: 15 moves
- 5 disks: 31 moves
- 6 disks: 63 moves
- 7 disks: 127 moves

## 📁 Project Structure

```
TowersOfHanoi/
├── hanoi-game/
│   ├── public/
│   │   ├── sounds/          # Audio files for game effects
│   │   └── vite.svg         # Vite logo
│   ├── src/
│   │   ├── assets/          # Static assets
│   │   ├── App.jsx          # Main game component
│   │   ├── Footer.jsx       # Footer component
│   │   ├── index.css        # Global styles
│   │   └── main.jsx         # Application entry point
│   ├── index.html           # HTML template
│   ├── package.json         # Project dependencies
│   ├── vite.config.js       # Vite configuration
│   └── eslint.config.js     # ESLint configuration
└── README.md                # This file
```

## 🎨 Customization

### Themes
The application supports both dark and light themes. Click the sun/moon icon to toggle between themes.

### Sound
- Adjust volume using the slider
- Mute/unmute using the speaker icon
- Custom sounds for moves, wins, and restarts

## 🧮 Algorithm

The auto-solve feature implements the recursive Tower of Hanoi algorithm:

```javascript
function solveHanoi(n, source, destination, auxiliary) {
  if (n === 1) {
    moveDisk(source, destination);
    return;
  }
  
  solveHanoi(n - 1, source, auxiliary, destination);
  moveDisk(source, destination);
  solveHanoi(n - 1, auxiliary, destination, source);
}
```

## 📜 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Kishore-Krish19/TowersOfHanoi/issues).

## 👨‍💻 Developer

**Kishore**
- LinkedIn: [@kishore-e-241369279](https://linkedin.com/in/kishore-e-241369279)
- GitHub: [@Kishore-Krish19](https://github.com/Kishore-Krish19)

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Inspired by the classic Tower of Hanoi puzzle by Édouard Lucas
- Built with modern web technologies for educational purposes
- Sound effects enhance the gaming experience

## 📸 Screenshots

*Coming soon - Screenshots will be added to showcase the game interface*

---

**Enjoy playing the Tower of Hanoi! 🎮🗼**
