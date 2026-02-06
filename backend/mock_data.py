"""
🚀 Mock Data Generator - Instant Data Loading
Optimized for lightning-fast demo responses
"""

import json
import time
from datetime import datetime
from typing import Dict, List, Any

class MockDataGenerator:
    """Generate realistic cricket data instantly for demo purposes"""
    
    def __init__(self):
        self.teams = [
            "India", "Australia", "England", "Pakistan", "South Africa", 
            "New Zealand", "West Indies", "Sri Lanka", "Bangladesh", "Afghanistan"
        ]
        
        self.venues = [
            "Lord's, London", "Eden Gardens, Kolkata", "Melbourne Cricket Ground",
            "Sydney Cricket Ground", "Wankhede Stadium, Mumbai", "Chinnaswamy, Bangalore",
            "Old Trafford, Manchester", "Kensington Oval, Barbados", "Dubai International Stadium"
        ]
        
        self.players = [
            "Virat Kohli", "Steve Smith", "Joe Root", "Babar Azam", "Kane Williamson",
            "Rohit Sharma", "David Warner", "Ben Stokes", "Jos Buttler", "Quinton de Kock"
        ]

    def generate_match_data(self) -> List[Dict]:
        """Generate match data instantly"""
        return [
            {
                "match_id": 1,
                "team1": "India",
                "team2": "Australia", 
                "venue": "Lord's, London",
                "winner": "India",
                "margin": "4 wickets",
                "overs": 50,
                "season": "2023"
            },
            {
                "match_id": 2,
                "team1": "England", 
                "team2": "Pakistan",
                "venue": "Eden Gardens, Kolkata",
                "winner": "England",
                "margin": "3 runs",
                "overs": 50,
                "season": "2023"
            },
            {
                "match_id": 3,
                "team1": "South Africa",
                "team2": "New Zealand",
                "venue": "Melbourne Cricket Ground", 
                "winner": "South Africa",
                "margin": "6 wickets",
                "overs": 50,
                "season": "2023"
            }
        ]

    def generate_delivery_data(self) -> List[Dict]:
        """Generate ball-by-ball data instantly"""
        deliveries = []
        ball_id = 1
        
        for match_id in range(1, 4):
            for innings in [1, 2]:
                for over in range(1, 6):  # 5 overs for demo
                    for ball in range(1, 7):
                        deliveries.append({
                            "match_id": match_id,
                            "innings": innings,
                            "over": over,
                            "ball": ball,
                            "bat_team": self.teams[match_id - 1],
                            "bowl_team": self.teams[match_id],
                            "batter": self.players[match_id - 1],
                            "bowler": self.players[match_id],
                            "batsman_runs": 1 if ball % 3 == 0 else 0,
                            "extras": 0,
                            "total_runs": 1 if ball % 3 == 0 else 0,
                            "venue": self.venues[match_id - 1]
                        })
                        ball_id += 1
        
        return deliveries

    def generate_player_stats(self) -> List[Dict]:
        """Generate player statistics instantly"""
        return [
            {
                "player_name": "Virat Kohli",
                "total_runs": 1848,
                "innings": 35,
                "average": 52.8,
                "strike_rate": 93.4,
                "centuries": 3,
                "half_centuries": 15
            },
            {
                "player_name": "Steve Smith", 
                "total_runs": 1592,
                "innings": 32,
                "average": 49.8,
                "strike_rate": 87.2,
                "centuries": 2,
                "half_centuries": 12
            },
            {
                "player_name": "Joe Root",
                "total_runs": 1784,
                "innings": 38,
                "average": 46.9,
                "strike_rate": 85.6,
                "centuries": 2,
                "half_centuries": 14
            }
        ]

# Global instance
mock_generator = MockDataGenerator()

def get_mock_matches() -> List[Dict]:
    """Get mock match data instantly"""
    time.sleep(0.1)  # Simulate minimal processing time
    return mock_generator.generate_match_data()

def get_mock_scraping_results():
    """Generate realistic scraping results for industry-standard response"""
    time.sleep(0.1)  # Simulate minimal processing time
    
    return {
        "success": True,
        "message": "Data scraped successfully",
        "data": {
            "matches_scraped": 156,
            "players_scraped": 48,
            "records_scraped": 5420,
            "scraping_time": "0.5 seconds",
            "status": "completed",
            "sample_data": {
                "matches": get_mock_matches()[:2],
                "players": mock_generator.generate_player_stats()[:5],
                "deliveries": mock_generator.generate_delivery_data()[:5]
            }
        }
    }

def get_mock_deliveries() -> List[Dict]:
    """Get mock delivery data instantly"""
    time.sleep(0.1)  # Simulate minimal processing time
    return mock_generator.generate_delivery_data()

def get_mock_cleaning_results():
    """Generate realistic cleaning results for industry-standard response"""
    time.sleep(0.3)  # Simulate minimal processing time
    
    return {
        "success": True,
        "message": "Data cleaned successfully",
        "data": {
            "beforeRecords": 15234,
            "removed": 3000,
            "afterRecords": 12234,
            "cleaning_time": "0.3 seconds",
            "status": "completed",
            "data_quality_score": 98.5,
            "sample": [
                {"player": "Virat Kohli", "runs": 82, "strikeRate": 134.2},
                {"player": "Rohit Sharma", "runs": 61, "strikeRate": 128.5}
            ]
        }
    }

def get_cleaning_response():
    """Direct response for frontend - matches expected structure"""
    return {
        "beforeRecords": 15234,
        "removed": 3000,
        "afterRecords": 12234,
        "cleaning_time": "0.3 seconds",
        "status": "completed",
        "data_quality_score": 98.5,
        "sample": [
            {"player": "Virat Kohli", "runs": 82, "strikeRate": 134.2},
            {"player": "Rohit Sharma", "runs": 61, "strikeRate": 128.5},
            {"player": "KL Rahul", "runs": 45, "strikeRate": 142.8},
            {"player": "Suryakumar Yadav", "runs": 38, "strikeRate": 156.3},
            {"player": "Hardik Pandya", "runs": 29, "strikeRate": 118.7}
        ]
    }

def get_mock_eda_results(analysis_type):
    """Generate realistic EDA results for different analysis types"""
    time.sleep(0.5)  # Simulate processing time
    
    if analysis_type == "overview":
        return {
            "total_matches": 156,
            "total_players": 48,
            "data_range": "2020-2024",
            "data_quality": 98.5
        }
    elif analysis_type == "scoring":
        return {
            "avg_score": 285.6,
            "highest_score": 264,
            "avg_strike_rate": 128.5,
            "total_centuries": 45
        }
    elif analysis_type == "bowling":
        return {
            "avg_economy": 7.2,
            "best_bowling": "5/23",
            "dot_balls_percentage": 38.5,
            "wickets_per_match": 3.8
        }
    elif analysis_type == "venue":
        return {
            "total_venues": 24,
            "highest_avg_score": 312,
            "lowest_avg_score": 245,
            "day_night_split": "65/35"
        }
    elif analysis_type == "toss":
        return {
            "toss_win_percentage": 52.3,
            "bat_first_win_percentage": 58.7,
            "field_first_win_percentage": 41.3,
            "decision_impact": "High"
        }
    else:
        return {}
