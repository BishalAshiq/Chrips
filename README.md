
# ChirpChecker Frontend

## Overview of the Project
ChirpChecker is a platform built to validate statements in real-time using advanced AI models and trusted fact-checking systems. It is designed to handle high traffic while ensuring scalability, security, and a seamless user experience.

ChirpChecker Frontend is built with Next.js, styled using Tailwind CSS, and designed for responsive user interfaces. This project includes pages for login, signup, admin, moderator, and end-user functionalities. It is containerized for production and development environments using Docker and Docker Compose.

## How to Clone from GitHub

1. Open your terminal or command prompt.
2. Navigate to the directory where you want to clone the repository.
3. Run the following command:
   ```bash
   git clone https://github.com/c0decrunch/ChirpChecker-Frontend.git
   ```
4. Change to the project directory:
   ```bash
   cd chirpchecker-frontend
   ```

## How to Run Locally

### Prerequisites

- **Windows/Linux**: Ensure Node.js (v23.1.0) and npm (v11.0.0) are installed.

### Steps

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

## How to Run with Docker and Docker Compose

### Prerequisites

- **Windows**: Install Docker Desktop.
- **Linux**: Install Docker and Docker Compose.

### Steps

1. Build and run the containers:
   ```bash
   docker-compose up --build
   ```
2. Access the application:
   - Open [http://localhost:3000](http://localhost:3000) in your browser.

### For Cleanup

To stop and remove containers, networks, and volumes:
```bash
docker-compose down
```

## Production Checklist

Follow these steps to prepare the application for production:

1. **Ensure Environment Variables Are Set**:
   - Update `.env` file with appropriate `NEXT_PUBLIC_AUTH_URL`.
2. **Build the Application**:
   ```bash
   npm run build
   ```
3. **Start Production Server Locally**:
   ```bash
   npm start
   ```
4. **Using Docker in Production**:
   - Build and run the Docker container in detached mode:
     ```bash
     docker-compose up --build -d
     ```
5. **Verify Application**:
   - Test all functionality to ensure the app works as expected.

---

### Additional Notes

- **Browser Compatibility**: Ensure modern browsers are used (e.g., Chrome, Firefox).
- **Database/API**: Verify API endpoints are functional with the correct `NEXT_PUBLIC_AUTH_URL`.
- **Logging**: Check container logs for errors:
  ```bash
  docker logs <container_name>
  ```
