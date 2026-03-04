import json
from datetime import datetime
from pathlib import Path

PLEX_ROOT = Path(r"D:\PlexMedia")

MOVIES = PLEX_ROOT / "Movies"
TV = PLEX_ROOT / "TV Shows"   # <-- match your naming style
ANIME = PLEX_ROOT / "Anime"   # <-- matches your screenshot

MEDIA_EXT = {".mp4", ".mkv", ".avi", ".mov", ".m4v", ".ts", ".webm"}

def count_media_files_recursive(folder: Path) -> int:
    if not folder.exists():
        return 0
    return sum(
        1 for f in folder.rglob("*")
        if f.is_file() and f.suffix.lower() in MEDIA_EXT
    )

def count_top_level_folders(folder: Path) -> int:
    if not folder.exists():
        return 0
    return sum(1 for item in folder.iterdir() if item.is_dir())

movies_files = count_media_files_recursive(MOVIES)
tv_episode_files = count_media_files_recursive(TV)
anime_episode_files = count_media_files_recursive(ANIME)

stats = {
    "movies": movies_files,

    # series counts
    "shows": count_top_level_folders(TV),
    "anime_series": count_top_level_folders(ANIME),

    # BIG counter: playable video files across TV + Anime + Movies
    "episodes": movies_files + tv_episode_files + anime_episode_files,

    "updated": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
}

# quick sanity output
print("MOVIES:", MOVIES, "exists:", MOVIES.exists(), "files:", movies_files)
print("TV:", TV, "exists:", TV.exists(), "episode-files:", tv_episode_files, "series-folders:", stats["shows"])
print("ANIME:", ANIME, "exists:", ANIME.exists(), "episode-files:", anime_episode_files, "series-folders:", stats["anime_series"])

with open("stats.json", "w", encoding="utf-8") as f:
    json.dump(stats, f, indent=2)

print("Wrote stats.json:", stats)