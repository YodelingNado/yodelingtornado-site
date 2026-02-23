import json
import os
from datetime import datetime
from plexapi.server import PlexServer

# REQUIRED ENV VARS:
#   PLEX_BASEURL   e.g. http://localhost:32400
#   PLEX_TOKEN     your X-Plex-Token
#
# OPTIONAL:
#   ANIME_LIBRARY  e.g. Anime (defaults to "Anime")

BASEURL = os.environ.get("PLEX_BASEURL", "http://localhost:32400")
TOKEN = os.environ.get("B7GVnEjCvGZXB9ymUZJ7")
ANIME_LIBRARY = os.environ.get("ANIME_LIBRARY", "Anime")

if not TOKEN:
    raise SystemExit("Missing PLEX_TOKEN env var. Set it first (don’t hardcode it).")

plex = PlexServer(BASEURL, TOKEN)

def count_movies():
    # Count items in libraries of type 'movie'
    total = 0
    for section in plex.library.sections():
        if section.type == "movie":
            # all() can be heavy on massive libraries; size is usually fine
            total += section.totalSize
    return total

def count_shows_and_episodes():
    shows = 0
    episodes = 0
    for section in plex.library.sections():
        if section.type == "show":
            shows += section.totalSize
            # total episodes: sum episode count per show (fast-ish and accurate)
            # For very large libraries this can take a bit; still usually OK.
            for show in section.all():
                episodes += getattr(show, "leafCount", 0)
    return shows, episodes

def count_anime_series():
    # If you have a dedicated Anime library (type show), this is perfect.
    # If you don’t, we can upgrade later to “anime by label/genre” logic.
    try:
        sec = plex.library.section(ANIME_LIBRARY)
        if sec.type != "show":
            return 0
        return sec.totalSize
    except Exception:
        return 0

stats = {
    "movies": count_movies(),
    "shows": None,
    "episodes": None,
    "anime_series": count_anime_series(),
    "updated": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
}

shows, episodes = count_shows_and_episodes()
stats["shows"] = shows
stats["episodes"] = episodes

with open("stats.json", "w", encoding="utf-8") as f:
    json.dump(stats, f, indent=2)

print("Wrote stats.json:", stats)
