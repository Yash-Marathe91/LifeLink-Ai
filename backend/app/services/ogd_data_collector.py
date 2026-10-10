import os
import httpx
import logging
import asyncio
from typing import Dict, Any, List

logger = logging.getLogger(__name__)

class OGDDataCollector:
    """
    Data Collection Layer for Indian Open Government Data (data.gov.in)
    Fetches Meteorological and Environmental Telemetry using Resource IDs.
    """
    
    BASE_URL = "https://api.data.gov.in/resource"
    
    # Mapped from User Requirements
    RESOURCES = {
        "Rainfall": {
            "DistrictWise_Daily_IMD": "8752174f-1d17-4aaf-8058-2eb396f50157",
            "StateWise_Daily_IMD": "acd3023c-df96-4af8-8815-a7393cb80839"
        },
        "Ground_Water_Telemetry": {
            "Karnataka_2018_2020": "fd55abe4-e4b6-4134-ba2c-c4101a4a561b",
            "Karnataka_2021_2022": "6eca0a82-4a9d-4fe9-97e5-efaeef520c7e",
            "Karnataka_2023_2024": "5e71786c-227c-4057-9e5c-ab561168b49d",
            "Karnataka_2025_P1": "3f61f64b-0bd1-49f9-b9cf-d1623409fb38",
            "Karnataka_2025_P2": "011ee100-8310-42e4-aa2d-ad04585b1e5c",
            "Karnataka_2026_P1": "a2540dd2-6248-4a3e-95b5-d9f76f2a8c2c",
            "Karnataka_2026_P2": "efd53393-7adf-4471-9f8c-9b7eebe3b41d"
        },
        "Relative_Humidity_Telemetry": {
            "Karnataka_2021": "b42b813b-a0c9-4c36-a2c1-5ca855541616",
            "Karnataka_2022": "2ecfb844-851c-489b-8d19-5253a32c27c6",
            "Karnataka_2023": "27417f69-687c-4137-819d-ed22ec42d2cb",
            "Karnataka_2024": "be618af0-9cd8-4daa-b8a5-66f3acee5856",
            "Karnataka_2025": "364fa5dc-e215-41a4-b456-862622feb8d2",
            "Karnataka_2026_2030": "956e00cb-c1a4-471e-ab60-dd10b79737c9"
        },
        "Wind_Speed_Telemetry": {
            "West_Bengal_1970_2025": "b2271f82-aced-4a64-89e4-dfc755917a4a",
            "West_Bengal_2026_2030": "fec9b6f7-5f8a-446d-aac6-edc687e486fa",
            "UP_1970_2025": "fc1314ef-a47c-4ebe-b148-5b1ec7a90037",
            "UP_2026_2030": "beb454fb-8400-44c1-aa92-bf8b4b282efa",
            "HP_1970_2025": "22ef7020-904b-4ef8-a975-d6baa5701988",
            "HP_2026_2030": "7fe388d1-2ce9-4575-8fd2-6896f5e440b2",
            "Jharkhand_1970_2025": "fb32b0dc-9f50-4f18-bb95-984b7a505476",
            "Jharkhand_2026_2030": "6356072a-716f-4b48-99ce-09aab5511ae6",
            "Mizoram_1970_2025": "47345e5d-087c-427d-b7a1-7f9e07c38d7c",
            "Mizoram_2026_2030": "8f236160-fb5d-4ec2-8993-b538796042ad",
            "Telangana_1970_2025": "2bd910f5-02fa-474c-938b-5631eed4a251",
            "Telangana_2026_2030": "f31da111-83b2-4549-9813-f0677a9cccda"
        }
    }

    def __init__(self):
        self.api_key = os.getenv("OGD_API_KEY")
        if not self.api_key:
            logger.warning("OGD_API_KEY is not set. Data Gov API requests will fail.")

    async def fetch_resource(self, resource_id: str, limit: int = 10, offset: int = 0) -> Dict[str, Any]:
        """
        Fetches records from a specific OGD resource ID.
        """
        if not self.api_key:
            return {"error": "Missing OGD_API_KEY"}

        # Construct endpoint (JSON format)
        url = f"{self.BASE_URL}/{resource_id}"
        params = {
            "api-key": self.api_key,
            "format": "json",
            "limit": limit,
            "offset": offset
        }

        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(url, params=params, timeout=15.0)
                response.raise_for_status()
                return response.json()
            except httpx.RequestError as exc:
                logger.error(f"An error occurred while requesting {exc.request.url!r}.")
                return {"error": str(exc)}
            except httpx.HTTPStatusError as exc:
                logger.error(f"Error response {exc.response.status_code} while requesting {exc.request.url!r}.")
                return {"error": str(exc)}

    async def collect_all_latest(self) -> Dict[str, Any]:
        """
        Collects the top records from all defined critical telemetry sources.
        Useful for feeding into the predictive AI models (like Flood Risk Engine).
        """
        results = {}
        
        # We can concurrently fetch the most critical ones to speed things up
        tasks = []
        task_names = []
        
        # For demonstration, let's pick 1 from each category (e.g. current year or state)
        # You can expand this to fetch all, but it might hit rate limits.
        critical_sources = [
            ("Rainfall_StateWise", self.RESOURCES["Rainfall"]["StateWise_Daily_IMD"]),
            ("GroundWater_KA", self.RESOURCES["Ground_Water_Telemetry"]["Karnataka_2025_P1"]),
            ("Humidity_KA", self.RESOURCES["Relative_Humidity_Telemetry"]["Karnataka_2025"]),
            ("Wind_WB", self.RESOURCES["Wind_Speed_Telemetry"]["West_Bengal_1970_2025"])
        ]
        
        for name, res_id in critical_sources:
            tasks.append(self.fetch_resource(res_id, limit=5))
            task_names.append(name)
            
        responses = await asyncio.gather(*tasks)
        
        for i, name in enumerate(task_names):
            results[name] = responses[i]
            
        return results

# Singleton instance
ogd_collector = OGDDataCollector()
