#!/bin/bash
cd /home/kavia/workspace/code-generation/recipe-recommender-210287-210296/recipe_recommender_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

