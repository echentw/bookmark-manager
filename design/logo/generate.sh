mkdir -p generated

rm generated/*

# Generate the Axle logo in all the appropriate sizes.
magick Axle512x512.png -resize 16x16 generated/Axle16x16.png
magick Axle512x512.png -resize 32x32 generated/Axle32x32.png
magick Axle512x512.png -resize 48x48 generated/Axle48x48.png
magick Axle512x512.png -resize 128x128 generated/Axle128x128.png
