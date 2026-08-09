import logging
from typing import List, Dict, Any, Optional
import httpx
from app.core.config import settings
from app.schemas.youtube import YouTubeVideoItem, YouTubeSearchResponse

logger = logging.getLogger("mood_playlist.youtube")

# Curated fallback coding playlists & videos per mood if API Key is omitted or quota exceeded
CURATED_MOOD_VIDEOS: Dict[str, List[Dict[str, Any]]] = {
    "focused": [
        {
            "video_id": "jfKfPfyJRdk",
            "title": "Lofi Hip Hop Radio - Beats to Relax/Study to",
            "channel_title": "Lofi Girl",
            "thumbnail": "https://i.ytimg.com/vi/jfKfPfyJRdk/hqdefault.jpg",
            "description": "Peaceful lofi beats ideal for deep focus coding sessions.",
            "duration": "3:45",
            "bpm": 70,
            "audio_freq": 220
        },
        {
            "video_id": "5qap5aO4i9A",
            "title": "Lofi Music for Coding & Programming",
            "channel_title": "Music for Coding",
            "thumbnail": "https://i.ytimg.com/vi/5qap5aO4i9A/hqdefault.jpg",
            "description": "Chill instrumental lofi compilation for developers.",
            "duration": "4:12",
            "bpm": 72,
            "audio_freq": 230
        },
        {
            "video_id": "DWcJFNfaw9c",
            "title": "24/7 synthwave radio - chill beats to code to",
            "channel_title": "Lofi Girl Synthwave",
            "thumbnail": "https://i.ytimg.com/vi/DWcJFNfaw9c/hqdefault.jpg",
            "description": "Retro synthwave focus beats.",
            "duration": "3:50",
            "bpm": 75,
            "audio_freq": 240
        },
        {
            "video_id": "WPni755-Krg",
            "title": "Midnight Terminal - Deep Focus Ambient",
            "channel_title": "LoFi Coder",
            "thumbnail": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80",
            "description": "Minimal textures for long development sessions.",
            "duration": "4:30",
            "bpm": 68,
            "audio_freq": 210
        }
    ],
    "happy": [
        {
            "video_id": "36YnV9STBkc",
            "title": "Upbeat Indie Coding Beats - Happy Refactor",
            "channel_title": "Coding Vibes",
            "thumbnail": "https://i.ytimg.com/vi/36YnV9STBkc/hqdefault.jpg",
            "description": "Bright, uplifting tracks to boost development mood.",
            "duration": "3:15",
            "bpm": 112,
            "audio_freq": 294
        },
        {
            "video_id": "lP26UCnoH9s",
            "title": "Morning Coffee & Coding Groove",
            "channel_title": "Developer Cafe",
            "thumbnail": "https://i.ytimg.com/vi/lP26UCnoH9s/hqdefault.jpg",
            "description": "Positive acoustic and indie rhythm for morning coding.",
            "duration": "3:40",
            "bpm": 115,
            "audio_freq": 310
        },
        {
            "video_id": "tGj85jK_V7Q",
            "title": "PR Approved - Upbeat Synth Pop",
            "channel_title": "Pixel Joy",
            "thumbnail": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
            "description": "High energy joy for successful code deployments.",
            "duration": "2:58",
            "bpm": 120,
            "audio_freq": 330
        }
    ],
    "relaxed": [
        {
            "video_id": "1tE-0CSt6aY",
            "title": "Ambient Calm Soundscapes for Chill Coding",
            "channel_title": "Calm Horizon",
            "thumbnail": "https://i.ytimg.com/vi/1tE-0CSt6aY/hqdefault.jpg",
            "description": "Oceanic drift and soft ambient waves for steady coding.",
            "duration": "5:10",
            "bpm": 60,
            "audio_freq": 196
        },
        {
            "video_id": "2OEL4P1rub0",
            "title": "Soft Rain on Glass - Chill Study Beats",
            "channel_title": "Nature Tones",
            "thumbnail": "https://i.ytimg.com/vi/2OEL4P1rub0/hqdefault.jpg",
            "description": "Gentle rain and ambient pads.",
            "duration": "4:45",
            "bpm": 58,
            "audio_freq": 185
        }
    ],
    "energetic": [
        {
            "video_id": "N3oCS85HmgY",
            "title": "Cyberpunk Sprint - High Output Coding Music",
            "channel_title": "Neon Rush",
            "thumbnail": "https://i.ytimg.com/vi/N3oCS85HmgY/hqdefault.jpg",
            "description": "Driving electronic synth beats for intense refactoring.",
            "duration": "3:50",
            "bpm": 130,
            "audio_freq": 340
        },
        {
            "video_id": "4xDzrJKXOOY",
            "title": "Turbo Release - Fast Electronic Beats",
            "channel_title": "Overclock",
            "thumbnail": "https://i.ytimg.com/vi/4xDzrJKXOOY/hqdefault.jpg",
            "description": "Fast-paced synthwave for maximum coding velocity.",
            "duration": "3:30",
            "bpm": 132,
            "audio_freq": 350
        }
    ],
    "sad": [
        {
            "video_id": "S_MOd40zlYU",
            "title": "Late Night 3 AM Refactor - Melancholic Piano",
            "channel_title": "Nocturne Beats",
            "thumbnail": "https://i.ytimg.com/vi/S_MOd40zlYU/hqdefault.jpg",
            "description": "Quiet acoustic piano soundscapes for late night sessions.",
            "duration": "4:05",
            "bpm": 64,
            "audio_freq": 175
        },
        {
            "video_id": "77ZozI0rw7w",
            "title": "Midnight Echoes - Ambient Solitude",
            "channel_title": "City Lights",
            "thumbnail": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
            "description": "Warm acoustic soundscapes for reflective work.",
            "duration": "3:48",
            "bpm": 66,
            "audio_freq": 180
        }
    ],
    "stressed": [
        {
            "video_id": "M5QY2_8704o",
            "title": "Breathe & Reset - Stress Relief Piano for Coders",
            "channel_title": "Peaceful Mind",
            "thumbnail": "https://i.ytimg.com/vi/M5QY2_8704o/hqdefault.jpg",
            "description": "Gentle soothing piano to dissolve tension and return to flow.",
            "duration": "4:15",
            "bpm": 62,
            "audio_freq": 200
        },
        {
            "video_id": "lTRiuFIWV54",
            "title": "Warm Tea & Soft Piano Sanctuary",
            "channel_title": "Acoustic Soul",
            "thumbnail": "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=600&q=80",
            "description": "Soothing harmony to relax your mind while debugging.",
            "duration": "3:50",
            "bpm": 60,
            "audio_freq": 190
        }
    ]
}

