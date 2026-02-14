#!/bin/bash

echo "🚀 Setting up Enterprise Sales AI..."

# Install root dependencies
echo "📦 Installing root dependencies..."
pnpm install

# Setup environment
echo "📝 Setting up environment..."
if [ ! -f .env ]; then
  cp .env.example .env
  echo "✅ Created .env file from .env.example"
else
  echo "⚠️  .env file already exists, skipping..."
fi

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p apps/ml-service/saved_models
mkdir -p apps/ml-service/data/raw
mkdir -p apps/ml-service/data/processed

echo "✅ Setup complete! Don't forget to:"
echo "   1. Edit .env with your configuration"
echo "   2. Start MongoDB"
echo "   3. Run 'pnpm dev' to start development servers"

