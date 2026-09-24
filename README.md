# Zenith OS

<div align="center">
  <img src="icon.png" width="128" height="128" alt="Zenith OS Icon">
  <h3>A Sleek, Gamified Productivity & Eye Care OS</h3>
</div>

Zenith OS is a modern, desktop-native productivity application built to keep you on top of your game. It forces you to prioritize tasks effectively using an Eisenhower Matrix, tracks your XP to keep you motivated, and provides aggressive, un-ignorable reminders for your daily and weekly habits.

## 🌟 Features

- **Eisenhower Matrix Task Management**: Automatically sorts your tasks into Do First, Schedule, Delegate, or Eliminate based on urgency and importance.
- **Rich Task Reminders**: Set specific dates and times for tasks. Supports Daily and Weekly repeating tasks that automatically regenerate when completed.
- **Eye Care (20-20-20 Rule)**: Built-in 20-20-20 eye care monitor that reminds you to look 20 feet away for 20 seconds with a dedicated full-screen overlay (skippable if needed).
- **Customizable Alerts**: Never miss a task again. Choose between standard native Windows notifications or an aggressive, full-screen "Screen Block" alert with a countdown timer to grab your attention.
- **Gamification Engine**: Earn XP for completing tasks, level up, and maintain streaks to build momentum.
- **Background Desktop Native**: Sits quietly in your system tray, constantly monitoring your tasks in the background without cluttering your taskbar.

## 🚀 Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Desktop Runtime**: [Electron](https://www.electronjs.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction) (with local storage persistence)

## 🛠️ Installation & Development

To run Zenith OS locally in development mode:

```bash
# Clone the repository
git clone https://github.com/yourusername/zenith-os.git
cd zenith-os

# Install dependencies
npm install

# Start the development server and Electron app
npm run dev
```

## 📦 Building for Production

To compile Zenith OS into a standalone Windows `.exe` installer:

```bash
# Run the build script
npm run build
```

This will output a setup executable in the `build_release/` directory.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
