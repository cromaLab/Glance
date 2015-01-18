#!/bin/sh

# USAGE: sh blurVideos.sh <video_file>

inputFile="$1"

ffmpeg -i "$1" -vf 'boxblur=luma_radius=min\(h\,w\)/2:luma_power=1:chroma_radius=min\(cw\,ch\)/2:chroma_power=1' "$1_level1.mp4"
ffmpeg -i "$1" -vf "boxblur=luma_radius=min\(h\,w\)/4:luma_power=1:chroma_radius=min(cw\,ch)/4:chroma_power=1" "$1_level2.mp4"
ffmpeg -i "$1" -vf "boxblur=luma_radius=min\(h\,w\)/8:luma_power=1:chroma_radius=min(cw\,ch)/8:chroma_power=1" "$1_level3.mp4"
ffmpeg -i "$1" -vf "boxblur=luma_radius=min\(h\,w\)/16:luma_power=1:chroma_radius=min(cw\,ch)/16:chroma_power=1" "$1_level4.mp4"
ffmpeg -i "$1" -vf "boxblur=luma_radius=min\(h\,w\)/32:luma_power=1:chroma_radius=min(cw\,ch)/32:chroma_power=1" "$1_level5.mp4"
ffmpeg -i "$1" -vf "boxblur=luma_radius=min\(h\,w\)/64:luma_power=1:chroma_radius=min(cw\,ch)/64:chroma_power=1" "$1_level6.mp4"
ffmpeg -i "$1" -vf "boxblur=luma_radius=min\(h\,w\)/128:luma_power=1:chroma_radius=min(cw\,ch)/128:chroma_power=1" "$1_level7.mp4"
ffmpeg -i "$1" -vf "boxblur=luma_radius=min\(h\,w\)/256:luma_power=1:chroma_radius=min(cw\,ch)/256:chroma_power=1" "$1_level8.mp4"
ffmpeg -i "$1" -vf "boxblur=luma_radius=min\(h\,w\)/512:luma_power=1:chroma_radius=min(cw\,ch)/512:chroma_power=1" "$1_level9.mp4"