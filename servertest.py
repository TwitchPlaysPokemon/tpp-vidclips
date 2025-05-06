import asyncio
import json
import websockets

# Your fixed message
MESSAGE = {
    "type": "channel_point_reward_redemption_add",
    "extra_parameters": {
        "id": "f0b2ab35-f6f9-1771-a82d-423d-423d1cace120",
        "user": {
            "id": "95741618",
            "twitch_display_name": "testFromUser",
            "name": "testFromUser",
            "simple_name": "testFromUser",
            "color": None,
            "first_active_at": "2025-04-21T14:38:43.4356755Z",
            "last_active_at": "2025-04-21T14:38:43.4356755Z",
            "last_message_at": None,
            "last_whisper_received_at": None,
            "pokeyen": 100,
            "tokens": 0,
            "pokeyen_high_score": 0,
            "participation_emblems": [],
            "selected_participation_emblem": None,
            "selected_badge": None,
            "glow_color": None,
            "glow_color_unlocked": False,
            "pokeyen_bet_rank": None,
            "roles": [],
            "is_subscribed": False,
            "months_subscribed": 0,
            "subscription_tier": None,
            "loyalty_league": 0,
            "subscription_updated_at": None,
            "timeout_expiration": None,
            "banned": False,
            "is_bot": False,
            "is_captcha_suspended": False,
            "donor_badge": False
        },
        "user_input": "Test Input From CLI",
        "status": "unfulfilled",
        "reward": {
            "id": "4837774b-5c24-e276-0442-5c48b45e0f5c",
            "title": "Jelly-filled donut",
            "cost": 150,
            "promp": "Redeem Your Test Reward from CLI"
        },
        "redeemed_at": "2025-04-21T14:38:43.3933102Z"
    }
}

PERIOD_SECONDS = 5  # send interval

async def handler(websocket, path):
    await websocket.send(json.dumps({"message": "Welcome, master~"}))
    while True:
        await websocket.send(json.dumps(MESSAGE))
        await asyncio.sleep(PERIOD_SECONDS)

async def main():
    print("Server starting on ws://localhost:6789 nya~")
    async with websockets.serve(handler, "0.0.0.0", 6789):
        await asyncio.Future()  # run forever

if __name__ == "__main__":
    asyncio.run(main())