class YouTubeService:
    @staticmethod
    async def search_videos(query: str, mood: Optional[str] = None, max_results: int = 10) -> YouTubeSearchResponse:
        """Searches YouTube Data API v3 with automatic fallback to curated coding video catalog."""
        api_key = settings.YOUTUBE_API_KEY
        clean_mood = (mood or "focused").lower()

        if api_key and len(api_key.strip()) > 10:
            try:
                url = "https://www.googleapis.com/youtube/v3/search"
                params = {
                    "part": "snippet",
                    "q": query,
                    "type": "video",
                    "videoCategoryId": "10", # Music category
                    "maxResults": max_results,
                    "key": api_key
                }
                async with httpx.AsyncClient(timeout=5.0) as client:
                    response = await client.get(url, params=params)
                    if response.status_code == 200:
                        data = response.json()
                        items = data.get("items", [])
                        videos: List[YouTubeVideoItem] = []
                        for item in items:
                            v_id = item.get("id", {}).get("videoId")
                            snippet = item.get("snippet", {})
                            if v_id and snippet:
                                videos.append(
                                    YouTubeVideoItem(
                                        video_id=v_id,
                                        title=snippet.get("title", "Coding Music Track"),
                                        thumbnail=snippet.get("thumbnails", {}).get("high", {}).get("url") or snippet.get("thumbnails", {}).get("default", {}).get("url", ""),
                                        channel_title=snippet.get("channelTitle", "YouTube Music"),
                                        description=snippet.get("description", ""),
                                        duration="3:45",
                                        bpm=72,
                                        audio_freq=220
                                    )
                                )
                        if videos:
                            return YouTubeSearchResponse(
                                query=query,
                                mood=clean_mood,
                                total_results=len(videos),
                                videos=videos
                            )
                    else:
                        logger.warning(f"YouTube API returned status {response.status_code}: {response.text}")
            except Exception as e:
                logger.warning(f"YouTube API call failed: {e}. Falling back to curated catalog.")

        # Fallback implementation
        fallback_data = CURATED_MOOD_VIDEOS.get(clean_mood, CURATED_MOOD_VIDEOS["focused"])
        videos = [
            YouTubeVideoItem(
                video_id=item["video_id"],
                title=item["title"],
                thumbnail=item["thumbnail"],
                channel_title=item["channel_title"],
                description=item["description"],
                duration=item.get("duration", "3:45"),
                bpm=item.get("bpm", 72),
                audio_freq=item.get("audio_freq", 220)
            )
            for item in fallback_data
        ]

        return YouTubeSearchResponse(
            query=query,
            mood=clean_mood,
            total_results=len(videos),
            videos=videos
        )

youtube_service = YouTubeService()
