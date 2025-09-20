#!/usr/bin/env python3
"""
Setup script for Math Teacher AI Backend with Qdrant
"""
import os
import sys
import subprocess
import time
from pathlib import Path

def run_command(cmd, description, timeout=60):
    """Run a command and handle errors"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=timeout)
        if result.returncode != 0:
            print(f"❌ Error: {description} failed")
            print(f"Error output: {result.stderr}")
            return False
        print(f"✅ {description} completed")
        return True
    except subprocess.TimeoutExpired:
        print(f"⏰ {description} timed out")
        return False

def check_service(service_name, host, port):
    """Check if a service is running"""
    import socket
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(5)
        result = sock.connect_ex((host, port))
        sock.close()
        if result == 0:
            print(f"✅ {service_name} is running on {host}:{port}")
            return True
        else:
            print(f"❌ {service_name} is not running on {host}:{port}")
            return False
    except Exception as e:
        print(f"❌ Could not check {service_name}: {e}")
        return False

def main():
    print("🚀 Setting up Math Teacher AI Backend with Qdrant")
    print("=" * 60)
    
    # Check Python version
    if sys.version_info < (3, 9):
        print("❌ Python 3.9+ required")
        sys.exit(1)
    
    # Check if Docker is available
    docker_available = run_command("docker --version", "Checking Docker")
    
    if docker_available:
        print("\n🐳 Docker Setup Option:")
        print("You can use Docker Compose to set up all services:")
        print("  docker-compose up -d")
        print("\nOr continue with manual setup...")
        response = input("Use Docker Compose? (y/n): ").lower().strip()
        
        if response == 'y':
            if run_command("docker-compose up -d", "Starting services with Docker"):
                print("✅ All services started with Docker")
                print("Backend will be available at: http://localhost:8000")
                return
            else:
                print("❌ Docker setup failed, continuing with manual setup")
    
    print("\n🔧 Manual Setup:")
    
    # Install requirements
    if not run_command("pip install -r requirements.txt", "Installing requirements"):
        sys.exit(1)
    
    # Check required services
    print("\n🔍 Checking required services...")
    services_ok = True
    
    if not check_service("PostgreSQL", "localhost", 5432):
        print("⚠️  PostgreSQL not running. Please start it:")
        print("   • macOS: brew services start postgresql")
        print("   • Ubuntu: sudo systemctl start postgresql")
        print("   • Windows: Start PostgreSQL service")
        services_ok = False
    
    if not check_service("Redis", "localhost", 6379):
        print("⚠️  Redis not running. Please start it:")
        print("   • macOS: brew services start redis")
        print("   • Ubuntu: sudo systemctl start redis")
        print("   • Windows: Start Redis service")
        services_ok = False
    
    if not check_service("Qdrant", "localhost", 6333):
        print("⚠️  Qdrant not running. Please start it:")
        print("   • Docker: docker run -p 6333:6333 qdrant/qdrant")
        print("   • Or use Docker Compose for full setup")
        services_ok = False
    
    if not services_ok:
        print("\n❌ Required services are not running")
        print("Please start the required services and run setup again")
        sys.exit(1)
    
    # Setup database
    if not run_command("alembic upgrade head", "Setting up database"):
        print("⚠️  Database setup failed")
    
    # Test Qdrant setup
    print("\n🔧 Testing Qdrant setup...")
    try:
        import sys
        sys.path.append('.')
        from app.services.qdrant_setup import qdrant_setup
        
        if qdrant_setup.health_check():
            if qdrant_setup.setup_collection():
                print("✅ Qdrant collection setup completed")
            else:
                print("⚠️  Qdrant collection setup failed")
        else:
            print("⚠️  Qdrant health check failed")
    except Exception as e:
        print(f"⚠️  Could not test Qdrant setup: {e}")
    
    # Create .env if not exists
    if not Path(".env").exists():
        print("📝 Creating .env file from template...")
        subprocess.run("cp .env.example .env", shell=True)
        print("⚠️  Please edit .env file with your configuration")
    
    print("\n🎉 Backend setup complete!")
    print("\nNext steps:")
    print("1. Edit .env file with your configuration")
    print("2. Ensure all services are running:")
    print("   • PostgreSQL (port 5432)")
    print("   • Redis (port 6379)")
    print("   • Qdrant (port 6333)")
    print("3. Run: python main.py")
    print("\n📚 Documentation: http://localhost:8000/docs")

if __name__ == "__main__":
    main()