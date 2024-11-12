# Campus-Nav: 3D Interactive Campus Navigation System

**Campus-Nav** is an advanced 3D interactive map application designed to enhance campus navigation. This tool provides real-time location tracking and a searchable database of campus points of interest to assist students, faculty, and visitors in navigating campus facilities efficiently.

## Features
- **Real-Time Location Tracking**: Displays the user's current position on the 3D map to facilitate intuitive navigation.
- **Searchable Points of Interest**: Quickly find key locations, including buildings, faculty offices, student services, and classrooms.
- **Interactive 3D Visualization**: Users can zoom, pan, and rotate the 3D model to explore the campus from different perspectives.
- **Integration of GIS Data**: Combines Three.js for rendering and QGIS2threejs for geographical data export, creating a detailed and interactive 3D environment.

## Live Demo
Experience **Campus-Nav** on [GitHub Pages](https://shaishillo.github.io/Campus-Nav/).

## Technical Overview
- **Three.js**: A powerful JavaScript library for rendering animated 3D graphics directly in the browser with WebGL.
- **QGIS2threejs**: A plugin for QGIS that exports GIS data into formats compatible with Three.js, enhancing real-world data integration.
- **IndexedDB**: Provides efficient client-side storage and state management, allowing the application to maintain data across sessions.

## Getting Started

### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/): JavaScript runtime for running and managing the project locally.
- [npm](https://www.npmjs.com/): Node package manager (usually installed with Node.js).

### Installation
1. **Clone the repository**:
   ```bash
   git clone https://github.com/idan08/Campus-Nav.git
   cd Campus-Nav
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm start
   ```
   This command starts a local development server and opens the project in your web browser. Changes to the code will be reflected live.

### Building for Production
To create a production-ready build, run:
```bash
npm run build
```
This will generate optimized static files in the `dist` or `build` directory.

## How to Run a 3D JavaScript Project
1. **Set Up Three.js**: Make sure the Three.js library is correctly imported in your project.
2. **Import Project Scripts**: Ensure all necessary JavaScript and JSON data (such as GIS data) files are loaded into the project.
3. **Serve the Application**: For a complete 3D JavaScript project like Campus-Nav, a local development server or deployment platform is needed to view the 3D content.

## Contributions
Contributions are welcome! If you'd like to contribute, follow these steps:
- Fork the repository.
- Create a new branch (`git checkout -b feature/your-feature`).
- Commit your changes (`git commit -m 'Add new feature'`).
- Push to the branch (`git push origin feature/your-feature`).
- Open a pull request.

## License
This project is licensed under [MIT License](LICENSE).

## Author
**Shai Shillo**

## Acknowledgments
- Special thanks to contributors and the communities of **Three.js** and **QGIS** for their support and resources.

## Images
![](assets/Screenshot%202024-11-12%20at%2017.16.23.png)
![](assets/Screenshot%202024-11-12%20at%2017.17.04.png)
![](assets/Screenshot%202024-11-12%20at%2017.17.14.png)
![](assets/Screenshot%202024-11-12%20at%2017.17.26.png)
![](assets/Screenshot%202024-11-12%20at%2017.18.10.png)
![](assets/Screenshot%202024-11-12%20at%2017.18.21.png)
![](assets/Screenshot%202024-11-12%20at%2017.18.30.png)
![](assets/Screenshot%202024-11-12%20at%2017.18.42.png)


