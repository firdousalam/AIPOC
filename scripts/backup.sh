#!/bin/bash

# Backup script for MongoDB
BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="mongodb_backup_$DATE"

mkdir -p $BACKUP_DIR

echo "📦 Creating MongoDB backup..."

mongodump \
  --uri="${MONGODB_URI:-mongodb://localhost:27017/enterprise-sales-ai}" \
  --out="$BACKUP_DIR/$BACKUP_NAME"

if [ $? -eq 0 ]; then
  echo "✅ Backup created successfully: $BACKUP_DIR/$BACKUP_NAME"
  
  # Compress backup
  tar -czf "$BACKUP_DIR/$BACKUP_NAME.tar.gz" -C "$BACKUP_DIR" "$BACKUP_NAME"
  rm -rf "$BACKUP_DIR/$BACKUP_NAME"
  echo "✅ Backup compressed: $BACKUP_DIR/$BACKUP_NAME.tar.gz"
else
  echo "❌ Backup failed!"
  exit 1
fi

