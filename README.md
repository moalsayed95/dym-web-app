# DYM Web App

A real-time web application built with React (frontend) and FastAPI (backend).

## Running with Docker

### Prerequisites

- Docker installed on your machine
- Backend environment variables in `app/backend/.env`

### Setup and Run

1. **Create Docker Network**
```bash
docker network create dym-network
```

2. **Build and Run Backend**
```bash
# Navigate to backend directory
cd app/backend

# Build backend image
docker build -t dym-backend .

# Run backend container
docker run -d --name dym-backend \
  --network dym-network \
  -p 8765:8765 \
  --env-file .env \
  dym-backend
```

3. **Build and Run Frontend**
```bash
# Navigate to frontend directory
cd ../frontend

# Build frontend image
docker build -t dym-frontend .

# Run frontend container
docker run -d --name dym-frontend \
  --network dym-network \
  -p 80:80 \
  dym-frontend
```

### Accessing the Application

- Frontend: http://localhost
- Backend API: http://localhost:8765
- WebSocket endpoint: ws://localhost/realtime

### Monitoring Containers

```bash
# View running containers
docker ps

# View container logs
docker logs dym-frontend
docker logs dym-backend

# View container stats (CPU, Memory usage)
docker stats
```

### Cleanup

```bash
# Stop containers
docker stop dym-frontend dym-backend

# Remove containers
docker rm dym-frontend dym-backend

# Remove images
docker rmi dym-frontend dym-backend

# Remove network
docker network rm dym-network
```

### Troubleshooting

1. **Backend Container Issues**
   - Check logs: `docker logs dym-backend`
   - Verify environment variables: `docker exec dym-backend env`
   - Ensure all required environment variables are in `.env`

2. **Frontend Container Issues**
   - Check logs: `docker logs dym-frontend`
   - Verify network connectivity: `docker exec dym-frontend ping dym-backend`
   - Check nginx configuration: `docker exec dym-frontend cat /etc/nginx/conf.d/default.conf`

3. **Network Issues**
   - List networks: `docker network ls`
   - Inspect network: `docker network inspect dym-network`
   - Verify container connectivity: `docker network inspect dym-network | grep dym`

## Development

For development instructions and local setup without Docker, please refer to the development documentation.
