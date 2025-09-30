#!/bin/bash
cd /home/kavia/workspace/code-generation/ecommerce-chatbot-platform-3036-3045/chatbot_frontend
npx eslint
ESLINT_EXIT_CODE=$?
npm run build
BUILD_EXIT_CODE=$?
if [ $ESLINT_EXIT_CODE -ne 0 ] || [ $BUILD_EXIT_CODE -ne 0 ]; then
   exit 1
fi

