#!/bin/bash
# Script to copy generated images to the project's public folder

PROJ_DIR="$HOME/Library/CloudStorage/OneDrive-UniversidadMarianoGálvez/Platzi/Proyecto_Make_up/public"
IMG_DIR="$HOME/.gemini/antigravity/brain/2289c7f3-aae6-4bab-8213-3dcd88eb0b6a"

echo "Copying images to project..."

cp "$IMG_DIR/makeup_gt_logo_1776010927319.png" "$PROJ_DIR/logo.png"
cp "$IMG_DIR/hero_background_1776010944603.png" "$PROJ_DIR/hero-bg.png"
cp "$IMG_DIR/about_image_1776010962998.png" "$PROJ_DIR/about-img.png"

echo "Done! Images copied to $PROJ_DIR"
ls -la "$PROJ_DIR"
